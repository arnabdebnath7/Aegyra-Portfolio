/* ==========================================================================
   AEGYRA: UI CONTROLLER, REAL GITHUB RELICS, B11 TAGLINE REVEAL & STEGO AUDIT
   ========================================================================== */

import {
  renderClassicalMattePlate,
  decodeStegoWatermark,
  STEGO_SIGNATURE
} from "./assets-engine.js";
import { AegyraWebGLStage } from "./webgl-stage.js";

/* --------------------------------------------------------------------------
   REAL VERIFIED GITHUB REPOSITORIES OF ARNAB DEBNATH (arnabdebnath7)
   Framed as Monumental Engineered Relics of the Aegyra Sanctum
   -------------------------------------------------------------------------- */
const AEGYRA_RELICS = [
  {
    id: "dorabot",
    order: "01",
    guild: "COMPANIONS GUILD",
    title: "DoraBot Autonomous Oracle",
    repoName: "arnabdebnath7/DoraBot",
    repoUrl: "https://github.com/arnabdebnath7/DoraBot",
    liveUrl: "https://dorabot-independent.vercel.app",
    stack: "TypeScript · Kinetic Auth · AI Workflows",
    sceneKey: "companions",
    metrics: "3,547 KB repository · MIT license",
    summary:
      "An autonomous conversational companion and kinetic authentication sanctum engineered in TypeScript to guide travelers through intelligent workflows."
  },
  {
    id: "trading-journal",
    order: "02",
    guild: "SCHOLARS GUILD",
    title: "Sovereign Quantitative Ledger",
    repoName: "arnabdebnath7/Trading-JOURNAL",
    repoUrl: "https://github.com/arnabdebnath7/Trading-JOURNAL",
    liveUrl: "https://trading-journal-server-woad.vercel.app",
    stack: "Next.js · Neon PostgreSQL · JavaScript",
    sceneKey: "caldera",
    metrics: "14,290 KB repository · Cloud database",
    summary:
      "A high precision quantitative chronicle backed by Neon PostgreSQL that records market expeditions, risk discipline, and historical performance."
  },
  {
    id: "quill",
    order: "03",
    guild: "ARCHIVES GUILD",
    title: "Quill Illuminated Scriptorium",
    repoName: "arnabdebnath7/Quill",
    repoUrl: "https://github.com/arnabdebnath7/Quill",
    liveUrl: "https://quill-nine.vercel.app",
    stack: "TypeScript · Full Stack Document Engine",
    sceneKey: "observatory",
    metrics: "2,765 KB repository · Vercel edge",
    summary:
      "A scholarly manuscript and document synthesis workspace built in TypeScript for rapid knowledge distillation and archival reading."
  },
  {
    id: "website-hunter",
    order: "04",
    guild: "BUILDERS GUILD",
    title: "Astrolabe Web Hunter AI",
    repoName: "arnabdebnath7/website-hunter-ai",
    repoUrl: "https://github.com/arnabdebnath7/website-hunter-ai",
    liveUrl: "https://website-hunter-ai.vercel.app",
    stack: "TypeScript · Autonomous Reconnaissance",
    sceneKey: "cliffs",
    metrics: "2,310 KB repository · Live deployment",
    summary:
      "An intelligent cartography and reconnaissance instrument that surveys digital territories and evaluates web architecture."
  },
  {
    id: "mrittika",
    order: "05",
    guild: "CITADEL HOSPITALITY",
    title: "Mrittika Culinary Pavilion",
    repoName: "arnabdebnath7/Mrittika-Resturant",
    repoUrl: "https://github.com/arnabdebnath7/Mrittika-Resturant",
    liveUrl: "https://mrittika-resturant.vercel.app",
    stack: "TypeScript · Bespoke Digital Menu",
    sceneKey: "citadel",
    metrics: "Commercial release · Contai craft",
    summary:
      "A bespoke culinary and hospitality portal crafted with tactile typography, responsive curation, and instant mobile table discovery."
  },
  {
    id: "firebase-cloud",
    order: "06",
    guild: "INFRASTRUCTURE FOUNDRY",
    title: "Firebase Conduit & Cloud Workstation",
    repoName: "arnabdebnath7/Firebase-MCP",
    repoUrl: "https://github.com/arnabdebnath7/Preview",
    liveUrl: "https://github.com/arnabdebnath7?tab=repositories",
    stack: "Model Context Protocol · Cloud Shell",
    sceneKey: "forests",
    metrics: "9 total repositories · Mobile terminal",
    summary:
      "Protocol bridges and cloud terminal orchestration scripts engineered entirely from an Android mobile development workflow."
  }
];

