// ─── i18n ───────────────────────────────────────────────────────────────────
const i18n = {
    ru: {
        "nav.services": "Услуги", "nav.process": "Процесс", "nav.projects": "Проекты",
        "nav.team": "Команда", "nav.contact": "Контакт", "nav.cta": "Обсудить проект",
        "hero.eyebrow": "backend / infra / product delivery",
        "hero.title1": "Собираю", "hero.title2": "веб-продукты", "hero.title3": "от ТЗ до production",
        "hero.text": "Я беру проект целиком: помогаю собрать требования, проектирую API и данные, пишу backend, при необходимости закрываю frontend, а потом довожу релиз до Docker, CI/CD и нормального production.",
        "hero.btn.services": "Что я делаю", "hero.btn.projects": "Смотреть кейс",
        "hero.badge.contract": "Договор и NDA", "hero.badge.ci": "CI/CD без ручной рутины",
        "hero.panel.top": "до первого рабочего прототипа после фиксации задачи",
        "hero.panel.bottom": "один контур: код, инфраструктура, релиз и поддержка",
        "services.kicker": "01 / чем занимаюсь", "services.title": "Что беру на себя",
        "services.desc": "Обычно я подключаюсь там, где нужен человек, который доведет продукт до релиза, а не остановится на макетах или одном слое системы.",
        "services.discovery.title": "Разбор задачи и первый план",
        "services.discovery.desc": "На старте раскладываю задачу по частям: что нужно в первом релизе, где риски и что можно не делать сейчас.",
        "services.discovery.li1": "Требования и узкие места", "services.discovery.li2": "План первого релиза", "services.discovery.li3": "Оценка сроков и этапов",
        "services.architecture.title": "ТЗ, API и архитектура",
        "services.architecture.desc": "Собираю технический контур проекта: сценарии, схемы данных, интеграции и точки, в которых система будет расти дальше.",
        "services.architecture.li1": "ТЗ по ключевым модулям", "services.architecture.li2": "API-контракты и схема данных", "services.architecture.li3": "Архитектура без лишнего оверинжиниринга",
        "services.build.title": "Разработка frontend и backend",
        "services.build.desc": "Делаю рабочие итерации. После каждого этапа у вас есть не статус-репорт, а кусок продукта, который можно смотреть и обсуждать.",
        "services.build.li1": "React/Vite и FastAPI", "services.build.li2": "Code review, тесты, чистый API", "services.build.li3": "Демо по готовым этапам",
        "services.deploy.title": "Инфраструктура, Docker и CI/CD",
        "services.deploy.desc": "Собираю контейнеры, настраиваю окружения и автоматизирую выкладку, чтобы релиз не зависел от ручных шагов.",
        "services.deploy.li1": "Docker, Compose, Nginx, VPS", "services.deploy.li2": "CI/CD и предсказуемые релизы", "services.deploy.li3": "Логи, мониторинг и базовая эксплуатация",
        "services.ai.title": "AI-интеграции без шума",
        "services.ai.desc": "Подключаю модели там, где они реально экономят время: в поиске, классификации, генерации, ассистентах и автоматизации.",
        "services.ai.li1": "GPT/ML интеграции", "services.ai.li2": "Prompt/system design", "services.ai.li3": "Пайплайны и проверка качества",
        "services.support.title": "Поддержка после запуска",
        "services.support.desc": "После релиза не исчезаю. Закрываю фиксы, доработки и технические хвосты, пока продукт уже живет в работе.",
        "services.support.li1": "Фиксы и сопровождение", "services.support.li2": "План следующих итераций", "services.support.li3": "Документация и handoff",
        "services.snap.legal.title": "Рабочий контур", "services.snap.legal.desc": "Договор, NDA, этапы и понятные зоны ответственности.",
        "services.snap.docs.title": "Документация", "services.snap.docs.desc": "Swagger, схемы, runbooks и короткие инструкции, чтобы проект не жил только в голове.",
        "services.snap.infra.title": "Инфраструктура", "services.snap.infra.desc": "Резервные копии, базовая безопасность и подготовка к росту нагрузки.",
        "services.snap.own.desc": "Один человек отвечает за весь маршрут: от задачи до релиза.",
        "process.kicker": "02 / как иду по проекту", "process.title": "Как строю работу",
        "process.desc": "Процесс простой: сначала фиксируем, что именно делаем, потом собираем, тестируем и выкатываем. Без длинных пауз и без сюрпризов в конце.",
        "process.step1.title": "Созвон и разбор задачи", "process.step1.desc": "Собираю контекст: цель, сроки, ограничения, интеграции и то, что уже есть на руках.",
        "process.step2.title": "ТЗ и технический контур", "process.step2.desc": "Фиксирую user-flow, API, данные и структуру первой версии продукта.",
        "process.step3.title": "План, сроки и старт", "process.step3.desc": "Согласуем этапы, стоимость и формат работы. После этого можно спокойно заходить в разработку.",
        "process.step4.title": "Разработка", "process.step4.desc": "Пишу фичи по этапам, держу репозиторий в порядке и показываю результат без лишнего шума.",
        "process.step5.title": "Тесты и проверка", "process.step5.desc": "Прогоняю ключевые сценарии, проверяю интеграции и убираю то, что потом ломает релиз.",
        "process.step6.title": "Деплой и запуск", "process.step6.desc": "Собираю образы, настраиваю сервер, домен, SSL и выкладку так, чтобы релиз можно было повторить.",
        "process.step7.title": "Поддержка и развитие", "process.step7.desc": "После запуска продолжаю работу: фиксы, новые задачи, улучшение инфраструктуры и продукта.",
        "projects.title": "Публичный кейс, который уже живет.",
        "projects.desc": "Я не набиваю портфолио выдуманными карточками. Сейчас здесь один реальный запуск и место под следующий проект, который тоже дойдет до production.",
        "projects.ainocraft.preview": "Сайт Minecraft-проекта, где в одном месте собраны сервер, лаунчер, новости и точка входа в комьюнити.",
        "projects.ainocraft.desc": "AiNoCraft - это публичная экосистема вокруг Minecraft-проекта: сайт, страница лаунчера, новости, привилегии и связка с backend-сервисами.",
        "projects.ainocraft.btn": "Открыть ainocraft.com",
        "projects.next.title": "Следующий кейс пока свободен",
        "projects.next.desc": "Новые проекты появляются здесь только после живого запуска. Это медленнее, зато честно.",
        "projects.next.note.strong": "Лучше один сильный кейс, чем десять пустых карточек.",
        "projects.next.note.p": "Следующий проект попадет сюда только после полноценного релиза.",
        "stack.kicker": "04 / стек", "stack.title": "Чем работаю",
        "stack.desc": "Стек не ради списка технологий. Я держу только то, с чем могу спокойно собрать продукт, выкатывать его и поддерживать дальше.",
        "stack.frontend.title": "React, Vite и продуктовый UI", "stack.frontend.desc": "Собираю интерфейсы, личные кабинеты и лендинги, когда проекту нужен цельный frontend без отдельной команды.",
        "stack.backend.title": "Python, FastAPI, PostgreSQL", "stack.backend.desc": "Пишу API, бизнес-логику, интеграции, схемы данных и сервисный backend, который можно нормально развивать.",
        "stack.devops.title": "Docker, Compose, Nginx и CI/CD", "stack.devops.desc": "Готовлю окружения, сборки и выкладку так, чтобы запуск не превращался в ручную операцию.",
        "team.kicker": "05 / команда", "team.title": "Люди за проектом",
        "team.desc": "В команде два сильных контура. Я держу backend, инфраструктуру, Docker, CI/CD и production-релиз, а второй фокус закрывает AI-интеграции, automation и Python backend. В сумме это даёт полный маршрут от задачи до запуска.",
        "team.ak.desc": "Пишу backend на Python и FastAPI, проектирую API и схемы данных, настраиваю Docker, Docker Compose и CI/CD. В отдельных задачах беру React/Vite, AI-интеграции, Oracle / PL/SQL и производственный контур целиком.",
        "team.se.desc": "Собирает backend на Python, LLM-интеграции, AI-ассистентов, RAG, пайплайны данных, оценку качества ответов, ботов и автоматизацию процессов.",
        "team.cap1.title": "Backend и данные", "team.cap1.desc": "Python, FastAPI, PostgreSQL, Redis, MinIO, Kafka, Oracle и PL/SQL там, где важны API, интеграции и нормальная структура данных.",
        "team.cap2.title": "Инфраструктура и релизы", "team.cap2.desc": "Docker, Compose, Nginx, VPS и CI/CD. Люблю, когда сервис можно поднять, обновить и откатить без ручной магии.",
        "team.cap3.title": "AI и смежные задачи", "team.cap3.desc": "Подключаю AI-сценарии, автоматизацию, computer vision и продуктовые штуки, если они помогают проекту, а не просто красиво звучат.",
        "contact.kicker": "06 / контакт", "contact.title": "Можно обсудить ваш проект.",
        "contact.desc": "Если у вас уже есть задача, черновой план или просто идея, напишите пару строк. Я посмотрю, с чего лучше начать, и отвечу в течение суток.",
        "contact.reply": "до 24 часов", "contact.form.name": "Имя", "contact.form.name.ph": "Как к вам обращаться",
        "contact.form.project": "О проекте", "contact.form.project.ph": "Что нужно сделать, какие сроки и на каком этапе вы сейчас",
        "contact.form.submit": "Подготовить письмо",
        "contact.form.note": "Форма откроет черновик письма с уже собранной темой и описанием.",
        "form.error": "Заполните поля, и я сразу соберу письмо.",
        "form.opening": "Открываю черновик...",
        "form.done": "Черновик готов. Если почтовый клиент не открылся, напишите на hello@startup.dev."
    },
    en: {
        "nav.services": "Services", "nav.process": "Process", "nav.projects": "Projects",
        "nav.team": "Team", "nav.contact": "Contact", "nav.cta": "Discuss project",
        "hero.eyebrow": "backend / infra / product delivery",
        "hero.title1": "I build", "hero.title2": "web products", "hero.title3": "from specs to production",
        "hero.text": "I take the whole project on one side: shape the requirements, design APIs and data, build the backend, handle frontend when needed, then ship it through Docker, CI/CD and a sane production setup.",
        "hero.btn.services": "What I do", "hero.btn.projects": "See case",
        "hero.badge.contract": "Contract & NDA", "hero.badge.ci": "CI/CD without manual chaos",
        "hero.panel.top": "to the first working prototype after the scope is fixed",
        "hero.panel.bottom": "one flow: code, infra, release and support",
        "services.kicker": "01 / what I do", "services.title": "What I take on",
        "services.desc": "I usually step in when a project needs one person who can carry it to release, not stop at mockups or one layer of the system.",
        "services.discovery.title": "Scoping and first plan",
        "services.discovery.desc": "At the start I break the task down: what belongs in the first release, where the risks are and what can wait.",
        "services.discovery.li1": "Requirements and bottlenecks", "services.discovery.li2": "First release plan", "services.discovery.li3": "Timeline and stages",
        "services.architecture.title": "Specs, API and architecture",
        "services.architecture.desc": "I shape the technical outline: flows, data models, integrations and the parts the system will grow around.",
        "services.architecture.li1": "Specs for core modules", "services.architecture.li2": "API contracts and data model", "services.architecture.li3": "Architecture without overengineering",
        "services.build.title": "Frontend and backend development",
        "services.build.desc": "I work in real iterations. After each stage you get something usable, not just a status update.",
        "services.build.li1": "React/Vite and FastAPI", "services.build.li2": "Code review, tests, clean API", "services.build.li3": "Demos by completed stages",
        "services.deploy.title": "Infrastructure, Docker and CI/CD",
        "services.deploy.desc": "I build the containers, prepare environments and automate delivery so releases do not depend on manual steps.",
        "services.deploy.li1": "Docker, Compose, Nginx, VPS", "services.deploy.li2": "CI/CD and repeatable releases", "services.deploy.li3": "Logs, monitoring, basic ops",
        "services.ai.title": "AI integrations that make sense",
        "services.ai.desc": "I plug models in where they actually save time: search, classification, generation, assistants and automation.",
        "services.ai.li1": "GPT/ML integrations", "services.ai.li2": "Prompt and system design", "services.ai.li3": "Pipelines and quality checks",
        "services.support.title": "Post-launch support",
        "services.support.desc": "I do not disappear after release. I handle fixes, follow-up work and technical cleanup while the product is already in use.",
        "services.support.li1": "Fixes and support", "services.support.li2": "Plan for next iterations", "services.support.li3": "Documentation and handoff",
        "services.snap.legal.title": "Working terms", "services.snap.legal.desc": "Contract, NDA, stages and clear ownership.",
        "services.snap.docs.title": "Documentation", "services.snap.docs.desc": "Swagger, schemas, runbooks and short docs, so the project does not live only in my head.",
        "services.snap.infra.title": "Infrastructure", "services.snap.infra.desc": "Backups, baseline security and room for traffic growth.",
        "services.snap.own.desc": "One person owns the route from scope to release.",
        "process.kicker": "02 / process", "process.title": "How I run the work",
        "process.desc": "The process is straightforward: define the scope, build, test and release. No long silent gaps and no surprises at the end.",
        "process.step1.title": "Call and task breakdown", "process.step1.desc": "I collect context: goal, timeline, constraints, integrations and what already exists.",
        "process.step2.title": "Specs and technical outline", "process.step2.desc": "I lock in the user flow, API, data and the shape of the first version.",
        "process.step3.title": "Plan, timeline and kickoff", "process.step3.desc": "We align on stages, cost and the working format. After that, development starts cleanly.",
        "process.step4.title": "Development", "process.step4.desc": "I build features stage by stage, keep the repository tidy and show progress without noise.",
        "process.step5.title": "Testing and checks", "process.step5.desc": "I run through critical flows, verify integrations and remove the stuff that usually breaks at release.",
        "process.step6.title": "Deploy and go-live", "process.step6.desc": "I build images, set up the server, domain, SSL and delivery flow so the release can be repeated.",
        "process.step7.title": "Support and growth", "process.step7.desc": "After launch I stay with the product: fixes, new work, infra improvements and product growth.",
        "projects.title": "A public case already in the wild.",
        "projects.desc": "I do not fill the portfolio with invented cards. Right now there is one real launch and room for the next project that will also make it to production.",
        "projects.ainocraft.preview": "A Minecraft project site that brings the server, launcher, news and community entry point together.",
        "projects.ainocraft.desc": "AiNoCraft is a public ecosystem around a Minecraft project: website, launcher page, news, privileges and the link to backend services.",
        "projects.ainocraft.btn": "Open ainocraft.com",
        "projects.next.title": "The next case is still open",
        "projects.next.desc": "New projects appear here only after a real launch. Slower, but honest.",
        "projects.next.note.strong": "One strong case beats ten empty cards.",
        "projects.next.note.p": "The next project goes here only after a full release.",
        "stack.kicker": "04 / stack", "stack.title": "Tools I actually work with",
        "stack.desc": "Not a random list of technologies. Just the stack I can use to build, ship and support a product without drama.",
        "stack.frontend.title": "React, Vite and product UI", "stack.frontend.desc": "I build interfaces, dashboards and landing pages when a project needs a complete frontend, not a separate team.",
        "stack.backend.title": "Python, FastAPI, PostgreSQL", "stack.backend.desc": "I write APIs, business logic, integrations, data models and service backend that can grow without pain.",
        "stack.devops.title": "Docker, Compose, Nginx and CI/CD", "stack.devops.desc": "I set up environments, builds and delivery so launch day is just another repeatable step.",
        "team.kicker": "05 / team", "team.title": "The people behind the project",
        "team.desc": "The team has two clear focuses. I handle backend, infrastructure, Docker, CI/CD and production release, while the second track covers AI integrations, automation and Python backend. Together that gives a full path from scope to launch.",
        "team.ak.desc": "I build backend with Python and FastAPI, design APIs and data models, set up Docker, Docker Compose and CI/CD. When needed I also handle React/Vite, AI integrations, Oracle / PL/SQL and the full production contour.",
        "team.se.desc": "Builds Python backend, LLM integrations, AI assistants, RAG, data pipelines, response quality evaluation, bots and process automation.",
        "team.cap1.title": "Backend and data", "team.cap1.desc": "Python, FastAPI, PostgreSQL, Redis, MinIO, Kafka, Oracle and PL/SQL where APIs, integrations and sane data design matter.",
        "team.cap2.title": "Infrastructure and release", "team.cap2.desc": "Docker, Compose, Nginx, VPS and CI/CD. I like systems that can be started, updated and rolled back without manual tricks.",
        "team.cap3.title": "AI and adjacent work", "team.cap3.desc": "I plug in AI scenarios, automation, computer vision and product work when they solve a real task instead of just sounding good.",
        "contact.kicker": "06 / contact", "contact.title": "Let's talk about your project.",
        "contact.desc": "If you already have a task, a rough plan or just an idea, send a few lines. I'll say where to start and reply within a day.",
        "contact.reply": "within 24 hours", "contact.form.name": "Name", "contact.form.name.ph": "How should I address you",
        "contact.form.project": "About the project", "contact.form.project.ph": "What needs to be built, what the timeline looks like and where the project stands now",
        "contact.form.submit": "Prepare email",
        "contact.form.note": "The form will open an email draft with the subject and the outline already filled.",
        "form.error": "Fill in the fields and I'll prepare the email.",
        "form.opening": "Opening draft...",
        "form.done": "Draft is ready. If your mail client did not open, write to hello@startup.dev."
    }
};

