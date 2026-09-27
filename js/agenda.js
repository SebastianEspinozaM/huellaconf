// Filtro de la agenda por área (incluye "Mi agenda")
export function iniciarFiltroAgenda() {
  const botones = document.querySelectorAll(".btn-filter");
  const charlas = document.querySelectorAll(".agenda-list .list-group-item");
  const mensajeVacio = document.getElementById("agendaVacia");
  let filtroActual = "todas";

  // Función pura: ¿esta charla pasa el filtro?
  const pasaFiltro = (charla, filtro) => {
    if (filtro === "todas") return true;
    if (filtro === "favoritas") return charla.classList.contains("es-favorita");
    return charla.dataset.area === filtro;
  };

  const aplicarFiltro = () => {
    let visibles = 0;
    charlas.forEach((charla) => {
      const coincide = pasaFiltro(charla, filtroActual);
      charla.classList.toggle("d-none", !coincide);
      if (coincide) visibles++;
    });

    mensajeVacio.textContent =
      filtroActual === "favoritas"
        ? "Aún no guardas charlas. Toca ☆ en las que te interesen."
        : "No hay charlas para ese filtro.";
    mensajeVacio.classList.toggle("d-none", visibles > 0);
  };

  botones.forEach((boton) => {
    boton.setAttribute("aria-pressed", String(boton.classList.contains("active")));
    boton.addEventListener("click", () => {
      filtroActual = boton.dataset.filtro;
      botones.forEach((b) => {
        b.classList.toggle("active", b === boton);
        b.setAttribute("aria-pressed", String(b === boton));
      });
      aplicarFiltro();
    });
  });

  // Si se quita una favorita mientras se ve "Mi agenda", se actualiza
  document.addEventListener("favoritos:cambio", aplicarFiltro);
}
