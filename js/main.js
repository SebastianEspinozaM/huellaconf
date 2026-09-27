// =========================================================
// HuellaConf 2026 · Punto de entrada
// Cada funcionalidad vive en su propio módulo.
// =========================================================
import { iniciarModoOscuro } from "./tema.js";
import { iniciarFiltroAgenda } from "./agenda.js";
import { iniciarFavoritos } from "./favoritos.js";
import { iniciarBiosSpeakers } from "./speakers.js";
import { iniciarFormulario } from "./formulario.js";
import { iniciarCuentaRegresiva } from "./cuenta-regresiva.js";

document.addEventListener("DOMContentLoaded", () => {
  iniciarModoOscuro();
  iniciarFavoritos();
  iniciarFiltroAgenda();
  iniciarBiosSpeakers();
  iniciarFormulario();
  iniciarCuentaRegresiva();
});
