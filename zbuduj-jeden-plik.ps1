# ============================================================
#  Skleja calą aplikację w jeden plik HTML.
#
#  UWAGA - od wersji z kontami ten plik NIE dziala samodzielnie.
#  Postep mieszka w bazie SQLite na serwerze, wiec aplikacja musi
#  miec do niego dostep. Otwarta dwuklikiem z dysku pokaze ekran
#  "nie ma polaczenia" i na tym sie skonczy.
#
#  Sklejony plik ma teraz jedno zastosowanie: podlozyc go zamiast
#  index.html na tym samym serwerze, ktory wystawia /api.
#  Do przenoszenia na pendrive juz sie nie nadaje.
#
#  Uruchomienie:  .\zbuduj-jeden-plik.ps1
# ============================================================

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$out = Join-Path $root 'Rosyjski-jeden-plik.html'

$scripts = @(
  'js\data\00-core.js', 'js\data\01-fundament.js', 'js\data\02-codzienne.js',
  'js\data\03-swiat.js', 'js\data\04-praca-czas.js', 'js\data\05-dzialanie.js',
  'js\data\06-zywy.js', 'js\data\07-wiecej.js', 'js\data\10-gramatyka.js',
  'js\data\11-sciagawki.js', 'js\data\12-sciezka.js', 'js\data\13-zdania.js',
  'js\data\14-sklep.js', 'js\data\15-klawiatura.js', 'js\data\16-tlumaczenia.js',
  'js\ui.js', 'js\api.js', 'js\store.js', 'js\auth.js', 'js\speech.js',
  'js\app.js', 'js\views2.js', 'js\views3.js'
)

function ReadUtf8($rel) {
  $p = Join-Path $root $rel
  if (-not (Test-Path $p)) { throw "Brak pliku: $rel" }
  return [System.IO.File]::ReadAllText($p, [System.Text.Encoding]::UTF8)
}

# Sklejony plik lezy w korzeniu projektu, a nie w css/, wiec sciezki
# do czcionek trzeba podniesc o jeden poziom - inaczej Rubik sie nie wczyta.
$css = (ReadUtf8 'css\app.css') + "`n" + ((ReadUtf8 'css\cartoon.css') -replace '\.\./fonts/', 'fonts/')

$iconBytes = [System.IO.File]::ReadAllBytes((Join-Path $root 'icons\icon-192.png'))
$iconB64 = [Convert]::ToBase64String($iconBytes)

$sb = New-Object System.Text.StringBuilder
[void]$sb.AppendLine('<!DOCTYPE html>')
[void]$sb.AppendLine('<html lang="pl">')
[void]$sb.AppendLine('<head>')
[void]$sb.AppendLine('<meta charset="utf-8">')
[void]$sb.AppendLine('<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">')
[void]$sb.AppendLine('<meta name="color-scheme" content="dark">')
[void]$sb.AppendLine('<meta name="theme-color" content="#070a0f">')
[void]$sb.AppendLine('<meta name="apple-mobile-web-app-capable" content="yes">')
[void]$sb.AppendLine('<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">')
[void]$sb.AppendLine('<meta name="apple-mobile-web-app-title" content="Rublya">')
[void]$sb.AppendLine('<title>Rublya — rosyjski od zera do swobody</title>')
[void]$sb.AppendLine('<link rel="apple-touch-icon" href="data:image/png;base64,' + $iconB64 + '">')
[void]$sb.AppendLine('<link rel="icon" type="image/png" href="data:image/png;base64,' + $iconB64 + '">')
[void]$sb.AppendLine('<style>')
[void]$sb.AppendLine($css)
[void]$sb.AppendLine('</style>')
[void]$sb.AppendLine('</head>')
[void]$sb.AppendLine('<body>')
[void]$sb.AppendLine('<noscript><div style="padding:40px;font-family:system-ui;color:#eceae4"><h1>Potrzebny jest JavaScript</h1></div></noscript>')

foreach ($s in $scripts) {
  $code = ReadUtf8 $s
  [void]$sb.AppendLine('<script>/* ' + $s + ' */')
  [void]$sb.AppendLine($code)
  [void]$sb.AppendLine('</' + 'script>')
}

[void]$sb.AppendLine('</body>')
[void]$sb.AppendLine('</html>')

[System.IO.File]::WriteAllText($out, $sb.ToString(), (New-Object System.Text.UTF8Encoding($false)))

Write-Host ''
Write-Host ('  Gotowe: ' + $out) -ForegroundColor Green
Write-Host ('  Rozmiar: ' + [math]::Round((Get-Item $out).Length / 1KB, 1) + ' KB') -ForegroundColor DarkGray
Write-Host ''
Write-Host '  Ten plik potrzebuje dzialajacego serwera z /api.' -ForegroundColor Yellow
Write-Host '  Otwarty prosto z dysku pokaze "nie ma polaczenia" -' -ForegroundColor DarkGray
Write-Host '  konta i postep sa w bazie, nie w przegladarce.' -ForegroundColor DarkGray
Write-Host ''
