@echo off
title ICT Lab Inventory Server
echo ===================================================
echo Starting the ICT Lab Inventory Server...
echo Please leave this window open while using the app.
echo Closing this window will shut down the server.
echo ===================================================

:: Start a timer to open the browser after 4 seconds so the server has time to boot
start cmd /c "ping localhost -n 5 > nul & start http://localhost:3001"

call npm start
