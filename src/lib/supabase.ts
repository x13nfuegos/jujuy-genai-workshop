import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/**
 * Session del taller. Permite correr varias ediciones sin que se pisen:
 * cambiando VITE_WORKSHOP_SESSION arrancas con datos limpios.
 */
export const WORKSHOP_SESSION =
  (import.meta.env.VITE_WORKSHOP_SESSION as string | undefined) || 'jujuy-2026';

/**
 * Si faltan las variables de entorno, la app sigue andando 100% local
 * (localStorage). No rompe nada: solo no sincroniza.
 */
export const supabase: SupabaseClient | null =
  url && key ? createClient(url, key, { auth: { persistSession: false } }) : null;

export const isCloudEnabled = Boolean(supabase);
