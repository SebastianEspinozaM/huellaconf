// Filtro de la agenda por área
export function iniciarFiltroAgenda() {
  const botones = document.querySelectorAll(".btn-filter");
  const charlas = document.querySelectorAll(".agenda-list .list-group-item");
  const mensajeVacio = document.getElementById("agendaVacia");

  botones.forEach((boton) => {
    boton.addEventListener("click", () => {
      const filtro = boton.dataset.filtro;

      botones.forEach((b) => b.classList.remove("active"));
      boton.classList.add("active");

      let visibles = 0;
      charlas.forEach((charla) => {
        const coincide = filtro === "todas" || charla.dataset.area === filtro;
        charla.classList.toggle("d-none", !coincide);
        if (coincide) visibles++;
      });

      mensajeVacio.classList.toggle("d-none", visibles > 0);
    });
  });
}
