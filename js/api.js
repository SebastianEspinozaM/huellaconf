// =========================================================
// Consumo de API pública: Dog CEO (E2)
// https://dog.ceo/dog-api/
// Solo se encarga de pedir y normalizar datos (no toca el DOM).
// =========================================================
const URL_BASE = "https://dog.ceo/api";
const ORIGEN_IMAGENES = "https://images.dog.ceo/";
const TIEMPO_MAXIMO_MS = 8000;

// Función pura: "hound-afghan" -> "Afghan Hound"
export function nombreRaza(slug) {
  return slug
    .split("-")
    .reverse()
    .map((parte) => parte.charAt(0).toUpperCase() + parte.slice(1))
    .join(" ");
}

// Función pura: convierte una URL de imagen en un objeto paciente
export function aPaciente(urlImagen) {
  // Solo aceptamos imágenes del dominio oficial de la API
  if (typeof urlImagen !== "string" || !urlImagen.startsWith(ORIGEN_IMAGENES)) return null;
  const slug = urlImagen.split("/breeds/")[1]?.split("/")[0];
  if (!slug) return null;
  return { raza: nombreRaza(slug), imagen: urlImagen };
}

/**
 * Pide N imágenes aleatorias de perros.
 * @param {number} cantidad
 * @param {AbortSignal} [signal] para cancelar pedidos anteriores
 * @returns {Promise<{raza: string, imagen: string}[]>}
 */
export async function obtenerPacientes(cantidad = 8, signal) {
  // Cancelamos si la API tarda demasiado
  const porTiempo = AbortSignal.timeout(TIEMPO_MAXIMO_MS);
  const senal = signal ? AbortSignal.any([signal, porTiempo]) : porTiempo;

  const respuesta = await fetch(`${URL_BASE}/breeds/image/random/${cantidad}`, { signal: senal });
  if (!respuesta.ok) throw new Error(`La API respondió con estado ${respuesta.status}`);

  const datos = await respuesta.json();
  if (datos.status !== "success" || !Array.isArray(datos.message)) {
    throw new Error("Formato de respuesta inesperado");
  }

  return datos.message.map(aPaciente).filter(Boolean);
}