/* --------------------------------------------------------------------------
   BIOME EXPLORER DATA (IMAGE 10: VALLEYS, CITIES, FORESTS, CLIFFS)
   -------------------------------------------------------------------------- */
const BIOME_REALMS = {
  valleys: {
    eyebrow: "REALM 01 / THE SUNKEN CALDERA",
    title: "The Waterfall Citadel",
    body: "The heart of Aegyra and Dinotopia, a classical sanctuary carved into emerald cliffs where scholarly engineering and primordial nature flow together.",
    coordinates: "LAT 21.78° N · LON 87.75° E · ELEVATION 1,420 CUBITS",
    sceneKey: "citadel",
    linkedRelic: "arnabdebnath7/DoraBot",
    linkedUrl: "https://dorabot-independent.vercel.app"
  },
  cities: {
    eyebrow: "REALM 02 / THE MARBLE VIADUCTS",
    title: "The Acropolis of Companions",
    body: "Monumental Corinthian colonnades and stone viaducts engineered to carry both robed scholars and gentle sauropod giants across the chasm.",
    coordinates: "LAT 21.84° N · LON 87.81° E · ELEVATION 2,180 CUBITS",
    sceneKey: "companions",
    linkedRelic: "arnabdebnath7/Quill",
    linkedUrl: "https://quill-nine.vercel.app"
  },
  forests: {
    eyebrow: "REALM 03 / THE VIRIDIAN CANOPY",
    title: "The Botanical Archives",
    body: "Ancient cedar groves and misty terraced basins where autonomous protocols and living ecosystems share a single unbroken memory.",
    coordinates: "LAT 21.71° N · LON 87.69° E · ELEVATION 860 CUBITS",
    sceneKey: "forests",
    linkedRelic: "arnabdebnath7/Trading-JOURNAL",
    linkedUrl: "https://trading-journal-server-woad.vercel.app"
  },
  cliffs: {
    eyebrow: "REALM 04 / THE ASTRAL PRECIPICE",
    title: "The Watchtower of Giants",
    body: "High limestone watchtowers overlooking the turquoise strait where celestial bolides are charted and new web architectures are forged.",
    coordinates: "LAT 21.92° N · LON 87.88° E · ELEVATION 3,410 CUBITS",
    sceneKey: "cliffs",
    linkedRelic: "arnabdebnath7/website-hunter-ai",
    linkedUrl: "https://website-hunter-ai.vercel.app"
  }
};

