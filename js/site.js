const ICONS = {
  menu: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>',
  close: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
  arrow: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
  external: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>',
};

const NAV = [
  { label: "I.", title: "Home", path: "/" },
  { label: "II.", title: "Publications", path: "/publications/" },
  { label: "III.", title: "Curriculum Vitae", path: "/cv/" },
  { label: "IV.", title: "Gallery", path: "/gallery/" },
  { label: "V.", title: "News", path: "/news/" },
];

const TOPICS = [
  { value: "all", label: "All" },
  { value: "rotating_convection", label: "Rotating Convection" },
  { value: "boundary_layers", label: "Boundary Layers" },
  { value: "geostrophic_turbulence", label: "Geostrophic Turbulence" },
  { value: "vortex_dynamics", label: "Vortex Dynamics" },
  { value: "atmospheric_flows", label: "Atmospheric Flows" },
  { value: "other", label: "Other" },
];

const SORTS = [
  { value: "year_desc", label: "Newest First" },
  { value: "year_asc", label: "Oldest First" },
  { value: "citations", label: "Most Cited" },
];

const CV_CATS = [
  { value: "all", label: "All" },
  { value: "education", label: "Education" },
  { value: "position", label: "Positions" },
  { value: "grant", label: "Grants" },
  { value: "award", label: "Awards" },
  { value: "service", label: "Service" },
];

const CV_LABELS = {
  education: "Education",
  position: "Position",
  grant: "Grant",
  award: "Award",
  service: "Service",
};

const ROOT = new URL("../", import.meta.url);

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

