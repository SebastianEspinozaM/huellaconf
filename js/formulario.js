// Validación en tiempo real + envío del formulario de inscripción
export function iniciarFormulario() {
  const form = document.getElementById("formInscripcion");
  if (!form) return;

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

    const restantes = Math.max(Number(cupos.textContent) - 1, 0);
    cupos.textContent = restantes;

    mensaje.textContent = `Gracias, ${nombre}. Registramos tu cupo como ${perfil}. Te enviaremos los detalles por correo.`;
    modal.show();

    form.reset();
    campos.forEach((campo) => campo.classList.remove("is-valid", "is-invalid"));
  });
}
