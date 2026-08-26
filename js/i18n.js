export const LANG_KEY = "sa-lang";

export const I18N = {
  en: {
    "nav.home": "Home",
    "nav.publications": "Publications",
    "nav.cv": "Curriculum Vitae",
    "nav.gallery": "Gallery",
    "nav.news": "News",
    "nav.index": "Index",
    "nav.close": "Close",
    "hero.kicker": "Fluid Dynamics · Geophysical Turbulence · Atmospheric Flows",
    "hero.bio": "Assistant Professor, leading independent research on thermal effects over rough-wall turbulent boundary layers and large-scale flow structures in geophysical and astrophysical flows.",
    "hero.affil": "Fudan University",
    "hero.focusLabel": "Current Focus",
    "hero.focus": "Thermal effect in geophysical turbulence",
    "home.recentPubs": "Recent Publications",
    "home.latestNews": "Latest News",
    "home.viewAllPubs": "View all publications",
    "home.allNews": "All news",
    "openings.label": "Openings",
    "openings.phd": "One Ph.D. position in fluid mechanics is available this year.",
    "openings.postdoc": "Applications for postdoctoral positions are welcome at any time.",
    "openings.contact": "Please write to",
    "footer.collaborate": "Let's Collaborate",
    "footer.body": "I'm always open to discussing new research opportunities, collaborations, or simply exchanging ideas about fluid dynamics, geostrophic turbulence, and atmospheric flows.",
    "footer.sitemap": "Site Map",
    "footer.rights": "© 2026 — All rights reserved",
    "footer.monograph": "The Living Monograph",
    "page.publications": "Publications",
    "page.cv": "Curriculum Vitae",
    "page.news": "News",
    "page.gallery": "Gallery",
    "news.subtitle": "Updates & announcements",
    "news.pinned": "Pinned",
    "news.readMore": "Read more",
    "pub.works": "{n} works",
    "cv.milestones": "{n} milestones",
    "gallery.figures": "{n} figures",
    "gallery.empty": "No gallery items yet.",
    "gallery.figure": "Figure",
    "gallery.living": "Living Figure",
    "filter.all": "All",
    "topic.rotating_convection": "Rotating Convection",
    "topic.boundary_layers": "Boundary Layers",
    "topic.geostrophic_turbulence": "Geostrophic Turbulence",
    "topic.vortex_dynamics": "Vortex Dynamics",
    "topic.atmospheric_flows": "Atmospheric Flows",
    "topic.other": "Other",
    "sort.year_desc": "Newest First",
    "sort.year_asc": "Oldest First",
    "sort.citations": "Most Cited",
    "cv.education": "Education",
    "cv.position": "Position",
    "cv.positions": "Positions",
    "cv.grant": "Grant",
    "cv.grants": "Grants",
    "cv.award": "Award",
    "cv.awards": "Awards",
    "cv.service": "Service",
    "cv.present": "Present",
    "cat.publication": "publication",
    "cat.press": "press",
    "cat.talk": "talk",
    "cat.award": "award",
    "cat.opening": "opening",
    "meta.home": "Shan-Shan Ding — Assistant Professor at Fudan University. Fluid dynamics, geostrophic turbulence, and atmospheric flows.",
  },
  zh: {
    "nav.home": "首页",
    "nav.publications": "论文",
    "nav.cv": "简历",
    "nav.gallery": "图集",
    "nav.news": "新闻",
    "nav.index": "目录",
    "nav.close": "关闭",
    "hero.kicker": "流体力学 · 地球物理湍流 · 大气流动",
    "hero.bio": "助理教授。独立开展粗糙壁湍流边界层热效应，以及地球物理与天体物理流动中大尺度结构的研究。",
    "hero.affil": "复旦大学",
    "hero.focusLabel": "当前方向",
    "hero.focus": "地球物理湍流中的热效应",
    "home.recentPubs": "近期论文",
    "home.latestNews": "最新动态",
    "home.viewAllPubs": "全部论文",
    "home.allNews": "全部新闻",
    "openings.label": "招收人员",
    "openings.phd": "今年有流体力学方向博士生名额 1 名。",
    "openings.postdoc": "长期欢迎申请博士后岗位的研究人员联系。",
    "openings.contact": "请将材料发送至",
    "footer.collaborate": "欢迎合作",
    "footer.body": "欢迎就新的研究机会、合作，或流体力学、地球物理湍流与大气流动相关问题来信讨论。",
    "footer.sitemap": "网站地图",
    "footer.rights": "© 2026 — 保留所有权利",
    "footer.monograph": "The Living Monograph",
    "page.publications": "论文",
    "page.cv": "简历",
    "page.news": "新闻",
    "page.gallery": "图集",
    "news.subtitle": "动态与公告",
    "news.pinned": "置顶",
    "news.readMore": "阅读原文",
    "pub.works": "{n} 篇",
    "cv.milestones": "{n} 条",
    "gallery.figures": "{n} 幅",
    "gallery.empty": "暂无图集内容。",
    "gallery.figure": "图",
    "gallery.living": "动态图",
    "filter.all": "全部",
    "topic.rotating_convection": "旋转对流",
    "topic.boundary_layers": "边界层",
    "topic.geostrophic_turbulence": "地转湍流",
    "topic.vortex_dynamics": "涡动力学",
    "topic.atmospheric_flows": "大气流动",
    "topic.other": "其他",
    "sort.year_desc": "最新优先",
    "sort.year_asc": "最早优先",
    "sort.citations": "引用最多",
    "cv.education": "教育",
    "cv.position": "任职",
    "cv.positions": "任职",
    "cv.grant": "项目",
    "cv.grants": "项目",
    "cv.award": "荣誉",
    "cv.awards": "荣誉",
    "cv.service": "学术服务",
    "cv.present": "至今",
    "cat.publication": "发表",
    "cat.press": "媒体",
    "cat.talk": "报告",
    "cat.award": "荣誉",
    "cat.opening": "招生",
    "meta.home": "丁杉杉 — 复旦大学助理教授。流体力学、地球物理湍流与大气流动。",
  },
};

export function getLang() {
  try {
    return localStorage.getItem(LANG_KEY) === "zh" ? "zh" : "en";
  } catch {
    return "en";
  }
}

export function t(key, vars) {
  const lang = getLang();
  let s = (I18N[lang] && I18N[lang][key]) || I18N.en[key] || key;
  if (vars) {
    Object.keys(vars).forEach((k) => {
      s = s.split(`{${k}}`).join(String(vars[k]));
    });
  }
  return s;
}

export function pick(item, field) {
  if (!item) return "";
  if (getLang() === "zh" && item[`${field}_zh`]) return item[`${field}_zh`];
  return item[field] || "";
}

export function applyStaticI18n() {
  document.documentElement.lang = getLang() === "zh" ? "zh-CN" : "en";
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  const page = document.body.dataset.page;
  if (page === "home") {
    document.title = "ScholarsArchive";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", t("meta.home"));
  } else if (page === "publications") document.title = `${t("page.publications")} | ScholarsArchive`;
  else if (page === "cv") document.title = `${t("page.cv")} | ScholarsArchive`;
  else if (page === "news") document.title = `${t("page.news")} | ScholarsArchive`;
  else if (page === "gallery") document.title = `${t("page.gallery")} | ScholarsArchive`;
}

export function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  if (getLang() === "zh") {
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
  }
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }).replace(",", "");
}

export function formatDateLong(iso) {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  if (getLang() === "zh") {
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
  }
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}
