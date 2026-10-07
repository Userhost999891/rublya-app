# Привет — nauka rosyjskiego (aplikacja na iPhone'a)

Aplikacja webowa (PWA): instalujesz ją z Safari na ekranie początkowym, otwiera się na pełnym ekranie i działa offline.

## Co jest w środku

- **Biblioteka: 1983 słowa w 46 kategoriach** (A1 → B2), każde z akcentem, polskim tłumaczeniem i zapisem wymowy po polsku (np. молоко → [małak**o**]). 176 przykładowych zdań, notatki gramatyczne (aspekt czasowników, rodzaj, odmiana), osobna kategoria **fałszywych przyjaciół** (магазин ≠ magazyn, неделя ≠ niedziela…).
- **Alfabet i wymowa**: 33 litery pogrupowane (jak po polsku / podobne, ale inne / nowe), 10 zasad czytania (akanie, ikanie, ubezdźwięcznienie…), quiz.
- **Moje fiszki**: własne talie, słowo + tłumaczenie + notatka + przykład; wbudowana klawiatura cyrylicy z klawiszem akcentu; podpowiedzi z biblioteki; import listy (wklejka z Excela/notatek) i eksport CSV.
- **Codzienna lekcja**: nowe słowa (wprowadzenie → test → układanka/pisanie/słuchanie) + powtórki dokładnie wtedy, gdy zaczynasz zapominać (algorytm SM-2 z krokami nauki, jak w Anki).
- **8 trybów treningu**: fiszki z oceną pamięci, test wyboru, pisanie cyrylicą, słuchanie i dyktando, układanka, pary na czas, sprint 60 s, quiz alfabetu.
- **Motywacja**: seria dni (rośnie po osiągnięciu celu dnia), zamrożenia serii (1 za każde 7 dni, maks. 2), XP i poziomy, 20 osiągnięć, mapa aktywności, wykresy XP i prognoza powtórek.
- Wymowa przez syntezę mowy iPhone'a (głos rosyjski), tempo regulowane, tryb wolny.
- Motyw jasny/ciemny, kopia zapasowa postępu (plik lub tekst).

## Jak zainstalować na iPhonie

Aplikację trzeba umieścić pod adresem `https://…` (wymóg iOS dla aplikacji offline). Najprościej:

**GitHub Pages (za darmo, na stałe)**
1. Utwórz repozytorium na GitHubie i wgraj całą zawartość tego folderu.
2. Repozytorium → *Settings* → *Pages* → *Deploy from a branch* → `main` / `(root)` → *Save*.
3. Po minucie strona działa pod `https://TWOJA-NAZWA.github.io/NAZWA-REPO/`.

**Netlify Drop (bez Gita)**
1. Wejdź na https://app.netlify.com/drop i przeciągnij ten folder.
2. Załóż darmowe konto, żeby strona nie zniknęła po godzinie.

**Na iPhonie:** otwórz adres w **Safari** → **Udostępnij** → **Do ekranu początkowego** → **Dodaj**.

## Aktualizacja aplikacji

Po zmianie plików podnieś numer `VERSION` w `sw.js` (np. `privet-1.0.1`) i wgraj pliki ponownie. Aplikacja na telefonie pokaże pasek „Dostępna nowa wersja — Odśwież”. Postęp zostaje.

## Twoje dane

Postęp jest zapisany w telefonie (localStorage aplikacji). Przed zmianą telefonu: **Profil → Ustawienia → Zapisz kopię zapasową**, a na nowym urządzeniu **Przywróć z kopii**.

## Dodawanie słów do biblioteki

Pliki `data/*.js`, jedna linia = jedno słowo:

```
rosyjski|polski|notatka|przykład po rosyjsku|tłumaczenie przykładu
приве'т|cześć|nieformalnie|Приве'т, Ма'ша!|Cześć, Masza!
```

Apostrof po samogłosce oznacza akcent. Po zmianach sprawdź dane:

```bash
node tools/validate.js
```

## Struktura

```
index.html            powłoka aplikacji
manifest.webmanifest  ikona i nazwa na ekranie początkowym
sw.js                 tryb offline
css/app.css           wygląd (motyw gżelski: kobalt + porcelana)
js/core.js            tekst, wymowa, biblioteka, zapis, SRS, seria, osiągnięcia
js/ui.js              ikony, okna, klawiatura cyrylicy
js/session.js         lekcje i wszystkie ćwiczenia
js/views.js           ekrany
js/main.js            start aplikacji
data/                 słownictwo i alfabet
icons/                ikony (tools/make_icons.py)
tools/                walidator danych, generator ikon, serwer testowy
```

Test lokalny: `python tools/devserver.py` i otwórz http://127.0.0.1:8765