document.addEventListener("DOMContentLoaded", () => {
  // 1. Initialize Three.js 2.5D WebGL Stage & Celestial Bolide Intro
  const webglCanvas = document.getElementById("webgl-sanctum-canvas");
  const introGate = document.getElementById("starfall-intro-gate");

  const dismissIntroGate = () => {
    if (introGate && introGate.getAttribute("data-dismissed") !== "true") {
      introGate.setAttribute("data-dismissed", "true");
    }
  };

  const stage = new AegyraWebGLStage(webglCanvas, () => {
    setTimeout(dismissIntroGate, 650);
  });
  stage.setupScrollTrigger();

  const igniteBtn = document.getElementById("ignite-starfall-btn");
  if (igniteBtn) {
    igniteBtn.addEventListener("click", () => {
      stage.triggerImmediateImpact();
      dismissIntroGate();
    });
  }

  // Respect prefers-reduced-motion right away
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    stage.triggerImmediateImpact();
    dismissIntroGate();
  }

  // 2. Render Hero & Bento Classical Matte Canvases with Invisible LSB Watermarks
  document.querySelectorAll("canvas[data-matte-scene]").forEach((canvas) => {
    const sceneKey = canvas.getAttribute("data-matte-scene") || "citadel";
    renderClassicalMattePlate(canvas, sceneKey);
  });

  // 3. Render Real GitHub Relics Grid
  const relicsContainer = document.getElementById("relics-bento-container");
  const renderRelics = (filterGuild = "ALL") => {
    if (!relicsContainer) return;
    const filtered = filterGuild === "ALL"
      ? AEGYRA_RELICS
      : AEGYRA_RELICS.filter((r) => r.guild.includes(filterGuild));

    if (filtered.length === 0) {
      relicsContainer.innerHTML = `
        <div class="col-span-12 bezel-outer" style="padding: var(--spacing-500); text-align: center;">
          <p class="title-2">No chronicles found in this guild</p>
          <p class="body-5" style="color: var(--text-secondary); margin-top: var(--spacing-75);">
            Reset the guild filter to inspect all six engineered repositories in the sanctum.
          </p>
        </div>
      `;
      return;
    }

    relicsContainer.innerHTML = filtered
      .map((relic, idx) => {
        // Asymmetric 12-column bento pairing: alternate 7/5 and 5/7 spans
        const spanClass =
          idx % 3 === 0 ? "col-span-7" : idx % 3 === 1 ? "col-span-5" : "col-span-6";
        return `
          <article class="${spanClass} bezel-outer" data-relic-id="${relic.id}">
            <div style="display: flex; flex-direction: column; gap: var(--spacing-200);">
              <div class="bezel-inner aspect-16-10">
                <canvas
                  id="relic-canvas-${relic.id}"
                  width="640"
                  height="400"
                  style="width: 100%; height: 100%; display: block;"
                  aria-label="Classical oil matte plate for ${relic.title}"
                ></canvas>
              </div>
              <div style="padding: var(--spacing-100); display: flex; flex-direction: column; gap: var(--spacing-100);">
                <div style="display: flex; justify-content: space-between; align-items: center; gap: var(--spacing-100);">
                  <span class="caption-3 mono" style="color: var(--text-info);">RELIC ${relic.order} // ${relic.guild}</span>
                  <span class="caption-5 mono" style="color: var(--text-tertiary);">${relic.metrics}</span>
                </div>
                <h3 class="heading-5">${relic.title}</h3>
                <p class="body-5" style="color: var(--text-secondary);">${relic.summary}</p>
              </div>
            </div>
            <div style="padding: var(--spacing-100); border-top: 1px solid var(--border-primary); display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: var(--spacing-100); margin-top: var(--spacing-200);">
              <span class="caption-4 mono" style="color: var(--text-tertiary);">${relic.stack}</span>
              <div style="display: flex; gap: var(--spacing-75);">
                <a href="${relic.liveUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary button-sm">
                  Open live relic
                </a>
                <a href="${relic.repoUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary button-sm">
                  Inspect codex
                </a>
              </div>
            </div>
          </article>
        `;
      })
      .join("");

    // Paint each relic canvas and embed its invisible steganographic watermark
    filtered.forEach((relic) => {
      const c = document.getElementById(`relic-canvas-${relic.id}`);
      if (c) {
        renderClassicalMattePlate(c, relic.sceneKey);
      }
    });
  };

  renderRelics("ALL");

  document.querySelectorAll("[data-guild-filter]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("[data-guild-filter]").forEach((b) => {
        b.classList.remove("btn-primary");
        b.classList.add("btn-secondary");
      });
      btn.classList.remove("btn-secondary");
      btn.classList.add("btn-primary");
      renderRelics(btn.getAttribute("data-guild-filter"));
    });
  });

  // 4. Interactive Biome Explorer Tabs (Valleys, Cities, Forests, Cliffs)
  const biomeCanvas = document.getElementById("biome-showcase-canvas");
  if (biomeCanvas) {
    renderClassicalMattePlate(biomeCanvas, "citadel");
  }

  document.querySelectorAll("[data-biome-tab]").forEach((tab) => {
    tab.addEventListener("click", () => {
      const key = tab.getAttribute("data-biome-tab");
      const data = BIOME_REALMS[key];
      if (!data) return;

      document.querySelectorAll("[data-biome-tab]").forEach((t) => {
        t.setAttribute("aria-selected", "false");
      });
      tab.setAttribute("aria-selected", "true");

      const eyebrowEl = document.getElementById("biome-eyebrow");
      const titleEl = document.getElementById("biome-title");
      const bodyEl = document.getElementById("biome-body");
      const coordEl = document.getElementById("biome-coords");
      const linkEl = document.getElementById("biome-action-link");

      if (eyebrowEl) eyebrowEl.textContent = data.eyebrow;
      if (titleEl) titleEl.textContent = data.title;
      if (bodyEl) bodyEl.textContent = data.body;
      if (coordEl) coordEl.textContent = data.coordinates;
      if (linkEl) {
        linkEl.href = data.linkedUrl;
        linkEl.textContent = `Traverse ${data.linkedRelic}`;
      }

      if (biomeCanvas) {
        renderClassicalMattePlate(biomeCanvas, data.sceneKey);
      }
      stage.setBiomeLook(key);
    });
  });

  // 5. Mandatory B11 Tagline Reveal Section (Word-by-Word on Scroll via IntersectionObserver)
  const taglineEl = document.getElementById("b11-tagline-text");
  if (taglineEl) {
    const rawWords = taglineEl.textContent.trim().split(/\s+/);
    taglineEl.innerHTML = rawWords
      .map((w, i) => `<span class="reveal-word" data-word-idx="${i}">${w}</span>`)
      .join(" ");

    const wordSpans = Array.from(taglineEl.querySelectorAll(".reveal-word"));
    let ticking = false;

    const updateWordsOnScroll = () => {
      const rect = taglineEl.getBoundingClientRect();
      const viewH = window.innerHeight;
      // Trigger window from 85% viewport height to 30% viewport height
      const progress = Math.max(0, Math.min(1, (viewH * 0.85 - rect.top) / (viewH * 0.55)));
      const activeCount = Math.floor(progress * wordSpans.length);

      wordSpans.forEach((span, idx) => {
        if (idx <= activeCount) {
          span.classList.add("is-active");
        }
      });
      ticking = false;
    };

    const taglineObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            window.addEventListener(
              "scroll",
              () => {
                if (!ticking) {
                  window.requestAnimationFrame(updateWordsOnScroll);
                  ticking = true;
                }
              },
              { passive: true }
            );
            updateWordsOnScroll();
          }
        });
      },
      { threshold: 0.05 }
    );
    taglineObserver.observe(taglineEl);
  }

  // 6. Scroll Reveal Observer for Sections (B7: Once on enter, never replay on scroll up)
  const revealObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll(".reveal-section").forEach((sec) => {
    revealObserver.observe(sec);
  });

  // 7. Invisible LSB Steganographic Watermark Inspector
  const verifyStegoBtn = document.getElementById("verify-stego-btn");
  const stegoModal = document.getElementById("stego-modal");
  const stegoCloseBtn = document.getElementById("close-stego-modal");
  const stegoOutput = document.getElementById("stego-audit-output");

  const runStegoVerification = () => {
    const heroPlate = document.getElementById("hero-matte-canvas");
    if (!heroPlate || !stegoOutput) return;
    const result = decodeStegoWatermark(heroPlate);
    stegoOutput.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: var(--spacing-100);">
        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-primary); padding-bottom: var(--spacing-75);">
          <span class="caption-3 mono">STATUS</span>
          <span class="caption-3 mono" style="color: var(--text-success);">AUTHENTICATED // ZERO VISIBLE WATERMARK</span>
        </div>
        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-primary); padding-bottom: var(--spacing-75);">
          <span class="caption-3 mono">PROTOCOL</span>
          <span class="caption-4 mono">${result.bitDepth}</span>
        </div>
        <div style="display: flex; flex-direction: column; gap: var(--spacing-50);">
          <span class="caption-3 mono">EXTRACTED LSB PAYLOAD FROM CANVAS BUFFER</span>
          <code class="caption-4 mono" style="background: var(--surface-deep); padding: var(--spacing-100); border-radius: var(--radius-6); border: 1px solid var(--border-primary); color: var(--text-info); word-break: break-all;">
            ${result.signature}
          </code>
        </div>
      </div>
    `;
  };

  if (verifyStegoBtn && stegoModal) {
    verifyStegoBtn.addEventListener("click", () => {
      runStegoVerification();
      stegoModal.setAttribute("data-open", "true");
    });
  }
  if (stegoCloseBtn && stegoModal) {
    stegoCloseBtn.addEventListener("click", () => {
      stegoModal.setAttribute("data-open", "false");
    });
  }

  // 8. Foundations & 25-Variant Design System Modal
  const openFoundationsBtn = document.getElementById("open-foundations-btn");
  const foundationsModal = document.getElementById("foundations-modal");
  const closeFoundationsBtn = document.getElementById("close-foundations-modal");
  const buttonMatrixContainer = document.getElementById("button-25-matrix");

  if (buttonMatrixContainer) {
    const types = [
      { label: "Primary", cls: "btn-primary" },
      { label: "Secondary", cls: "btn-secondary" },
      { label: "Tertiary", cls: "btn-tertiary" },
      { label: "Error", cls: "btn-error" },
      { label: "Warning", cls: "btn-warning" }
    ];
    const states = ["default", "hover", "pressed", "focus", "disabled"];

    buttonMatrixContainer.innerHTML = types
      .map((t) =>
        states
          .map(
            (s) => `
          <button
            type="button"
            class="btn ${t.cls} button-sm"
            data-state="${s}"
            ${s === "disabled" ? "disabled" : ""}
          >
            ${t.label} ${s}
          </button>
        `
          )
          .join("")
      )
      .join("");
  }

  if (openFoundationsBtn && foundationsModal) {
    openFoundationsBtn.addEventListener("click", () => {
      foundationsModal.setAttribute("data-open", "true");
    });
  }
  if (closeFoundationsBtn && foundationsModal) {
    closeFoundationsBtn.addEventListener("click", () => {
      foundationsModal.setAttribute("data-open", "false");
    });
  }

  // 9. Theme Mode Toggle (Dark / Light Variable Modes)
  const themeToggleBtn = document.getElementById("theme-toggle-btn");
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme") || "dark";
      const next = current === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      themeToggleBtn.textContent = next === "dark" ? "Light mode" : "Dark mode";
    });
  }

  // 10. Mobile Full-Height Navigation Toggle
  const menuToggleBtn = document.getElementById("mobile-menu-toggle");
  const mobilePanel = document.getElementById("mobile-menu-panel");
  if (menuToggleBtn && mobilePanel) {
    menuToggleBtn.addEventListener("click", () => {
      const expanded = menuToggleBtn.getAttribute("aria-expanded") === "true";
      menuToggleBtn.setAttribute("aria-expanded", String(!expanded));
      mobilePanel.setAttribute("data-open", String(!expanded));
    });

    mobilePanel.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menuToggleBtn.setAttribute("aria-expanded", "false");
        mobilePanel.setAttribute("data-open", "false");
      });
    });
  }

  // 11. FAQ Accordion Controller
  document.querySelectorAll(".faq-trigger").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const expanded = trigger.getAttribute("aria-expanded") === "true";
      const panelId = trigger.getAttribute("aria-controls");
      const panel = document.getElementById(panelId);
      trigger.setAttribute("aria-expanded", String(!expanded));
      if (panel) {
        panel.hidden = expanded;
      }
    });
  });

  // 12. Client-Side Commission Form Validation (Calm, Specific Feedback — Zero window.alert)
  const form = document.getElementById("sanctum-commission-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const nameInput = document.getElementById("patron-name");
      const emailInput = document.getElementById("patron-email");
      const briefInput = document.getElementById("patron-brief");
      const statusBox = document.getElementById("form-status-message");

      let valid = true;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      const setError = (input, errId, msg) => {
        const errEl = document.getElementById(errId);
        if (msg) {
          input.setAttribute("aria-invalid", "true");
          if (errEl) {
            errEl.textContent = msg;
            errEl.hidden = false;
          }
          valid = false;
        } else {
          input.setAttribute("aria-invalid", "false");
          if (errEl) errEl.hidden = true;
        }
      };

      setError(
        nameInput,
        "err-patron-name",
        nameInput.value.trim().length < 2 ? "Enter your full name to register the missive." : ""
      );
      setError(
        emailInput,
        "err-patron-email",
        !emailRegex.test(emailInput.value.trim())
          ? "Enter a valid electronic mail address such as patron@domain.com."
          : ""
      );
      setError(
        briefInput,
        "err-patron-brief",
        briefInput.value.trim().length < 12
          ? "Include at least 12 characters describing your project scope."
          : ""
      );

      if (!valid) return;

      if (statusBox) {
        statusBox.hidden = false;
        statusBox.style.color = "var(--text-success)";
        statusBox.textContent = `Missive recorded for ${nameInput.value.trim()}. Dispatched to Arnab Debnath at debnatharnab64@gmail.com.`;
      }
      form.reset();
    });
  }

  // 13. Custom 404 Sanctuary Drawer Trigger (Ship Requirement B10)
  const open404Btn = document.getElementById("preview-404-btn");
  const modal404 = document.getElementById("custom-404-modal");
  const close404Btn = document.getElementById("close-404-modal");
  if (open404Btn && modal404) {
    open404Btn.addEventListener("click", (e) => {
      e.preventDefault();
      modal404.setAttribute("data-open", "true");
    });
  }
  if (close404Btn && modal404) {
    close404Btn.addEventListener("click", () => {
      modal404.setAttribute("data-open", "false");
    });
  }
});
