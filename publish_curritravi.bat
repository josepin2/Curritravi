@echo off
setlocal
if "%~1"=="" (
  echo Uso: publish_curritravi.bat https://github.com/usuario/repositorio.git
  exit /b 1
)

where git >nul 2>&1
if errorlevel 1 (
  echo Git no esta instalado o no esta en el PATH.
  echo Descarga: https://git-scm.com/download/win
  exit /b 1
)

set REMOTE=%~1

git init
git add .
git commit -m "Inicial: Curritravi (React + Vite)"
git branch -M main
git remote remove origin >nul 2>&1
git remote add origin "%REMOTE%"
git push -u origin main

endlocal
