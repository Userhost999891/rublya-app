@echo off
title Rublya - udostepnianie telefonowi
cd /d "%~dp0"

rem ============================================================
rem  Wpuszcza telefon do serwera.
rem
rem  Wystarczy jedna rzecz, raz na zawsze: wyjatek w zaporze.
rem  Rezerwacja adresu (netsh http add urlacl) byla potrzebna
rem  poprzedniemu serwerowi na PowerShellu - HttpListener bez niej
rem  nie nasluchuje na "+". Node otwiera gniazdo sam i tego nie
rem  wymaga, wiec ten krok znikl.
rem
rem  Wyjatek zakladamy dla WSZYSTKICH profili sieci, ale tylko
rem  dla adresow z lokalnej podsieci (remoteip=LocalSubnet).
rem  Powod: hotspot z telefonu Windows klasyfikuje zwykle jako
rem  siec publiczna, wiec regula tylko dla "private" nic nie da.
rem  Ograniczenie do podsieci sprawia, ze port pozostaje
rem  niewidoczny spoza Twojej sieci.
rem ============================================================

set PORT=8080

where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo   Nie znaleziono Node.js - bez niego serwer nie ruszy.
  echo   Zainstaluj wersje LTS z https://nodejs.org i sprobuj ponownie.
  echo.
  pause
  exit /b 1
)

net session >nul 2>&1
if not %errorlevel%==0 (
  echo.
  echo   Potrzebne uprawnienia administratora - potwierdz okno Windows.
  echo.
  powershell -NoProfile -Command "Start-Process -FilePath '%~f0' -Verb RunAs"
  exit /b
)

echo.
echo   ====================================================
echo    Udostepnianie aplikacji telefonowi - port %PORT%
echo   ====================================================
echo.

echo   Wykryty profil sieci:
powershell -NoProfile -Command "Get-NetConnectionProfile | ForEach-Object { '     ' + $_.InterfaceAlias + ' -> ' + $_.NetworkCategory }"
echo.

rem --- zapora: wszystkie profile, ale tylko lokalna podsiec ---
rem Kasujemy tez regule spod starej nazwy aplikacji, zeby po zmianie
rem nazwy nie zostala w systemie osierocona i nikomu niepotrzebna.
netsh advfirewall firewall delete rule name="Russkij Put %PORT%" >nul 2>&1
netsh advfirewall firewall delete rule name="Rublya %PORT%" >nul 2>&1
netsh advfirewall firewall add rule name="Rublya %PORT%" dir=in action=allow protocol=TCP localport=%PORT% profile=any remoteip=LocalSubnet >nul 2>&1
if %errorlevel%==0 (echo   [ok] port %PORT% otwarty dla urzadzen z Twojej sieci) else (echo   [!!] nie udalo sie otworzyc portu)

echo.
echo   Adres do wpisania w przegladarce telefonu:
powershell -NoProfile -Command "Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -notlike '127.*' -and $_.IPAddress -notlike '169.254.*' } | ForEach-Object { '     http://' + $_.IPAddress + ':%PORT%' }"
echo.
echo   Telefon musi byc w tej samej sieci co komputer.
echo   Nie wpisuj 'localhost' - dla telefonu to on sam.
echo.
echo   Na telefonie zaloguj sie na to samo konto co na komputerze -
echo   postep jest wspolny, bo siedzi w bazie na tym serwerze.
echo.

rem --- restart serwera w trybie sieciowym ---
powershell -NoProfile -Command "Get-CimInstance Win32_Process -Filter \"Name='node.exe'\" | Where-Object { $_.CommandLine -like '*server*server.js*' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }"
timeout /t 2 /nobreak >nul

start "Rublya - serwer" cmd /c "node server\server.js --port %PORT% --lan || pause"

echo   Serwer wystartowal w osobnym oknie. Zamkniecie tamtego okna konczy prace.
echo.
echo   Zeby cofnac zmiany w zaporze, uruchom: Cofnij udostepnianie.bat
echo.
pause
