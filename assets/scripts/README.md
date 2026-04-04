Generador de favicons

Este script crea versiones compatibles de favicon a partir de `assets/img/favicon-optica.svg`.

Requisitos:

- ImageMagick (instala desde https://imagemagick.org o en Windows usar Chocolatey: `choco install imagemagick`)

Uso (desde la carpeta `assets/scripts`):

```bash
bash generate-favicons.sh
```

Salidas (en `assets/img`):

- `favicon.ico`
- `favicon-32.png`
- `favicon-16.png`
- `apple-touch-icon.png`

Si usas Windows y `magick` es el comando disponible, el script lo detecta automáticamente.

Uso en Windows (PowerShell desde la raíz `C:\laragon\www`):

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
powershell -NoProfile -ExecutionPolicy Bypass -File .\assets\scripts\generate-favicons.ps1
```

Mover assets de la página `gioconda`

Se incluye un script PowerShell `move-gioconda-assets.ps1` que copia imágenes y fuentes desde
`especialistas/gioconda-torres` hacia `assets/img/gioconda` y `assets/fonts`.

Uso (PowerShell, desde la raíz del proyecto `C:\laragon\www`):

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
powershell -NoProfile -ExecutionPolicy Bypass -File .\assets\scripts\move-gioconda-assets.ps1
```

Después de ejecutar, revisa que los archivos se hayan copiado y prueba la página.
