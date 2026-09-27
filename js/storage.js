// =========================================================
// Persistencia con localStorage (E4)
// Envoltorio seguro: si el navegador bloquea localStorage
// (modo privado, permisos) el sitio sigue funcionando.
// =========================================================
const PREFIJO = "huellaconf:";

export function leer(clave, valorPorDefecto) {
  try {
    const crudo = localStorage.getItem(PREFIJO + clave);
    return crudo === null ? valorPorDefecto : JSON.parse(crudo);
  } catch (error) {
    return valorPorDefecto;
  }
}

export function guardar(clave, valor) {
  try {
    localStorage.setItem(PREFIJO + clave, JSON.stringify(valor));
    return true;
  } catch (error) {
    console.warn("No se pudo guardar en localStorage:", error);
    return false;
  }
}
