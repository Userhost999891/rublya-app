# Rublya

Aplikacja do nauki rosyjskiego dla polskiego użytkownika. Ponad 1500 słówek, dziewięć modułów gramatyki, dwa egzaminy, tłumaczenie zdań w obie strony i trener klawiatury ЙЦУКЕН.

Postęp zapisuje się na koncie w bazie SQLite, więc naukę zaczętą na komputerze kończysz na telefonie i odwrotnie.

---

## Czego potrzebujesz

**Node.js w wersji 24 lub nowszej** — [nodejs.org](https://nodejs.org), wariant LTS, instalacja z opcjami domyślnymi.

Node trzyma bazę z kontami. Bez niego aplikacja nie ruszy, bo nie ma skąd wczytać postępu.

Poza Node — nic. Zero paczek z npm, zero budowania. Baza to SQLite wbudowany w Node (`node:sqlite`), hasła liczy `node:crypto`, serwer stoi na `node:http`. Jeśli masz starszego Node i nie chcesz go podnosić, doinstaluj sterownik: `npm install better-sqlite3` — aplikacja sama go wykryje.

---

## Uruchomienie

**Windows, najprościej**

Dwuklik w `Uruchom aplikacje.bat`. Wystartuje serwer i otworzy się okno bez paska adresu — wygląda jak zwykły program. Jeśli brakuje Node, plik powie o tym wprost.

**Z wiersza poleceń**

```bash
node server/server.js
```

Aplikacja czeka pod `http://localhost:8080`. Inny port: `--port 3000`.

Przy pierwszym uruchomieniu zakładasz konto — login i hasło co najmniej ośmioznakowe. Nic poza tym nie jest potrzebne: żadnego e-maila, żadnego potwierdzania.

---

## Telefon

### W domowej sieci Wi-Fi

1. Uruchom **`Udostepnij telefonowi.bat`** i potwierdź pytanie o uprawnienia administratora. Otwiera port w zaporze, ograniczony do lokalnej podsieci — port nie staje się widoczny spoza Twojej sieci.
2. W oknie serwera pojawi się adres w rodzaju `http://192.168.1.15:8080`.
3. Wpisz go w przeglądarce telefonu i zaloguj się na to samo konto.

Nie wpisuj na telefonie `localhost` — dla telefonu `localhost` to on sam, nie komputer.

Cofnięcie zmian: `Cofnij udostepnianie.bat`.

### Ikona na ekranie głównym

Aplikacja instaluje się jak zwykły program — pełny ekran, bez paska adresu, własna ikona ze znakiem rubla obok innych aplikacji.

- **iPhone**: Safari → *Udostępnij* → *Do ekranu początkowego*
- **Android**: Chrome sam zaproponuje instalację

Do samej ikony i pełnego ekranu wystarczy `manifest.webmanifest` — nie trzeba niczego więcej. Bez sieci aplikacja się otworzy, ale zamiast ćwiczeń pokaże „nie ma połączenia": postęp mieszka w bazie na serwerze i nie ma czego wczytać.

---

## Konta i baza

Wszystko, co aplikacja o Tobie wie, siedzi w jednym pliku: `server/data/rublya.db`. Przeglądarka nie trzyma niczego — ani w `localStorage`, ani nigdzie indziej.

**Tabele**

| tabela | co trzyma |
|---|---|
| `users` | login, nazwa wyświetlana, hash hasła |
| `sessions` | tokeny zalogowanych urządzeń |
| `progress` | cały stan nauki jako JSON |
| `answers` | dziennik odpowiedzi do statystyk |

**Hasła** liczy scrypt (`N=32768, r=8, p=1`) z losową solą na każde konto. Z bazy nie da się ich odczytać — można tylko sprawdzić, czy podane hasło pasuje. Parametry zapisujemy razem z hashem, żeby dało się je kiedyś podnieść bez unieważniania starych kont.

**Sesja** to losowy token w ciasteczku `HttpOnly` — JavaScript strony go nie odczyta, więc nawet udany atak XSS nie wyniesie logowania. Ciasteczko ma `SameSite=Lax`, co zamyka drogę atakom CSRF. Logowanie jest dławione: dwanaście prób na kwadrans z jednego adresu.

**Zapis** nie leci po każdym kliknięciu — zmiany sklejają się i wędrują do bazy po siedmiuset milisekundach ciszy. Przy zamykaniu karty zaległości dosyła `sendBeacon`. Kropka w prawym górnym rogu pokazuje, czy postęp faktycznie doszedł: zielona znaczy zapisano, bursztynowa — w drodze, czerwona — serwer nie odpowiada.

**Kopia zapasowa** to skopiowanie pliku `rublya.db`. Nic więcej.

---

## Publikacja

### GitHub

Repozytorium — tak, ale **GitHub Pages nie uruchomi tej aplikacji**. Pages serwuje wyłącznie pliki statyczne, a tu potrzebny jest proces Node z bazą. Na Pages zobaczysz ekran logowania, który nigdy nie przepuści dalej.

`.gitignore` pilnuje, żeby **baza nie trafiła do repozytorium**. Zawiera hashe haseł i cały postęp — to dane osobowe, nie kod. Sprawdź przed pierwszym `git push`, czy `git status` nie pokazuje `server/data/`.

### HTTPS nie jest ozdobą

Service worker rejestruje się **wyłącznie w bezpiecznym kontekście**: po HTTPS albo na `localhost`. Adres w domowej sieci, taki jak `http://192.168.1.15:8080`, bezpieczny nie jest — na telefonie wchodzącym pod ten adres service worker po prostu nie wystartuje, a razem z nim odpada instalacja jako pełnoprawna aplikacja i błyskawiczne otwieranie.

Do nauki po domu wystarczy. Żeby aplikacja zachowywała się na telefonie jak aplikacja, potrzebny jest HTTPS.

### Gdzie to postawić

**Najprościej i za darmo: tunel Cloudflare.** Serwer zostaje na Twoim komputerze, a tunel daje mu publiczny adres HTTPS. Nic nie trzeba otwierać w routerze, baza nie opuszcza dysku.

```bash
cloudflared tunnel --url http://localhost:8080
```

Wypisze adres w rodzaju `https://cos-tam.trycloudflare.com`. Wchodzisz nim z telefonu i dopiero wtedy dostajesz prawdziwe PWA. Warunek: komputer musi być włączony. Adres bez konta jest losowy i znika po zamknięciu tunelu; darmowe konto Cloudflare pozwala przypiąć stały.

**Jeśli ma działać bez Twojego komputera**, potrzebny jest hosting z **dyskiem trwałym** — SQLite to plik, a serwis dający przy każdym wdrożeniu czysty system plików skasuje wszystkie konta:

| usługa | uwagi |
|---|---|
| **Fly.io** | wolumeny (`fly volumes`) podpięte pod `server/data`, rozliczenie od zużycia |
| **Railway** | obsługuje dysk trwały, model płatny od zużycia |
| **VPS** | pełna kontrola, `node server/server.js` pod procesem nadzorującym |
| **Render — darmowy plan** | **nie nadaje się**: dyski trwałe są tylko w planach płatnych, więc baza znika przy każdym restarcie, a usługa usypia po 15 minutach bezczynności |

Komenda startowa wszędzie ta sama: `npm start`. Port bierze się ze zmiennej `PORT`, którą hostingi ustawiają same. Ścieżkę bazy można przenieść zmienną `RP_DB`.

Po HTTPS ciasteczko sesji samo dostaje flagę `Secure` — nic nie trzeba przestawiać.

---

## Co jest w środku

**Słownictwo — 1532 słowa w 30 kategoriach**
Każde hasło ma tłumaczenie i transkrypcję, w której WIELKIE LITERY oznaczają sylabę akcentowaną. Rosyjski akcent jest ruchomy i nieprzewidywalny, więc uczysz się go razem ze słowem. Osobne kategorie na slang, zwroty native speakerów, fałszywych przyjaciół, liczebniki, czasowniki ruchu, przyimki i partykuły.

**Gramatyka — 9 modułów, 475 pytań, 2 egzaminy**
Sprawdzian (44 pytania) i egzamin końcowy (76 pytań) z tykającym zegarem.

**Ścieżka — 46 celów w 7 rozdziałach**
Cele odblokowują się po kolei, a przycisk na pulpicie zawsze wie, co dalej.

**Tłumacz**
Czytasz zdanie po rosyjsku i piszesz je po polsku albo odwrotnie — z klawiatury, bez listy odpowiedzi i bez gotowych klocków. Do wyboru trzy kierunki: na polski, na rosyjski, albo na przemian. Piszesz zwykłym polem tekstowym, klawiaturą urządzenia — na telefonie rosyjski układ dokładasz raz w ustawieniach systemu i przełączasz globusem.

Sprawdzanie jest wyrozumiałe, bo tłumaczenie nie ma jednej dobrej odpowiedzi. Wybacza interpunkcję, wielkość liter, polskie ogonki, `ё` zamiast `е`, pominięty zaimek i literówki — literówka daje werdykt „prawie", nie „źle". Warianty znaczeniowe („wszystko mi jedno" i „nie obchodzi mnie to" dla `Мне всё равно`) siedzą w `js/data/16-tlumaczenia.js`. W błędnej odpowiedzi podświetlają się słowa, których nie napisałeś.

**Układacz zdań**
108 zdań w czterech poziomach trudności. Układasz je z rozsypanych kafelków albo dobierasz tłumaczenie — tu ćwiczysz szyk i końcówki, a nie produkcję zdania od zera.

**Zadania poboczne**
Trzy wyzwania losowane codziennie plus sesje naprawcze generowane z Twoich błędów.

**Trener klawiatury ЙЦУКЕН**
Siedem lekcji od rzędu podstawowego po pełne zdania. Czyta pozycję klawisza, nie znak — naciskasz `F`, pojawia się `а`. Nie musisz dodawać rosyjskiego układu do Windowsa.

**Czytelnia**
Wklejasz dowolny rosyjski tekst. Aplikacja koloruje słowa według tego, jak dobrze je znasz, i pozwala wrzucić nieznane do kolejki powtórek.

**Sklep za rubli**
Waluta liczona tak, żeby opłacała się celność, nie czas: za odpowiedź 1 ₽, za trafność ponad 90% premia 20 ₽, za sesję bez błędu 40 ₽.

**Ściągawki i notatki**
Dziewięć kart z tabelami odmian oraz miejsce na własne obserwacje.

---

## Wymowa

Jeśli w systemie nie ma rosyjskiego głosu, aplikacja czyta rosyjskie słowa **polskim głosem z transkrypcji fonetycznej**: `спасибо` wypowiadane jako „spasiba". Polska fonetyka leży blisko rosyjskiej, więc efekt jest zaskakująco dobry.

Chcesz prawdziwy rosyjski głos? *Ustawienia Windows → Czas i język → Język i region → Dodaj język → Rosyjski*, przy instalacji zaznacz **Zamiana tekstu na mowę**, potem zrestartuj przeglądarkę. Aplikacja sama go wykryje. Stan wymowy znajdziesz w zakładce **Postępy → Wymowa**.

---

## Jak działa zapamiętywanie

Każde słowo ma pudełko od 0 do 5. Odpowiesz dobrze — awansuje i wróci po dniu, trzech, tygodniu, szesnastu dniach, czterdziestu. Pomylisz się — spada do zera i wraca za dziesięć minut. Od pudełka 2 słowo liczy się jako „w pamięci".

---

## Skróty klawiszowe

- `1`–`4` — wybór odpowiedzi, a przy fiszce ocena
- `spacja` — odwrócenie fiszki
- `Enter` — zatwierdzenie wpisanego słowa i tłumaczenia
- `Shift+Enter` — nowa linia w polu tłumaczenia
- `Esc` — wyjście z sesji

---

## Struktura plików

```
index.html                  szkielet strony
manifest.webmanifest        dane instalacji jako aplikacja
sw.js                       cache szkieletu aplikacji
package.json                skrypty uruchomieniowe

server/server.js            serwer HTTP, API, pliki statyczne
server/db.js                SQLite: sterownik, schemat, zapytania
server/auth.js              hasła scrypt, sesje, ciasteczka
server/data/rublya.db      baza (nie trafia do repozytorium)

css/app.css                 warstwa wizualna
icons/                      ikony aplikacji

js/ui.js                    DOM, konfetti, powiadomienia
js/api.js                   rozmowa z serwerem, kolejka zapisu
js/store.js                 stan, powtórki, XP, rubli, odznaki
js/auth.js                  ekran logowania i rejestracji
js/speech.js                wymowa i transliteracja
js/app.js                   router, widoki, silnik sesji
js/views2.js                zadania, sklep, klawiatura, zdania, czytelnia
js/views3.js                tłumacz

js/data/00-07               1532 słowa w 30 kategoriach
js/data/10-gramatyka.js     moduły i egzaminy
js/data/11-sciagawki.js     tabele i zasady
js/data/12-sciezka.js       cele ścieżki i odznaki
js/data/13-zdania.js        zdania do układacza i tłumacza
js/data/14-sklep.js         sklep, zadania dnia, teksty do Czytelni
js/data/15-klawiatura.js    układ ЙЦУКЕН, palce, lekcje
js/data/16-tlumaczenia.js   uznawane warianty tłumaczeń
```

Chcesz dołożyć własne słowa? Otwórz dowolny plik z `js/data/01…07` i dopisz wiersz:
`['rosyjski', 'polski', 'transkrypcja', 'przykład po rosyjsku', 'tłumaczenie przykładu']`.
Dwa ostatnie pola są opcjonalne.

Własne zdania do tłumaczenia dopisujesz w `js/data/13-zdania.js`, a dodatkowe poprawne brzmienia — w `js/data/16-tlumaczenia.js`.
