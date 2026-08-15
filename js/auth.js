/* ============================================================
   BRAMA — logowanie i rejestracja

   Aplikacja nie startuje, dopóki nie wiemy, czyj postęp wczytać.
   Ten plik zatrzymuje boot(), pokazuje ekran konta, a po udanym
   logowaniu pobiera stan z bazy i dopiero wtedy oddaje sterowanie.
   ============================================================ */

window.Auth = (function () {

let user = null;
let onReady = null;

/* ------------------------------------------------------------
   Ekran konta
   ------------------------------------------------------------ */

function screen(mode) {
  const rejestracja = mode === 'register';

  document.body.innerHTML =
    '<div class="gate">' +
      '<div class="gate-glow" aria-hidden="true"></div>' +
      '<div class="gate-box">' +
        '<div class="gate-brand">' +
          '<div class="brand-mark">РУБ<span>ЛЯ</span></div>' +
          '<div class="brand-sub">rublya · rosyjski krok po kroku</div>' +
        '</div>' +

        '<h1 class="gate-title">' + (rejestracja ? 'Zakładasz konto' : 'Witaj z powrotem') + '</h1>' +
        '<p class="gate-lead">' + (rejestracja
          ? 'Postępy będą czekać na Ciebie i na telefonie, i na komputerze.'
          : 'Wracamy do nauki.') + '</p>' +

        '<form class="gate-form" id="gform" novalidate>' +
          '<label class="gate-field">' +
            '<span>Login</span>' +
            '<input id="gl" name="username" type="text" autocomplete="username" ' +
              'autocapitalize="none" autocorrect="off" spellcheck="false" ' +
              'placeholder="np. anna" required>' +
          '</label>' +

          '<label class="gate-field">' +
            '<span>Hasło</span>' +
            '<div class="gate-pass">' +
              '<input id="gp" name="password" type="password" ' +
                'autocomplete="' + (rejestracja ? 'new-password' : 'current-password') + '" ' +
                'placeholder="' + (rejestracja ? 'co najmniej 8 znaków' : 'hasło') + '" required>' +
              '<button type="button" class="gate-eye" id="geye" aria-label="Pokaż hasło">око</button>' +
            '</div>' +
          '</label>' +

          '<div class="gate-error" id="gerr" role="alert" hidden></div>' +

          '<button class="btn primary gate-submit" type="submit" id="gbtn">' +
            (rejestracja ? 'Załóż konto' : 'Zaloguj się') +
          '</button>' +
        '</form>' +

        '<div class="gate-swap">' +
          (rejestracja
            ? 'Masz już konto? <button type="button" data-mode="login">Zaloguj się</button>'
            : 'Pierwszy raz tutaj? <button type="button" data-mode="register">Załóż konto</button>') +
        '</div>' +
      '</div>' +
    '</div>';

  const form = document.getElementById('gform');
  const err = document.getElementById('gerr');
  const btn = document.getElementById('gbtn');
  const inLogin = document.getElementById('gl');
  const inPass = document.getElementById('gp');

  const fail = (msg) => {
    err.textContent = msg;
    err.hidden = false;
    btn.disabled = false;
    btn.textContent = rejestracja ? 'Załóż konto' : 'Zaloguj się';
  };

  document.getElementById('geye').addEventListener('click', (e) => {
    const show = inPass.type === 'password';
    inPass.type = show ? 'text' : 'password';
    e.currentTarget.classList.toggle('on', show);
    inPass.focus();
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (btn.disabled) return;

    const l = inLogin.value.trim();
    const p = inPass.value;
    if (!l || !p) return fail('Wypełnij oba pola.');
    if (rejestracja && p.length < 8) return fail('Hasło musi mieć co najmniej 8 znaków.');

    err.hidden = true;
    btn.disabled = true;
    btn.textContent = rejestracja ? 'Zakładam…' : 'Loguję…';

    try {
      const out = rejestracja ? await API.register(l, p) : await API.login(l, p);
      user = out.user;
      await enter();
    } catch (ex) {
      fail(ex.message || 'Coś poszło nie tak.');
    }
  });

  document.querySelector('.gate-swap').addEventListener('click', (e) => {
    const b = e.target.closest('[data-mode]');
    if (b) screen(b.dataset.mode);
  });

  /* Na telefonie klawiatura zasłania pół ekranu — nie wywołujemy jej
     sami, użytkownik sam decyduje, kiedy zacząć pisać. Na komputerze
     ustawienie kursora oszczędza jedno kliknięcie. */
  if (!matchMedia('(pointer: coarse)').matches) inLogin.focus();
}

/* ------------------------------------------------------------
   Wejście do aplikacji
   ------------------------------------------------------------ */

function loading(text) {
  document.body.innerHTML =
    '<div class="gate">' +
      '<div class="gate-glow" aria-hidden="true"></div>' +
      '<div class="gate-box gate-loading">' +
        '<div class="brand-mark">РУБ<span>ЛЯ</span></div>' +
        '<div class="gate-spin" aria-hidden="true"></div>' +
        '<p class="gate-lead">' + text + '</p>' +
      '</div>' +
    '</div>';
}

async function enter() {
  loading('Wczytuję Twój postęp…');
  try {
    const dane = await API.loadState();
    Store.hydrate(dane);
  } catch (ex) {
    return breakdown(ex.message || 'Nie udało się wczytać postępu.');
  }
  if (onReady) onReady();
}

/* Ekran awaryjny — bez bazy nie ma czego pokazywać, więc zamiast
   udawać, że apka działa, mówimy wprost, co jest nie tak. */
function breakdown(msg) {
  document.body.innerHTML =
    '<div class="gate">' +
      '<div class="gate-box gate-loading">' +
        '<div class="brand-mark">РУБ<span>ЛЯ</span></div>' +
        '<h1 class="gate-title">Nie ma połączenia</h1>' +
        '<p class="gate-lead">Sprawdź internet i spróbuj jeszcze raz.</p>' +
        '<button class="btn primary gate-submit" id="gretry">Spróbuj ponownie</button>' +
      '</div>' +
    '</div>';
  document.getElementById('gretry').addEventListener('click', start);
}

/* ------------------------------------------------------------
   Start i wylogowanie
   ------------------------------------------------------------ */

async function start(boot) {
  if (typeof boot === 'function') onReady = boot;

  /* Ekran „sprawdzam konto" pokazujemy dopiero, gdy serwer marudzi.
     Przy zwykłym starcie odpowiedź wraca w kilkadziesiąt milisekund
     i mignięcie panelu ładowania wygląda jak zacięcie — a na iPhonie,
     gdzie Safari potrafi ubić kartę i wczytać ją od nowa, było wręcz
     mylące: użytkownik widział ekran logowania bez powodu. */
  const zwloka = setTimeout(() => loading('Sprawdzam konto…'), 400);

  let out;
  try {
    out = await API.me();
  } catch (ex) {
    clearTimeout(zwloka);
    return breakdown(ex.message || 'Serwer nie odpowiada.');
  }
  clearTimeout(zwloka);

  if (out.user) {
    user = out.user;
    /* Postęp przyszedł w tej samej odpowiedzi — nie ma po co pytać drugi raz. */
    if (out.dane !== undefined) {
      Store.hydrate(out.dane);
      if (onReady) onReady();
      return;
    }
    /* Starszy serwer odsyła samo konto — wtedy dobieramy stan osobno. */
    return enter();
  }
  screen('login');
}

async function logout() {
  try { await API.flushNow(); } catch (e) { /* i tak wychodzimy */ }
  try { await API.logout(); } catch (e) { /* sesja i tak przepadnie */ }
  user = null;
  screen('login');
}

/* Sesja wygasła w trakcie pracy — API krzyczy, my wracamy do bramy. */
window.addEventListener('rp-wylogowano', () => {
  if (!user) return;
  user = null;
  screen('login');
});

return {
  start, logout, screen,
  get user() { return user; },
};

})();
