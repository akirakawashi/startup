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

  /* Пыль у шпиля: готовые слои движутся только пока поле видно. */
  (function initSpireMotion() {
    var stage = $('.spire-stage');
    if (!stage) return;
    var visible = false;
    var sync = function () {
      stage.classList.toggle('idle', !visible || document.hidden || motionQuery.matches);
    };
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        sync();
      }).observe($('.spire-stars', stage));
    } else {
      visible = true;
      sync();
    }
    document.addEventListener('visibilitychange', sync);
    if (motionQuery.addEventListener) motionQuery.addEventListener('change', sync);
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

  /* ============================================================
     Бегущая строка: дублируем содержимое ради бесшовного цикла
     ============================================================ */
  var marquee = $('#marqueeTrack');
  if (marquee && !reduceMotion) {
    marquee.innerHTML = marquee.innerHTML + marquee.innerHTML;
  }

  /* ============================================================
     Призма автоматизации: один масштаб для стекла, нитей и импульсов
     ============================================================ */
  (function initSignalSize() {
    var stage = $('.signal-stage');
    var scene = $('.signal-scene');
    if (!stage || !scene) return;
    // SVG и импульсы используют одну систему координат 1000 × 440.
    // На телефоне немного обрезаем дальние концы нитей, сохраняя размер призмы.
    var fit = function () {
      scene.style.setProperty('--signal-scale', Math.max(.55, Math.min(1.12, stage.clientWidth / 1000)));
    };
    if ('ResizeObserver' in window) new ResizeObserver(fit).observe(stage);
    else window.addEventListener('resize', fit, { passive: true });
    fit();
    stage.classList.add('is-ready');
  })();

  /* ============================================================
     Декоративные CSS-анимации: пауза вне экрана и в скрытой вкладке.
     Наблюдаем неподвижные обёртки, чтобы движущийся потомок не выключал
     сам себя. Небольшой запас запускает эффект до появления его свечения.
     play-state сохраняет фазу, в том числе общую фазу луча и отметок радара.
     ============================================================ */
  (function initMotionVisibility() {
    var scopes = $$('.hero-rim, .pulse, .marquee, .portfolio-card, .stack-display, .button-lit, .radar-stage, .mk-cv, .signal-stage, .work, .strata-plane');
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
     Услуги: разрез проекта. Вкладка выбирает слой стопки — у него меняются
     заливки граней, под ним включается уже готовое пятно света, и на его
     высоту переезжает блик. Пересчётов нет: два класса и одна переменная.
     Автоперебора нет намеренно, как и у вкладок «Ваша задача»: выбранный
     слой стоит, пока его читают.
     ============================================================ */
  (function initServiceStrata() {
    var strata = $('.strata');
    if (!strata) return;
    var tabs = $$('.strata-tab', strata);
    var panels = $$('.strata-panel', strata);
    var plates = $$('.strata-plate', strata);
    var glows = $$('.strata-glow', strata);
    if (!tabs.length) return;

    function select(index, focus) {
      strata.dataset.active = index;
      /* высота плиты живёт в разметке рядом с её путями, а не в скрипте:
         одно место правки, если геометрия сдвинется */
      var plate = plates.filter(function (p) { return +p.dataset.i === index; })[0];
      if (plate) strata.style.setProperty('--sy', plate.dataset.y);

      tabs.forEach(function (tab, i) {
        tab.setAttribute('aria-selected', String(i === index));
        tab.tabIndex = i === index ? 0 : -1;
      });
      panels.forEach(function (panel, i) { panel.classList.toggle('is-on', i === index); });
      plates.forEach(function (p) { p.classList.toggle('is-on', +p.dataset.i === index); });
      glows.forEach(function (g) { g.classList.toggle('is-on', +g.dataset.i === index); });
      if (focus) tabs[index].focus({ preventScroll: true });
    }

    tabs.forEach(function (tab, index) {
      tab.addEventListener('click', function () { select(index, false); });
      tab.addEventListener('keydown', function (event) {
        var next;
        if (event.key === 'ArrowDown') next = (index + 1) % tabs.length;
        else if (event.key === 'ArrowUp') next = (index + tabs.length - 1) % tabs.length;
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
