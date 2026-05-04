// ─── i18n ───────────────────────────────────────────────────────────────────
const i18n = {
    ru: {
        "nav.services": "Услуги", "nav.process": "Процесс", "nav.projects": "Проекты",
        "nav.team": "Команда", "nav.contact": "Контакт", "nav.cta": "Связаться",
        "hero.eyebrow": "stellar product engineering",
        "hero.title1": "Запускаем", "hero.title2": "веб-приложения", "hero.title3": "от идеи до production",
        "hero.text": "startup проектирует и собирает веб-продукты полного цикла: от аналитики и интерфейсов до frontend/backend, CI/CD, production-деплоя и поддержки. Всё в одном ритме и без лишнего слоя бюрократии.",
        "hero.btn.services": "Посмотреть услуги", "hero.btn.projects": "Готовые проекты",
        "hero.badge.contract": "Договор и NDA", "hero.badge.ci": "CI/CD по умолчанию",
        "hero.panel.top": "на запуск первого прототипа после аналитики",
        "hero.panel.bottom": "единый контур: дизайн, код, деплой и сопровождение",
        "services.kicker": "01 / услуги", "services.title": "Услуги полного цикла",
        "services.desc": "Мы закрываем все этапы: от первой идеи и аналитики до стабильной работы продукта в production, инфраструктуры, документации и дальнейшего развития.",
        "services.discovery.title": "Discovery и стратегия продукта",
        "services.discovery.desc": "Проводим интервью, формируем гипотезы и расставляем приоритеты так, чтобы разработка сразу шла в сторону бизнес-результата.",
        "services.discovery.li1": "Карта требований и рисков", "services.discovery.li2": "Roadmap первого релиза", "services.discovery.li3": "Оценка сроков и бюджета",
        "services.architecture.title": "ТЗ и архитектурное проектирование",
        "services.architecture.desc": "Собираем технический контур проекта: схемы данных, API-контракты, сценарии пользователей и технические ограничения.",
        "services.architecture.li1": "Подробное ТЗ по модулям", "services.architecture.li2": "API blueprint и ER-диаграммы", "services.architecture.li3": "Архитектурные решения под рост",
        "services.build.title": "Разработка фронта и бэка",
        "services.build.desc": "Реализуем фичи короткими итерациями. Каждый спринт заканчивается рабочим результатом и прозрачным статусом по задачам.",
        "services.build.li1": "React/Vite + FastAPI", "services.build.li2": "Code review и тесты", "services.build.li3": "Демо после каждой итерации",
        "services.deploy.title": "DevOps, CI/CD и production-деплой",
        "services.deploy.desc": "Настраиваем окружения, автоматизируем сборки и выкладываем релизы предсказуемо: быстро, стабильно и без ручных рисков.",
        "services.deploy.li1": "Docker + Nginx + VPS", "services.deploy.li2": "CI/CD pipeline и quality gates", "services.deploy.li3": "Мониторинг и алерты",
        "services.ai.title": "AI-интеграции в продукт",
        "services.ai.desc": "Добавляем интеллектуальные сценарии: ассистенты, поиск, генерация контента и персонализация под ваши KPI.",
        "services.ai.li1": "Интеграции GPT/ML", "services.ai.li2": "Prompt/system design", "services.ai.li3": "Оценка качества ответов",
        "services.support.title": "Поддержка и развитие после релиза",
        "services.support.desc": "Сопровождаем систему в бою: мониторинг, горячие фиксы, развитие фичей и масштабирование инфраструктуры под нагрузку.",
        "services.support.li1": "SLA и инцидент-менеджмент", "services.support.li2": "План развития продукта", "services.support.li3": "Техническая документация",
        "services.snap.legal.title": "Юридический контур", "services.snap.legal.desc": "Договор, NDA, прозрачные этапы и фиксация ответственности.",
        "services.snap.docs.title": "Документация", "services.snap.docs.desc": "Swagger/Redoc, схемы, runbooks и инструкции для команды.",
        "services.snap.infra.title": "Инфраструктура", "services.snap.infra.desc": "Резервное копирование, безопасность и подготовка к масштабированию.",
        "services.snap.own.desc": "Одна команда, полный цикл и единая ответственность за результат.",
        "process.kicker": "02 / процесс", "process.title": "Процесс разработки",
        "process.desc": "Прозрачный пайплайн из семи этапов с полным контролем на каждом шаге: от первого знакомства и ТЗ до production-деплоя и поддержки.",
        "process.step1.title": "Знакомство и аналитика", "process.step1.desc": "Созвон, бриф, исследование рынка и конкурентов. Формируем видение продукта.",
        "process.step2.title": "ТЗ и прототипы", "process.step2.desc": "Детальное техзадание, wireframes, user-flow и спецификация API-эндпоинтов.",
        "process.step3.title": "Договор и оплата", "process.step3.desc": "Фиксируем сроки, стоимость и NDA. Вы платите поэтапно, без лишних рисков и сюрпризов.",
        "process.step4.title": "Разработка", "process.step4.desc": "Спринты по 1–2 недели, доступ к Git-репозиторию, статусы по задачам и предсказуемый темп.",
        "process.step5.title": "Тестирование и QA", "process.step5.desc": "Unit, integration и E2E тесты, ручное QA и проверка ключевых сценариев под нагрузкой.",
        "process.step6.title": "Деплой в production", "process.step6.desc": "Docker-образы, VPS, Nginx, SSL и мониторинг. Всё проходит по предсказуемому CI/CD пайплайну.",
        "process.step7.title": "Поддержка и развитие", "process.step7.desc": "Мониторинг, горячие фиксы, новые фичи, масштабирование и сопровождение продукта после релиза.",
        "projects.title": "Живой кейс, который уже работает в production.",
        "projects.desc": "Пока в портфолио один публичный запуск, и я решил показать это честно: один реальный live-проект плюс следующий слот для нового продукта, который можно собрать вместе с вами.",
        "projects.ainocraft.preview": "Сайт для Minecraft-проекта, где в одной точке собраны презентация сервера, лаунчер, новости и вход в комьюнити.",
        "projects.ainocraft.desc": "Публичный сайт игрового Minecraft-проекта, который связывает презентацию сервера, скачивание официального лаунчера, новости, привилегии и социальные каналы в одну цельную экосистему.",
        "projects.ainocraft.btn": "Открыть ainocraft.com",
        "projects.next.title": "Следующий кейс может быть вашим",
        "projects.next.desc": "Портфолио собирается вокруг реальных запусков. Вместо набора вымышленных карточек здесь будет только то, что действительно вышло в свет.",
        "projects.next.note.strong": "Фокус на качестве, а не на количестве.",
        "projects.next.note.p": "Каждый следующий проект будет добавляться сюда только после полноценного production-запуска.",
        "stack.kicker": "04 / стек", "stack.title": "Технологический стек",
        "stack.desc": "Проверенные инструменты, которые мы используем каждый день, чтобы запускать интерфейсы, API и инфраструктуру без лишней хрупкости.",
        "stack.frontend.title": "React, Vite и TypeScript", "stack.frontend.desc": "Собираем быстрые интерфейсы, личные кабинеты и продуктовые страницы с чистой адаптивной версткой.",
        "stack.backend.title": "FastAPI, PostgreSQL и Redis", "stack.backend.desc": "Строим API, бизнес-логику, очереди задач и надежные модели данных под рост продукта.",
        "stack.devops.title": "Docker, VPS, Nginx и CI/CD", "stack.devops.desc": "Готовим production-контур, мониторинг, документацию и автоматические выкладки без ручного хаоса.",
        "team.kicker": "05 / команда", "team.title": "Люди за проектом",
        "team.desc": "Оба работаем с fullstack-разработкой, backend, инфраструктурой и production-процессами. Команда сочетает продуктовый frontend, надежную работу с данными, AI-интеграции и автоматизацию в одном инженерном процессе.",
        "team.ak.desc": "Проектирует продуктовую архитектуру, собирает frontend/backend, API и production-контур. Основной фокус — интерфейсы, состояние приложения, схемы данных и PostgreSQL.",
        "team.se.desc": "Собирает backend на Python, LLM-интеграции, AI-ассистенты, RAG, пайплайны данных, оценка качества ответов, боты и автоматизация процессов.",
        "team.cap1.title": "Общий стек", "team.cap1.desc": "React, Vite, FastAPI, Python, PostgreSQL, Docker, CI/CD и production-подход есть в общем инженерном контуре.",
        "team.cap2.title": "Интерфейсы и данные", "team.cap2.desc": "Проектируем понятные экраны, клиентскую логику, API-контракты и структуру данных так, чтобы продукт было удобно развивать.",
        "team.cap3.title": "AI-интеграции", "team.cap3.desc": "Встраиваем LLM, RAG, ботов, пайплайны и автоматизацию в реальные рабочие процессы, где они экономят время и повышают качество.",
        "contact.kicker": "06 / контакт", "contact.title": "Готов обсудить ваш запуск.",
        "contact.desc": "Напишите пару строк о задаче. Я предложу формат старта, помогу собрать следующий шаг и отвечу в течение 24 часов.",
        "contact.reply": "до 24 часов", "contact.form.name": "Имя", "contact.form.name.ph": "Как к вам обращаться",
        "contact.form.project": "О проекте", "contact.form.project.ph": "Коротко опишите задачу, сроки и текущую стадию проекта",
        "contact.form.submit": "Подготовить письмо",
        "contact.form.note": "Форма откроет черновик письма в почтовом клиенте с уже собранной темой и описанием.",
        "form.error": "Заполните все поля, и я сразу подготовлю письмо.",
        "form.opening": "Открываю черновик письма...",
        "form.done": "Черновик письма готов. Если почтовый клиент не открылся, напишите на hello@startup.dev."
    },
    en: {
        "nav.services": "Services", "nav.process": "Process", "nav.projects": "Projects",
        "nav.team": "Team", "nav.contact": "Contact", "nav.cta": "Contact us",
        "hero.eyebrow": "stellar product engineering",
        "hero.title1": "We build", "hero.title2": "web apps", "hero.title3": "from idea to production",
        "hero.text": "startup designs and builds full-cycle web products: from analytics and interfaces to frontend/backend, CI/CD, production deployment and support. All in one flow, without layers of bureaucracy.",
        "hero.btn.services": "View services", "hero.btn.projects": "Ready projects",
        "hero.badge.contract": "Contract & NDA", "hero.badge.ci": "CI/CD by default",
        "hero.panel.top": "to launch the first prototype after analytics",
        "hero.panel.bottom": "single flow: design, code, deploy & support",
        "services.kicker": "01 / services", "services.title": "Full-cycle services",
        "services.desc": "We cover every stage: from the first idea and analytics to stable operation in production, infrastructure, documentation and ongoing development.",
        "services.discovery.title": "Discovery & product strategy",
        "services.discovery.desc": "We conduct interviews, form hypotheses and prioritize so that development moves toward business results right away.",
        "services.discovery.li1": "Requirements & risk map", "services.discovery.li2": "First release roadmap", "services.discovery.li3": "Timeline & budget estimation",
        "services.architecture.title": "Specs & architecture design",
        "services.architecture.desc": "We build the technical outline of the project: data schemas, API contracts, user scenarios and technical constraints.",
        "services.architecture.li1": "Detailed specs by modules", "services.architecture.li2": "API blueprint & ER diagrams", "services.architecture.li3": "Architecture decisions for growth",
        "services.build.title": "Frontend & backend development",
        "services.build.desc": "We implement features in short iterations. Each sprint ends with a working result and transparent task status.",
        "services.build.li1": "React/Vite + FastAPI", "services.build.li2": "Code review & tests", "services.build.li3": "Demo after each iteration",
        "services.deploy.title": "DevOps, CI/CD & production deploy",
        "services.deploy.desc": "We set up environments, automate builds and deploy releases predictably: fast, stable and without manual risks.",
        "services.deploy.li1": "Docker + Nginx + VPS", "services.deploy.li2": "CI/CD pipeline & quality gates", "services.deploy.li3": "Monitoring & alerts",
        "services.ai.title": "AI integrations in product",
        "services.ai.desc": "We add intelligent scenarios: assistants, search, content generation and personalization for your KPIs.",
        "services.ai.li1": "GPT/ML integrations", "services.ai.li2": "Prompt/system design", "services.ai.li3": "Response quality evaluation",
        "services.support.title": "Support & development after release",
        "services.support.desc": "We maintain the system in production: monitoring, hotfixes, feature development and infrastructure scaling under load.",
        "services.support.li1": "SLA & incident management", "services.support.li2": "Product development plan", "services.support.li3": "Technical documentation",
        "services.snap.legal.title": "Legal framework", "services.snap.legal.desc": "Contract, NDA, transparent stages and accountability.",
        "services.snap.docs.title": "Documentation", "services.snap.docs.desc": "Swagger/Redoc, schemas, runbooks and team guides.",
        "services.snap.infra.title": "Infrastructure", "services.snap.infra.desc": "Backup, security and preparation for scaling.",
        "services.snap.own.desc": "One team, full cycle and single accountability for the result.",
        "process.kicker": "02 / process", "process.title": "Development process",
        "process.desc": "A transparent pipeline of seven stages with full control at every step: from first meeting and specs to production deployment and support.",
        "process.step1.title": "Intro & analytics", "process.step1.desc": "Call, brief, market and competitor research. We form the product vision.",
        "process.step2.title": "Specs & prototypes", "process.step2.desc": "Detailed technical spec, wireframes, user-flow and API endpoint specification.",
        "process.step3.title": "Contract & payment", "process.step3.desc": "We fix timelines, cost and NDA. You pay in stages, without extra risks and surprises.",
        "process.step4.title": "Development", "process.step4.desc": "1–2 week sprints, Git access, task statuses and a predictable pace.",
        "process.step5.title": "Testing & QA", "process.step5.desc": "Unit, integration and E2E tests, manual QA and key scenario checks under load.",
        "process.step6.title": "Deploy to production", "process.step6.desc": "Docker images, VPS, Nginx, SSL and monitoring. All via a predictable CI/CD pipeline.",
        "process.step7.title": "Support & development", "process.step7.desc": "Monitoring, hotfixes, new features, scaling and product support after release.",
        "projects.title": "A live case already running in production.",
        "projects.desc": "Currently one public launch in the portfolio, and I chose to show that honestly: one real live project plus the next slot for a new product we can build together.",
        "projects.ainocraft.preview": "A website for a Minecraft project where server presentation, launcher, news and community access are all in one place.",
        "projects.ainocraft.desc": "A public website for a Minecraft game project that unifies server presentation, official launcher download, news, privileges and social channels into one cohesive ecosystem.",
        "projects.ainocraft.btn": "Open ainocraft.com",
        "projects.next.title": "The next case could be yours",
        "projects.next.desc": "The portfolio is built around real launches. Instead of a set of made-up cards, only what has truly gone live will appear here.",
        "projects.next.note.strong": "Focus on quality, not quantity.",
        "projects.next.note.p": "Each new project will only be added here after a full production launch.",
        "stack.kicker": "04 / stack", "stack.title": "Technology stack",
        "stack.desc": "Proven tools we use every day to ship interfaces, APIs and infrastructure without unnecessary fragility.",
        "stack.frontend.title": "React, Vite & TypeScript", "stack.frontend.desc": "We build fast interfaces, dashboards and product pages with clean responsive markup.",
        "stack.backend.title": "FastAPI, PostgreSQL & Redis", "stack.backend.desc": "We build APIs, business logic, task queues and reliable data models for product growth.",
        "stack.devops.title": "Docker, VPS, Nginx & CI/CD", "stack.devops.desc": "We prepare the production environment, monitoring, documentation and automated deployments without manual chaos.",
        "team.kicker": "05 / team", "team.title": "The people behind the project",
        "team.desc": "Both of us work with fullstack development, backend, infrastructure and production processes. The team combines product frontend, reliable data work, AI integrations and automation in one engineering process.",
        "team.ak.desc": "Designs product architecture, builds frontend/backend, API and production environment. Main focus — interfaces, app state, data schemas and PostgreSQL.",
        "team.se.desc": "Builds Python backend, LLM integrations, AI assistants, RAG, data pipelines, response quality evaluation, bots and process automation.",
        "team.cap1.title": "Common stack", "team.cap1.desc": "React, Vite, FastAPI, Python, PostgreSQL, Docker, CI/CD and the production approach are all in the common engineering scope.",
        "team.cap2.title": "Interfaces & data", "team.cap2.desc": "We design clear screens, client logic, API contracts and data structures so the product is easy to evolve.",
        "team.cap3.title": "AI integrations", "team.cap3.desc": "We embed LLM, RAG, bots, pipelines and automation into real workflows where they save time and improve quality.",
        "contact.kicker": "06 / contact", "contact.title": "Ready to discuss your launch.",
        "contact.desc": "Write a few lines about your task. I'll suggest a starting format, help shape the next step and reply within 24 hours.",
        "contact.reply": "within 24 hours", "contact.form.name": "Name", "contact.form.name.ph": "How to address you",
        "contact.form.project": "About the project", "contact.form.project.ph": "Briefly describe the task, timeline and current project stage",
        "contact.form.submit": "Prepare the email",
        "contact.form.note": "The form will open a draft email in your mail client with the subject and description already filled in.",
        "form.error": "Please fill in all fields and I'll prepare the email.",
        "form.opening": "Opening email draft...",
        "form.done": "Email draft ready. If your mail client didn't open, write to hello@startup.dev."
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
