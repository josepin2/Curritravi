Curritravi — Generador de CV (React + Vite)

Requisitos
- Node.js 18+ (LTS recomendado) y npm
- Windows 10/11
- Opcional: Git
- Opcional: Ollama para mejoras con IA locales (modelo `gemma3:12b-it-qat`)

Instalación
- Descarga o clona el proyecto en tu PC
- Abre una terminal en la carpeta del proyecto
- Ejecuta: `npm install`

Ejecución en desarrollo
- Opción 1 (terminal): `npm run dev` y abre `http://localhost:5173/`
- Opción 2 (bat en Windows): ejecuta `start_curritravi.bat` (instala dependencias y lanza el servidor en la misma ventana). El navegador se abre automáticamente porque el script `dev` lleva `--open`.

Mejoras de texto con IA (Ollama, local)
- Instala Ollama: https://ollama.com
- Arranca el servicio: `ollama serve`
- Descarga el modelo: `ollama pull gemma3:12b-it-qat`
- La app usa un proxy local a `http://localhost:11434` bajo `/ollama`; no requiere configuración adicional
- En el formulario pulsa “Mejorar con IA” en Resumen o Descripción

Crear build de producción
- `npm run build`
- Previsualiza el build: `npm run preview` y abre la URL indicada

Exportar a PDF
- Pulsa el botón “Exportar PDF” para imprimir/exportar el CV
- El PDF se genera sin bordes y con paginación limpia cuando el contenido es largo

Notas
- Si Ollama no está activo, los botones de mejora con IA mostrarán estados de carga y restaurarán el texto original en caso de error
- Los datos del CV se guardan en localStorage para recuperar tu borrador

Publicación en GitHub
- Opción script (Windows): `publish_curritravi.bat https://github.com/usuario/repositorio.git`
  - Repositorio vacío (sin README) previamente creado en tu GitHub
  - Realiza init, commit, set `main`, añade remoto y hace push
- Opción manual:
  - `git init && git add . && git commit -m "Inicial: Curritravi (React + Vite)"`
  - `git branch -M main`
  - `git remote add origin https://github.com/usuario/repositorio.git`
  - `git push -u origin main`
