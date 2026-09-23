/**
 * PINs que ESTE dispositivo conoce. Nunca viajan a la nube en texto plano:
 * se mandan solo como argumento de save_group, que los compara contra el hash.
 * Viven en localStorage para que un equipo no tenga que retipear su PIN
 * cada vez que edita su ficha desde el mismo celular.
 */
const KEY = 'jujuy_workshop_pins_v1';

type PinMap = Record<string, string>;

function leer(): PinMap {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as PinMap) : {};
  } catch {
    return {};
  }
}

function escribir(map: PinMap) {
  try {
    localStorage.setItem(KEY, JSON.stringify(map));
  } catch {}
}

export function getPin(groupId: string): string | undefined {
  return leer()[groupId];
}

export function setPin(groupId: string, pin: string) {
  const limpio = pin.trim();
  if (!limpio) return;
  const map = leer();
  map[groupId] = limpio;
  escribir(map);
}

export function forgetPin(groupId: string) {
  const map = leer();
  delete map[groupId];
  escribir(map);
}

/** PIN maestro del tallerista: sirve para cualquier grupo. */
export function getMasterPin(): string | undefined {
  return leer().__master;
}

export function setMasterPin(pin: string) {
  setPin('__master', pin);
}
