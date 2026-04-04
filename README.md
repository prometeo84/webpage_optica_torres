# Óptica Torres — Sitio web

Proyecto de sitio web institucional para Óptica Torres. Contiene la landing principal y páginas de especialistas (p. ej. `especialistas/gioconda-torres`).

Características clave

- Plantilla responsive basada en Bootstrap 5.
- Secciones para especialistas, testimonios y agendamiento.
- Reutilización de assets (CSS/JS/imagenes) desde la carpeta `assets/`.
- Placeholders de vídeo con carga a demanda (thumb proxy para Dailymotion).

Cómo ejecutar localmente

1. Coloca el proyecto en tu servidor local (Laragon, XAMPP, etc.) en `C:\laragon\www`.
2. Accede a: `http://localhost/` o `http://localhost/especialistas/gioconda-torres/index.html` para la página de la Dra. Gioconda.
3. Si cambias archivos estáticos, limpia la caché del navegador (DevTools → Disable cache) y recarga.

Estructura relevante

- `assets/` — CSS, JS y vendor (Bootstrap, AOS, Swiper, etc.)
- `especialistas/gioconda-torres/` — página de la Dra. Gioconda, scripts y estilos específicos
- `README.md` — este fichero

Cambios recientes

- 2026-04-04: Se simplificó la página de la Dra. Gioconda: extracción de CSS/JS inline, creación de `gioconda-page.js` y `css/gioconda-page.css`, y arquitectura de placeholders para vídeos de Dailymotion con `thumb.php`.
- 2026-04-04: Se eliminó la carpeta duplicada `medic-care` y se consolidaron los assets en la estructura principal.

Notas para desarrolladores

- Las miniaturas de Dailymotion las sirve `especialistas/gioconda-torres/thumb.php` para evitar problemas CORS.
- Los iframes de vídeo usan `data-lazy` + `data-src` y se reemplazan por un placeholder que carga el iframe solo al hacer clic.