let currentLang = localStorage.getItem("lang") || "ru";

function t(key) {
    return (i18n[currentLang] && i18n[currentLang][key]) || i18n.ru[key] || key;
}

function applyLang(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;
    localStorage.setItem("lang", lang);

    document.querySelectorAll("[data-i18n]").forEach((el) => {
        const text = t(el.dataset.i18n);
        if (text) { el.textContent = text; }
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
        const text = t(el.dataset.i18nPlaceholder);
        if (text) { el.placeholder = text; }
    });

    document.querySelectorAll(".lang-btn").forEach((btn) => {
        btn.classList.toggle("is-active", btn.dataset.lang === lang);
    });
}

function initLangSwitcher() {
    document.querySelectorAll(".lang-btn").forEach((btn) => {
        btn.addEventListener("click", () => applyLang(btn.dataset.lang));
    });
    applyLang(currentLang);
}

// ─── theme ───────────────────────────────────────────────────────────────────
let currentTheme = localStorage.getItem("theme") || "dark";

function applyTheme(theme) {
    currentTheme = theme;
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
}

function initThemeToggle() {
    const btn = document.getElementById("themeToggle");
    if (!btn) { return; }
    applyTheme(currentTheme);
    btn.addEventListener("click", () => {
        applyTheme(currentTheme === "dark" ? "light" : "dark");
    });
}

