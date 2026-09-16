@echo off
title ACT'ERE - Serveur Backend API
color 0A
echo =========================================================
echo    ACT'ERE - Demarrage du Serveur Backend (API Flask)
echo =========================================================
echo.
cd /d "%~dp0"

echo [1/2] Verification des dependances Python...
python -c "import flask, flask_cors, psycopg, openpyxl" >nul 2>&1
if %errorlevel% neq 0 (
    echo Installation des bibliotheques requises...
    pip install flask flask-cors psycopg openpyxl
)

echo [2/2] Lancement du serveur API Flask sur http://localhost:5000 ...
echo.
echo =========================================================
echo    Le serveur est actif ! Ne fermez pas cette fenetre.
echo    Pour arreter le serveur : CTRL + C
echo =========================================================
echo.

python api.py

if %errorlevel% neq 0 (
    echo.
    echo [ERREUR] Le serveur s'est arrete avec une erreur.
    echo Verifiez le mot de passe dans backend/config.py si la base refuse la connexion.
)

pause