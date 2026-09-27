// Modo claro / oscuro (persistente con storage.js)
import { leer, guardar } from "./storage.js";

export function iniciarModoOscuro() {
  const html = document.documentElement;
  const boton = document.getElementById("btnTema");
  if (!boton) return;

  const aplicarTema = (tema) => {
    html.setAttribute("data-theme", tema);
    const oscuro = tema === "dark";
    boton.textContent = oscuro ? "☀️ Modo claro" : "🌙 Modo oscuro";
    boton.setAttribute("aria-pressed", String(oscuro));
  };

  // Respeta la preferencia guardada o, si no hay, la del sistema
  const prefiereOscuro = window.matchMedia("(prefers-color-scheme: dark)").matches;
  aplicarTema(leer("tema", prefiereOscuro ? "dark" : "light"));

  boton.addEventListener("click", () => {
    const nuevoTema = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
    aplicarTema(nuevoTema);
    guardar("tema", nuevoTema);
  });
}
