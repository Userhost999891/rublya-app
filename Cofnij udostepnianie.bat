@echo off
title Rublya - cofanie udostepniania
cd /d "%~dp0"

rem ============================================================
rem  Zamyka to, co otworzylo "Udostepnij telefonowi.bat":
rem  kasuje wyjatek w zaporze i rezerwacje adresu.
rem  Aplikacja nadal bedzie dzialac na tym komputerze.
rem ============================================================

set PORT=8080

net session >nul 2>&1
if not %errorlevel%==0 (
  echo   Potrzebne uprawnienia administratora - potwierdz okno Windows.
  powershell -NoProfile -Command "Start-Process -FilePath '%~f0' -Verb RunAs"
  exit /b
)

echo.
rem Obie nazwy - biezaca i ta sprzed zmiany nazwy aplikacji.
netsh advfirewall firewall delete rule name="Rublya %PORT%" >nul 2>&1
netsh advfirewall firewall delete rule name="Russkij Put %PORT%" >nul 2>&1
echo   [ok] wyjatek w zaporze usuniety (jesli istnial)

rem Rezerwacja adresu byla potrzebna staremu serwerowi na PowerShellu.
rem Node jej nie zaklada, ale po poprzedniej wersji moze zostac.
netsh http delete urlacl url=http://+:%PORT%/ >nul 2>&1
if %errorlevel%==0 (echo   [ok] stara rezerwacja adresu cofnieta) else (echo   [--] nie bylo rezerwacji)

powershell -NoProfile -Command "Get-CimInstance Win32_Process -Filter \"Name='node.exe'\" | Where-Object { $_.CommandLine -like '*server*server.js*' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }"
echo   [ok] serwer zatrzymany
echo.
echo   Aplikacja nadal dziala na tym komputerze przez
echo   "Uruchom aplikacje.bat" - tylko telefon straci dostep.
echo.
pause
