import { supabase, WORKSHOP_SESSION, isCloudEnabled } from '../lib/supabase';
import type { GroupProject, WorkshopConfig } from '../types';
import { getPin, getMasterPin } from './groupPins';

export type CloudStatus = 'local' | 'conectando' | 'sincronizado' | 'error';

/** 'ok' guardo | 'pin' hace falta el PIN del equipo | 'error' fallo de red o base */
export type PushResult = 'ok' | 'pin' | 'error';

type GroupRow = {
  session_id: string;
  id: string;
  group_number: number;
  data: GroupProject;
  has_pin: boolean;
  updated_at: string;
};

/** Postgres 42501 = insufficient_privilege, que es como save_group rechaza un PIN. */
const ES_PIN_RECHAZADO = (code?: string, msg?: string) =>
  code === '42501' || /PIN incorrecto/i.test(msg || '');

/** Trae todos los grupos guardados en la nube para esta sesion del taller. */
export async function fetchGroups(): Promise<GroupProject[] | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('workshop_groups')
    .select('data, group_number, has_pin')
    .eq('session_id', WORKSHOP_SESSION)
    .order('group_number', { ascending: true });

  if (error) {
    console.warn('[cloudSync] no pude leer los grupos:', error.message);
    return null;
  }
  if (!data || data.length === 0) return [];
  return data.map(r => ({ ...(r.data as GroupProject), hasPin: r.has_pin }));
}

/** El flag hasPin es de la columna, no del jsonb: no lo guardamos adentro. */
function sinFlag(group: GroupProject): GroupProject {
  const { hasPin, ...resto } = group as GroupProject & { hasPin?: boolean };
  return resto as GroupProject;
}

/**
 * Guarda un grupo. Manda el PIN que este dispositivo conozca (el del equipo,
 * o el maestro del tallerista). La validacion la hace la base, no el browser.
 */
export async function pushGroup(
  group: GroupProject,
  pinExplicito?: string
): Promise<PushResult> {
  if (!supabase) return 'error';
  const pin = pinExplicito ?? getPin(group.id) ?? getMasterPin() ?? null;

  const { error } = await supabase.rpc('save_group', {
    p_session: WORKSHOP_SESSION,
    p_id: group.id,
    p_group_number: group.groupNumber,
    p_data: sinFlag(group),
    p_pin: pin,
  });

  if (!error) return 'ok';
  if (ES_PIN_RECHAZADO(error.code, error.message)) return 'pin';
  console.warn('[cloudSync] no pude guardar el grupo', group.id, error.message);
  return 'error';
}

/**
 * Sube varios grupos (sorteo masivo, reset, regeneracion). Devuelve 'pin' si
 * al menos uno quedo trabado, con la lista de los que faltan destrabar.
 */
export async function pushAllGroups(
  groups: GroupProject[]
): Promise<{ result: PushResult; trabados: GroupProject[] }> {
  if (!supabase || groups.length === 0) return { result: 'error', trabados: [] };

  const resultados = await Promise.all(
    groups.map(async g => ({ grupo: g, r: await pushGroup(g) }))
  );

  const trabados = resultados.filter(x => x.r === 'pin').map(x => x.grupo);
  const huboError = resultados.some(x => x.r === 'error');

  if (trabados.length > 0) return { result: 'pin', trabados };
  return { result: huboError ? 'error' : 'ok', trabados: [] };
}

export async function fetchConfig(): Promise<WorkshopConfig | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('workshop_config')
    .select('data')
    .eq('session_id', WORKSHOP_SESSION)
    .maybeSingle();
  if (error || !data) return null;
  return data.data as WorkshopConfig;
}

export async function pushConfig(config: WorkshopConfig): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase
    .from('workshop_config')
    .upsert({ session_id: WORKSHOP_SESSION, data: config }, { onConflict: 'session_id' });
  return !error;
}

/**
 * Escucha cambios de otros dispositivos. Devuelve la funcion para desuscribirse.
 * Cada vez que un equipo se anota desde el celular, llega aca.
 */
export function subscribeToGroups(onChange: (group: GroupProject) => void): () => void {
  const client = supabase;
  if (!client) return () => {};
  const channel = client
    .channel(`workshop_groups:${WORKSHOP_SESSION}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'workshop_groups',
        filter: `session_id=eq.${WORKSHOP_SESSION}`,
      },
      payload => {
        const row = payload.new as GroupRow | null;
        if (row?.data) onChange(row.data);
      }
    )
    .subscribe();

  return () => {
    client.removeChannel(channel);
  };
}

export { isCloudEnabled };