// ─── apply theme immediately to avoid flash ──────────────────────────────────
applyTheme(localStorage.getItem("theme") || "dark");

const root = document.documentElement;
const header = document.getElementById("siteHeader");
const navLinks = Array.from(document.querySelectorAll(".nav-link"));
const sectionTargets = navLinks
    .map((link) => ({
        link,
        target: document.querySelector(link.getAttribute("href"))
    }))
    .filter((item) => item.target);
const revealItems = Array.from(document.querySelectorAll("[data-reveal]"));
const counterItems = Array.from(document.querySelectorAll("[data-counter]"));
const tiltCards = Array.from(document.querySelectorAll(".tilt-card"));
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const flowCanvas = document.getElementById("flowField");
const heroVisual = document.querySelector(".hero-visual");
const codeLines = Array.from(document.querySelectorAll(".code-lines span"));
const servicePills = Array.from(document.querySelectorAll(".service-pill"));
const servicePanels = Array.from(document.querySelectorAll(".service-panel"));
const servicesSwitcher = document.querySelector(".services-switcher");
const servicesPanelsWrap = document.querySelector(".services-panels");
const processLineFill = document.querySelector(".process-line-fill");
const processTimeline = document.querySelector(".process-timeline");
const processSteps = Array.from(document.querySelectorAll(".process-step"));
const processProgressValue = document.querySelector(".process-progress-value");
const processCurrentStep = document.querySelector(".process-current-step");

