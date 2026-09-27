// =========================================================
// Carrusel de testimonios (E5) · sin librerías
// - Botones anterior/siguiente y puntos
// - Flechas del teclado y swipe en mobile
// - Rotación automática que se pausa con hover, foco o botón
// - Respeta prefers-reduced-motion (sin autoplay)
// =========================================================
const INTERVALO_MS = 6000;

// Función pura: índice circular
export function indiceCircular(indice, total) {
  return ((indice % total) + total) % total;
}

export function iniciarCarrusel(idCarrusel) {
  const carrusel = document.getElementById(idCarrusel);
  if (!carrusel) return;

  const pista = carrusel.querySelector(".carrusel-pista");
  const slides = [...carrusel.querySelectorAll(".carrusel-slide")];
  const contenedorPuntos = carrusel.querySelector(".carrusel-puntos");
  const btnPausa = carrusel.querySelector('[data-accion="pausa"]');
  const estado = carrusel.querySelector("[aria-live]");
  const sinMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let actual = 0;
  let temporizador = null;
  let pausadoPorUsuario = sinMovimiento;

  // Crear un punto por slide
  const puntos = slides.map((_, i) => {
    const punto = document.createElement("button");
    punto.type = "button";
    punto.className = "carrusel-punto";
    punto.setAttribute("aria-label", `Ir al testimonio ${i + 1}`);
    punto.addEventListener("click", () => irA(i, true));
    contenedorPuntos.appendChild(punto);
    return punto;
  });

  function irA(indice, anunciar = false) {
    actual = indiceCircular(indice, slides.length);
    pista.style.transform = `translateX(-${actual * 100}%)`;

    slides.forEach((slide, i) => {
      const visible = i === actual;
      slide.setAttribute("aria-hidden", String(!visible));
      slide.inert = !visible;
    });
    puntos.forEach((punto, i) => punto.setAttribute("aria-current", String(i === actual)));

    if (anunciar) estado.textContent = `Testimonio ${actual + 1} de ${slides.length}`;
  }

  const detener = () => {
    clearInterval(temporizador);
    temporizador = null;
  };

  const reanudar = () => {
    if (pausadoPorUsuario || temporizador) return;
    temporizador = setInterval(() => irA(actual + 1), INTERVALO_MS);
  };

  const actualizarBotonPausa = () => {
    btnPausa.textContent = pausadoPorUsuario ? "▶" : "❚❚";
    btnPausa.setAttribute(
      "aria-label",
      pausadoPorUsuario ? "Reanudar rotación automática" : "Pausar rotación automática"
    );
  };

  carrusel.addEventListener("click", (evento) => {
    const accion = evento.target.closest("[data-accion]")?.dataset.accion;
    if (accion === "anterior") irA(actual - 1, true);
    if (accion === "siguiente") irA(actual + 1, true);
    if (accion === "pausa") {
      pausadoPorUsuario = !pausadoPorUsuario;
      actualizarBotonPausa();
      pausadoPorUsuario ? detener() : reanudar();
    }
  });

  // Teclado: flechas izquierda / derecha dentro del carrusel
  carrusel.addEventListener("keydown", (evento) => {
    if (evento.key === "ArrowLeft") irA(actual - 1, true);
    if (evento.key === "ArrowRight") irA(actual + 1, true);
  });

  // Swipe en pantallas táctiles
  let inicioX = null;
  carrusel.addEventListener("touchstart", (e) => (inicioX = e.touches[0].clientX), { passive: true });
  carrusel.addEventListener("touchend", (e) => {
    if (inicioX === null) return;
    const delta = e.changedTouches[0].clientX - inicioX;
    if (Math.abs(delta) > 50) irA(actual + (delta < 0 ? 1 : -1), true);
    inicioX = null;
  });

  // Pausa mientras el usuario interactúa
  carrusel.addEventListener("mouseenter", detener);
  carrusel.addEventListener("mouseleave", reanudar);
  carrusel.addEventListener("focusin", detener);
  carrusel.addEventListener("focusout", (e) => {
    if (!carrusel.contains(e.relatedTarget)) reanudar();
  });

  irA(0);
  actualizarBotonPausa();
  reanudar();
}
