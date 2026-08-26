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
  const header = document.getElementById("site-header");
  header.innerHTML = `
    <header class="site-header">
      <div class="site-header-inner">
        <a class="brand" href="${pathFor("/")}">S.-S. Ding</a>
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
        ${NAV.map((item) => `
          <a class="overlay-link${here === item.path ? " is-active" : ""}" href="${pathFor(item.path)}">
            <span class="num">${item.label}</span>
            <span class="label">${t(item.key)}</span>
          </a>`).join("")}
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
            </nav>
          </div>
        </div>
        <div class="footer-rule"></div>
        <div class="footer-bottom">
          <span>${t("footer.rights")}</span>
          <span>${t("footer.monograph")}</span>
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

async function renderHome() {
  const [pubs, news] = await Promise.all([loadJSON("publications"), loadJSON("news")]);
  const recent = [...pubs].sort((a, b) => b.year - a.year).slice(0, 4);
  const latest = [...news].sort((a, b) => (b.date || "").localeCompare(a.date || "")).slice(0, 3);

  document.getElementById("recent-pubs").innerHTML =
    recent.map((p) => pubCard(p)).join("") +
    `<a class="link-more" href="${pathFor("/publications/")}">${t("home.viewAllPubs")} ${ICONS.arrow}</a>`;

  document.getElementById("latest-news").innerHTML = latest.map((n) => `
    <article class="news-card">
      <div class="news-meta">
        <span class="date">${formatDate(n.date)}</span>
        ${n.category ? `<span class="cat">${catLabel(n.category)}</span>` : ""}
      </div>
      <h3>${pick(n, "title")}</h3>
      <p class="line-clamp-3">${md(pick(n, "content"))}</p>
    </article>`).join("");
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
      ${n.link_url ? `<a class="read-more" href="${n.link_url}" target="_blank" rel="noopener noreferrer">${t("news.readMore")} ${ICONS.external}</a>` : ""}
    </article>`).join("");
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
  el.innerHTML = `<div class="gallery-grid">${items.map((n) => `
    <article class="gallery-card">
      ${n.media_type === "animation"
        ? `<video src="${n.file_url}" autoplay loop muted playsinline></video>`
        : `<img src="${n.file_url}" alt="${n.title || ""}">`}
      <div class="cap"><div class="cap-inner">
        <span>${n.media_type === "animation" ? t("gallery.living") : t("gallery.figure")}</span>
        <h3>${n.title || ""}</h3>
      </div></div>
    </article>`).join("")}</div>`;
}

function boot() {
  injectChrome();
  applyStaticI18n();
  const page = document.body.dataset.page;
  if (page === "home") renderHome();
  if (page === "publications") renderPublications();
  if (page === "cv") renderCV();
  if (page === "news") renderNews();
  if (page === "gallery") renderGallery();
}

boot();
