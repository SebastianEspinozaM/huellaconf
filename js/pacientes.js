// =========================================================
// Sección "Pacientes de la semana" (E2)
// Estados: cargando -> éxito | vacío | error (con reintento)
// Se renderiza con createElement + textContent (sin innerHTML)
// para evitar XSS con datos externos.
// =========================================================
import { obtenerPacientes } from "./api.js";
import { filtrarPorTexto, conectarBuscador } from "./filtro.js";

const CANTIDAD = 8;

function crearTarjeta(paciente) {
  const item = document.createElement("li");
  item.className = "col-6 col-md-4 col-lg-3";

  const tarjeta = document.createElement("article");
  tarjeta.className = "card paciente-card h-100";

  const img = document.createElement("img");
  img.className = "card-img-top";
  img.src = paciente.imagen;
  img.alt = `Perro de raza ${paciente.raza}`;
  img.loading = "lazy";
  img.decoding = "async";
  img.width = 400;
  img.height = 300;

  const cuerpo = document.createElement("div");
  cuerpo.className = "card-body";

  const titulo = document.createElement("h3");
  titulo.className = "card-title";
  titulo.textContent = paciente.raza; // textContent: nunca se interpreta como HTML

  cuerpo.appendChild(titulo);
  tarjeta.append(img, cuerpo);
  item.appendChild(tarjeta);
  return item;
}

function crearEsqueleto() {
  const item = document.createElement("li");
  item.className = "col-6 col-md-4 col-lg-3";
  item.setAttribute("aria-hidden", "true");
  const tarjeta = document.createElement("div");
  tarjeta.className = "paciente-esqueleto";
  item.appendChild(tarjeta);
  return item;
}

export function iniciarPacientes() {
  const lista = document.getElementById("listaPacientes");
  const estado = document.getElementById("pacientesEstado");
  const boton = document.getElementById("btnOtrosPacientes");
  const buscador = document.getElementById("buscarRaza");
  if (!lista) return;

  let controlador = null;
  let pacientes = [];
  let busqueda = "";

  const mostrarCargando = () => {
    lista.replaceChildren(...Array.from({ length: CANTIDAD }, crearEsqueleto));
    lista.setAttribute("aria-busy", "true");
    estado.className = "pacientes-estado";
    estado.textContent = "Cargando pacientes…";
    boton.disabled = true;
  };

  const mostrarError = (mensaje) => {
    lista.replaceChildren();
    estado.className = "pacientes-estado pacientes-error";
    estado.textContent = mensaje + " ";

    const reintentar = document.createElement("button");
    reintentar.type = "button";
    reintentar.className = "btn btn-sm btn-reintentar";
    reintentar.textContent = "Reintentar";
    reintentar.addEventListener("click", cargar);
    estado.appendChild(reintentar);
  };

  // Muestra solo los pacientes que coinciden con la búsqueda (E3)
  const renderizar = () => {
    const visibles = filtrarPorTexto(pacientes, busqueda, "raza");
    lista.replaceChildren(...visibles.map(crearTarjeta));
    estado.className = "pacientes-estado";

    if (busqueda === "") {
      estado.textContent = `${pacientes.length} pacientes cargados.`;
    } else if (visibles.length === 0) {
      estado.textContent = `Ninguna raza coincide con “${busqueda}”.`;
    } else {
      estado.textContent = `Mostrando ${visibles.length} de ${pacientes.length} pacientes.`;
    }
  };

  async function cargar() {
    // Si hay un pedido en curso, lo cancelamos (evita race conditions)
    controlador?.abort();
    controlador = new AbortController();
    const miControlador = controlador;

    mostrarCargando();
    try {
      pacientes = await obtenerPacientes(CANTIDAD, miControlador.signal);
      if (miControlador !== controlador) return; // llegó una respuesta vieja

      if (pacientes.length === 0) {
        lista.replaceChildren();
        estado.textContent = "No encontramos pacientes esta vez. Intenta de nuevo.";
      } else {
        renderizar();
      }
    } catch (error) {
      if (miControlador !== controlador) return;
      console.warn("No se pudieron obtener pacientes:", error.message);
      const mensaje =
        error.name === "TimeoutError"
          ? "La API tardó demasiado en responder."
          : "No pudimos cargar los pacientes. Revisa tu conexión.";
      mostrarError(mensaje);
    } finally {
      if (miControlador === controlador) {
        lista.setAttribute("aria-busy", "false");
        boton.disabled = false;
      }
    }
  }

  boton.addEventListener("click", cargar);
  conectarBuscador(buscador, (texto) => {
    busqueda = texto.trim();
    if (pacientes.length > 0) renderizar();
  });
  cargar();
}
