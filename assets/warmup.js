/* VoidLabs — подготовка ресурсов между кадрами, без запуска скрытых анимаций. */
(function () {
  'use strict';

  var jobs = [], handle = 0, mediaRunning = 0, order = 0, started = false;
  var motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var connection = navigator.connection;
  var idle = typeof window.requestIdleCallback === 'function';
  var observer = null, resizeTimer = 0;

  function limitedConnection() {
    return connection && (connection.saveData || /(^|-)2g$/.test(connection.effectiveType));
  }

  function nextJob() {
    var ready = jobs.filter(function (job) {
      return job.state === 'queued' && (!job.motion || !motion.matches) &&
        (!job.media || mediaRunning < 2) &&
        (!job.media || job.near || !limitedConnection());
    });
    ready.sort(function (a, b) {
      if (a.near !== b.near) return a.near ? -1 : 1;
      return a.order - b.order;
    });
    return ready[0];
  }

  function schedule() {
    if (!started || handle || document.hidden || !nextJob()) return;
    handle = idle ? window.requestIdleCallback(run, { timeout: 1200 }) : window.setTimeout(run, 80);
  }

  function finish(job, result) {
    if (job.media) mediaRunning--;
    job.state = result === false || job.again ? 'queued' : 'done';
    job.again = false;
    job.order = ++order;
    schedule();
  }

  function run(deadline) {
    handle = 0;
    if (document.hidden) return;
    var job = nextJob();
    if (!job) return;
    var until = performance.now() + 6;
    var budget = { timeRemaining: function () {
      var remaining = Math.max(0, until - performance.now());
      return deadline && !deadline.didTimeout ? Math.min(remaining, deadline.timeRemaining()) : remaining;
    } };
    if (budget.timeRemaining() < 1) { schedule(); return; }
    job.state = 'running';
    if (job.media) mediaRunning++;
    try {
      var result = job.prepare(budget);
      if (result && typeof result.then === 'function') {
        result.then(function () { finish(job); }, function () { finish(job); });
        schedule();
      } else finish(job, result);
    } catch (error) {
      // Ошибка прогрева не блокирует обычную загрузку и показ секции.
      finish(job);
    }
  }

  function add(element, prepare, options) {
    options = options || {};
    var bounds = element.getBoundingClientRect();
    var margin = Math.max(600, window.innerHeight * 1.5);
    var job = {
      element: element, prepare: prepare, state: 'queued', order: ++order,
      near: bounds.bottom > -margin && bounds.top < window.innerHeight + margin,
      media: !!options.media, motion: !!options.motion, again: false
    };
    jobs.push(job);
    if (observer) observer.observe(element);
    schedule();
    return function invalidate() {
      if (job.state === 'running') job.again = true;
      else job.state = 'queued';
      schedule();
    };
  }

  function observeAhead() {
    if (observer) observer.disconnect();
    if (!('IntersectionObserver' in window)) return;
    observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        jobs.forEach(function (job) {
          if (job.element === entry.target) job.near = entry.isIntersecting;
        });
      });
      schedule();
    }, { rootMargin: Math.max(600, window.innerHeight * 1.5) + 'px 0px' });
    jobs.forEach(function (job) { observer.observe(job.element); });
  }

  function prepareImage(img) {
    return new Promise(function (resolve) {
      var timer;
      function finishImage() {
        clearTimeout(timer);
        img.removeEventListener('load', decode);
        img.removeEventListener('error', finishImage);
        resolve();
      }
      function decode() {
        if (img.decode) img.decode().then(finishImage, finishImage);
        else finishImage();
      }
      img.addEventListener('load', decode, { once: true });
      img.addEventListener('error', finishImage, { once: true });
      timer = setTimeout(finishImage, 8000);
      img.decoding = 'async';
      img.loading = 'eager';
      if (img.complete) decode();
    });
  }

  function prepareVideo(video) {
    // Меняем только подсказку загрузки, даже если первый кадр уже получен.
    // load()/play() сбросили бы позицию или запустили скрытый ролик.
    video.preload = 'auto';
    if (video.readyState >= 2) return;
    return new Promise(function (resolve) {
      var timer;
      function finishVideo() {
        clearTimeout(timer);
        video.removeEventListener('loadeddata', finishVideo);
        video.removeEventListener('error', finishVideo);
        resolve();
      }
      video.addEventListener('loadeddata', finishVideo, { once: true });
      video.addEventListener('error', finishVideo, { once: true });
      timer = setTimeout(finishVideo, 8000);
    });
  }

  window.VoidLabsWarmup = { add: add };
  observeAhead();
  Array.prototype.forEach.call(document.querySelectorAll('img'), function (img) {
    add(img, function () { return prepareImage(img); }, { media: true });
  });
  Array.prototype.forEach.call(document.querySelectorAll('video'), function (video) {
    add(video, function () { return prepareVideo(video); }, { media: true, motion: true });
  });

  // Первый экран получает приоритет до старта фоновой очереди.
  var heroVideo = document.getElementById('heroVideo');
  if (heroVideo && !motion.matches) heroVideo.preload = 'auto';

  function start() {
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () { started = true; schedule(); });
    });
  }
  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start, { once: true });
  document.addEventListener('visibilitychange', function () {
    if (document.hidden && handle) {
      if (idle) window.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
      handle = 0;
    } else schedule();
  });
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(observeAhead, 150);
  }, { passive: true });
  if (motion.addEventListener) motion.addEventListener('change', schedule);
  if (connection && connection.addEventListener) connection.addEventListener('change', schedule);
})();
