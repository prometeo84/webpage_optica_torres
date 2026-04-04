#!/usr/bin/env bash
# Genera favicon.ico, PNGs y apple-touch-icon desde el SVG fuente
# Requiere ImageMagick (convert) o la utilidad 'magick' en Windows
set -e
SRC="../img/favicon-optica.svg"
OUT_DIR="../img"
mkdir -p "$OUT_DIR"

# Detectar comando convert/magick
if command -v magick >/dev/null 2>&1; then
  CMD="magick"
elif command -v convert >/dev/null 2>&1; then
  CMD="convert"
else
  echo "Error: ImageMagick no está instalado (necesita 'magick' o 'convert')." >&2
  exit 1
fi

# Generar PNGs
$CMD "$SRC" -background none -resize 180x180 "$OUT_DIR/apple-touch-icon.png"
$CMD "$SRC" -background none -resize 32x32  "$OUT_DIR/favicon-32.png"
$CMD "$SRC" -background none -resize 16x16  "$OUT_DIR/favicon-16.png"

# Generar favicon.ico (varios tamaños)
$CMD "$SRC" -background none -resize 48x48  "$OUT_DIR/favicon-48.png"
$CMD "$SRC" -background none -resize 32x32  "$OUT_DIR/favicon-32-for-ico.png"
$CMD "$SRC" -background none -resize 16x16  "$OUT_DIR/favicon-16-for-ico.png"
$CMD "$OUT_DIR/favicon-48.png" "$OUT_DIR/favicon-32-for-ico.png" "$OUT_DIR/favicon-16-for-ico.png" "$OUT_DIR/favicon.ico"

# Limpieza de archivos temporales usados para crear el ico
rm -f "$OUT_DIR/favicon-48.png" "$OUT_DIR/favicon-32-for-ico.png" "$OUT_DIR/favicon-16-for-ico.png"

echo "Favicons generados en $OUT_DIR (favicon.ico, favicon-32.png, favicon-16.png, apple-touch-icon.png)."
