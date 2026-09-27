// =========================================================
// Validación de formularios (E1) · sin librerías
// Las reglas son funciones puras: reciben un valor y
// devuelven un mensaje de error o "" si todo está bien.
// =========================================================

const REGEX_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const REGEX_TELEFONO_CL = /^(\+?56)?\s?9\s?\d{4}\s?\d{4}$/;
const REGEX_NOMBRE = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' -]+$/;

export const reglas = {
  nombre(valor) {
    const limpio = valor.trim();
    if (limpio === "") return "Ingresa tu nombre.";
    if (limpio.length < 3) return "El nombre debe tener al menos 3 caracteres.";
    if (!REGEX_NOMBRE.test(limpio)) return "El nombre solo puede contener letras y espacios.";
    return "";
  },
  correo(valor) {
    const limpio = valor.trim();
    if (limpio === "") return "Ingresa tu correo electrónico.";
    if (!REGEX_CORREO.test(limpio)) return "El correo no tiene un formato válido (ej: nombre@dominio.cl).";
    return "";
  },
  telefono(valor) {
    const limpio = valor.trim();
    if (limpio === "") return ""; // opcional
    if (!REGEX_TELEFONO_CL.test(limpio)) return "Usa el formato +56 9 1234 5678.";
    return "";
  },
  perfil(valor) {
    return valor === "" ? "Selecciona tu perfil." : "";
  },
  terminos(marcado) {
    return marcado ? "" : "Debes aceptar para continuar.";
  },
};

// Obtiene el valor de un campo según su tipo
function valorDe(campo) {
  return campo.type === "checkbox" ? campo.checked : campo.value;
}

// Valida un campo y muestra (u oculta) su error inline
export function validarCampo(campo) {
  const regla = reglas[campo.name];
  if (!regla) return true;

  const mensaje = regla(valorDe(campo));
  const error = document.getElementById(`${campo.id}-error`);

  campo.classList.toggle("is-invalid", mensaje !== "");
  campo.classList.toggle("is-valid", mensaje === "" && valorDe(campo) !== "");
  campo.setAttribute("aria-invalid", String(mensaje !== ""));
  if (error) error.textContent = mensaje;

  return mensaje === "";
}

// Valida todo el formulario y devuelve los campos con error
export function validarFormulario(form) {
  const campos = [...form.querySelectorAll("input, select, textarea")];
  return campos.filter((campo) => !validarCampo(campo));
}

// Limpia estados de validación (después de enviar)
export function limpiarValidacion(form) {
  form.querySelectorAll(".is-valid, .is-invalid").forEach((campo) => {
    campo.classList.remove("is-valid", "is-invalid");
    campo.removeAttribute("aria-invalid");
  });
  form.querySelectorAll(".invalid-feedback").forEach((p) => (p.textContent = ""));
}
