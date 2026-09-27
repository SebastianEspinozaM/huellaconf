// Mostrar / ocultar la bio de cada speaker
export function iniciarBiosSpeakers() {
  document.querySelectorAll(".btn-bio").forEach((boton) => {
    boton.addEventListener("click", () => {
      const bio = boton.previousElementSibling;
      const ahoraVisible = !bio.classList.toggle("d-none");
      boton.textContent = ahoraVisible ? "Ocultar bio" : "Ver bio";
      boton.setAttribute("aria-expanded", String(ahoraVisible));
    });
  });
}
