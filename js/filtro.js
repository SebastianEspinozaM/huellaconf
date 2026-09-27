// =========================================================
// Filtro / búsqueda dinámica (E3)
// Funciones puras + un helper para conectar un input.
// =========================================================

// "Pastor Alemán" -> "pastor aleman" (sin tildes ni mayúsculas)
export function normalizar(texto) {
  return String(texto)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

// Devuelve los elementos cuyo campo contiene el texto buscado
export function filtrarPorTexto(elementos, texto, campo) {
  const buscado = normalizar(texto);
  if (buscado === "") return elementos;
  return elementos.filter((el) => normalizar(el[campo]).includes(buscado));
}

// Llama a alCambiar(texto) mientras el usuario escribe (con pequeño debounce)
export function conectarBuscador(input, alCambiar, esperaMs = 150) {
  let temporizador;
  input.addEventListener("input", () => {
    clearTimeout(temporizador);
    temporizador = setTimeout(() => alCambiar(input.value), esperaMs);
  });
  // Escape limpia la búsqueda
  input.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape" && input.value !== "") {
      input.value = "";
      alCambiar("");
    }
  });
}
