/* ============================================================
   ERGO — поведение страницы
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
     Заголовок первого экрана: разбор на слова
     Слова после тире получают акцентный цвет.
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
     Пыль на первом экране — по движению частиц Reflect.

     Всё поле поворачивается за 70 секунд; каждая точка равномерно сходится
     к центру за 7–14 секунд и уменьшается с 2 до 1 CSS px. Радиальная маска
     плавно убирает её под светом кольца. Размер задан в пикселях страницы,
     независимо от размера сцены: растягивается поле, а не сами крупинки.

     На canvas остаются только маленькие заливки без ореолов и следов.
     Небольшое увеличение через pixelated сохраняет фактуру света сайта.
     ============================================================ */
  (function initHeroDust() {
    var canvas = $('.hero-dust');
    if (!canvas || !canvas.getContext) return;

    var BLOCK   = 1.25;   // сторона пикселя холста на странице, CSS px
    var FPS     = 60;
    var COUNT   = 100;
    var FIELD   = 700 / 1440; // диаметр поля относительно видео в референсе
    var SPIN    = 70;         // один общий оборот, с
    var LIFE_MIN = 7, LIFE_MAX = 14;
    var DOT_SIZE = 2;         // начальный поперечник, CSS px

    var stage = canvas.parentNode;
    var ctx   = canvas.getContext('2d');
    if (!ctx) return;
    var TAU   = 2 * Math.PI;
    var OMEGA = TAU / SPIN;
    var parts = [];
    var W = 0, H = 0, cx = 0, cy = 0, R = 0, key = '', rotation = 0;
    var visible = false, running = false, last = 0, frame = 0;

    var smooth = function (a, b, v) {
      var t = clamp((v - a) / (b - a), 0, 1);
      return t * t * (3 - 2 * t);
    };

    var seed = function (p) {
      var x = Math.random() * 2 - 1, y = Math.random() * 2 - 1;
      p.radius = Math.sqrt(x * x + y * y);
      p.angle = Math.atan2(y, x);
      p.life = LIFE_MIN + Math.random() * (LIFE_MAX - LIFE_MIN);
      p.age = 0;
    };

    var build = function () {
      var sw = stage.offsetWidth, sh = stage.offsetHeight;
      if (!sw || !sh) return false;
      var k = sw + 'x' + sh;
      if (k === key) return true;
      key = k;
      W = H = Math.round(sw * FIELD / BLOCK);
      canvas.width = W;
      canvas.height = H;
      canvas.style.width  = (W * BLOCK) + 'px';
      canvas.style.height = (H * BLOCK) + 'px';
      cx = W / 2;
      cy = H / 2;
      R = W / 2;
      while (parts.length < COUNT) {
        var p = { lit: parts.length % 3 === 0 ? .5 : 1 };
        seed(p);
        // Разные фазы с первого кадра: поле не ждёт заполнения и не пульсирует.
        p.age = Math.random() * p.life;
        parts.push(p);
      }
      return true;
    };

    var paint = function (dt) {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#fff';
      rotation = (rotation + OMEGA * dt) % TAU;
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        p.age += dt;
        if (p.age >= p.life) { seed(p); continue; }

        var progress = p.age / p.life;
        var radius = p.radius * (1 - .9 * progress);
        // Профиль маски Reflect: пустое ядро, мягкая полоса пыли, тёмный край.
        var mask = smooth(.2708, .4792, radius) *
                   (1 - .2 * smooth(.4792, .75, radius)) *
                   (1 - smooth(.75, 1, radius));
        var alpha = p.lit * smooth(0, .1, progress) * mask;
        if (alpha < .006) continue;
        var angle = p.angle + rotation;
        var size = DOT_SIZE * (1 - .5 * progress) / BLOCK;
        var x = cx + R * radius * Math.cos(angle);
        var y = cy - R * radius * Math.sin(angle);
        ctx.globalAlpha = alpha;
        ctx.fillRect(x - size * .5, y - size * .5, size, size);
      }
      ctx.globalAlpha = 1;
    };

    var tick = function (now) {
      frame = 0;
      if (!running) return;
      if (!last) last = now - 1000 / FPS;
      var dt = (now - last) / 1000;
      if (dt >= 1 / FPS - .002) {
        last = now;
        paint(Math.min(dt, 1 / 30)); // после задержки кадра пыль не прыгает
      }
      frame = window.requestAnimationFrame(tick);
    };

    var sync = function () {
      var on = visible && !document.hidden && !motionQuery.matches && build();
      stage.classList.toggle('has-dust', on);
      if (on === running) return;
      running = on;
      if (on) {
        last = 0;
        paint(0);
        frame = window.requestAnimationFrame(tick);
      } else {
        window.cancelAnimationFrame(frame);
        frame = 0;
      }
    };

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        sync();
      }, { rootMargin: '120px' }).observe(stage);
    } else {
      visible = true;
      sync();
    }
    document.addEventListener('visibilitychange', sync);
    if (motionQuery.addEventListener) motionQuery.addEventListener('change', sync);
    window.addEventListener('load', sync);

    var queued = false;
    window.addEventListener('resize', function () {
      if (queued) return;
      queued = true;
      window.requestAnimationFrame(function () { queued = false; sync(); });
    }, { passive: true });
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
     Кнопки: насыщенная заливка с точечным бликом и вспышка кромки.
     Один набор слоёв на кнопку; в кадре меняются только transform/opacity.
     Действия ссылок, submit и клавиатуры остаются нативными.
     ============================================================ */
  (function initButtonLight() {
    var pointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    var resets = [];
    $$('.btn').forEach(function (el) {
      var label = document.createElement('span');
      label.className = 'button-label';
      while (el.firstChild) label.appendChild(el.firstChild);
      el.appendChild(label);
      el.classList.add('button-lit');
      // Задержка появления не должна задерживать подсветку при наведении.
      el.style.removeProperty('transition-delay');

      function layer(name, parent) {
        var node = document.createElement('span');
        node.className = name;
        node.setAttribute('aria-hidden', 'true');
        (parent || el).appendChild(node);
        return node;
      }
      layer('button-aura');
      layer('button-sweep', layer('button-fill'));
      layer('button-rim');
      var flash = layer('button-flash');
      var enabled = function () { return !el.matches(':disabled, [aria-disabled="true"]'); };

      function reset() {
        el.classList.remove('is-hovered');
        flash.classList.remove('is-running');
      }
      resets.push(reset);
      function hover(e) {
        if (!enabled() || !pointerQuery.matches || e.pointerType === 'touch') return;
        el.classList.add('is-hovered');
      }
      function pulse() {
        if (!enabled() || motionQuery.matches) return;
        flash.classList.remove('is-running');
        // Перезапускаем один слой, не задерживая переход по ссылке или submit.
        void flash.offsetWidth;
        flash.classList.add('is-running');
      }
      el.addEventListener('pointerenter', hover);
      el.addEventListener('pointermove', hover);
      el.addEventListener('pointerleave', function () {
        el.classList.remove('is-hovered');
      });
      el.addEventListener('pointerdown', function (e) { if (e.button === 0) pulse(); });
      el.addEventListener('pointercancel', reset);
      el.addEventListener('keydown', function (e) {
        if (!e.repeat && (e.key === 'Enter' || (e.key === ' ' && el.tagName === 'BUTTON'))) pulse();
      });
      el.addEventListener('blur', reset);
      flash.addEventListener('animationend', function () { flash.classList.remove('is-running'); });
    });
    function resetAll() { resets.forEach(function (reset) { reset(); }); }
    if (motionQuery.addEventListener) motionQuery.addEventListener('change', resetAll);
    if (pointerQuery.addEventListener) pointerQuery.addEventListener('change', resetAll);
    window.addEventListener('blur', resetAll);
    document.addEventListener('visibilitychange', function () { if (document.hidden) resetAll(); });
  })();

  /* Локальный пример AI: один таймер на всю последовательность.
     Вне экрана и в скрытой вкладке сохраняем остаток задержки. */
  (function initAiDemo() {
    var section = $('#ai');
    if (!section) return;
    var demo = $('.ai-demo', section);
    var trigger = $('.ai-demo-trigger', demo);
    var triggerLabel = $('span', trigger);
    var note = $('.ai-demo-text', demo);
    var answerBody = $('.ai-answer-body p', demo);
    var answerStatus = $('.ai-answer-status', demo);
    var status = $('.ai-status', demo);
    var question = note.textContent;
    var answer = answerBody.textContent;
    var running = false;
    var visible = false;
    var visibilityQueued = false;
    var timer = 0;
    var pending = null;
    var remaining = 0;
    var startedAt = 0;
    var typed = 0;
    var clickTarget = null;
    var timing = { selection: 1050, toolbar: 1000, menu: 1350, entry: 700, typing: 40, reading: 1350, click: 580 };
    demo.style.setProperty('--ai-click-duration', timing.click + 'ms');

    function arm() {
      if (!pending || timer || !visible || document.hidden) return;
      startedAt = performance.now();
      timer = window.setTimeout(function () {
        timer = 0;
        var next = pending;
        pending = null;
        if (next) next();
      }, remaining);
    }
    function schedule(next, delay) {
      window.clearTimeout(timer);
      timer = 0;
      pending = next;
      remaining = delay;
      arm();
    }
    function clearSequence() {
      window.clearTimeout(timer);
      timer = 0;
      pending = null;
      if (clickTarget) clickTarget.classList.remove('is-clicking');
      clickTarget = null;
      running = false;
      trigger.removeAttribute('aria-disabled');
    }
    function finish() {
      clearSequence();
      note.textContent = answer;
      answerBody.textContent = answer;
      demo.dataset.aiState = 'done';
      triggerLabel.textContent = 'Повторить пример';
      trigger.setAttribute('aria-label', 'Повторить пример работы AI-помощника');
      status.textContent = 'Пример завершён. ' + answer;
    }
    // Нажатие — отдельный шаг: окно остаётся на месте, пока кнопка
    // сжимается, подсвечивается и отпускается. Потом начинается переход.
    function clickThrough(selector, next) {
      clickTarget = $(selector, demo);
      clickTarget.classList.add('is-clicking');
      schedule(function () {
        clickTarget.classList.remove('is-clicking');
        clickTarget = null;
        next();
      }, timing.click);
    }
    function clickReplace() { clickThrough('.ai-answer-replace', finish); }
    function clickCommand() { clickThrough('.ai-demo-command', showAnswer); }
    function clickSpark() { clickThrough('.ai-toolbar-spark', showMenu); }
    function typeAnswer() {
      typed = Math.min(typed + 2, answer.length);
      answerBody.textContent = answer.slice(0, typed);
      if (typed === answer.length) answerStatus.textContent = 'Готово';
      schedule(typed < answer.length ? typeAnswer : clickReplace, typed < answer.length ? timing.typing : timing.reading);
    }
    function showAnswer() {
      answerStatus.textContent = 'Пишет…';
      demo.dataset.aiState = 'answer';
      schedule(typeAnswer, timing.entry);
    }
    function showMenu() {
      demo.dataset.aiState = 'menu';
      schedule(clickCommand, timing.menu);
    }
    function showToolbar() {
      demo.dataset.aiState = 'toolbar';
      schedule(clickSpark, timing.toolbar);
    }
    function syncMotion() {
      var active = visible && !document.hidden;
      section.classList.toggle('idle', !active || motionQuery.matches);
      if (motionQuery.matches && running) finish();
      if (active) {
        arm();
      } else if (timer) {
        window.clearTimeout(timer);
        timer = 0;
        remaining = Math.max(0, remaining - (performance.now() - startedAt));
      }
    }
    function checkVisibility() {
      if (visibilityQueued) return;
      visibilityQueued = true;
      window.requestAnimationFrame(function () {
        visibilityQueued = false;
        var bounds = section.getBoundingClientRect();
        visible = bounds.bottom > 0 && bounds.top < window.innerHeight;
        syncMotion();
      });
    }
    trigger.hidden = false;
    trigger.addEventListener('click', function () {
      if (running) return;
      running = true;
      typed = 0;
      note.textContent = question;
      answerBody.textContent = '';
      status.textContent = 'Воспроизводится пример работы AI-помощника.';
      trigger.setAttribute('aria-disabled', 'true');
      if (motionQuery.matches) { finish(); return; }
      demo.dataset.aiState = 'select';
      schedule(showToolbar, timing.selection);
    });
    demo.addEventListener('keydown', function (event) {
      if (event.key !== 'Escape' || !running) return;
      clearSequence();
      note.textContent = question;
      demo.dataset.aiState = 'idle';
      status.textContent = 'Воспроизведение остановлено.';
    });
    if ('IntersectionObserver' in window) new IntersectionObserver(checkVisibility).observe(section);
    window.addEventListener('scroll', checkVisibility, { passive: true });
    window.addEventListener('resize', checkVisibility, { passive: true });
    document.addEventListener('visibilitychange', syncMotion);
    if (motionQuery.addEventListener) motionQuery.addEventListener('change', syncMotion);
    checkVisibility();
  })();

  /* Пыль в «Одной системе»: готовые слои движутся только пока поле видно. */
  (function initSystemStars() {
    var field = $('.system-stars');
    if (!field) return;
    var visible = false;
    var sync = function () {
      field.classList.toggle('idle', !visible || document.hidden || motionQuery.matches);
    };
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        sync();
      }).observe(field);
    } else {
      visible = true;
      sync();
    }
    document.addEventListener('visibilitychange', sync);
    if (motionQuery.addEventListener) motionQuery.addEventListener('change', sync);
  })();

  /* Слияние: такт за тактом источники по очереди пишут в общую базу.
     Один таймер, как у релизов: вне экрана и в скрытой вкладке он стоит, а
     остаток паузы сохраняется. Скрипт держит три вещи: какой источник сейчас
     активен (`data-beat` и `data-state` у него), какая половина такта идёт
     (`data-tick` — без смены имени анимации CSS не перезапустил бы вспышку
     базы) и что уже записано в журнале. */
  (function initSystemMerge() {
    var merge = $('.system-merge');
    if (!merge) return;
    var sources = $$('.system-source', merge);
    var rows = $$('.system-log-row', merge);
    var order = ['client', 'staff', 'service'];
    var BEAT = 2400;
    var index = 0;
    var started = false;
    var visible = false;
    var queued = false;
    var timer = 0;
    var remaining = BEAT;
    var armedAt = 0;

    function show(i, instant) {
      index = i;
      var name = order[i];
      merge.dataset.beat = name;
      /* Первый такт тоже должен вспыхнуть, поэтому на старте тик не
         переключается, а выставляется: у атрибута меняется значение — этого
         достаточно, чтобы анимация началась. */
      merge.dataset.tick = instant ? 'a' : (merge.dataset.tick === 'a' ? 'b' : 'a');
      sources.forEach(function (el) {
        el.dataset.state = el.dataset.source === name ? 'active' : '';
      });
      /* Круг начинается с чистого журнала: прежние записи гаснут переходом. */
      rows.forEach(function (row, k) {
        row.dataset.state = k === i ? 'new' : (k < i ? 'written' : '');
      });
    }
    function rest() {
      /* Покой для статичного показа: все записи на месте, ничего не летит. */
      merge.dataset.beat = 'rest';
      merge.dataset.tick = '';
      sources.forEach(function (el) { el.dataset.state = ''; });
      rows.forEach(function (row) { row.dataset.state = 'written'; });
    }
    function pause() {
      if (!timer) return;
      window.clearTimeout(timer);
      timer = 0;
      remaining = Math.max(0, remaining - (performance.now() - armedAt));
    }
    function arm() {
      if (timer || !started || !visible || document.hidden || motionQuery.matches) return;
      armedAt = performance.now();
      timer = window.setTimeout(function () {
        timer = 0;
        show((index + 1) % order.length);
        remaining = BEAT;
        arm();
      }, remaining);
    }
    function syncMotion() {
      var active = visible && !document.hidden;
      merge.classList.toggle('motion-paused', !active || motionQuery.matches);
      if (motionQuery.matches) { pause(); rest(); return; }
      if (active) arm();
      else pause();
    }
    function checkVisibility() {
      if (queued) return;
      queued = true;
      window.requestAnimationFrame(function () {
        queued = false;
        var rect = merge.getBoundingClientRect();
        visible = rect.bottom > 0 && rect.top < window.innerHeight;
        if (!started && !document.hidden && visible && rect.top < window.innerHeight - Math.min(140, rect.height * .3)) {
          started = true;
          show(0, true);
          remaining = BEAT;
        }
        syncMotion();
      });
    }

    if (motionQuery.matches) rest(); else show(0, true);
    if ('IntersectionObserver' in window) new IntersectionObserver(checkVisibility, { threshold: [0, .25, .5] }).observe(merge);
    window.addEventListener('scroll', checkVisibility, { passive: true });
    window.addEventListener('resize', checkVisibility, { passive: true });
    document.addEventListener('visibilitychange', checkVisibility);
    if (motionQuery.addEventListener) motionQuery.addEventListener('change', function () { syncMotion(); checkVisibility(); });
    checkVisibility();
  })();

  /* ============================================================
     Световые дорожки и частицы в «Предложении»
     Двигаются готовые слои; маски и фон неподвижны.
     Пауза вне экрана, в скрытой вкладке и при reduced motion.
     ============================================================ */
  var orbStage = $('.orb-stage');
  if (orbStage) {
    var orbVisible = false;
    var orbVisibilityQueued = false;
    var syncOrbMotion = function () {
      orbStage.classList.toggle('idle', !orbVisible || document.hidden || motionQuery.matches);
    };
    var checkOrbVisibility = function () {
      if (orbVisibilityQueued) return;
      orbVisibilityQueued = true;
      window.requestAnimationFrame(function () {
        orbVisibilityQueued = false;
        var bounds = orbStage.parentNode.getBoundingClientRect();
        orbVisible = bounds.bottom > 0 && bounds.top < window.innerHeight;
        syncOrbMotion();
      });
    };
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(checkOrbVisibility).observe(orbStage.parentNode);
    }
    // После адаптивной перевёрстки и перехода по якорю IntersectionObserver
    // может вернуть старые координаты. Сверяем текущие, один раз за кадр
    // события; постоянного цикла отрисовки здесь нет.
    window.addEventListener('scroll', checkOrbVisibility, { passive: true });
    window.addEventListener('resize', checkOrbVisibility, { passive: true });
    document.addEventListener('visibilitychange', syncOrbMotion);
    if (motionQuery.addEventListener) motionQuery.addEventListener('change', syncOrbMotion);
    checkOrbVisibility();
  }

  /* Отзывы: две пары одинаковых лент. За кадром, при наведении и
     с клавиатурным фокусом движение стоит; на телефоне — ручной скролл. */
  (function initReviews() {
    var section = $('#reviews');
    if (!section) return;
    var toggle = $('.love-toggle', section);
    var rows = $$('.love-row', section);
    var mobile = window.matchMedia('(max-width: 700px)');
    var visible = false;
    var queued = false;

    $$('.love-track', section).forEach(function (track) {
      var copy = $('.love-group', track).cloneNode(true);
      copy.setAttribute('aria-hidden', 'true');
      copy.setAttribute('inert', '');
      track.appendChild(copy);
    });
    section.classList.add('is-ready');
    toggle.hidden = false;
    toggle.addEventListener('click', function () {
      var paused = section.classList.toggle('is-paused');
      toggle.setAttribute('aria-pressed', String(paused));
      $('span', toggle).textContent = paused ? 'Продолжить' : 'Приостановить';
    });
    function syncMotion() {
      section.classList.toggle('idle', !visible || document.hidden || motionQuery.matches);
    }
    function checkVisibility() {
      if (queued) return;
      queued = true;
      window.requestAnimationFrame(function () {
        queued = false;
        var bounds = section.getBoundingClientRect();
        visible = bounds.bottom > 0 && bounds.top < window.innerHeight;
        syncMotion();
      });
    }
    function resetScroll() {
      rows.forEach(function (row) { row.scrollLeft = 0; });
      syncMotion();
    }
    if ('IntersectionObserver' in window) new IntersectionObserver(checkVisibility).observe(section);
    window.addEventListener('scroll', checkVisibility, { passive: true });
    window.addEventListener('resize', checkVisibility, { passive: true });
    document.addEventListener('visibilitychange', syncMotion);
    if (motionQuery.addEventListener) motionQuery.addEventListener('change', resetScroll);
    if (mobile.addEventListener) mobile.addEventListener('change', resetScroll);
    checkVisibility();
  })();

  /* Автоматизация: дорожки платы ведут сигнал к чипу и уведомлению.
     Геометрия считается при resize; в кадре меняются только transform/opacity. */
  (function initSignalDemo() {
    var stage = $('.signal-stage');
    var scene = $('.signal-scene');
    if (!stage || !scene) return;
    var section = $('#automation');
    var routes = $('.signal-routes', stage);
    var energy = $('.signal-energy', stage);
    var boardEnergy = $('.signal-board-energy', stage);
    var animations = [];
    var duration = 12000;
    var elapsed = 0;
    var startedAt = 0;
    var running = false;
    var visible = false;
    var queued = false;
    var previousSize = '';
    var ns = 'http://www.w3.org/2000/svg';

    function svg(parent, tag, attrs) {
      var node = document.createElementNS(ns, tag);
      Object.keys(attrs).forEach(function (key) { node.setAttribute(key, attrs[key]); });
      parent.appendChild(node);
      return node;
    }
    function animate(node, frames) {
      var animation = node.animate(frames.map(function (frame) {
        return Object.assign({ offset: frame[0] / duration }, frame[1]);
      }), { duration: duration, iterations: Infinity, fill: 'both' });
      animation.pause();
      animation.currentTime = elapsed;
      animations.push(animation);
    }
    function fade(node, frames) {
      animate(node, frames.map(function (frame) { return [frame[0], { opacity: frame[1] }]; }));
    }
    function light(node, start, peak, end, strength) {
      fade(node, [[0, 0], [start, 0], [peak, strength], [end, 0], [duration, 0]]);
    }
    function path(points) {
      return points.map(function (p, i) { return (i ? 'L' : 'M') + p[0] + ' ' + p[1]; }).join(' ');
    }
    function flare(parent, point, start, peak, end, radius) {
      var fixed = svg(parent, 'g', { transform: 'translate(' + point.join(' ') + ')' });
      var glow = svg(fixed, 'g', { 'class': 'signal-flare' });
      svg(glow, 'circle', { r: radius, fill: 'url(#signalPulseFill)' });
      svg(glow, 'circle', { r: 2, fill: '#f2e5ff', opacity: .7 });
      light(glow, start, peak, end, .95);
      animate(glow, [[0, { transform: 'scale(.55)' }], [start, { transform: 'scale(.55)' }],
        [peak, { transform: 'scale(1)' }], [end, { transform: 'scale(1.6)' }], [duration, { transform: 'scale(1.6)' }]]);
    }
    function particle(parent, size) {
      var traveler = svg(parent, 'g', { 'class': 'signal-traveler' });
      svg(traveler, 'ellipse', { cx: -size * .3, rx: size * .8, ry: Math.min(7, size * .55), fill: 'url(#signalPulseFill)' });
      svg(traveler, 'path', { d: 'M-' + size + ' 0H0', stroke: 'url(#signalPulseTrail)', 'stroke-width': 1.8, 'stroke-linecap': 'round' });
      svg(traveler, 'circle', { r: Math.min(2.1, size * .25), fill: '#fff3ff' });
      return traveler;
    }
    function movement(points, start, end, stops) {
      var frames = stops ? [] : points.map(function (p, i) {
        var next = points[Math.min(i + 1, points.length - 1)];
        var prev = points[Math.max(0, i - 1)];
        var angle = Math.atan2(next[1] - prev[1], next[0] - prev[0]) * 180 / Math.PI;
        return [start + (end - start) * i / (points.length - 1), {
          transform: 'translate(' + p[0] + 'px,' + p[1] + 'px) rotate(' + angle + 'deg)'
        }];
      });
      if (stops) {
        // Одна частица на всю дорожку: направление меняется на повороте,
        // движение непрерывно, без перезапуска яркости.
        for (var i = 0; i < points.length - 1; i++) {
          var from = points[i], to = points[i + 1];
          var angle = Math.atan2(to[1] - from[1], to[0] - from[0]) * 180 / Math.PI;
          frames.push([stops[i], { transform: 'translate(' + from[0] + 'px,' + from[1] + 'px) rotate(' + angle + 'deg)' }]);
          frames.push([stops[i + 1] - .1, { transform: 'translate(' + to[0] + 'px,' + to[1] + 'px) rotate(' + angle + 'deg)' }]);
        }
      }
      return frames;
    }
    function routeTimes(points, start, end) {
      var distances = [0];
      for (var i = 1; i < points.length; i++) {
        distances.push(distances[i-1] + Math.hypot(points[i][0]-points[i-1][0], points[i][1]-points[i-1][1]));
      }
      return distances.map(function (distance) { return start + (end-start) * distance / distances[distances.length-1]; });
    }
    function travel(parent, points, start, end, strength, size, stops) {
      var traveler = particle(parent, size);
      var frames = movement(points, start, end, stops);
      animate(traveler, [[0, frames[0][1]]].concat(frames, [[duration, frames[frames.length - 1][1]]]));
      var fadeIn = Math.min(90, (end - start) * .22);
      var fadeOut = Math.min(60, (end - start) * .2);
      fade(traveler, [[0, 0], [start, 0], [start + fadeIn, strength], [end - fadeOut, strength], [end + fadeOut, 0], [duration, 0]]);
    }
    function stream(parent, points, options) {
      // Один SVG-элемент обслуживает весь поток на дорожке. Повторные
      // запросы заданы ключевыми кадрами общего цикла, без таймеров и rAF.
      var traveler = particle(parent, options.size);
      traveler.classList.add('signal-request');
      var frames = [], visibility = [[0, 0]], pass = 0;
      for (var start = options.start; start + options.flight + 40 <= options.until; start += options.flight + options.gap) {
        var end = start + options.flight;
        var lane = options.alternate && pass % 2 ? points.slice().reverse() : points;
        frames = frames.concat(movement(lane, start, end, routeTimes(lane, start, end)));
        visibility.push([start, 0], [start + 30, options.strength], [end - 35, options.strength], [end + 40, 0]);
        pass++;
      }
      animate(traveler, [[0, frames[0][1]]].concat(frames, [[duration, frames[frames.length - 1][1]]]));
      fade(traveler, visibility.concat([[duration, 0]]));
    }
    function line(parent, points, start, end, strength, width, tail) {
      var ray = svg(parent, 'path', { d: path(points), fill: 'none', stroke: '#d1b6ff', 'stroke-width': width, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
      light(ray, start, end, end + (tail == null ? 1100 : tail), strength);
    }
    function curve(a, b, mobile) {
      var points = [];
      for (var i = 0; i <= 14; i++) {
        var t = i / 14, u = 1 - t;
        var c1 = mobile ? [a[0], a[1] + (b[1] - a[1]) * .6] : [a[0] + (b[0] - a[0]) * .6, a[1]];
        var c2 = mobile ? [b[0], a[1] + (b[1] - a[1]) * .7] : [a[0] + (b[0] - a[0]) * .7, b[1]];
        points.push([u*u*u*a[0] + 3*u*u*t*c1[0] + 3*u*t*t*c2[0] + t*t*t*b[0], u*u*u*a[1] + 3*u*u*t*c1[1] + 3*u*t*t*c2[1] + t*t*t*b[1]]);
      }
      return points;
    }
    function pause() {
      if (!running) return;
      elapsed = (elapsed + performance.now() - startedAt) % duration;
      running = false;
      animations.forEach(function (animation) { animation.pause(); animation.currentTime = elapsed; });
    }
    function sync() {
      var active = visible && !document.hidden && !motionQuery.matches;
      stage.classList.toggle('motion-paused', !active);
      if (!active) pause();
      if (motionQuery.matches) {
        elapsed = 9600;
        animations.forEach(function (animation) { animation.currentTime = elapsed; });
      } else if (active && !running && animations.length) {
        startedAt = performance.now();
        running = true;
        var origin = document.timeline.currentTime - elapsed;
        animations.forEach(function (animation) { animation.play(); animation.startTime = origin; });
      }
    }
    function checkVisibility() {
      if (queued) return;
      queued = true;
      requestAnimationFrame(function () {
        queued = false;
        var rect = stage.getBoundingClientRect();
        visible = rect.bottom > 0 && rect.top < innerHeight;
        sync();
      });
    }
    function fit() {
      var width = stage.clientWidth;
      var mobile = innerWidth <= 700;
      var size = width + ':' + mobile;
      if (size === previousSize) return;
      previousSize = size;
      pause();
      animations.forEach(function (animation) { animation.cancel(); });
      animations = [];
      routes.replaceChildren(); energy.replaceChildren(); boardEnergy.replaceChildren();
      var scale = mobile ? Math.max(.7, Math.min(.9, width / 410)) : Math.min(1.12, width / 1000);
      scene.style.setProperty('--signal-scale', scale);
      if (!stage.animate) return;
      var bounds = scene.getBoundingClientRect();
      function port(selector) {
        var r = $(selector, stage).getBoundingClientRect();
        return [(r.left - bounds.left) / scale, (r.top - bounds.top) / scale];
      }
      var source = port('.signal-source-port');
      var result = port('.signal-result-port');
      function route(node) {
        return Array.from(node.points).map(function (p) { return [p.x,p.y]; });
      }
      var mode = mobile ? 'mobile' : 'desktop';
      var inputRoute = route($('.signal-chip-input[data-mode="'+mode+'"]', stage));
      var outputRoute = route($('.signal-chip-output[data-mode="'+mode+'"]', stage));
      var logic = route($('.signal-chip-logic', stage));
      var core = outputRoute[0];
      var entry = inputRoute[0];
      var merge = mobile ? [entry[0], entry[1] - 28] : [entry[0] - 40, entry[1]];
      var exit = outputRoute[outputRoute.length-1];
      [-1, 0, 1].forEach(function (lane, i) {
        var from = mobile ? [source[0] + lane * 38, source[1]] : [source[0], source[1] + lane * 33];
        var points = curve(from, merge, mobile);
        svg(routes, 'path', { d: path(points), stroke: '#af92e4', 'stroke-width': .6, opacity: .16 });
        travel(routes, points, 1250 + i * 300, 2500 + i * 160, .65, 18);
      });
      flare(routes, merge, 2250, 2820, 3450, 22);
      line(routes, [merge, entry], 2800, 3290, .6, 1.2);
      travel(routes, [merge, entry], 2920, 3500, 1, 32);

      // Быстрая обработка идёт по выгравированной схеме. Подводящие
      // дорожки и вывод к уведомлению сохраняют спокойный темп.
      line(energy, inputRoute, 3500, 4120, .65, 1.2, 350);
      travel(energy, inputRoute, 3500, 4120, 1, 18, routeTimes(inputRoute,3500,4120));
      var times = logic.map(function (_, i) { return i === logic.length-1 ? 7250 : 4120+i*120; });
      travel(energy, logic, times[0], 7250, 1, 10, times);
      for (var i = 0; i < logic.length-1; i++) {
        line(energy, [logic[i],logic[i+1]], times[i], times[i+1], .85, 1.1, 200);
      }
      for (var part = 0; part < 4; part += 2) {
        var segment = logic.slice(part*6, part === 3 ? logic.length : part*6+7);
        stream(energy, segment, {
          start: 4120+part*115, until: 7210, flight: 310+part*18,
          gap: 115, strength: .8, size: 6, alternate: false
        });
      }
      $$('.signal-chip-bus', stage).forEach(function (node, i) {
        if (i % 2) return;
        stream(boardEnergy, route(node), {
          start: 3790+(i*73)%480, until: 7160, flight: 280+(i%4)*35,
          gap: 90+(i%3)*30, strength: .85, size: 8, alternate: true
        });
      });
      $$('.signal-chip-bank', stage).forEach(function (node, i) {
        var frames = [[0,.18]];
        for (var turn = 0; turn < 3; turn++) {
          var start = 4120+i*180+turn*880;
          frames.push([start,.18],[start+100,.95],[start+330,.18]);
        }
        frames.push([duration,.18]); fade(node,frames);
      });
      fade($('.signal-chip-mark', stage), [[0,.4],[4120,.4],[7250,1],[8100,1],[9400,.4],[duration,.4]]);
      flare(energy, core, 6900, 7400, 8250, 32);
      line(energy, outputRoute, 7310, 7700, .85, 1.3);
      travel(energy, outputRoute, 7340, 7770, 1, 22, routeTimes(outputRoute,7340,7770));
      var outgoing = curve(exit, result, mobile);
      svg(routes, 'path', { d: path(outgoing), stroke: '#ae9bd4', 'stroke-width': .7, opacity: .1 });
      line(routes, outgoing, 7640, 8190, .75, 1.4);
      travel(routes, outgoing, 7720, 8400, 1, 42);
      flare(routes, result, 8170, 8500, 9090, 26);

      fade($('.signal-aura', stage), [[0,.075],[2800,.075],[4200,.16],[6800,.2],[7450,.34],[8500,.13],[11000,.075],[duration,.075]]);
      fade($('.signal-emission', stage), [[0,.045],[3300,.045],[4900,.1],[6800,.12],[7480,.22],[8500,.07],[11000,.045],[duration,.045]]);
      fade($('.signal-floor', stage), [[0,.1],[3000,.1],[7000,.4],[8100,.3],[10000,.1],[duration,.1]]);
      fade($('.signal-chip-core', stage), [[0,.08],[3500,.08],[4900,.25],[6800,.32],[7480,.6],[8500,.16],[duration,.08]]);
      fade($('.signal-bloom', stage), [[0,.015],[6900,.015],[7460,.55],[8300,.06],[10000,.015],[duration,.015]]);
      fade($('.signal-source', stage), [[0,0],[120,0],[700,1],[10900,1],[11600,0],[duration,0]]);
      fade($('.signal-event-first', stage), [[0,.25],[600,.9],[10400,.9],[11600,.25],[duration,.25]]);
      fade($('.signal-event-second', stage), [[0,.12],[450,.12],[1200,.95],[10400,.95],[11600,.12],[duration,.12]]);
      animate($('.signal-event-second', stage), [[0,{transform:'translateX(-8px)'}],[450,{transform:'translateX(-8px)'}],[1200,{transform:'translateX(0)'}],[10400,{transform:'translateX(0)'}],[11600,{transform:'translateX(-8px)'}],[duration,{transform:'translateX(-8px)'}]]);
      fade($('.signal-received', stage), [[0,.1],[800,.1],[1550,.85],[3400,.85],[4400,.3],[10500,.3],[11600,.1],[duration,.1]]);
      var scan = $('.signal-source-scan', stage);
      var sourceWidth = $('.signal-source-card', stage).clientWidth + 30;
      light(scan, 500, 1100, 1750, 1);
      animate(scan, [[0,{transform:'translateX(0)'}],[500,{transform:'translateX(0)'}],[1750,{transform:'translateX('+sourceWidth+'px)'}],[duration,{transform:'translateX('+sourceWidth+'px)'}]]);
      fade($('.signal-source-rule', stage), [[0,.45],[1100,.45],[1750,1],[3300,1],[4500,.6],[11000,.6],[duration,.45]]);

      var messageWidth = $('.signal-message', stage).clientWidth + 30;
      var messageScan = $('.signal-message-scan', stage);
      fade($('.signal-message', stage), [[0,.18],[8170,.18],[8600,1],[10900,1],[11600,.18],[duration,.18]]);
      light(messageScan, 8280, 8570, 9010, .9);
      animate(messageScan, [[0,{transform:'translateX(0)'}],[8280,{transform:'translateX(0)'}],[9010,{transform:'translateX('+messageWidth+'px)'}],[duration,{transform:'translateX('+messageWidth+'px)'}]]);
      fade($('.signal-message-border', stage), [[0,.06],[8230,.06],[8620,.85],[10600,.6],[11500,.06],[duration,.06]]);
      fade($('.signal-message-glow', stage), [[0,0],[8170,0],[8520,.65],[9250,.16],[10800,.16],[11500,0],[duration,0]]);
      fade($('.signal-message-header', stage), [[0,0],[8470,0],[8880,1],[10900,1],[11600,0],[duration,0]]);
      fade($('.signal-message-text', stage), [[0,0],[8590,0],[9130,1],[10900,1],[11600,0],[duration,0]]);
      fade($('.signal-result .signal-node-label', stage), [[0,.55],[8280,.55],[9030,1],[10800,1],[11600,.55],[duration,.55]]);
      $$('.signal-steps li', section).forEach(function (step, i) {
        var on = [500,3500,8250][i], off = [3350,7850,10900][i];
        fade(step, [[0,.4],[on,.4],[on+450,1],[off,1],[off+700,.4],[duration,.4]]);
      });
      stage.classList.add('is-ready');
      sync(); checkVisibility();
    }
    if ('ResizeObserver' in window) new ResizeObserver(fit).observe(stage);
    window.addEventListener('resize', function () { fit(); checkVisibility(); }, { passive: true });
    window.addEventListener('scroll', checkVisibility, { passive: true });
    document.addEventListener('visibilitychange', function () { sync(); checkVisibility(); });
    motionQuery.addEventListener('change', function () { sync(); checkVisibility(); });
    if ('IntersectionObserver' in window) new IntersectionObserver(checkVisibility).observe(stage);
    fit(); checkVisibility();
  })();


  /* Релизы: спокойный цикл с паузой на готовом результате.
     Один таймер сохраняет фазу и остаток задержки вне экрана. */
  (function initReleaseDemo() {
    var demo = $('.release-demo');
    if (!demo) return;
    var steps = $$('.release-step', demo);
    var notes = $$('.release-step-note', demo);
    var phase = 'ready';
    var started = false;
    var visible = false;
    var queued = false;
    var timer = 0;
    var remaining = 0;
    var armedAt = 0;
    var phases = {
      ready:    [['pending', 'pending', 'idle'], ['Ожидание', 'Ожидание', 'Текущая версия']],
      checks:   [['active', 'pending', 'idle'], ['Проверяем', 'Ожидание', 'Текущая версия']],
      transfer: [['done', 'pending', 'idle'], ['Пройдено', 'Доставка', 'Текущая версия']],
      launch:   [['done', 'active', 'idle'], ['Пройдено', 'Запускаем', 'Текущая версия']],
      deliver:  [['done', 'done', 'active'], ['Пройдено', 'Запущено', 'Новая версия']],
      live:     [['done', 'done', 'done'], ['Пройдено', 'Запущено', 'Новая версия']]
    };
    var sequence = ['ready', 'checks', 'transfer', 'launch', 'deliver', 'live'];
    var timing = { ready: 1000, checks: 2600, transfer: 1500, launch: 2300, deliver: 1600, live: 1000 };
    /* Подписи сменяются небольшим падением. Новая строка сразу встаёт в поток
       на итоговое место и опускается в него сверху; прежняя закрепляется
       поверх в своих координатах, скрыта от скринридера, уходит вниз и
       удаляется по концу анимации. */
    function setText(el, text, instant) {
      var current = el.querySelector('.release-text:not(.is-leaving)');
      if ((current ? current.textContent : el.textContent) === text) return;
      $$('.release-text.is-leaving', el).forEach(function (node) { node.remove(); });
      var incoming = document.createElement('span');
      incoming.className = 'release-text';
      incoming.textContent = text;
      if (instant || !current || motionQuery.matches) {
        el.textContent = '';
        el.appendChild(incoming);
        return;
      }
      var old = current.getBoundingClientRect();
      current.classList.add('is-leaving');
      current.setAttribute('aria-hidden', 'true');
      current.style.width = old.width + 'px';
      current.addEventListener('animationend', function () { current.remove(); }, { once: true });
      incoming.classList.add('is-entering');
      incoming.addEventListener('animationend', function () { incoming.classList.remove('is-entering'); }, { once: true });
      el.appendChild(incoming);
      var box = el.getBoundingClientRect();
      current.style.left = (old.left - box.left) + 'px';
      current.style.top = (old.top - box.top) + 'px';
    }
    function show(next, instant) {
      phase = next;
      demo.dataset.phase = next;
      var view = phases[next];
      steps.forEach(function (step, i) {
        step.dataset.state = view[0][i];
        if (view[0][i] === 'active') step.setAttribute('aria-current', 'step');
        else step.removeAttribute('aria-current');
        setText(notes[i], view[1][i], instant);
      });
    }
    function pause() {
      if (!timer) return;
      window.clearTimeout(timer);
      timer = 0;
      remaining = Math.max(0, remaining - (performance.now() - armedAt));
    }
    function arm() {
      if (timer || !started || !visible || document.hidden || motionQuery.matches) return;
      armedAt = performance.now();
      timer = window.setTimeout(function () {
        timer = 0;
        advance();
      }, remaining);
    }
    function advance() {
      if (phase === 'live') {
        /* Выпущенная версия становится текущей для следующего круга.
           Она остаётся видимой; следующая рисуется поверх неё. */
        var previous = $('.release-version-old', demo);
        var next = $('.release-version-new', demo);
        next.classList.replace('release-version-new', 'release-version-old');
        previous.classList.replace('release-version-old', 'release-version-new');
        next.parentNode.insertBefore(next, previous);
      }
      show(sequence[(sequence.indexOf(phase) + 1) % sequence.length]);
      remaining = timing[phase];
      arm();
    }
    function syncMotion() {
      var active = visible && !document.hidden;
      demo.classList.toggle('motion-paused', !active || motionQuery.matches);
      if (motionQuery.matches) {
        pause();
        if (phase !== 'live') show('live');
        remaining = timing.live;
        return;
      }
      if (active) arm();
      else pause();
    }
    function checkVisibility() {
      if (queued) return;
      queued = true;
      window.requestAnimationFrame(function () {
        queued = false;
        var rect = demo.getBoundingClientRect();
        visible = rect.bottom > 0 && rect.top < window.innerHeight;
        if (!started && !document.hidden && visible && rect.top < window.innerHeight - Math.min(160, rect.height * .3)) started = true;
        syncMotion();
      });
    }
    show(motionQuery.matches ? 'live' : 'ready', true);
    remaining = timing[phase];
    if ('IntersectionObserver' in window) new IntersectionObserver(checkVisibility, { threshold: [0, .25, .5] }).observe(demo);
    window.addEventListener('scroll', checkVisibility, { passive: true });
    window.addEventListener('resize', checkVisibility, { passive: true });
    document.addEventListener('visibilitychange', function () { syncMotion(); checkVisibility(); });
    motionQuery.addEventListener('change', function () { syncMotion(); checkVisibility(); });
    checkVisibility();
  })();

  /* ============================================================
     Декоративные CSS-анимации: пауза вне экрана и в скрытой вкладке.
     Наблюдаем неподвижные обёртки, чтобы движущийся потомок не выключал
     сам себя. Небольшой запас запускает эффект до появления его свечения.
     play-state сохраняет фазу, в том числе общую фазу луча и отметок радара.
     ============================================================ */
  (function initMotionVisibility() {
    var scopes = $$('.hero-rim, .hero-flow, .pulse, .portfolio-card, .stack-display, .button-lit, .radar-stage, .mk-cv, .work, .strata-projector, .strata-selector');
    var visible = new Set(scopes);
    var sync = function () {
      scopes.forEach(function (el) {
        el.classList.toggle('motion-paused', document.hidden || !visible.has(el));
      });
    };
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) visible.add(entry.target);
          else visible.delete(entry.target);
        });
        sync();
      }, { rootMargin: '120px' });
      scopes.forEach(function (el) { observer.observe(el); });
    }
    document.addEventListener('visibilitychange', sync);
    sync();
  })();

  /* ============================================================
     Видео: сохраняем кадр и позицию на паузе, продолжаем при возвращении
     ============================================================ */
  (function initVideoVisibility() {
    var videos = $$('video');
    if (!videos.length) return;
    var observed = 'IntersectionObserver' in window;
    var visible = new Set(observed ? [] : videos);
    var sync = function () {
      videos.forEach(function (v) {
        if (!visible.has(v) || document.hidden || motionQuery.matches) {
          v.pause();
        } else if (v.paused) {
          var p = v.play();
          if (p && p.catch) p.catch(function () { /* запрет автозапуска или пауза до готовности видео */ });
        }
      });
    };
    // Запуском управляет видимость: autoplay не должен обойти паузу,
    // если файл догрузился уже после ухода со страницы или из блока.
    videos.forEach(function (v) { v.removeAttribute('autoplay'); });
    if (observed) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) visible.add(entry.target);
          else visible.delete(entry.target);
        });
        sync();
      }, { threshold: 0.05 });
      videos.forEach(function (v) { observer.observe(v); });
    }
    document.addEventListener('visibilitychange', sync);
    if (motionQuery.addEventListener) motionQuery.addEventListener('change', sync);
    sync();
  })();

  /* ============================================================
     Ваша задача: вкладки меняют текст и слои одного приложения.
     Автопереключения нет: сценарий остаётся выбранным, пока его читают.
     ============================================================ */
  (function initWorkScenarios() {
    var section = $('#work');
    if (!section) return;
    var tablist = $('.work-tabs', section);
    var tabs = $$('.work-tab', section);
    var panels = $$('.work-panel', section);
    if (!tablist || !tabs.length) return;

    function selectTab(index, focus) {
      var selected = tabs[index];
      section.dataset.scenario = selected.dataset.scenario;
      tablist.style.setProperty('--tab-index', index);
      tabs.forEach(function (tab) {
        var active = tab === selected;
        tab.setAttribute('aria-selected', String(active));
        tab.tabIndex = active ? 0 : -1;
      });
      panels.forEach(function (panel) {
        panel.hidden = panel.id !== selected.getAttribute('aria-controls');
      });
      if (focus) selected.focus({ preventScroll: true });
    }

    tabs.forEach(function (tab, index) {
      tab.addEventListener('click', function () { selectTab(index, false); });
      tab.addEventListener('keydown', function (event) {
        var next;
        if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
        else if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = tabs.length - 1;
        else return;
        event.preventDefault();
        selectTab(next, true);
      });
    });
  })();

  /* ============================================================
     Услуги: выбранный слой выезжает со своей SVG-голограммой.
     Плита и проекция двигаются одним контейнером. Автоперебора нет.
     ============================================================ */
  (function initServiceStrata() {
    var strata = $('.strata');
    if (!strata) return;
    var tabs = $$('.strata-tab', strata);
    var panels = $$('.strata-panel', strata);
    var plates = $$('.strata-plate', strata);
    var layers = $$('.strata-layer', strata);
    var glows = $$('.strata-glow', strata);
    var holograms = $$('.strata-hologram', strata);
    var legend = $('.strata-legend', strata);
    var selector = $('.strata-selector', strata);
    var projector = $('.strata-projector', strata);
    var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    var projectionFrame = 0;
    var projectionTimer = 0;
    var lookFrame = 0;
    var lookX = 0;
    var lookY = 0;
    var selected = +strata.dataset.active || 0;
    if (!tabs.length || !projector) return;

    /* Кромка использует размеры сетки, включая её переносы. Пересчёт нужен
       только при выборе или изменении ширины, без покадровых замеров. */
    function syncCursor() {
      if (!selector) return;
      var columns = parseInt(window.getComputedStyle(legend).getPropertyValue('--strata-columns'), 10) || tabs.length;
      selector.style.setProperty('--strata-column', selected % columns);
      selector.style.setProperty('--strata-row', Math.floor(selected / columns));
    }
    if (selector && 'ResizeObserver' in window) {
      var selectorObserver = new ResizeObserver(syncCursor);
      selectorObserver.observe(legend);
    } else {
      window.addEventListener('resize', syncCursor, { passive: true });
    }

    /* Параллакс затрагивает только рисунок голограммы. Луч, плита и кнопки
       сохраняют координаты; без движения указателя нет покадровой работы. */
    function canLook() {
      return finePointer.matches && !motionQuery.matches && !document.hidden
        && !projector.classList.contains('motion-paused');
    }
    function resetLook() {
      window.cancelAnimationFrame(lookFrame);
      lookFrame = 0;
      lookX = lookY = 0;
      projector.style.removeProperty('--look-x');
      projector.style.removeProperty('--look-y');
    }
    projector.addEventListener('pointermove', function (event) {
      if (event.pointerType === 'touch' || !canLook()) return;
      var rect = projector.getBoundingClientRect();
      lookX = Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1));
      lookY = Math.max(-1, Math.min(1, (event.clientY - rect.top) / rect.height * 2 - 1));
      if (lookFrame) return;
      lookFrame = window.requestAnimationFrame(function () {
        lookFrame = 0;
        if (!canLook()) { resetLook(); return; }
        projector.style.setProperty('--look-x', lookX.toFixed(3));
        projector.style.setProperty('--look-y', lookY.toFixed(3));
      });
    }, { passive: true });
    projector.addEventListener('pointerleave', resetLook);
    projector.addEventListener('pointercancel', resetLook);
    finePointer.addEventListener('change', resetLook);
    motionQuery.addEventListener('change', resetLook);
    document.addEventListener('visibilitychange', function () { if (document.hidden) resetLook(); });
    if ('IntersectionObserver' in window) {
      var lookObserver = new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting) resetLook();
      });
      lookObserver.observe(projector);
    }

    function project() {
      window.cancelAnimationFrame(projectionFrame);
      window.clearTimeout(projectionTimer);
      strata.classList.remove('is-projecting');
      if (motionQuery.matches) return;
      /* Два кадра сбрасывают однократную анимацию без принудительного layout.
         Быстрое переключение отменяет предыдущий запуск. */
      projectionFrame = window.requestAnimationFrame(function () {
        projectionFrame = window.requestAnimationFrame(function () {
          strata.classList.add('is-projecting');
          projectionTimer = window.setTimeout(function () { strata.classList.remove('is-projecting'); }, 1750);
        });
      });
    }

    function select(index, focus) {
      var changed = selected !== index;
      selected = index;
      strata.dataset.active = index;
      tabs.forEach(function (tab, i) {
        tab.setAttribute('aria-selected', String(i === index));
        tab.tabIndex = i === index ? 0 : -1;
      });
      panels.forEach(function (panel, i) { panel.classList.toggle('is-on', i === index); });
      function setLayerState(layer) {
        layer.classList.toggle('is-on', +layer.dataset.i === index);
      }
      layers.forEach(function (layer) {
        setLayerState(layer);
        layer.classList.toggle('is-near', Math.abs(+layer.dataset.i - index) === 1);
      });
      plates.forEach(setLayerState);
      glows.forEach(setLayerState);
      holograms.forEach(function (h) { h.classList.toggle('is-on', +h.dataset.i === index); });
      syncCursor();
      if (changed) project();
      if (focus) tabs[index].focus({ preventScroll: true });
    }

    tabs.forEach(function (tab, index) {
      tab.addEventListener('click', function () { select(index, false); });
      tab.addEventListener('keydown', function (event) {
        var next;
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
          /* Число колонок берётся из CSS: стрелки сохраняют колонку
             и после переноса переключателя в несколько рядов. */
          var columns = parseInt(window.getComputedStyle(legend).getPropertyValue('--strata-columns'), 10) || tabs.length;
          if (columns >= tabs.length) return;
          var column = index % columns;
          var lastInColumn = tabs.length - 1;
          while (lastInColumn % columns !== column) lastInColumn--;
          next = event.key === 'ArrowDown'
            ? (index + columns < tabs.length ? index + columns : column)
            : (index >= columns ? index - columns : lastInColumn);
        }
        else if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
        else if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = tabs.length - 1;
        else return;
        event.preventDefault();
        select(next, true);
      });
    });

    /* по самой стопке тоже кликается: плиты перекрывают друг друга сверху
       вниз, поэтому событие ловит именно та, чей край видно под курсором */
    plates.forEach(function (plate) {
      plate.addEventListener('click', function () { select(+plate.dataset.i, false); });
    });

    select(+strata.dataset.active || 0, false);
    window.requestAnimationFrame(function () { if (selector) selector.classList.add('is-ready'); });
  })();

  /* ============================================================
     Ключи: расшифровка заголовка

     Поле шифротекста — ролик в разметке (assets/crypt-*.webm), скрипту
     остаётся только текст. Собирать поле знаками пробовали: см. README,
     раздел «Поле шифротекста в „Ключах“».
     ============================================================ */
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
  var MAIL_TO = 'akirakawashikz@gmail.com';
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
     сайта: насыщенный фиолетовый и светлая лаванда.

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

    // Палитру читаем один раз: вычисление стилей не попадает в кадр.
    var paletteStyle = getComputedStyle(document.documentElement);
    var paletteRgb = function (name) {
      return paletteStyle.getPropertyValue(name).trim().split(',').map(Number);
    };
    var VIOLET = { hot: paletteRgb('--text-rgb'), mid: paletteRgb('--accent-rgb'), deep: paletteRgb('--accent-deep-rgb') };
    var LAVENDER = { hot: paletteRgb('--text-rgb'), mid: paletteRgb('--accent-hi-rgb'), deep: paletteRgb('--accent-rgb') };

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

        var pal = w1 > w2 ? VIOLET : LAVENDER;
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

    var visible = false, frame = 0, last = 0, previous = null, elapsed = 0;
    var stop = function () {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      last = 0;
      previous = null;
    };
    var tick = function (now) {
      frame = 0;
      if (!visible || document.hidden || motionQuery.matches) { stop(); return; }
      if (previous !== null) elapsed += now - previous;
      previous = now;
      if (!last || now - last >= 1000 / FPS) {
        last = now;
        paint(phaseAt(elapsed));
        setScreen(elapsed);
      }
      frame = window.requestAnimationFrame(tick);
    };
    var sync = function () {
      if (!visible || document.hidden) { stop(); return; }
      if (!build()) return;
      glowCanvas.parentNode.classList.add('has-glow');
      if (motionQuery.matches) { stop(); paint(0); setScreen(0); return; }
      if (!frame) frame = window.requestAnimationFrame(tick);
    };

    if (!('IntersectionObserver' in window)) {
      visible = true;
      sync();
    } else {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        sync();
      }, { rootMargin: '120px' }).observe(glowCanvas.parentNode);
    }

    document.addEventListener('visibilitychange', sync);
    if (motionQuery.addEventListener) motionQuery.addEventListener('change', sync);
    window.addEventListener('load', sync);
    var glowQueued = false;
    window.addEventListener('resize', function () {
      if (glowQueued) return;
      glowQueued = true;
      window.requestAnimationFrame(function () {
        glowQueued = false;
        if (!visible || document.hidden) return;
        if (build()) {
          var t = motionQuery.matches ? 0 : elapsed;
          paint(phaseAt(t));
          setScreen(t);
          sync();
        }
      });
    }, { passive: true });
  }

})();
