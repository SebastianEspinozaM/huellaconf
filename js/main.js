// =========================================================
// HuellaConf 2026 · JavaScript propio (vanilla)
// Todos los eventos usan addEventListener y modifican el DOM.
// =========================================================

document.addEventListener("DOMContentLoaded", () => {
  iniciarModoOscuro();
  iniciarFiltroAgenda();
  iniciarBiosSpeakers();
  iniciarFormulario();
  iniciarCuentaRegresiva();
});

// ---------- 1. Toggle modo claro / oscuro ----------
function iniciarModoOscuro() {
  const html = document.documentElement;
  const boton = document.getElementById("btnTema");

  const aplicarTema = (tema) => {
    html.setAttribute("data-theme", tema);
    const oscuro = tema === "dark";
    boton.textContent = oscuro ? "☀️ Modo claro" : "🌙 Modo oscuro";
    boton.setAttribute("aria-pressed", String(oscuro));
  };

  // Recordar preferencia (si el navegador lo permite)
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

// ---------- 2. Filtro de la agenda por área ----------
function iniciarFiltroAgenda() {
  const botones = document.querySelectorAll(".btn-filter");
  const charlas = document.querySelectorAll(".agenda-list .list-group-item");
  const mensajeVacio = document.getElementById("agendaVacia");

  botones.forEach((boton) => {
    boton.addEventListener("click", () => {
      const filtro = boton.dataset.filtro;

      // Marcar botón activo
      botones.forEach((b) => b.classList.remove("active"));
      boton.classList.add("active");

      // Mostrar u ocultar charlas
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

// ---------- 3. Mostrar / ocultar bio de cada speaker ----------
function iniciarBiosSpeakers() {
  document.querySelectorAll(".btn-bio").forEach((boton) => {
    boton.addEventListener("click", () => {
      const bio = boton.previousElementSibling;
      const ahoraVisible = !bio.classList.toggle("d-none");
      boton.textContent = ahoraVisible ? "Ocultar bio" : "Ver bio";
      boton.setAttribute("aria-expanded", String(ahoraVisible));
    });
  });
}

// ---------- 4. Validación en tiempo real + envío del formulario ----------
function iniciarFormulario() {
  const form = document.getElementById("formInscripcion");
  const campos = form.querySelectorAll("input, select");
  const cupos = document.getElementById("cuposRestantes");
  const modal = new bootstrap.Modal(document.getElementById("modalConfirmacion"));
  const mensaje = document.getElementById("modalMensaje");

  const validarCampo = (campo) => {
    const valido = campo.checkValidity();
    campo.classList.toggle("is-valid", valido);
    campo.classList.toggle("is-invalid", !valido);
    return valido;
  };

  // Validación mientras el usuario escribe / cambia
  campos.forEach((campo) => {
    const evento = campo.type === "checkbox" || campo.tagName === "SELECT" ? "change" : "input";
    campo.addEventListener(evento, () => validarCampo(campo));
  });

  form.addEventListener("submit", (evento) => {
    evento.preventDefault();

    let todoValido = true;
    campos.forEach((campo) => {
      if (!validarCampo(campo)) todoValido = false;
    });
    if (!todoValido) return;

    const nombre = form.nombre.value.trim();
    const perfil = form.perfil.value;

    // Actualizar cupos disponibles en el hero
    const restantes = Math.max(Number(cupos.textContent) - 1, 0);
    cupos.textContent = restantes;

    mensaje.textContent = `Gracias, ${nombre}. Registramos tu cupo como ${perfil}. Te enviaremos los detalles por correo.`;
    modal.show();

    form.reset();
    campos.forEach((campo) => campo.classList.remove("is-valid", "is-invalid"));
  });
}

// ---------- 5. Cuenta regresiva al evento ----------
function iniciarCuentaRegresiva() {
  const fechaEvento = new Date("2026-11-14T09:00:00-03:00");
  const dias = document.getElementById("cdDias");
  const horas = document.getElementById("cdHoras");
  const minutos = document.getElementById("cdMinutos");

  const actualizar = () => {
    const diferencia = Math.max(fechaEvento - new Date(), 0);
    dias.textContent = Math.floor(diferencia / 86400000);
    horas.textContent = Math.floor((diferencia / 3600000) % 24);
    minutos.textContent = Math.floor((diferencia / 60000) % 60);
  };

  actualizar();
  setInterval(actualizar, 30000);
}
