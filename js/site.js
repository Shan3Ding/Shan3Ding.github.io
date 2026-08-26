import {
  LANG_KEY,
  t,
  pick,
  getLang,
  applyStaticI18n,
  formatDate,
  formatDateLong,
} from "./i18n.js";

const EMAIL = "dingshanshan@fudan.edu.cn";

const ICONS = {
  menu: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>',
  close: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
  arrow: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
  external: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>',
};

const NAV = [
  { label: "I.", key: "nav.home", path: "/" },
  { label: "II.", key: "nav.publications", path: "/publications/" },
  { label: "III.", key: "nav.cv", path: "/cv/" },
  { label: "IV.", key: "nav.gallery", path: "/gallery/" },
  { label: "V.", key: "nav.news", path: "/news/" },
  { label: "VI.", key: "openings.label", path: "/#openings" },
];

const TOPICS = [
  { value: "all", key: "filter.all" },
  { value: "rotating_convection", key: "topic.rotating_convection" },
  { value: "boundary_layers", key: "topic.boundary_layers" },
  { value: "geostrophic_turbulence", key: "topic.geostrophic_turbulence" },
  { value: "vortex_dynamics", key: "topic.vortex_dynamics" },
  { value: "atmospheric_flows", key: "topic.atmospheric_flows" },
  { value: "other", key: "topic.other" },
];

const SORTS = [
  { value: "year_desc", key: "sort.year_desc" },
  { value: "year_asc", key: "sort.year_asc" },
  { value: "citations", key: "sort.citations" },
];

const CV_CATS = [
  { value: "all", key: "filter.all" },
  { value: "education", key: "cv.education" },
  { value: "position", key: "cv.positions" },
  { value: "grant", key: "cv.grants" },
  { value: "award", key: "cv.awards" },
  { value: "service", key: "cv.service" },
];

const CV_LABELS = {
  education: "cv.education",
  position: "cv.position",
  grant: "cv.grant",
  award: "cv.award",
  service: "cv.service",
};

const ROOT = new URL("../", import.meta.url);
const jsonCache = {};

function pathFor(href) {
  if (href === "/") return new URL("./", ROOT).href;
  if (href.startsWith("/#")) return new URL("./", ROOT).href + href.slice(1);
  return new URL(href.replace(/^\//, ""), ROOT).href;
}

function currentPath() {
  const p = window.location.pathname;
  if (p.includes("/publications")) return "/publications/";
  if (p.includes("/cv")) return "/cv/";
  if (p.includes("/gallery")) return "/gallery/";
  if (p.includes("/news")) return "/news/";
  return "/";
}

function setLang(lang) {
  try {
    localStorage.setItem(LANG_KEY, lang === "zh" ? "zh" : "en");
  } catch {
    /* ignore */
  }
  boot();
}

function langSwitch() {
  const lang = getLang();
  return `
    <div class="lang-switch" role="group" aria-label="Language">
      <button type="button" data-lang="en" class="${lang === "en" ? "is-active" : ""}">EN</button>
      <span class="lang-sep" aria-hidden="true">|</span>
      <button type="button" data-lang="zh" class="${lang === "zh" ? "is-active" : ""}">中文</button>
    </div>`;
}

function injectChrome() {
  const here = currentPath();
  const hash = window.location.hash;
  const header = document.getElementById("site-header");
  header.innerHTML = `
    <header class="site-header">
      <div class="site-header-inner">
        <a class="brand" href="${pathFor("/")}">${t("hero.name")}</a>
        <div class="header-actions">
          ${langSwitch()}
          <button class="index-btn" type="button" aria-label="${t("nav.index")}" id="open-index">
            <span>${t("nav.index")}</span>${ICONS.menu}
          </button>
        </div>
      </div>
    </header>
    <div class="overlay-backdrop" id="overlay-bg"></div>
    <nav class="overlay-panel" id="index-panel" aria-label="${t("nav.index")}">
      <div class="overlay-head">
        <span>${t("nav.index")}</span>
        <button class="overlay-close" type="button" id="close-index" aria-label="${t("nav.close")}">${ICONS.close}</button>
      </div>
      <div class="overlay-nav">
        ${NAV.map((item) => {
          const active = item.path === "/#openings"
            ? here === "/" && hash === "#openings"
            : here === item.path && !(item.path === "/" && hash === "#openings");
          return `
          <a class="overlay-link${active ? " is-active" : ""}" href="${pathFor(item.path)}">
            <span class="num">${item.label}</span>
            <span class="label">${t(item.key)}</span>
          </a>`;
        }).join("")}
      </div>
    </nav>
  `;

  const footer = document.getElementById("site-footer");
  footer.innerHTML = `
    <footer class="site-footer">
      <div class="footer-inner">
        <div class="footer-grid">
          <div class="footer-copy">
            <h2 class="text-section">${t("footer.collaborate")}</h2>
            <p class="text-body">${t("footer.body")}</p>
            <a class="footer-email" href="mailto:${EMAIL}">${EMAIL} →</a>
          </div>
          <div class="footer-map">
            <span class="footer-map-label">${t("footer.sitemap")}</span>
            <nav>
              <a href="${pathFor("/")}">${t("nav.home")}</a>
              <a href="${pathFor("/publications/")}">${t("nav.publications")}</a>
              <a href="${pathFor("/cv/")}">${t("nav.cv")}</a>
              <a href="${pathFor("/gallery/")}">${t("nav.gallery")}</a>
              <a href="${pathFor("/news/")}">${t("nav.news")}</a>
              <a href="${pathFor("/#openings")}">${t("openings.label")}</a>
            </nav>
          </div>
        </div>
        <div class="footer-rule"></div>
        <div class="footer-bottom">
          <span>${t("footer.rights")}</span>
        </div>
      </div>
    </footer>
  `;

  const open = () => document.body.classList.add("nav-open");
  const close = () => document.body.classList.remove("nav-open");
  document.getElementById("open-index").addEventListener("click", open);
  document.getElementById("close-index").addEventListener("click", close);
  document.getElementById("overlay-bg").addEventListener("click", close);
  header.querySelector(".lang-switch").addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-lang]");
    if (!btn || btn.dataset.lang === getLang()) return;
    setLang(btn.dataset.lang);
  });
}

