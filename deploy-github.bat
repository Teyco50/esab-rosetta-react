@echo off
REM Script para inicializar Git y deployar en GitHub

echo.
echo ====================================
echo ESAB Rosetta React - GitHub Deploy
echo ====================================
echo.

REM Inicializar repositorio Git
echo Inicializando Git...
git init

REM Agregar todos los archivos
echo Agregando archivos...
git add .

REM Crear commit inicial
echo Creando commit...
git commit -m "Initial commit: ESAB Rosetta React + Vite with full functionality"

REM Renombrar rama a main
echo Configurando rama main...
git branch -M main

REM Agregar remote
echo Conectando con GitHub...
git remote add origin https://github.com/Teyco50/esab-rosetta-react.git

REM Push a GitHub
echo Pusheando a GitHub...
git push -u origin main

echo.
echo ====================================
echo Deployment completado!
echo Verifica: https://github.com/Teyco50/esab-rosetta-react
echo ====================================
echo.

pause