const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const finePointerQuery = window.matchMedia("(pointer: fine)");

let prefersReducedMotion = motionQuery.matches;
const hasFinePointer = finePointerQuery.matches;

let activeServiceTarget = "";
let serviceSwitchTimer = 0;
let switcherPulseTimer = 0;

function applyHeroParallax() {
    if (!heroVisual) {
        return;
    }

    if (prefersReducedMotion) {
        heroVisual.style.setProperty("--hero-visual-scale", "1");
        return;
    }

    const rect = heroVisual.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const progress = Math.max(0, Math.min(1, (viewportHeight - rect.top) / (viewportHeight + rect.height)));
    const scale = 1.07 - Math.min(progress * 0.12, 0.07);
    heroVisual.style.setProperty("--hero-visual-scale", scale.toFixed(4));
}

function updateScrollUI() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
    root.style.setProperty("--scroll-progress", progress.toFixed(4));

    header.classList.toggle("is-scrolled", window.scrollY > 16);

    const probe = window.scrollY + window.innerHeight * 0.4;
    let currentId = "";

    sectionTargets.forEach(({ target }) => {
        if (probe >= target.offsetTop) {
            currentId = target.id;
        }
    });

    navLinks.forEach((link) => {
        link.classList.toggle("is-current", link.getAttribute("href") === `#${currentId}`);
    });

    applyHeroParallax();
    updateProcessLine();
}

