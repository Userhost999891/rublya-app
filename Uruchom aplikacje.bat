@echo off
title Rublya - serwer
cd /d "%~dp0"

rem ============================================================
rem  Uruchamia serwer i otwiera aplikacje w oknie bez paska
rem  adresu - wyglada i dziala jak zwykly program.
rem
rem  Od wersji z kontami serwer musi byc na Node: trzyma baze
rem  SQLite z uzytkownikami i postepem. Sam PowerShell tego nie
rem  udzwignie, bo nie ma sterownika bazy.
rem
rem  Plik celowo nie zawiera cyrylicy: cmd.exe potrafi sie o nia
rem  potknac przy zmianie strony kodowej.
rem ============================================================

set PORT=8080
set URL=http://localhost:%PORT%/index.html

echo.
echo   Startuje aplikacje...
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo   ================================================
  echo    Nie znaleziono Node.js
  echo   ================================================
  echo.
  echo   Aplikacja trzyma teraz konta i postep w bazie SQLite,
  echo   a baza potrzebuje serwera. Node instaluje sie raz:
  echo.
  echo     https://nodejs.org  --  wersja LTS, Windows Installer
  echo.
  echo   Podczas instalacji zostaw wszystkie opcje domyslne.
  echo   Potem zamknij to okno i uruchom ten plik jeszcze raz.
  echo.
  pause
  exit /b 1
)

rem jesli serwer juz chodzi, nie startujemy drugiego
netstat -an | find "LISTENING" | find ":%PORT%" >nul
if %errorlevel%==0 (
  echo   Serwer juz dziala na porcie %PORT%.
) else (
  start "Rublya - serwer" /min cmd /c "node server\server.js --port %PORT% || pause"
  echo   Czekam na serwer...
  ping -n 4 127.0.0.1 >nul
)

set "EDGE=%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe"
if not exist "%EDGE%" set "EDGE=%ProgramFiles%\Microsoft\Edge\Application\msedge.exe"
set "CHROME=%ProgramFiles%\Google\Chrome\Application\chrome.exe"
if not exist "%CHROME%" set "CHROME=%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"

if exist "%EDGE%" (
  start "" "%EDGE%" --app=%URL%
) else if exist "%CHROME%" (
  start "" "%CHROME%" --app=%URL%
) else (
  start "" %URL%
)

exit /b