function injectChrome() {
  const here = currentPath();
  const header = document.getElementById("site-header");
  header.innerHTML = `
    <header class="site-header">
      <div class="site-header-inner">
        <a class="brand" href="${pathFor("/")}">S.-S. Ding</a>
        <button class="index-btn" type="button" aria-label="Index" id="open-index">
          <span>Index</span>${ICONS.menu}
        </button>
      </div>
    </header>
    <div class="overlay-backdrop" id="overlay-bg"></div>
    <nav class="overlay-panel" id="index-panel" aria-label="Index">
      <div class="overlay-head">
        <span>Index</span>
        <button class="overlay-close" type="button" id="close-index" aria-label="Close">${ICONS.close}</button>
      </div>
      <div class="overlay-nav">
        ${NAV.map((item) => `
          <a class="overlay-link${here === item.path ? " is-active" : ""}" href="${pathFor(item.path)}">
            <span class="num">${item.label}</span>
            <span class="label">${item.title}</span>
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
            <h2 class="text-section">Let's Collaborate</h2>
            <p class="text-body">I'm always open to discussing new research opportunities, collaborations, or simply exchanging ideas about fluid dynamics, geostrophic turbulence, and atmospheric flows.</p>
            <a class="footer-email" href="mailto:shanshan.ding@physics.ox.ac.uk">shanshan.ding@physics.ox.ac.uk →</a>
          </div>
          <div class="footer-map">
            <span class="footer-map-label">Site Map</span>
            <nav>
              <a href="${pathFor("/")}">Home</a>
              <a href="${pathFor("/publications/")}">Publications</a>
              <a href="${pathFor("/cv/")}">Curriculum Vitae</a>
              <a href="${pathFor("/gallery/")}">Gallery</a>
              <a href="${pathFor("/news/")}">News</a>
            </nav>
          </div>
        </div>
        <div class="footer-rule"></div>
        <div class="footer-bottom">
          <span>© 2026 — All rights reserved</span>
          <span>The Living Monograph</span>
        </div>
      </div>
    </footer>
  `;

  const open = () => document.body.classList.add("nav-open");
  const close = () => document.body.classList.remove("nav-open");
  document.getElementById("open-index").addEventListener("click", open);
  document.getElementById("close-index").addEventListener("click", close);
  document.getElementById("overlay-bg").addEventListener("click", close);
}

async function loadJSON(name) {
  const url = new URL(`data/${name}.json`, ROOT);
  const res = await fetch(url);
  return res.json();
}

function md(text) {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>");
}

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }).replace(",", "");
}

function formatDateLong(iso) {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function pubCard(p, { abstract = false, doi = false } = {}) {
  const doiHref = p.doi ? `https://doi.org/${p.doi}` : null;
  return `
    <article class="pub-card">
      <div class="pub-row">
        <span class="pub-year">${p.year}</span>
        <div class="pub-main">
          <div>
            <h3>${p.title}</h3>
            <p class="pub-authors">${p.authors}</p>
            <p class="pub-journal">${p.journal}</p>
            ${abstract && p.abstract ? `<p class="pub-abstract">${p.abstract}</p>` : ""}
          </div>
          ${doi && doiHref ? `<div class="pub-links"><a href="${doiHref}" target="_blank" rel="noopener noreferrer">${ICONS.external} DOI</a></div>` : ""}
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
    `<a class="link-more" href="${pathFor("/publications/")}">View all publications ${ICONS.arrow}</a>`;

  document.getElementById("latest-news").innerHTML = latest.map((n) => `
    <article class="news-card">
      <div class="news-meta">
        <span class="news-date">${formatDate(n.date)}</span>
        ${n.category ? `<span class="news-cat">${n.category}</span>` : ""}
      </div>
      <h3>${n.title}</h3>
      <p>${md(n.content)}</p>
    </article>`).join("");
}

async function renderPublications() {
  const pubs = await loadJSON("publications");
  let topic = "all";
  let sort = "year_desc";
  const countEl = document.getElementById("pub-count");
  const listEl = document.getElementById("pub-list");
  const topicEl = document.getElementById("pub-topics");
  const sortEl = document.getElementById("pub-sorts");

  const draw = () => {
    topicEl.innerHTML = TOPICS.map((t) =>
      `<button type="button" class="filter-btn${topic === t.value ? " active" : ""}" data-v="${t.value}">${t.label}</button>`
    ).join("");
    sortEl.innerHTML = SORTS.map((s) =>
      `<button type="button" class="filter-btn${sort === s.value ? " accent" : ""}" data-v="${s.value}">${s.label}</button>`
    ).join("");

    let items = pubs.filter((p) => topic === "all" || p.topic === topic);
    items = [...items].sort((a, b) => {
      if (sort === "year_asc") return a.year - b.year;
      if (sort === "citations") return (b.citation_count || 0) - (a.citation_count || 0);
      return b.year - a.year;
    });
    countEl.textContent = `${items.length} works`;
    listEl.innerHTML = items.map((p) => pubCard(p, { abstract: true, doi: true })).join("");
  };

  topicEl.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-v]");
    if (!btn) return;
    topic = btn.dataset.v;
    draw();
  });
  sortEl.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-v]");
    if (!btn) return;
    sort = btn.dataset.v;
    draw();
  });
  draw();
}

async function renderCV() {
  const entries = await loadJSON("cv");
  let cat = "all";
  const filters = document.getElementById("cv-filters");
  const yearsEl = document.getElementById("cv-years");
  const list = document.getElementById("cv-list");
  const countEl = document.getElementById("cv-count");

  const draw = () => {
    filters.innerHTML = CV_CATS.map((c) =>
      `<button type="button" class="filter-btn${cat === c.value ? " active" : ""}" data-v="${c.value}">${c.label}</button>`
    ).join("");
    const items = entries.filter((e) => cat === "all" || e.category === cat);
    countEl.textContent = `${items.length} milestones`;
    const years = [...new Set(items.map((e) => e.start_year))].sort((a, b) => b - a).slice(0, 10);
    yearsEl.innerHTML = `<div class="theorem-line" style="margin-bottom:1rem"></div>` +
      years.map((y) => `<span>${y}</span>`).join("");
    list.innerHTML = items.map((e) => {
      const range = e.end_year ? `${e.start_year}–${e.end_year}` : `${e.start_year}–Present`;
      return `
        <article class="cv-item">
          <div class="cv-rail"><div class="cv-dot"></div><div class="cv-line"></div></div>
          <div class="cv-body">
            <div class="cv-meta">
              <span class="cv-range">${range}</span>
              <span class="cv-cat">${CV_LABELS[e.category] || e.category}</span>
            </div>
            <h3>${e.title}</h3>
            ${e.institution ? `<p class="cv-inst">${e.institution}</p>` : ""}
            ${e.description ? `<p class="cv-desc">${e.description}</p>` : ""}
          </div>
        </article>`;
    }).join("");
  };

  filters.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-v]");
    if (!btn) return;
    cat = btn.dataset.v;
    draw();
  });
  draw();
}

async function renderNews() {
  const news = await loadJSON("news");
  const items = [...news].sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  document.getElementById("news-list").innerHTML = items.map((n) => `
    <article class="news-item">
      <div class="news-meta">
        ${n.pinned ? `<span class="pin">Pinned</span>` : ""}
        <span class="news-date">${formatDateLong(n.date)}</span>
        ${n.category ? `<span class="news-cat">${n.category}</span>` : ""}
      </div>
      <h2>${n.title}</h2>
      ${n.content ? `<div class="content">${md(n.content)}</div>` : ""}
      ${n.link_url ? `<a class="text-link" href="${n.link_url}" target="_blank" rel="noopener noreferrer" style="margin-top:1rem">Read more ${ICONS.external}</a>` : ""}
    </article>`).join("");
}

async function renderGallery() {
  const items = await loadJSON("gallery");
  document.getElementById("gallery-count").textContent = `${items.length} figures`;
  const el = document.getElementById("gallery-list");
  if (!items.length) {
    el.innerHTML = `<p class="empty">No gallery items yet. Upload images and animations from the admin panel.</p>`;
    return;
  }
  el.innerHTML = `<div class="gallery-grid">${items.map((n) => `
    <article class="gallery-card">
      ${n.media_type === "animation"
        ? `<video src="${n.file_url}" autoplay loop muted playsinline></video>`
        : `<img src="${n.file_url}" alt="${n.title || ""}">`}
      <div class="cap"><div class="cap-inner">
        <span>${n.media_type === "animation" ? "Living Figure" : "Figure"}</span>
        <h3>${n.title || ""}</h3>
      </div></div>
    </article>`).join("")}</div>`;
}

injectChrome();
const page = document.body.dataset.page;
if (page === "home") renderHome();
if (page === "publications") renderPublications();
if (page === "cv") renderCV();
if (page === "news") renderNews();
if (page === "gallery") renderGallery();
