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

---

## 📸 Badge W3C — ¿recomendado?

Sí. Añadir un badge discreto con enlace al validador aporta credibilidad técnica. Recomendación práctica:

- Colocar en footer o en página "Avisos legales".
- Mantener el badge como enlace al validador o, mejor, a un resultado de validación exportado.

---

## 📌 Estado actual y acciones realizadas ahora

## 📌 Estado actual y cambios recientes

Actualizado: 2026-04-05

- `tools/site_checks.py` ejecutado: `tools/site_checks_report.json` muestra 0 errores/warnings en las páginas principales.
- Añadido workflow de CI: `.github/workflows/w3c-validate.yml`.
- Añadido helper en `tools/check_w3c_exit.py` para comprobar el resultado de W3C en CI.
- Badges añadidos en el sitio: W3C (logo), GitHub Actions y badges de shields.io en `index.html` y en `especialistas/gioconda-torres/index.html`.
- El footer principal (`index.html`) fue actualizado: el correo se convirtió en enlace `mailto`.
- En la sección `Especialistas` la tarjeta de la Dra. Gioconda ahora enlaza a `especialistas/gioconda-torres/index.html`.
- Todos los cambios del sitio fueron commiteados y pusheados al repositorio (`origin/main`).

— Equipo de mantenimiento — Óptica Torres
