# Óptica Torres — Sitio web

¡Trabajo realizado! 🎉 Este repositorio contiene la web de Óptica Torres con mejoras de SEO, accesibilidad, rendimiento y seguridad aplicadas a la landing y la página de especialistas.

---

## ✅ Resumen ejecutivo (lo esencial)

- Se añadieron etiquetas `rel="canonical"` y se actualizó `sitemap.xml` para URLs canónicas.
- `robots.txt` actualizado y apunta a la sitemap absoluta.
- Validación W3C: todas las páginas principales escaneadas pasan con 0 errores/warnings (ver `tools/site_checks_report.json`).
- Proxy de miniaturas seguro: `especialistas/gioconda-torres/thumb.php` con caché, ETag, conversión WebP y rate‑limit.
- Consolidación CSS: movimiento de estilos inline a `assets/css/main.css` (clase `.gallery-img`).

---

## 📌 Cambios técnicos (detallado)

1. SEO & metadata

- `index.html` y páginas clave ahora incluyen `link rel="canonical"`.
- `sitemap.xml` revisado y normalizado (entradas canónicas, `lastmod` actualizado).
- `robots.txt` actualizado para bloquear paths administrativos y declarar sitemap absoluto.

2. Accesibilidad y calidad de código

- Correcciones para pasar validación W3C; utilidades: `tools/validate_html_w3c.py`, `tools/site_checks.py` y `tools/normalize_html.py`.
- Se eliminaron saltos de línea excesivos y se validaron comentarios HTML.

3. Rendimiento y media

- Galería: clases CSS (`.gallery-img`) para tamaño uniforme y `object-fit:contain`.
- Proxy de miniaturas (`thumb.php`):
  - Caché en disco (preferente fuera del webroot), metadatos JSON y protección `.htaccess` si está dentro del webroot.
  - ETag + 304 support, TTL configurable (por defecto 1 día).
  - Conversión a WebP (Imagick si disponible, GD como fallback).
  - Rate‑limit por IP: Redis si está instalado; fallback a contador en filesystem.

4. Seguridad y editor

- Stubs para `Redis` e `Imagick` en `stubs/` para evitar advertencias del editor (Intelephense).
- `.vscode/settings.json` actualizado para tratar `sitemap.xml` como XML.

---

## 🧰 Scripts incluidos

- `tools/validate_html_w3c.py <file>` — usa el validador W3C y devuelve JSON.
- `tools/site_checks.py` — corre la validación en todos los HTML y crea `tools/site_checks_report.json`.
- `tools/normalize_html.py` — valida comentarios y colapsa saltos de línea redundantes.

---

## ⚙️ Recomendaciones de despliegue

- Caché fuera del webroot (recomendado): crear `C:\laragon\thumb_cache` y dar permisos al usuario del servidor web.
- Imagick: instalar la extensión para mejor conversión WebP.
- Redis: instalar/activar si quieres rate‑limit robusto y altamente eficiente.

Ejemplo (PowerShell) para crear caché fuera del webroot:

```powershell
New-Item -ItemType Directory -Path C:\laragon\thumb_cache -Force
icacls C:\laragon\thumb_cache /grant "IIS_IUSRS:(OI)(CI)M" /T
```

---

## 🛡️ Edge rate limiting (Nginx + Cloudflare)

- Nginx (config global en `http`):

```nginx
limit_req_zone $binary_remote_addr zone=thumb_zone:10m rate=2r/s;
```

- Location recomendado para `thumb.php`:

```nginx
location = /especialistas/gioconda-torres/thumb.php {
		limit_req zone=thumb_zone burst=20 nodelay;
		include fastcgi_params;
		fastcgi_pass unix:/run/php/php-fpm.sock;
		fastcgi_param SCRIPT_FILENAME /var/www/html/especialistas/gioconda-torres/thumb.php;
}
```

- Cloudflare: crear regla Rate Limiting (`>120 requests / 1 minute` por IP) para `*/thumb.php*` y probar en modo "Simulate" antes de bloquear en producción.

**Estructura recomendada para despliegue (subir al hosting)**

Aquí tienes un árbol visual con los archivos y carpetas que deberías subir al servidor de producción. Excluye las carpetas y archivos marcados en la sección de exclusión.

```text
/ (webroot)
├─ index.html
├─ starter-page.html
├─ robots.txt
├─ sitemap.xml
├─ .htaccess            # si usas Apache (CSP, rewrites, HSTS)
├─ assets/
│  ├─ css/
│  │  ├─ variables.css
│  │  ├─ main.css
│  │  └─ (otros *.css necesarios)
│  ├─ js/
│  │  ├─ main.js
│  │  └─ (vendor scripts: bootstrap, aos, glightbox...)
│  ├─ img/
│  │  └─ (imágenes públicas, optimizadas WebP/servir webp cuando sea posible)
│  └─ fonts/
├─ vendor/              # dependencias frontend (bootstrap, fontawesome...)
├─ especialistas/
│  ├─ gioconda-torres/
│  │  ├─ index.html
│  │  ├─ css/
│  │  │  └─ gioconda-page.css
│  │  ├─ js/
│  │  └─ thumb.php       # proxy de miniaturas (si lo usas en producción)
│  └─ (otras páginas de especialistas si las hay)
└─ README.md

# Archivos/ carpetas que NO subir
# (mantener fuera del servidor público o del deploy)
/.venv/                # entorno virtual local
/.github/              # CI workflows (no necesarios en producción)
/tools/                # scripts de validación / desarrollo
/stubs/                # stubs de editor
/scss/                 # fuentes de estilo preprocesadas
/assets/scripts/       # herramientas helper / generadores (no runtime)
/thumb_cache/          # caché de miniaturas (debe ubicarse fuera del webroot)
*.log                  # logs locales
*.tmp

```

Notas:

- Si `thumb.php` está activado, configura la caché fuera del webroot (p.ej. `/var/cache/thumbs` o `C:\laragon\thumb_cache`) y no subas esa carpeta al repo ni al hosting público.
- Ajusta permisos de `assets/img/` y de la carpeta de caché para que el proceso web pueda leer/escribir según sea necesario.
- Antes de apuntar el dominio a producción: probar en staging con HTTPS y validar sitemap/robots.

---

## 🔄 Actualización — 12 de abril de 2026

- **Validaciones:** Se verificó la validación HTML (W3C) en páginas clave del sitio; los informes locales indican que no quedan errores críticos.
- **Correcciones:** Se aplicó una corrección para que el botón flotante de WhatsApp funcione correctamente en vistas móviles (ajuste de inicialización JS al evento DOMContentLoaded).
- **SEO y accesibilidad:** Se añadieron mejoras de metadatos y pequeños ajustes en la jerarquía de encabezados para mejorar la accesibilidad y señales SEO.
- **Estado del repositorio:** Los cambios relacionados fueron committeados y pusheados al branch `main`.

Si necesitas que incluya hashes de commit o los resultados JSON de validación aquí, dímelo y los añado (sin información sensible).
