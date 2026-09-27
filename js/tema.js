// Modo claro / oscuro
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

  try {
    const guardado = localStorage.getItem("hc-tema");
    if (guardado) aplicarTema(guardado);
  } catch (error) {
    // Sin localStorage: se usa el tema claro por defecto
  }

  boton.addEventListener("click", () => {
    const nuevoTema = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
    aplicarTema(nuevoTema);
    try {
      localStorage.setItem("hc-tema", nuevoTema);
    } catch (error) {
      // Ignorar si no se puede guardar
    }
  });
}
