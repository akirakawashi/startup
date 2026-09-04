/* ============================================================
   startup — поведение страницы
   Без зависимостей. Всё, что двигается, отключается системной
   настройкой prefers-reduced-motion.
   ============================================================ */
(function () {
  'use strict';

  var motionQuery  = window.matchMedia('(prefers-reduced-motion: reduce)');
  var reduceMotion = motionQuery.matches;
  var finePointer  = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };

  /* ============================================================
     Тема
     ============================================================ */
  var THEME_KEY = 'startup-theme';
  var root = document.documentElement;

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'light' ? '#f7f6fb' : '#06050d');
  }

  (function initTheme() {
    var saved = null;
    try { saved = localStorage.getItem(THEME_KEY); } catch (e) { /* приватный режим */ }
    if (saved === 'light' || saved === 'dark') applyTheme(saved);
    else applyTheme(window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  })();

  var themeToggle = $('#themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      applyTheme(next);
      try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* не критично */ }
    });
  }

  /* ============================================================
     Заголовок первого экрана: разбор на слова
     Слова после тире получают акцентный градиент.
     ============================================================ */
  (function splitTitle() {
    var title = $('[data-split]');
    if (!title) return;

    var words = title.textContent.trim().split(/\s+/);
    var dashAt = words.indexOf('—');
    title.textContent = '';

    words.forEach(function (word, i) {
      var holder = document.createElement('span');
      holder.className = 'w' + (dashAt > -1 && i > dashAt ? ' accent' : '');

      var inner = document.createElement('span');
      inner.textContent = word;
      if (!reduceMotion) inner.style.transitionDelay = (i * 55) + 'ms';

      holder.appendChild(inner);
      title.appendChild(holder);
      title.appendChild(document.createTextNode(' '));
    });

    window.requestAnimationFrame(function () {
      window.setTimeout(function () { title.classList.add('in'); }, 120);
    });
  })();

  /* ============================================================
     Прокрутка: прогресс, залипающая шапка, активный раздел,
     заполнение линии процесса.

     Первый экран намеренно НЕ параллаксится: композиция держится на том,
     что центр диска совпадает с нижней границей секции. Любой сдвиг видео
     ломает это выравнивание и отрывает дугу от линии горизонта.
     ============================================================ */
  var topbar    = $('#topbar');
  var progress  = $('#pageProgress');
  var navLinks  = $$('.topnav a');
  var sections  = navLinks.map(function (a) { return $(a.getAttribute('href')); }).filter(Boolean);
  var stepsList = $('#steps');
  var stepsFill = $('#stepsFill');
  var stepItems = $$('.step');
  var heroVideo = $('#heroVideo');

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      var y = window.scrollY;
      var vh = window.innerHeight;

      if (topbar) topbar.classList.toggle('is-stuck', y > 12);

      if (progress) {
        var max = document.documentElement.scrollHeight - vh;
        progress.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
      }

      var current = null;
      var line = y + vh * 0.35;
      for (var i = 0; i < sections.length; i++) {
        if (sections[i].offsetTop <= line) current = sections[i].id;
      }
      navLinks.forEach(function (a) {
        a.classList.toggle('is-active', a.getAttribute('href') === '#' + current);
      });

      // линия процесса заполняется по мере прокрутки блока
      if (stepsList && stepsFill) {
        var box = stepsList.getBoundingClientRect();
        var done = clamp((vh * 0.72 - box.top) / box.height, 0, 1);
        stepsFill.style.height = (done * 100) + '%';

        var reached = vh * 0.72;
        stepItems.forEach(function (step) {
          var r = step.getBoundingClientRect();
          step.classList.toggle('lit', r.top < reached);
        });
      }

      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ============================================================
     Мобильное меню
     ============================================================ */
  var burger = $('#burger');
  var topnav = $('#topnav');
  if (burger && topnav) {
    burger.addEventListener('click', function () {
      var open = topnav.classList.toggle('open');
      burger.setAttribute('aria-expanded', String(open));
    });
    topnav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        topnav.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ============================================================
     Появление блоков
     ============================================================ */
  var revealables = $$('.reveal, .underline-grow');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('in'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealables.forEach(function (el) {
      var siblings = el.parentElement ? $$('.reveal', el.parentElement) : [];
      var idx = siblings.indexOf(el);
      if (idx > 0) el.style.transitionDelay = Math.min(idx, 5) * 70 + 'ms';
      revealObserver.observe(el);
    });
  }

  /* ============================================================
     Счётчики в метриках проекта
     ============================================================ */
  var counters = $$('[data-count]');
  function runCounter(el) {
    var target = parseFloat(el.getAttribute('data-count')) || 0;
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';

    if (reduceMotion) { el.textContent = prefix + target + suffix; return; }

    var started = null;
    var duration = 1200;
    function tick(now) {
      if (started === null) started = now;
      var p = clamp((now - started) / duration, 0, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + Math.round(target * eased) + suffix;
      if (p < 1) window.requestAnimationFrame(tick);
    }
    window.requestAnimationFrame(tick);
  }

  if (counters.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      counters.forEach(runCounter);
    } else {
      var countObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          runCounter(entry.target);
          countObserver.unobserve(entry.target);
        });
      }, { threshold: 0.6 });
      counters.forEach(function (el) { countObserver.observe(el); });
    }
  }

  /* ============================================================
     Подсветка под курсором внутри карточек
     ============================================================ */
  if (finePointer && !reduceMotion) {
    $$('.spotlight').forEach(function (card) {
      var queued = false, lastX = 0, lastY = 0;
      card.addEventListener('pointermove', function (e) {
        var box = card.getBoundingClientRect();
        lastX = e.clientX - box.left;
        lastY = e.clientY - box.top;
        if (queued) return;
        queued = true;
        window.requestAnimationFrame(function () {
          card.style.setProperty('--mx', lastX + 'px');
          card.style.setProperty('--my', lastY + 'px');
          queued = false;
        });
      });
    });
  }

  /* ============================================================
     Магнитные кнопки
     ============================================================ */
  if (finePointer && !reduceMotion) {
    $$('.magnetic').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var box = el.getBoundingClientRect();
        var dx = (e.clientX - (box.left + box.width / 2)) * 0.22;
        var dy = (e.clientY - (box.top + box.height / 2)) * 0.32;
        el.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
      });
      el.addEventListener('pointerleave', function () { el.style.transform = ''; });
    });
  }

  /* ============================================================
     Бегущая строка: дублируем содержимое ради бесшовного цикла
     ============================================================ */
  var marquee = $('#marqueeTrack');
  if (marquee && !reduceMotion) {
    marquee.innerHTML = marquee.innerHTML + marquee.innerHTML;
  }

  /* ============================================================
     Видео: не крутим вхолостую за пределами экрана
     ============================================================ */
  if (heroVideo) {
    if (reduceMotion) {
      heroVideo.removeAttribute('autoplay');
      heroVideo.pause();
    } else if ('IntersectionObserver' in window) {
      var videoObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var p = heroVideo.play();
            if (p && p.catch) p.catch(function () { /* автовоспроизведение запрещено — остаётся постер */ });
          } else {
            heroVideo.pause();
          }
        });
      }, { threshold: 0.05 });
      videoObserver.observe(heroVideo);
    }
  }

  /* ============================================================
     Терминал в блоке процесса
     ============================================================ */
  var terminal = $('#terminalBody');
  var lines = [
    { mark: '›', text: 'git push origin <b>main</b>' },
    { mark: '·', text: 'проверка кода и тестов',           time: '12s',   done: true },
    { mark: '·', text: 'сборка образа',                    time: '48s',   done: true },
    { mark: '·', text: 'миграции базы данных',             time: '3s',    done: true },
    { mark: '·', text: 'выкатка без простоя',              time: '9s',    done: true },
    { mark: '·', text: 'проверка доступности сервиса',     time: '2s',    done: true },
    { mark: '✓', text: '<b>релиз в продакшене</b>',        time: '1m14s', done: true },
    { mark: '›', text: 'сертификат продлится автоматически' }
  ];

  function renderTerminal() {
    if (!terminal) return;
    terminal.textContent = '';
    lines.forEach(function (item, i) {
      var row = document.createElement('div');
      row.className = 'tline';

      var mark = document.createElement('span');
      mark.className = 't-mark' + (item.done ? ' done' : '');
      mark.textContent = item.mark;
      row.appendChild(mark);

      var text = document.createElement('span');
      text.className = 't-text';
      text.innerHTML = item.text;
      row.appendChild(text);

      if (item.time) {
        var time = document.createElement('span');
        time.className = 't-time';
        time.textContent = item.time;
        row.appendChild(time);
      }

      terminal.appendChild(row);

      if (reduceMotion) row.classList.add('in');
      else window.setTimeout(function () { row.classList.add('in'); }, 260 + i * 300);
    });
  }

  if (terminal) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      renderTerminal();
    } else {
      var termObserver = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) { renderTerminal(); termObserver.disconnect(); }
      }, { threshold: 0.35 });
      termObserver.observe(terminal);
    }
  }

  /* ============================================================
     Ключи: поле шифротекста и расшифровка заголовка

     Поле у образца (reflect.app) — видео на 830 КБ; здесь оно собирается
     разметкой. Форма снята с их кадра: эллипс из строк, к верху и низу
     короче, верхняя половина зеркалит нижнюю. Волну поле не считает —
     она целиком в CSS (см. style.css): скрипт только раскладывает строки
     и ставит каждой группе оттенок по расстоянию до центра.

     Набор одинаков при каждой загрузке: генератор с постоянным зерном.
     Случайное поле меняло бы блок от перезагрузки к перезагрузке, и
     сравнить два снимка при правке было бы нечем.
     ============================================================ */
  var CRYPT_ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  var CRYPT_PITCH = 22;    /* px — шаг строк, как у образца: 26.6 видеопикселя */
  var cryptField  = $('#cryptField');
  var cryptSize   = { w: 0, h: 0 };

  /* xorshift32 */
  function cryptRandom(seed) {
    var s = seed;
    return function () {
      s ^= s << 13; s ^= s >>> 17; s ^= s << 5;
      return (s >>> 0) / 4294967296;
    };
  }

  function buildCrypt() {
    if (!cryptField) return;
    var w = cryptField.clientWidth;
    var h = cryptField.clientHeight;
    if (!w || !h) return;

    /* шрифт не моноширинный, поэтому ширина каждой группы меряется на
       холсте тем же шрифтом, что стоит на поле: ни одного обращения к
       раскладке на три сотни групп */
    var cs  = window.getComputedStyle(cryptField);
    var ctx = document.createElement('canvas').getContext('2d');
    ctx.font = cs.fontWeight + ' ' + cs.fontSize + ' ' + cs.fontFamily;
    var sepW = ctx.measureText(' :: ').width;

    /* нечётное число строк: средняя лежит ровно на центре, остальные
       зеркалятся вокруг неё */
    var rows = 2 * Math.floor((h / CRYPT_PITCH - 1) / 2) + 1;
    var cx = w / 2, cy = h / 2;
    /* эллипс строк чуть выше поля: крайняя строка тогда не вырождается
       в одно слово, а держит примерно половину средней, как у образца */
    var a = cx, b = cy * 1.12;
    var maxD = Math.sqrt(cx * cx + cy * cy);
    var rnd = cryptRandom(0x1f3a5c7);
    var dim = document.createElement('div');
    dim.className = 'crypt-dim';
    var half = [];
    var r, k, i;

    for (r = 0; r <= (rows - 1) / 2; r++) {
      var dy = (r - (rows - 1) / 2) * CRYPT_PITCH;
      var chord = 2 * a * Math.sqrt(Math.max(0, 1 - (dy * dy) / (b * b)));
      var toks = [], widths = [], total = 0;
      while (true) {
        var len = 6 + Math.floor(rnd() * 10);
        var s = '';
        for (k = 0; k < len; k++) s += CRYPT_ALPHA.charAt(Math.floor(rnd() * 64));
        var tw = ctx.measureText(s).width;
        if (total + (toks.length ? sepW : 0) + tw > chord) break;
        total += (toks.length ? sepW : 0) + tw;
        toks.push(s); widths.push(tw);
      }
      if (!toks.length) continue;

      var row = document.createElement('div');
      row.className = 'crypt-row';
      var left = cx - total / 2;
      row.style.left = left + 'px';
      var x = left;
      for (i = 0; i < toks.length; i++) {
        var tok = document.createElement('i');
        tok.textContent = toks[i];
        /* оттенок по радиусу: шаг чуть шире полосы кольца, поэтому соседние
           кольца приходят разного цвета — от голубого к розово-фиолетовому.
           У образца оттенок держится за местом, а не за фазой */
        var px = x + widths[i] / 2 - cx;
        var u = Math.sqrt(px * px + dy * dy) / maxD;
        tok.style.setProperty('--h', (252 + 30 * Math.sin(u * 14)).toFixed(0));
        row.appendChild(tok);
        x += widths[i] + sepW;
      }
      half.push({ row: row, dy: dy });
    }

    /* зеркало: строка r и строка rows-1-r — один и тот же текст */
    for (i = 0; i < half.length; i++) {
      var top = cy + half[i].dy - CRYPT_PITCH / 2;
      half[i].row.style.top = top + 'px';
      dim.appendChild(half[i].row);
      if (half[i].dy < 0) {
        var mirror = half[i].row.cloneNode(true);
        mirror.style.top = (cy - half[i].dy - CRYPT_PITCH / 2) + 'px';
        dim.appendChild(mirror);
      }
    }

    var lit = dim.cloneNode(true);
    lit.className = 'crypt-lit';
    var bloom = document.createElement('div');
    bloom.className = 'crypt-bloom';

    cryptField.textContent = '';
    cryptField.appendChild(dim);
    cryptField.appendChild(lit);
    cryptField.appendChild(bloom);
    cryptSize.w = w;
    cryptSize.h = h;
  }

  /* ширина групп меряется шрифтом: до его загрузки поле разложилось бы
     запасным и после подмены поехало */
  function buildCryptReady() {
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(buildCrypt, buildCrypt);
    } else {
      buildCrypt();
    }
  }

  if (cryptField) {
    if (!('IntersectionObserver' in window)) {
      buildCryptReady();
    } else {
      var cryptObserver = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) { buildCryptReady(); cryptObserver.disconnect(); }
      }, { rootMargin: '400px' });
      cryptObserver.observe(cryptField);
    }

    var cryptTimer = null;
    window.addEventListener('resize', function () {
      window.clearTimeout(cryptTimer);
      cryptTimer = window.setTimeout(function () {
        if (!cryptSize.w) return;            /* поле ещё не собрано */
        if (Math.abs(cryptField.clientWidth  - cryptSize.w) < 48 &&
            Math.abs(cryptField.clientHeight - cryptSize.h) < 48) return;
        buildCrypt();
      }, 280);
    });
  }

  /* Расшифровка. У образца текст перебирается целыми словами каждые 50 мс и
     в момент появления блока разом становится настоящим. Здесь знаки встают
     на место по одному слева направо: так видно направление, а строка не
     скачет — перебор идёт буквами того же алфавита и того же регистра,
     поэтому ширина почти не меняется. */
  var DEC_LOWER = 'абвгдежзиклмнопрстуфхцчшщыэюя';
  var DEC_UPPER = 'АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЩЭЮЯ';
  var DEC_LAT   = 'abcdefghijklmnopqrstuvwxyz';
  var DEC_DUR   = 1.05;   /* с на весь текст, независимо от его длины */
  var DEC_STEP  = 45;     /* мс между перетасовками, как у образца */

  function cryptNoise(ch) {
    if (ch === 'ё') return DEC_LOWER.charAt(Math.floor(Math.random() * DEC_LOWER.length));
    if (ch === 'Ё') return DEC_UPPER.charAt(Math.floor(Math.random() * DEC_UPPER.length));
    if (ch >= 'а' && ch <= 'я') return DEC_LOWER.charAt(Math.floor(Math.random() * DEC_LOWER.length));
    if (ch >= 'А' && ch <= 'Я') return DEC_UPPER.charAt(Math.floor(Math.random() * DEC_UPPER.length));
    if (ch >= '0' && ch <= '9') return String.fromCharCode(48 + Math.floor(Math.random() * 10));
    if (ch >= 'a' && ch <= 'z') return DEC_LAT.charAt(Math.floor(Math.random() * 26));
    if (ch >= 'A' && ch <= 'Z') return DEC_LAT.charAt(Math.floor(Math.random() * 26)).toUpperCase();
    return ch;                              /* пробелы и знаки препинания на месте */
  }

  function runDecode(el, delay) {
    var real = el.textContent.replace(/\s+/g, ' ').replace(/^ | $/g, '');
    var n = real.length;
    if (!n) return;

    var view = document.createElement('span');
    view.setAttribute('aria-hidden', 'true');
    var sr = document.createElement('span');
    sr.className = 'crypt-sr';
    sr.textContent = real;
    el.textContent = '';
    el.appendChild(view);
    el.appendChild(sr);

    /* момент фиксации знака: в основном слева направо, немного вразнобой */
    var lock = [];
    for (var i = 0; i < n; i++) {
      lock.push(delay + DEC_DUR * (.6 * (i / n) + .4 * Math.random()));
    }

    var start = 0, rolled = -1e9;
    function frame(now) {
      if (!start) start = now;
      if (now - rolled < DEC_STEP) { window.requestAnimationFrame(frame); return; }
      rolled = now;
      var t = (now - start) / 1000, out = '', done = true;
      for (var j = 0; j < n; j++) {
        if (t >= lock[j]) out += real.charAt(j);
        else { out += cryptNoise(real.charAt(j)); done = false; }
      }
      view.textContent = out;
      if (!done) window.requestAnimationFrame(frame);
    }
    view.textContent = real.replace(/[^ ]/g, function (c) { return cryptNoise(c); });
    window.requestAnimationFrame(frame);
  }

  var cryptTitle = $('.crypt-title');
  if (cryptTitle && !reduceMotion && 'IntersectionObserver' in window) {
    var decObserver = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      decObserver.disconnect();
      $$('#keys [data-decode]').forEach(function (el, i) { runDecode(el, i * .12); });
    }, { threshold: .6 });
    decObserver.observe(cryptTitle);
  }

  /* ============================================================
     Уведомление
     ============================================================ */
  var toast = $('#toast');
  var toastTimer = null;
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () { toast.classList.remove('show'); }, 2600);
  }

  /* ============================================================
     Копирование контакта
     ============================================================ */
  $$('.copy-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var value = btn.getAttribute('data-copy') || '';

      function fallback() {
        var input = document.createElement('input');
        input.value = value;
        input.setAttribute('readonly', '');
        input.style.position = 'fixed';
        input.style.opacity = '0';
        document.body.appendChild(input);
        input.select();
        try { document.execCommand('copy'); } catch (e) { /* браузер не дал */ }
        document.body.removeChild(input);
        showToast('Скопировано: ' + value);
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value)
          .then(function () { showToast('Скопировано: ' + value); })
          .catch(fallback);
      } else {
        fallback();
      }
    });
  });

  /* ============================================================
     Форма: собираем письмо
     ============================================================ */
  var MAIL_TO = 'hello@example.com';   // ← заменить на рабочую почту
  var form = $('#contactForm');
  var formNote = $('#formNote');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var name    = $('#name').value.trim();
      var contact = $('#reply').value.trim();
      var topic   = $('#topic').value;
      var message = $('#message').value.trim();

      var missing = [];
      [['#name', name], ['#reply', contact], ['#message', message]].forEach(function (pair) {
        var field = $(pair[0]);
        var empty = !pair[1];
        field.classList.toggle('invalid', empty);
        if (empty) missing.push(field);
      });

      if (missing.length) {
        missing[0].focus();
        if (formNote) {
          formNote.textContent = 'Заполните имя, контакт и описание задачи.';
          formNote.classList.remove('ok');
        }
        return;
      }

      var subject = 'Заявка с сайта — ' + topic;
      var body = ['Имя: ' + name, 'Контакт: ' + contact, 'Задача: ' + topic, '', message].join('\n');

      window.location.href = 'mailto:' + MAIL_TO +
        '?subject=' + encodeURIComponent(subject) +
        '&body='    + encodeURIComponent(body);

      if (formNote) {
        formNote.textContent = 'Письмо открыто в почтовом клиенте — осталось нажать «отправить».';
        formNote.classList.add('ok');
      }
      showToast('Письмо подготовлено');
    });

    $$('#contactForm input, #contactForm textarea').forEach(function (field) {
      field.addEventListener('input', function () { field.classList.remove('invalid'); });
    });
  }


  /* ============================================================
     Свет у панели проверок

     У huly.io на этом месте видео: 2944×2112, 60 к/с, 12 секунд, 9,6 МБ,
     отрендерено в motion-редакторе. Два источника, тёплый и холодный,
     обходят рамку по часовой стрелке за 12 секунд, находясь на
     противоположных концах периметра. Видео сюда не годится: высота нашей
     панели зависит от текста, а кадр требует фиксированных пропорций.
     Поэтому та же картина считается здесь в реальном времени, в цветах
     сайта: фиолетовый и бирюзовый вместо оранжевого и синего.

     Движение не равномерное: по прямой свет ползёт, углы проходит быстро.
     Опорные точки — середины сторон, три секунды на переход с ease-in-out,
     поэтому пик скорости приходится ровно на угол. Второй источник всегда
     на противоположной стороне.

     На проходе угла переключается экран панели — там же меняет картинку
     Rive-анимация у huly.io. Смена приходится на самый быстрый участок:
     под движущимся светом подмена не читается как скачок.

     Два холста вдвое меньше панели: .checks-glow — полоса и дымка, поверх
     него CSS-маска кладёт сетку точек; .checks-rim — нить у самой рамки,
     без маски, свет там сплошной. Один раз считаются поля: расстояние до
     скруглённой рамки и положение ближайшей точки рамки на периметре.
     Каждый кадр — только цвет и яркость по этим полям, без геометрии.
     Считается только пока панель на экране; при prefers-reduced-motion
     один кадр.
     ============================================================ */
  var glowCanvas = $('.checks-glow');
  var rimCanvas  = $('.checks-rim');
  if (glowCanvas && rimCanvas && glowCanvas.getContext) {
    var BLOCK  = 2;      // размер блока, px
    var PAD    = 230;    // насколько холст шире панели с каждой стороны, px
    var RADIUS = 15;     // скругление рамки окна, px
    var RIM    = 6;      // дальность нити, px
    var BAND   = 52;     // дальность цветной полосы, px
    var HAZE   = 160;    // дальность дымки, px
    var SPAN   = 0.24;   // полуширина пятна вдоль периметра, доля периметра
    var STEP   = 3000;   // переход от середины стороны до следующей, мс
    var FPS    = 30;
    var FADE   = 500;    // длительность наплыва между экранами, мс (см. style.css)

    // палитра сайта: фиолетовый акцент и бирюзовый из бейджа «8 / 8»
    var WARM = { hot: [242, 234, 255], mid: [167, 139, 250], deep: [104, 52, 226] };
    var COOL = { hot: [226, 255, 250], mid: [ 94, 234, 212], deep: [ 16, 150, 160] };

    var ctx  = glowCanvas.getContext('2d');
    var rctx = rimCanvas.getContext('2d');
    var W = 0, H = 0, N = 0, img = null, px = null, rimg = null, rpx = null;
    var fMask, fRim, fBand, fHaze, fU;
    var stops = [.125, .375, .625, .875, 1.125];   // середины сторон, уточняются в build
    var builtKey = '';

    var build = function () {
      var shot = glowCanvas.parentNode;
      var PW = shot.offsetWidth, PH = shot.offsetHeight;
      var key = PW + 'x' + PH;
      if (!PW || !PH) return false;
      if (key === builtKey) return true;
      builtKey = key;

      W = Math.ceil((PW + PAD * 2) / BLOCK);
      H = Math.ceil((PH + PAD * 2) / BLOCK);
      N = W * H;
      [glowCanvas, rimCanvas].forEach(function (c) {
        c.width = W;
        c.height = H;
        c.style.width  = (W * BLOCK) + 'px';
        c.style.height = (H * BLOCK) + 'px';
        c.style.left = (-PAD) + 'px';
        c.style.top  = (-PAD) + 'px';
      });
      img  = ctx.createImageData(W, H);  px  = img.data;
      rimg = rctx.createImageData(W, H); rpx = rimg.data;

      fMask = new Uint8Array(N);
      fRim  = new Float32Array(N);
      fBand = new Float32Array(N);
      fHaze = new Float32Array(N);
      fU    = new Float32Array(N);

      var P = 2 * (PW + PH);           // периметр
      var maxd = PAD - 6;              // дальше этого — гарантированный ноль
      var mt = PW / 2, mr = PW + PH / 2, mb = PW + PH + PW / 2, ml = 2 * PW + PH + PH / 2;
      stops = [mt / P, mr / P, mb / P, ml / P, mt / P + 1];
      for (var j = 0; j < H; j++) {
        for (var i = 0; i < W; i++) {
          var k = j * W + i;
          var x = (i + .5) * BLOCK - PAD;   // координаты в системе панели
          var y = (j + .5) * BLOCK - PAD;

          // расстояние со знаком до скруглённого прямоугольника
          var qx = Math.abs(x - PW / 2) - (PW / 2 - RADIUS);
          var qy = Math.abs(y - PH / 2) - (PH / 2 - RADIUS);
          var ox = qx > 0 ? qx : 0, oy = qy > 0 ? qy : 0;
          var dist = Math.sqrt(ox * ox + oy * oy) + Math.min(Math.max(qx, qy), 0) - RADIUS;
          if (dist < -1 || dist > maxd) continue;   // под окном или за пределом

          var dd = dist > 0 ? dist : 0;
          var fade = 1 - dd / maxd;
          fMask[k] = 1;
          fRim[k]  = Math.exp(-dd / RIM);
          fBand[k] = Math.exp(-dd / BAND) * fade;
          fHaze[k] = Math.exp(-dd / HAZE) * fade * fade;

          // положение ближайшей точки рамки на периметре, по часовой
          // стрелке от верхнего левого угла: верх → право → низ → лево.
          // Точки внутри габарита (клинья между дугой скругления и прямым
          // углом) относятся к ближайшей стороне — без этого они уходили
          // на левую и на правых углах брали цвет второго источника
          var cx = clamp(x, 0, PW), cy = clamp(y, 0, PH), u;
          var inside = x >= 0 && x <= PW && y >= 0 && y <= PH;
          var side = inside
            ? [y, PW - x, PH - y, x].indexOf(Math.min(y, PW - x, PH - y, x))
            : (y < 0 ? 0 : x > PW ? 1 : y > PH ? 2 : 3);
          if (side === 0)      u = cx;
          else if (side === 1) u = PW + cy;
          else if (side === 2) u = PW + PH + (PW - cx);
          else                 u = 2 * PW + PH + (PH - cy);
          fU[k] = u / P;
        }
      }
      return true;
    };

    var paint = function (phase) {
      var out = px, rout = rpx, o, c;
      for (var z = 0; z < out.length; z++) { out[z] = 0; rout[z] = 0; }
      for (var k = 0; k < N; k++) {
        if (!fMask[k]) continue;

        // расстояние вдоль периметра до каждого из двух источников;
        // второй на полпериметра дальше первого
        var du = fU[k] - phase; du -= Math.floor(du);
        var d1 = du > .5 ? 1 - du : du;
        var d2 = du > .5 ? du - .5 : .5 - du;
        var w1 = d1 < SPAN ? 1 - d1 / SPAN : 0; w1 *= w1;
        var w2 = d2 < SPAN ? 1 - d2 / SPAN : 0; w2 *= w2;
        var wl = w1 > w2 ? w1 : w2;
        if (wl < .004) continue;

        var pal = w1 > w2 ? WARM : COOL;
        var rim = fRim[k], band = fBand[k], haze = fHaze[k];
        o = k * 4;

        // полоса и дымка — под сетку точек
        var a = (rim * .5 + band * .95 + haze * .5) * wl;
        if (a > 1) a = 1;
        if (a >= .01) {
          for (c = 0; c < 3; c++) {
            out[o + c] = pal.deep[c] + (pal.mid[c] - pal.deep[c]) * band;
          }
          out[o + 3] = a * 255;
        }

        // нить — сплошная, к рамке уходит в белый
        var r = rim * wl;
        if (r >= .02) {
          for (c = 0; c < 3; c++) {
            rout[o + c] = pal.mid[c] + (pal.hot[c] - pal.mid[c]) * rim;
          }
          rout[o + 3] = r * 255;
        }
      }
      ctx.putImageData(img, 0, 0);
      rctx.putImageData(rimg, 0, 0);
    };

    // фаза по времени: номер перехода выбирает пару соседних середин сторон,
    // дробная часть с кубическим ease-in-out — положение между ними. Угол
    // лежит посередине перехода, где скорость максимальна
    var phaseAt = function (t) {
      var seg = Math.floor(t / STEP) % 4;
      var f = (t % STEP) / STEP;
      f = f < .5 ? 4 * f * f * f : 1 - 4 * (1 - f) * (1 - f) * (1 - f);
      return stops[seg] + (stops[seg + 1] - stops[seg]) * f;
    };

    // экран панели: наплыв начинается перед углом, чтобы его середина
    // пришлась ровно на самый быстрый участок — под движущимся светом
    // подмена не читается как скачок. Цикл смены — два перехода, шесть секунд
    var screenEl = $('.checks-window');
    var failing = null;
    var setScreen = function (t) {
      if (!screenEl) return;
      var q = ((t + FADE / 2) / (STEP * 2)) % 1;
      var bad = q >= .25 && q < .75;
      if (bad === failing) return;
      failing = bad;
      screenEl.classList.toggle('failing', bad);
    };

    var visible = false, running = false, last = 0, t0 = 0;
    var tick = function (now) {
      if (!visible) { running = false; return; }
      if (now - last >= 1000 / FPS) {
        last = now;
        if (!t0) t0 = now;
        paint(phaseAt(now - t0));
        setScreen(now - t0);
      }
      window.requestAnimationFrame(tick);
    };
    var start = function () {
      if (!build()) return;
      glowCanvas.parentNode.classList.add('has-glow');
      if (reduceMotion) { paint(0); return; }
      if (!running) { running = true; window.requestAnimationFrame(tick); }
    };

    if (reduceMotion || !('IntersectionObserver' in window)) {
      visible = true;
      start();
    } else {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        if (visible) start();
      }, { rootMargin: '120px' }).observe(glowCanvas.parentNode);
    }

    window.addEventListener('load', function () { if (visible) start(); });
    var glowQueued = false;
    window.addEventListener('resize', function () {
      if (glowQueued) return;
      glowQueued = true;
      window.requestAnimationFrame(function () {
        glowQueued = false;
        if (build() && (reduceMotion || !running)) paint(0);
      });
    }, { passive: true });
  }

})();
