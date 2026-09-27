# Changelog

Todos los cambios relevantes del proyecto. Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/).

## [v2.0] — 2026-09-27

### Agregado

- E1: Validación del formulario de inscripción con reglas propias, errores inline, resumen de errores y campo de teléfono chileno opcional.
- E2: Sección "Pacientes de la semana" con datos de la API Dog CEO, con estados de carga, error con reintento y éxito.
- E3: Buscador de razas en tiempo real sobre los datos de la API.
- E4: "Mi agenda": charlas favoritas guardadas en localStorage, con filtro y contador.
- E5: Carrusel de testimonios propio con teclado, swipe, puntos y pausa.
- E6: Meta tags Open Graph/Twitter, canonical, favicon, enlace "Saltar al contenido" y foco visible.

### Mejorado

- JavaScript separado en módulos ES por funcionalidad (`main.js` como punto de entrada).
- Modo oscuro persistente a través de `storage.js`; respeta la preferencia del sistema.
- Contraste de botones, enlaces y etiquetas para cumplir WCAG AA.
- Imágenes bajo el pliegue con `loading="lazy"`.
- Lighthouse (GitHub Pages, mobile): Performance 91, Accessibility 100, Best Practices 100, SEO 100.

### Cambiado

- El sitio ahora debe abrirse desde un servidor local (Live Server o `python3 -m http.server`) por el uso de módulos ES.

## [v1.0] — 2026-09-27

- Entrega inicial: sitio estático con Bootstrap 5 + CSS custom + eventos básicos (modo oscuro, filtro de agenda, bio de speakers, validación simple y modal de inscripción).
