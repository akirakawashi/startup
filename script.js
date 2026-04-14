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
            setFormStatus("Заполните все поля, и я сразу подготовлю письмо.", true);
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

        setFormStatus("Открываю черновик письма...");
        window.location.href = `mailto:hello@startup.dev?subject=${subject}&body=${body}`;
        setFormStatus("Черновик письма готов. Если почтовый клиент не открылся, напишите на hello@startup.dev.");
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
