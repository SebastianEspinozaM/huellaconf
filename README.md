# HuellaConf 2026 🐾

> Proyecto del Módulo 1 — HTML + CSS + JS · Diplomado Fullstack IPSS
> Opción base: **C — Página de evento/conferencia**

## Integrantes

- Sebastián Enrique — dueño de todos los evolutivos (trabajo individual)

## Descripción

HuellaConf 2026 es la landing de un congreso ficticio de medicina veterinaria de pequeños animales en Santiago.
Incluye hero con cuenta regresiva, agenda filtrable con favoritos, speakers, pacientes cargados desde una API pública, sponsors, testimonios, preguntas frecuentes e inscripción con validación.

## Demo

- Sitio desplegado: https://sebastianespinozam.github.io/huellaconf/
- Capturas:

| Desktop | Mobile |
|---|---|
| ![Desktop](docs/desktop.png) | ![Mobile](docs/mobile.png) |

## Cómo correr localmente

El JavaScript usa **módulos ES** (`import`/`export`), así que el sitio debe abrirse desde un servidor local (los navegadores bloquean módulos abiertos con `file://`).

```bash
git clone https://github.com/SebastianEspinozaM/huellaconf.git
cd huellaconf
python3 -m http.server 8000
# abrir http://localhost:8000
```

En VS Code también sirve la extensión **Live Server** (clic derecho en `index.html` → *Open with Live Server*).

## Estructura del proyecto

```
.
├── index.html
├── CHANGELOG.md
├── css/
│   └── custom.css          ← CSS propio, cargado DESPUÉS de Bootstrap
├── js/
│   ├── main.js             ← punto de entrada: solo importa e inicializa módulos
│   ├── validacion.js       ← E1: reglas de validación (funciones puras)
│   ├── formulario.js       ← E1: conecta las reglas con el formulario
│   ├── api.js              ← E2: fetch a Dog CEO (sin tocar el DOM)
│   ├── pacientes.js        ← E2/E3: estados de carga, error y render
│   ├── filtro.js           ← E3: búsqueda en tiempo real
│   ├── storage.js          ← E4: envoltorio seguro de localStorage
│   ├── favoritos.js        ← E4: "Mi agenda"
│   ├── tema.js             ← E4: modo oscuro persistente
│   ├── carrusel.js         ← E5: carrusel de testimonios
│   ├── agenda.js           ← filtro de agenda por área (Eval 1)
│   ├── speakers.js         ← bio de speakers (Eval 1)
│   └── cuenta-regresiva.js ← cuenta regresiva (Eval 1)
├── img/                    ← imágenes WebP/JPG + favicon SVG
└── docs/                   ← capturas para el README
```

## Evolutivos implementados (Evaluación 2)

| # | Evolutivo | Qué se hizo |
|---|---|---|
| **E1** | Validación de formulario | Reglas propias por campo (nombre, correo, teléfono chileno opcional, perfil, términos). Errores inline con mensajes específicos, resumen de errores al enviar, foco en el primer campo con error y `aria-invalid`/`aria-describedby` para lectores de pantalla. El envío se bloquea si hay errores. |
| **E2** | Consumo de API con `fetch` | Sección **Pacientes de la semana** con imágenes de la API [Dog CEO](https://dog.ceo/dog-api/). Estados de carga (tarjetas esqueleto), error (mensaje + botón *Reintentar*), vacío y éxito. Botón para pedir otros pacientes. |
| **E3** | Búsqueda dinámica | Buscador que filtra las razas cargadas mientras se escribe, sin distinguir tildes ni mayúsculas. Muestra "Mostrando X de Y" y un mensaje cuando no hay coincidencias. `Escape` limpia la búsqueda. |
| **E4** | Persistencia con `localStorage` | **Mi agenda**: cada charla tiene una ☆ para guardarla; se filtran con el botón "★ Mi agenda (n)" y se mantienen al recargar. El modo oscuro también se guarda y, si no hay preferencia, respeta la del sistema. |
| **E5** | Componente interactivo propio | Carrusel de testimonios hecho desde cero (sin el JS de Bootstrap): anterior/siguiente, puntos, flechas del teclado, swipe en mobile, rotación automática con pausa (botón, hover y foco) y sin autoplay si el sistema pide menos movimiento. |
| **E6** | Mejoras de calidad | Meta tags Open Graph/Twitter, canonical, favicon y `theme-color`. Enlace "Saltar al contenido", foco visible en todos los controles, `loading="lazy"` en imágenes bajo el pliegue y ajustes de contraste AA. Lighthouse (GitHub Pages, mobile): **Performance 91 · Accessibility 100 · Best Practices 100 · SEO 100**. |

Todo lo de la Evaluación 1 se mantiene: filtro de agenda por área, bio de speakers, cuenta regresiva, modal de confirmación y diseño responsive.

## Decisiones técnicas

- **API elegida: Dog CEO.** Es pública, gratuita, no requiere API key, permite CORS y calza con la temática veterinaria. Con un solo pedido (`/breeds/image/random/8`) se obtienen las imágenes, y el nombre de la raza se saca de la URL (`hound-afghan` → *Afghan Hound*).
- **Seguridad (XSS):** todo dato externo se inserta con `createElement` + `textContent`; no se usa `innerHTML` con datos de la API. Además, `api.js` descarta cualquier imagen que no venga de `https://images.dog.ceo/`.
- **Async y errores:** `async/await` con `try/catch`. Se valida `response.ok` y el formato de la respuesta. Hay un límite de 8 segundos (`AbortSignal.timeout`) y un `AbortController` que cancela el pedido anterior si el usuario pide otros pacientes antes de que termine (evita *race conditions*).
- **Organización del JS:** un módulo por funcionalidad; `main.js` solo inicializa. La lógica que no depende del DOM está en funciones puras (`reglas` de validación, `normalizar`, `filtrarPorTexto`, `nombreRaza`, `alternarId`, `indiceCircular`, `calcularTiempoRestante`), lo que las hace fáciles de probar y reutilizar.
- **Módulos ES vs. `file://`:** usar `import/export` obliga a abrir el sitio con un servidor local (o GitHub Pages). Se aceptó este *trade-off* porque ordena mucho mejor el código.
- **`localStorage` seguro:** `storage.js` envuelve lectura y escritura en `try/catch` y usa un prefijo (`huellaconf:`) para no chocar con otros datos. Si el navegador lo bloquea (modo privado), el sitio sigue funcionando sin persistencia.
- **Formulario sin "saltos":** el espacio de los mensajes de error queda reservado, para que el botón no se mueva al aparecer un error y el clic en "Confirmar" no se pierda.
- **Componente propio en E5:** se hizo sin el carrusel de Bootstrap para cumplir "sin librerías" y controlar la accesibilidad (`aria-roledescription`, `inert` en diapositivas ocultas, región `aria-live`).

## Stack

- HTML5 semántico
- Bootstrap 5.3 (vía CDN)
- CSS custom propio (variables de paleta y tipografía, mobile first)
- Google Fonts: Fraunces + Nunito
- JavaScript vanilla con módulos ES
- API pública: Dog CEO
