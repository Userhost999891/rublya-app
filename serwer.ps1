# ============================================================
#  Serwer lokalny dla Rublya (wersja statyczna, bez kont)
#
#  Service worker (tryb offline i instalacja jako aplikacja)
#  nie działa przy otwieraniu pliku z dysku — przeglądarki
#  wymagają protokołu http. Ten skrypt podaje folder pod
#  http://localhost:8080 i nic poza tym nie robi.
#
#  Zatrzymanie: Ctrl+C
# ============================================================

param(
  [int]$Port = 8080,
  [switch]$NoBrowser,
  [switch]$Lan        # nasluch takze dla innych urzadzen w sieci (telefon)
)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path

# "localhost" przyjmuje polaczenia tylko z tego komputera.
# Zeby wpuscic telefon, trzeba nasluchiwac na wszystkich interfejsach ("+"),
# a na to Windows wymaga uprawnien administratora albo rezerwacji urlacl.
$prefix = if ($Lan) { "http://+:$Port/" } else { "http://localhost:$Port/" }

$types = @{
  '.html' = 'text/html; charset=utf-8'
  '.js'   = 'application/javascript; charset=utf-8'
  '.css'  = 'text/css; charset=utf-8'
  '.json' = 'application/json; charset=utf-8'
  '.webmanifest' = 'application/manifest+json; charset=utf-8'
  '.png'  = 'image/png'
  '.woff2' = 'font/woff2'
  '.svg'  = 'image/svg+xml'
  '.ico'  = 'image/x-icon'
  '.md'   = 'text/markdown; charset=utf-8'
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)

try {
  $listener.Start()
} catch {
  # Dwie zupelnie rozne przyczyny wygladaja tak samo z zewnatrz:
  # zajety port i brak rezerwacji adresu. Rozroznijmy je, zamiast
  # zgadywac - falszywa diagnoza kosztuje wiecej niz sam blad.
  $busy = $null -ne (Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue)

  Write-Host ""
  if ($busy) {
    Write-Host "  Port $Port jest juz zajety - najpewniej serwer juz dziala." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  Zamknij poprzednie okno serwera albo uzyj innego portu:" -ForegroundColor DarkGray
    Write-Host "    .\serwer.ps1 -Port 8090" -ForegroundColor Cyan
  } elseif ($Lan) {
    Write-Host "  Brak rezerwacji adresu dla calej sieci." -ForegroundColor Red
    Write-Host "  Uruchom raz plik 'Udostepnij telefonowi.bat' - zalatwi to" -ForegroundColor Yellow
    Write-Host "  wraz z otwarciem portu w zaporze." -ForegroundColor Yellow
  } else {
    Write-Host "  Nie udalo sie wystartowac serwera na porcie $Port." -ForegroundColor Red
    Write-Host ("  Szczegoly: " + $_.Exception.Message) -ForegroundColor DarkGray
  }
  Write-Host ""
  Read-Host "  Enter zamyka to okno"
  exit 1
}

Write-Host ""
Write-Host "  RUSSKIJ PUT" -ForegroundColor Yellow
Write-Host "  Folder: $root" -ForegroundColor DarkGray
Write-Host ""
Write-Host "  Na tym komputerze:" -ForegroundColor DarkGray
Write-Host "    http://localhost:$Port" -ForegroundColor Green
Write-Host ""

if ($Lan) {
  Write-Host "  Na telefonie w tej samej sieci Wi-Fi:" -ForegroundColor DarkGray
  try {
    $ips = Get-NetIPAddress -AddressFamily IPv4 -ErrorAction Stop |
           Where-Object { $_.IPAddress -notlike '127.*' -and $_.IPAddress -notlike '169.254.*' }
    foreach ($ip in $ips) { Write-Host ("    http://" + $ip.IPAddress + ":$Port") -ForegroundColor Cyan }
  } catch { }
  Write-Host ""
  Write-Host "  Wpisz ten adres w przegladarce telefonu. Samo 'localhost'" -ForegroundColor DarkGray
  Write-Host "  nie zadziala - dla telefonu localhost to on sam." -ForegroundColor DarkGray
} else {
  Write-Host "  Telefon sie nie polaczy: serwer slucha tylko tego komputera." -ForegroundColor DarkYellow
  Write-Host "  Chcesz go wpuscic? Uruchom 'Udostepnij telefonowi.bat'." -ForegroundColor DarkYellow
}
Write-Host ""
Write-Host "  Zatrzymanie: Ctrl+C albo zamkniecie tego okna" -ForegroundColor DarkGray
Write-Host ""

if (-not $NoBrowser) {
  Start-Process $prefix | Out-Null
}

try {
  while ($listener.IsListening) {
    $ctx = $listener.GetContext()
    $req = $ctx.Request
    $res = $ctx.Response

    $rel = [System.Uri]::UnescapeDataString($req.Url.AbsolutePath.TrimStart('/'))
    if ([string]::IsNullOrWhiteSpace($rel)) { $rel = 'index.html' }

    $full = Join-Path $root $rel
    # nie wypuszczamy niczego spoza folderu projektu
    $fullResolved = [System.IO.Path]::GetFullPath($full)
    if (-not $fullResolved.StartsWith([System.IO.Path]::GetFullPath($root))) {
      $res.StatusCode = 403; $res.Close(); continue
    }

    # Ten serwer obsluguje zadania po kolei, jedno po drugim. Przy
    # polaczeniach trwalych przegladarka trzyma szesc gniazd otwartych
    # i czeka, a serwer czeka na nia - obie strony staja. Zamykanie
    # polaczenia po kazdej odpowiedzi kosztuje troche wydajnosci,
    # ale przy kilkudziesieciu plikach to roznica miedzy dziala
    # a wisi.
    $res.KeepAlive = $false

    if (Test-Path -LiteralPath $fullResolved -PathType Leaf) {
      $ext = [System.IO.Path]::GetExtension($fullResolved).ToLower()
      $ctype = $types[$ext]
      if (-not $ctype) { $ctype = 'application/octet-stream' }
      $bytes = [System.IO.File]::ReadAllBytes($fullResolved)
      $res.ContentType = $ctype
      $res.Headers.Add('Cache-Control', 'no-cache')
      $res.ContentLength64 = $bytes.Length
      $res.OutputStream.Write($bytes, 0, $bytes.Length)
      Write-Host ("  200  " + $rel) -ForegroundColor DarkGray
    } else {
      $res.StatusCode = 404
      $msg = [System.Text.Encoding]::UTF8.GetBytes('Nie znaleziono: ' + $rel)
      $res.OutputStream.Write($msg, 0, $msg.Length)
      Write-Host ("  404  " + $rel) -ForegroundColor DarkYellow
    }
    $res.Close()
  }
} finally {
  $listener.Stop()
  $listener.Close()
  Write-Host ""
  Write-Host "  Serwer zatrzymany." -ForegroundColor DarkGray
}