function initRevealObserver() {
    if (prefersReducedMotion) {
        revealItems.forEach((item) => item.classList.add("is-visible"));
        return;
    }

    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            });
        },
        {
            threshold: 0.16,
            rootMargin: "0px 0px -8% 0px"
        }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
}

function animateCounter(element) {
    const target = Number(element.dataset.counter || 0);
    const duration = 1400;
    const startTime = performance.now();

    const tick = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        element.textContent = String(Math.round(target * eased));

        if (progress < 1) {
            requestAnimationFrame(tick);
        }
    };

    requestAnimationFrame(tick);
}

function initCounters() {
    const counterObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting || entry.target.dataset.played === "true") {
                    return;
                }

                entry.target.dataset.played = "true";

                if (prefersReducedMotion) {
                    entry.target.textContent = entry.target.dataset.counter || "0";
                } else {
                    animateCounter(entry.target);
                }

                observer.unobserve(entry.target);
            });
        },
        {
            threshold: 0.7
        }
    );

    counterItems.forEach((item) => counterObserver.observe(item));
}

function updateProcessLine() {
    if (!processLineFill || !processTimeline || !processSteps.length) {
        return;
    }

    const rect = processTimeline.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const activationPoint = viewportHeight * 0.72;
    const rawProgress = (activationPoint - rect.top) / Math.max(rect.height, 1);
    const progress = Math.max(0, Math.min(1, rawProgress));
    const totalSteps = processSteps.length;
    const currentIndex = progress <= 0.001 ? 0 : Math.min(totalSteps - 1, Math.floor(progress * totalSteps));

    processTimeline.style.setProperty("--line-progress", progress.toFixed(4));
    processLineFill.style.height = `${(progress * 100).toFixed(1)}%`;

    processSteps.forEach((step, index) => {
        const localRaw = progress * totalSteps - index;
        const localProgress = Math.max(0, Math.min(1, localRaw));
        const isActive = progress > 0.01 && index <= currentIndex;

        step.style.setProperty("--step-progress", localProgress.toFixed(4));
        step.classList.toggle("is-active", isActive);
        step.classList.toggle("is-current", isActive && index === currentIndex);
    });

    if (processProgressValue) {
        processProgressValue.textContent = `${String(Math.round(progress * 100)).padStart(2, "0")}%`;
    }

    if (processCurrentStep) {
        processCurrentStep.textContent = `${String(currentIndex + 1).padStart(2, "0")} / ${String(totalSteps).padStart(2, "0")}`;
    }
}

function resetTilt(card) {
    card.style.setProperty("--rotate-x", "0deg");
    card.style.setProperty("--rotate-y", "0deg");
    card.style.setProperty("--spotlight-x", "50%");
    card.style.setProperty("--spotlight-y", "50%");
}

function initTiltCards() {
    tiltCards.forEach((card) => {
        resetTilt(card);

        if (!hasFinePointer || prefersReducedMotion) {
            return;
        }

        card.addEventListener("pointermove", (event) => {
            const rect = card.getBoundingClientRect();
            const percentX = (event.clientX - rect.left) / rect.width;
            const percentY = (event.clientY - rect.top) / rect.height;
            const rotateY = (percentX - 0.5) * 10;
            const rotateX = (0.5 - percentY) * 10;

            card.style.setProperty("--rotate-x", `${rotateX.toFixed(2)}deg`);
            card.style.setProperty("--rotate-y", `${rotateY.toFixed(2)}deg`);
            card.style.setProperty("--spotlight-x", `${(percentX * 100).toFixed(1)}%`);
            card.style.setProperty("--spotlight-y", `${(percentY * 100).toFixed(1)}%`);
        });

        card.addEventListener("pointerleave", () => resetTilt(card));
    });
}

function runCodeAnimation() {
    if (!codeLines.length) {
        return;
    }

    if (prefersReducedMotion) {
        codeLines.forEach((line) => line.classList.add("line-done"));
        return;
    }

    let current = 0;

    const step = () => {
        codeLines.forEach((line, index) => {
            line.classList.remove("line-active", "line-done");

            if (index < current) {
                line.classList.add("line-done");
            }

            if (index === current) {
                line.classList.add("line-active");
            }
        });

        current += 1;

        if (current <= codeLines.length) {
            window.setTimeout(step, current === codeLines.length ? 1400 : 620);
            return;
        }

        window.setTimeout(() => {
            codeLines.forEach((line) => line.classList.remove("line-active", "line-done"));
            current = 0;
            window.setTimeout(step, 320);
        }, 900);
    };

    window.setTimeout(step, 700);
}

