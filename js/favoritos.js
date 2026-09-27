// =========================================================
// Favoritos de la agenda: "Mi agenda" (E4)
// Guarda los IDs de las charlas marcadas en localStorage.
// =========================================================
import { leer, guardar } from "./storage.js";

const CLAVE = "favoritas";

// Función pura: agrega o quita un id de la lista
export function alternarId(lista, id) {
  return lista.includes(id) ? lista.filter((x) => x !== id) : [...lista, id];
}

export function iniciarFavoritos() {
  const charlas = document.querySelectorAll(".agenda-list .list-group-item[data-id]");
  const contador = document.getElementById("contadorFavoritas");
  let favoritas = leer(CLAVE, []);

  // Limpia ids que ya no existen en la agenda
  const idsValidos = [...charlas].map((c) => c.dataset.id);
  favoritas = favoritas.filter((id) => idsValidos.includes(id));

  const pintar = (charla, boton) => {
    const activa = favoritas.includes(charla.dataset.id);
    charla.classList.toggle("es-favorita", activa);
    boton.textContent = activa ? "★" : "☆";
    boton.setAttribute("aria-pressed", String(activa));
  };

  charlas.forEach((charla) => {
    const titulo = charla.childNodes[1]?.textContent.trim() ?? "charla";

    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "btn-fav";
    boton.setAttribute("aria-label", `Guardar "${titulo}" en Mi agenda`);
    pintar(charla, boton);

    boton.addEventListener("click", () => {
      favoritas = alternarId(favoritas, charla.dataset.id);
      guardar(CLAVE, favoritas);
      pintar(charla, boton);
      contador.textContent = favoritas.length;
      // Avisamos al filtro de la agenda para que se actualice
      document.dispatchEvent(new CustomEvent("favoritos:cambio"));
    });

    charla.appendChild(boton);
  });

  contador.textContent = favoritas.length;
}