async function loadJSON(name) {
  if (!jsonCache[name]) {
    const url = new URL(`data/${name}.json`, ROOT);
    jsonCache[name] = fetch(url).then((res) => res.json());
  }
  return jsonCache[name];
}

function md(text) {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>");
}

function catLabel(category) {
  return t(`cat.${category}`) !== `cat.${category}` ? t(`cat.${category}`) : category;
}

function bindOnce(el, type, fn, flag = "bound") {
  if (!el || el.dataset[flag]) return;
  el.dataset[flag] = "1";
  el.addEventListener(type, fn);
}

function assetHref(path) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return new URL(String(path).replace(/^\.\.\//, "").replace(/^\//, ""), ROOT).href;
}

function pubCard(p, { abstract = false, doi = false } = {}) {
  const doiHref = p.doi ? `https://doi.org/${p.doi}` : null;
  return `
    <article class="pub-card">
      <div class="pub-row">
        <span class="pub-year">${p.year}</span>
        <div>
          <div class="pub-head">
            <h3 class="notranslate">${p.title}</h3>
            ${doi && doiHref ? `<div class="pub-links"><a href="${doiHref}" target="_blank" rel="noopener noreferrer">${ICONS.external} DOI</a></div>` : ""}
          </div>
          <p class="pub-authors notranslate">${p.authors}</p>
          <p class="pub-journal notranslate">${p.journal}</p>
          ${abstract && p.abstract ? `<p class="pub-abstract notranslate">${p.abstract}</p>` : ""}
        </div>
      </div>
    </article>`;
}

const SELECTED_SPEC = [
  { year: 2026, re: /Physical Review Letters/i },
  { year: 2025, re: /Journal of Fluid Mechanics/i },
  { year: 2024, re: /Journal of Fluid Mechanics/i },
  { year: 2023, re: /Journal of Fluid Mechanics/i },
  { year: 2022, re: /Journal of Fluid Mechanics/i },
  { year: 2021, re: /Nature Communications/i },
  { year: 2019, re: /Physical Review Fluids/i },
];

function selectedPubs(pubs) {
  const flagged = pubs
    .filter((p) => p.selected)
    .sort((a, b) => (a.selected_order || 99) - (b.selected_order || 99));
  if (flagged.length) return flagged;
  return SELECTED_SPEC.map((s) => pubs.find((p) => p.year === s.year && s.re.test(p.journal))).filter(Boolean);
}

function timelineNewsCard(n) {
  const img = n.image
    ? `<img class="tl-img" src="${assetHref(n.image)}" alt="">`
    : "";
  const title = n.link_url
    ? `<a href="${n.link_url}" target="_blank" rel="noopener noreferrer">${pick(n, "title")}</a>`
    : pick(n, "title");
  return `
    <div class="tl-panel">
      <div class="tl-date-row">
        <time class="tl-date" datetime="${n.date || ""}">${formatDate(n.date)}</time>
      </div>
      <div class="tl-body">
        ${n.category ? `<span class="tl-cat">${catLabel(n.category)}</span>` : ""}
        <h3>${title}</h3>
        <p class="tl-excerpt">${md(pick(n, "content"))}</p>
        ${img}
      </div>
    </div>`;
}

async function renderHome() {
  const [pubs, news] = await Promise.all([loadJSON("publications"), loadJSON("news")]);
  const latestNews = [...news]
    .map((n, idx) => ({ n, idx }))
    .sort((a, b) => (b.n.date || "").localeCompare(a.n.date || "") || a.idx - b.idx)
    .slice(0, 5)
    .sort((a, b) => {
      const d = (a.n.date || "").localeCompare(b.n.date || "");
      if (d) return d;
      return a.idx - b.idx;
    });

  document.getElementById("home-timeline").innerHTML = latestNews.map(({ n }) =>
    `<li class="tl-item is-news">${timelineNewsCard(n)}<span class="tl-node" aria-hidden="true"></span></li>`
  ).join("");

  const chosen = selectedPubs(pubs);
  document.getElementById("selected-pubs").innerHTML =
    chosen.map((p) => pubCard(p, { doi: true })).join("") +
    `<a class="link-more" href="${pathFor("/publications/")}">${t("home.viewAllPubs")} ${ICONS.arrow}</a>`;
}

async function renderPublications() {
  const pubs = await loadJSON("publications");
  if (!renderPublications.state) {
    renderPublications.state = { topic: "all", sort: "year_desc" };
  }
  const state = renderPublications.state;
  const countEl = document.getElementById("pub-count");
  const listEl = document.getElementById("pub-list");
  const topicEl = document.getElementById("pub-topics");
  const sortEl = document.getElementById("pub-sorts");

  const draw = () => {
    topicEl.innerHTML = TOPICS.map((item) =>
      `<button type="button" class="chip${state.topic === item.value ? " is-active" : ""}" data-v="${item.value}">${t(item.key)}</button>`
    ).join("");
    sortEl.innerHTML = SORTS.map((item) =>
      `<button type="button" class="chip is-sort${state.sort === item.value ? " is-active" : ""}" data-v="${item.value}">${t(item.key)}</button>`
    ).join("");

    let items = pubs.filter((p) => state.topic === "all" || p.topic === state.topic);
    items = [...items].sort((a, b) => {
      if (state.sort === "year_asc") return a.year - b.year;
      if (state.sort === "citations") return (b.citation_count || 0) - (a.citation_count || 0);
      return b.year - a.year;
    });
    countEl.textContent = t("pub.works", { n: items.length });
    listEl.innerHTML = items.map((p) => pubCard(p, { abstract: true, doi: true })).join("");
  };

  bindOnce(topicEl, "click", (e) => {
    const btn = e.target.closest("button[data-v]");
    if (!btn) return;
    state.topic = btn.dataset.v;
    draw();
  }, "pubTopicBound");
  bindOnce(sortEl, "click", (e) => {
    const btn = e.target.closest("button[data-v]");
    if (!btn) return;
    state.sort = btn.dataset.v;
    draw();
  }, "pubSortBound");
  draw();
}

async function renderCV() {
  const entries = await loadJSON("cv");
  if (!renderCV.state) renderCV.state = { cat: "all" };
  const state = renderCV.state;
  const filters = document.getElementById("cv-filters");
  const yearsEl = document.getElementById("cv-years");
  const list = document.getElementById("cv-list");
  const countEl = document.getElementById("cv-count");

  const draw = () => {
    filters.innerHTML = CV_CATS.map((c) =>
      `<button type="button" class="chip${state.cat === c.value ? " is-active" : ""}" data-v="${c.value}">${t(c.key)}</button>`
    ).join("");
    const items = entries.filter((e) => state.cat === "all" || e.category === state.cat);
    countEl.textContent = t("cv.milestones", { n: items.length });
    const years = [...new Set(items.map((e) => e.start_year))].sort((a, b) => b - a).slice(0, 10);
    yearsEl.innerHTML = `<div class="theorem-line" style="margin-bottom:1rem"></div>` +
      years.map((y) => `<span>${y}</span>`).join("");
    list.innerHTML = items.map((e) => {
      const range = e.end_year ? `${e.start_year}–${e.end_year}` : `${e.start_year}–${t("cv.present")}`;
      const email = e.email
        ? `<p class="cv-email"><a href="mailto:${e.email}">${e.email}</a></p>`
        : "";
      return `
        <article class="cv-item">
          <div class="cv-rail"><div class="cv-dot"></div><div class="cv-line"></div></div>
          <div class="cv-body">
            <div class="cv-meta">
              <span class="years">${range}</span>
              <span class="cat">${t(CV_LABELS[e.category] || e.category)}</span>
            </div>
            <h3>${pick(e, "title")}</h3>
            ${e.institution ? `<p class="cv-inst">${pick(e, "institution")}</p>` : ""}
            ${email}
            ${pick(e, "description") ? `<p class="cv-desc">${pick(e, "description")}</p>` : ""}
          </div>
        </article>`;
    }).join("");
  };

  bindOnce(filters, "click", (e) => {
    const btn = e.target.closest("button[data-v]");
    if (!btn) return;
    state.cat = btn.dataset.v;
    draw();
  }, "cvFilterBound");
  draw();
}

async function renderNews() {
  const news = await loadJSON("news");
  const items = [...news].sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  document.getElementById("news-list").innerHTML = items.map((n) => `
    <article class="news-item">
      <div class="news-meta">
        ${n.pinned ? `<span class="pin">${t("news.pinned")}</span>` : ""}
        <span class="date">${formatDateLong(n.date)}</span>
        ${n.category ? `<span class="cat">${catLabel(n.category)}</span>` : ""}
      </div>
      <h2>${pick(n, "title")}</h2>
      ${pick(n, "content") ? `<div class="content">${md(pick(n, "content"))}</div>` : ""}
      ${n.image ? `<img class="news-photo" src="${assetHref(n.image)}" alt="">` : ""}
      ${n.link_url ? `<a class="read-more" href="${n.link_url}" target="_blank" rel="noopener noreferrer">${t("news.readMore")} ${ICONS.external}</a>` : ""}
    </article>`).join("");
}

function youtubeId(url) {
  if (!url) return "";
  const m = String(url).match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : "";
}

async function renderGallery() {
  const items = await loadJSON("gallery");
  document.getElementById("gallery-count").textContent = t("gallery.figures", { n: items.length });
  const allChip = document.getElementById("gallery-all");
  if (allChip) allChip.textContent = t("filter.all");
  const el = document.getElementById("gallery-list");
  if (!items.length) {
    el.innerHTML = `<p class="empty">${t("gallery.empty")}</p>`;
    return;
  }
  el.innerHTML = `<div class="gallery-grid">${items.map((n) => {
    const title = pick(n, "title") || n.title || "";
    const yt = n.media_type === "youtube" ? youtubeId(n.file_url) : "";
    let media = "";
    if (yt) {
      media = `<iframe src="https://www.youtube.com/embed/${yt}?rel=0" title="${title}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
    } else if (n.media_type === "animation") {
      media = `<video src="${n.file_url}" autoplay loop muted playsinline></video>`;
    } else {
      media = `<img src="${n.file_url}" alt="${title}">`;
    }
    const kind = yt || n.media_type === "animation" ? t("gallery.living") : t("gallery.figure");
    return `
    <article class="gallery-card${yt ? " is-video" : ""}">
      <div class="gallery-media">${media}</div>
      <div class="gallery-cap">
        <span>${kind}</span>
        <h3>${title}</h3>
      </div>
    </article>`;
  }).join("")}</div>`;
}

function figureInkTop(img) {
  const w = img.naturalWidth;
  const h = img.naturalHeight;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(img, 0, 0);
  const data = ctx.getImageData(0, 0, w, h).data;
  const x0 = Math.floor(w * 0.4);
  for (let y = 0; y < h; y++) {
    let n = 0;
    for (let x = x0; x < w; x++) {
      const i = (y * w + x) * 4;
      if (data[i] < 248 || data[i + 1] < 248 || data[i + 2] < 248) n += 1;
    }
    if (n > 2) return y;
  }
  return 0;
}

function alignHeroFigure() {
  const hero = document.querySelector(".hero");
  const img = document.querySelector(".hero-bg img");
  const portrait = document.querySelector(".hero-portrait");
  if (!hero || !img || !portrait || !img.naturalWidth) return;
  const boxW = img.clientWidth;
  const boxH = img.clientHeight;
  const scale = Math.min(boxW / img.naturalWidth, boxH / img.naturalHeight);
  const rendH = img.naturalHeight * scale;
  const offY = (boxH - rendH) / 2;
  if (alignHeroFigure.ringTop == null) alignHeroFigure.ringTop = figureInkTop(img);
  const ringTopInHero = offY + alignHeroFigure.ringTop * scale;
  const portraitTopInHero = portrait.getBoundingClientRect().top - hero.getBoundingClientRect().top;
  img.style.transform = `translateY(${Math.round(portraitTopInHero - ringTopInHero)}px)`;
}

function initHeroAlign() {
  const img = document.querySelector(".hero-bg img");
  if (!img) return;
  const run = () => alignHeroFigure();
  const start = () => {
    run();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(run);
  };
  if (img.complete && img.naturalWidth) start();
  else img.addEventListener("load", start, { once: true });
  window.addEventListener("resize", run);
}

function boot() {
  injectChrome();
  applyStaticI18n();
  const page = document.body.dataset.page;
  if (page === "home") {
    initHeroAlign();
    renderHome();
  }
  if (page === "publications") renderPublications();
  if (page === "cv") renderCV();
  if (page === "news") renderNews();
  if (page === "gallery") renderGallery();
}

boot();