function applyServicePillState(targetId) {
    servicePills.forEach((pill) => {
        const isCurrent = pill.dataset.serviceTarget === targetId;
        pill.classList.toggle("is-current", isCurrent);
        pill.setAttribute("aria-selected", isCurrent ? "true" : "false");
    });
}

function normalizeServicePanels(activePanel) {
    servicePanels.forEach((panel) => {
        const isActive = panel === activePanel;
        panel.hidden = !isActive;
        panel.classList.toggle("is-current", isActive);
        panel.classList.remove("is-entering", "is-leaving");
    });
}

function updateServiceSwitcherIndicator(targetId, animate = true) {
    if (!servicesSwitcher) {
        return;
    }

    const targetPill = servicePills.find((pill) => pill.dataset.serviceTarget === targetId);

    if (!targetPill) {
        return;
    }

    servicesSwitcher.style.setProperty("--switcher-pill-x", `${targetPill.offsetLeft}px`);
    servicesSwitcher.style.setProperty("--switcher-pill-w", `${targetPill.offsetWidth}px`);

    if (!animate) {
        return;
    }

    servicesSwitcher.classList.add("is-sliding");
    window.clearTimeout(switcherPulseTimer);
    switcherPulseTimer = window.setTimeout(() => {
        servicesSwitcher.classList.remove("is-sliding");
    }, 480);
}

function setActiveServicePanel(targetId, options = {}) {
    if (!targetId) {
        return;
    }

    const nextPanel = servicePanels.find((panel) => panel.dataset.servicePanel === targetId);

    if (!nextPanel) {
        return;
    }

    const shouldAnimate = options.animate !== false && !prefersReducedMotion;
    const activePanelByState =
        servicePanels.find((panel) => panel.classList.contains("is-current")) ||
        servicePanels.find((panel) => !panel.hidden) ||
        null;

    if (serviceSwitchTimer) {
        window.clearTimeout(serviceSwitchTimer);
        serviceSwitchTimer = 0;

        if (activePanelByState) {
            normalizeServicePanels(activePanelByState);
        }

        if (servicesPanelsWrap) {
            servicesPanelsWrap.classList.remove("is-animating");
            servicesPanelsWrap.style.height = "";
        }
    }

    if (!activePanelByState || activePanelByState === nextPanel || targetId === activeServiceTarget) {
        applyServicePillState(targetId);
        normalizeServicePanels(nextPanel);

        if (servicesPanelsWrap) {
            servicesPanelsWrap.classList.remove("is-animating");
            servicesPanelsWrap.style.height = "";
        }

        updateServiceSwitcherIndicator(targetId, false);
        activeServiceTarget = targetId;
        return;
    }

    applyServicePillState(targetId);
    updateServiceSwitcherIndicator(targetId, shouldAnimate);

    if (!shouldAnimate || !servicesPanelsWrap) {
        normalizeServicePanels(nextPanel);
        activeServiceTarget = targetId;
        return;
    }

    normalizeServicePanels(activePanelByState);
    nextPanel.hidden = false;
    nextPanel.classList.add("is-current", "is-entering");

    const fromHeight = activePanelByState.offsetHeight;
    const toHeight = nextPanel.offsetHeight;

    servicesPanelsWrap.style.height = `${fromHeight}px`;
    servicesPanelsWrap.classList.add("is-animating");
    void servicesPanelsWrap.offsetHeight;
    servicesPanelsWrap.style.height = `${toHeight}px`;

    activePanelByState.classList.add("is-leaving");
    activePanelByState.classList.remove("is-current");

    requestAnimationFrame(() => {
        nextPanel.classList.remove("is-entering");
    });

    activeServiceTarget = targetId;
    serviceSwitchTimer = window.setTimeout(() => {
        normalizeServicePanels(nextPanel);
        servicesPanelsWrap.classList.remove("is-animating");
        servicesPanelsWrap.style.height = "";
        serviceSwitchTimer = 0;
    }, 820);
}

function initServiceTabs() {
    if (!servicePills.length || !servicePanels.length) {
        return;
    }

    const defaultTarget =
        servicePills.find((pill) => pill.classList.contains("is-current"))?.dataset.serviceTarget ||
        servicePanels[0]?.dataset.servicePanel;

    setActiveServicePanel(defaultTarget, { animate: false });

    servicePills.forEach((pill, index) => {
        pill.addEventListener("click", () => {
            setActiveServicePanel(pill.dataset.serviceTarget);
            pill.focus();
        });

        pill.addEventListener("keydown", (event) => {
            if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") {
                return;
            }

            event.preventDefault();
            const direction = event.key === "ArrowRight" ? 1 : -1;
            const nextIndex = (index + direction + servicePills.length) % servicePills.length;
            const nextPill = servicePills[nextIndex];

            setActiveServicePanel(nextPill.dataset.serviceTarget);
            nextPill.focus();
        });
    });

    if (servicesSwitcher) {
        servicesSwitcher.addEventListener(
            "scroll",
            () => {
                if (!activeServiceTarget) {
                    return;
                }

                updateServiceSwitcherIndicator(activeServiceTarget, false);
            },
            { passive: true }
        );
    }
}

