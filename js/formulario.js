// =========================================================
// Formulario de inscripción: usa las reglas de validacion.js
// =========================================================
import { validarCampo, validarFormulario, limpiarValidacion } from "./validacion.js";

export function iniciarFormulario() {
  const form = document.getElementById("formInscripcion");
  if (!form) return;

  const campos = form.querySelectorAll("input, select");
  const resumen = document.getElementById("formResumen");
  const cupos = document.getElementById("cuposRestantes");
  const modal = new bootstrap.Modal(document.getElementById("modalConfirmacion"));
  const mensaje = document.getElementById("modalMensaje");

  // Validación inline: al salir del campo, y luego en cada cambio
  campos.forEach((campo) => {
    campo.addEventListener("blur", () => {
      campo.dataset.tocado = "true";
      validarCampo(campo);
    });
    const evento = campo.type === "checkbox" || campo.tagName === "SELECT" ? "change" : "input";
    campo.addEventListener(evento, () => {
      if (campo.dataset.tocado) validarCampo(campo);
    });
  });

  form.addEventListener("submit", (evento) => {
    evento.preventDefault(); // nunca se envía si hay errores

    const conError = validarFormulario(form);
    campos.forEach((campo) => (campo.dataset.tocado = "true"));

    if (conError.length > 0) {
      const n = conError.length;
      resumen.textContent = `Revisa ${n} ${n === 1 ? "campo" : "campos"} antes de continuar.`;
      resumen.classList.remove("d-none");
      conError[0].focus();
      return;
    }

    resumen.classList.add("d-none");

    const nombre = form.nombre.value.trim();
    const perfil = form.perfil.value;

    const restantes = Math.max(Number(cupos.textContent) - 1, 0);
    cupos.textContent = restantes;

    mensaje.textContent = `Gracias, ${nombre}. Registramos tu cupo como ${perfil}. Te enviaremos los detalles por correo.`;
    modal.show();

    form.reset();
    limpiarValidacion(form);
    campos.forEach((campo) => delete campo.dataset.tocado);
  });
}