function setFormStatus(message, isError = false) {
    if (!formStatus) {
        return;
    }

    formStatus.textContent = message;
    formStatus.style.color = isError ? "#ff9f94" : "";
}

function initContactForm() {
    if (!contactForm) {
        return;
    }

    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const nameInput = contactForm.elements.namedItem("name");
        const emailInput = contactForm.elements.namedItem("email");
        const messageInput = contactForm.elements.namedItem("message");

        const name = nameInput ? nameInput.value.trim() : "";
        const email = emailInput ? emailInput.value.trim() : "";
        const message = messageInput ? messageInput.value.trim() : "";

        if (!name || !email || !message) {
            setFormStatus(t("form.error"), true);
            return;
        }

        const subject = encodeURIComponent(`Новый проект startup от ${name}`);
        const body = encodeURIComponent(
            [
                `Имя: ${name}`,
                `Email: ${email}`,
                "",
                "Описание проекта:",
                message
            ].join("\n")
        );

        setFormStatus(t("form.opening"));
        window.location.href = `mailto:hello@startup.dev?subject=${subject}&body=${body}`;
        setFormStatus(t("form.done"));
    });
}

function initFlowField() {
    if (!flowCanvas) {
        return;
    }

    const context = flowCanvas.getContext("2d");

    if (!context || prefersReducedMotion) {
        return;
    }

    let width = 0;
    let height = 0;
    let dpr = 1;
    let animationId = 0;
    let stars = [];
    let comets = [];
    let nodes = [];
    let resizeRaf = 0;
    const pointer = {
        x: window.innerWidth * 0.5,
        y: window.innerHeight * 0.35
    };

    const colors = [
        [181, 108, 255],
        [232, 121, 249],
        [247, 240, 255]
    ];

    const createStar = () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 0.35 + Math.random() * 1.85,
        alpha: 0.18 + Math.random() * 0.7,
        drift: 0.04 + Math.random() * 0.28,
        depth: 0.3 + Math.random() * 1.15,
        twinkle: 0.0012 + Math.random() * 0.004,
        phase: Math.random() * Math.PI * 2,
        colorIndex: Math.floor(Math.random() * colors.length)
    });

    const createNode = () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        size: 1.3 + Math.random() * 2.1,
        phase: Math.random() * Math.PI * 2,
        pulse: 0.001 + Math.random() * 0.002
    });

    const spawnComet = () => {
        comets.push({
            x: Math.random() * width * 0.9,
            y: -20 - Math.random() * 120,
            vx: 5.6 + Math.random() * 2.2,
            vy: 2.1 + Math.random() * 1.5,
            length: 90 + Math.random() * 70,
            alpha: 0.26 + Math.random() * 0.3
        });
    };

    const resizeCanvas = () => {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = window.innerWidth;
        height = window.innerHeight;

        flowCanvas.width = Math.floor(width * dpr);
        flowCanvas.height = Math.floor(height * dpr);
        flowCanvas.style.width = `${width}px`;
        flowCanvas.style.height = `${height}px`;

        context.setTransform(dpr, 0, 0, dpr, 0, 0);
        stars = Array.from(
            { length: Math.max(140, Math.min(320, Math.floor((width * height) / 8500))) },
            createStar
        );
        nodes = Array.from(
            { length: Math.max(102, Math.min(162, Math.floor((width * height) / 15000))) },
            createNode
        );
        comets = [];
    };

    const draw = (time) => {
        context.clearRect(0, 0, width, height);

        stars.forEach((star) => {
            star.x -= star.drift * star.depth;

            if (star.x < -40) {
                star.x = width + 40;
                star.y = Math.random() * height;
            }

            const twinkle = star.alpha + Math.sin(time * star.twinkle + star.phase) * 0.16;
            const [red, green, blue] = colors[star.colorIndex];

            context.fillStyle = `rgba(${red}, ${green}, ${blue}, ${Math.max(0.12, twinkle).toFixed(3)})`;
            context.beginPath();
            context.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            context.fill();

            if (star.size > 1.35) {
                context.strokeStyle = `rgba(${red}, ${green}, ${blue}, ${Math.max(0.08, twinkle * 0.4).toFixed(3)})`;
                context.lineWidth = 1;
                context.beginPath();
                context.moveTo(star.x - star.size * 3, star.y);
                context.lineTo(star.x + star.size * 3, star.y);
                context.moveTo(star.x, star.y - star.size * 3);
                context.lineTo(star.x, star.y + star.size * 3);
                context.stroke();
            }
        });

        nodes.forEach((node) => {
            node.x += node.vx;
            node.y += node.vy;

            if (node.x < 20 || node.x > width - 20) {
                node.vx *= -1;
            }

            if (node.y < 20 || node.y > height - 20) {
                node.vy *= -1;
            }
        });

        const pointerRadius = 160;
        const pointerRadiusSq = pointerRadius * pointerRadius;
        const maxLinkDistance = 205;

        for (let index = 0; index < nodes.length; index += 1) {
            const node = nodes[index];

            for (let nextIndex = index + 1; nextIndex < nodes.length; nextIndex += 1) {
                const nextNode = nodes[nextIndex];
                const dx = nextNode.x - node.x;
                const dy = nextNode.y - node.y;
                const distance = Math.hypot(dx, dy);

                if (distance > maxLinkDistance) {
                    continue;
                }

                const midpointX = (node.x + nextNode.x) * 0.5;
                const midpointY = (node.y + nextNode.y) * 0.5;
                const pointerDx = pointer.x - midpointX;
                const pointerDy = pointer.y - midpointY;
                const pointerDistanceSq = pointerDx * pointerDx + pointerDy * pointerDy;
                const nearPointer = pointerDistanceSq < pointerRadiusSq;
                const alpha = (1 - distance / maxLinkDistance) * (nearPointer ? 0.28 : 0.1);

                context.strokeStyle = nearPointer
                    ? `rgba(232, 121, 249, ${alpha.toFixed(3)})`
                    : `rgba(181, 108, 255, ${alpha.toFixed(3)})`;
                context.lineWidth = nearPointer ? 1.2 : 0.8;
                context.beginPath();
                context.moveTo(node.x, node.y);
                context.lineTo(nextNode.x, nextNode.y);
                context.stroke();
            }
        }

        nodes.forEach((node) => {
            const pointerDx = pointer.x - node.x;
            const pointerDy = pointer.y - node.y;
            const pointerDistanceSq = pointerDx * pointerDx + pointerDy * pointerDy;
            const nearPointer = pointerDistanceSq < pointerRadiusSq;
            const pulse = 0.65 + Math.sin(time * node.pulse + node.phase) * 0.22;
            const radius = node.size + pulse + (nearPointer ? 1.4 : 0);
            const fillAlpha = nearPointer ? 0.92 : 0.54;

            context.fillStyle = nearPointer
                ? `rgba(232, 121, 249, ${fillAlpha.toFixed(3)})`
                : `rgba(181, 108, 255, ${fillAlpha.toFixed(3)})`;
            context.beginPath();
            context.arc(node.x, node.y, radius, 0, Math.PI * 2);
            context.fill();

            if (nearPointer) {
                const distance = Math.max(18, Math.sqrt(pointerDistanceSq));
                const alpha = Math.max(0.08, 1 - distance / pointerRadius) * 0.24;
                context.strokeStyle = `rgba(232, 121, 249, ${alpha.toFixed(3)})`;
                context.lineWidth = 1;
                context.beginPath();
                context.moveTo(node.x, node.y);
                context.lineTo(pointer.x, pointer.y);
                context.stroke();
            }
        });

        if (Math.random() < 0.01 && comets.length < 3) {
            spawnComet();
        }

        comets = comets.filter((comet) => comet.x < width + comet.length && comet.y < height + comet.length);

        comets.forEach((comet) => {
            comet.x += comet.vx;
            comet.y += comet.vy;

            const gradient = context.createLinearGradient(
                comet.x,
                comet.y,
                comet.x - comet.length,
                comet.y - comet.length * 0.42
            );

            gradient.addColorStop(0, `rgba(232, 121, 249, ${comet.alpha.toFixed(3)})`);
            gradient.addColorStop(0.5, `rgba(181, 108, 255, ${(comet.alpha * 0.45).toFixed(3)})`);
            gradient.addColorStop(1, "rgba(232, 121, 249, 0)");

            context.strokeStyle = gradient;
            context.lineWidth = 1.6;
            context.beginPath();
            context.moveTo(comet.x, comet.y);
            context.lineTo(comet.x - comet.length, comet.y - comet.length * 0.42);
            context.stroke();
        });

        animationId = window.requestAnimationFrame(draw);
    };

    const onPointerMove = (event) => {
        pointer.x = event.clientX;
        pointer.y = event.clientY;
    };

    const onResize = () => {
        window.cancelAnimationFrame(resizeRaf);
        resizeRaf = window.requestAnimationFrame(resizeCanvas);
    };

    const onVisibilityChange = () => {
        if (document.hidden) {
            window.cancelAnimationFrame(animationId);
        } else {
            window.cancelAnimationFrame(animationId);
            animationId = window.requestAnimationFrame(draw);
        }
    };

    resizeCanvas();
    animationId = window.requestAnimationFrame(draw);

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
}

function init() {
    initThemeToggle();
    initLangSwitcher();
    updateScrollUI();
    initRevealObserver();
    initCounters();
    initTiltCards();
    initServiceTabs();
    initContactForm();
    initFlowField();
    runCodeAnimation();

    let scrollTicking = false;
    window.addEventListener(
        "scroll",
        () => {
            if (scrollTicking) {
                return;
            }

            scrollTicking = true;
            window.requestAnimationFrame(() => {
                updateScrollUI();
                scrollTicking = false;
            });
        },
        { passive: true }
    );

    window.addEventListener(
        "resize",
        () => {
            updateScrollUI();

            if (activeServiceTarget) {
                updateServiceSwitcherIndicator(activeServiceTarget, false);
            }
        },
        { passive: true }
    );
}

motionQuery.addEventListener?.("change", (event) => {
    prefersReducedMotion = event.matches;
});

init();
