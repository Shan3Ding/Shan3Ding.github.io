# 网页编辑说明

网站地址：https://shan3ding.github.io/  
代码仓库：https://github.com/Shan3Ding/Shan3Ding.github.io  

这是静态网页。改内容后，需要把改动推到 GitHub，大约 1 分钟后线上才会更新。

本地预览（在项目文件夹里运行）：

```bash
python3 -m http.server 8080
```

浏览器打开 http://localhost:8080

---

## 1. 改完后如何上线

1. 在 Cursor / VS Code 里保存文件。
2. 用 Git 提交并推送到 `main` 分支，例如：

```bash
git add .
git commit -m "Update publications"
git push
```

3. 打开 https://shan3ding.github.io/ 并强制刷新（Mac：`Cmd + Shift + R`）。

也可以在 GitHub 网页上直接编辑文件：打开仓库 → 点进对应文件 → 铅笔图标编辑 → Commit changes。

---

## 2. 文件放在哪里

| 要改的内容 | 文件 |
|---|---|
| 论文 | `data/publications.json` |
| 新闻 | `data/news.json` |
| 相册 | `data/gallery.json` + `assets/` 里的图片 |
| 简历条目 | `data/cv.json` |
| 主页姓名、简介、招生 | `index.html` |
| 主页时间线（最新 5 条新闻） | `index.html` + `js/site.js` 的 `renderHome()` |
| 主页精选论文 | `data/publications.json` 里的 `selected` / `selected_order` |
| 中英文界面文案 | `js/i18n.js` |
| 主页背景图 | `assets/hero.jpeg` |
| 主页简介旁的照片 | `assets/portrait.jpg` |
| 页眉名字、邮箱、页脚文字 | `js/site.js` |
| 导航菜单 | `js/site.js` 里的 `NAV` |

编辑 JSON 时注意：

- 用英文双引号 `" "`，不要用中文引号。
- 每条记录之间用逗号，**最后一条后面不要逗号**。
- 没有链接时写 `null`，不要留空。
- 可用 [jsonlint.com](https://jsonlint.com/) 检查格式。

---

## 3. 增加 / 删除论文

编辑 `data/publications.json`。

### 增加一篇

把下面这一段复制到数组最前面（最新的放上面也可以，网页会按年份排序）：

```json
{
  "title": "Paper title here",
  "authors": "S.-S. Ding, A. Collaborator",
  "journal": "Journal of Fluid Mechanics 123, A1",
  "year": 2026,
  "topic": "geostrophic_turbulence",
  "doi": "10.1017/jfm.xxxx",
  "abstract": "One or two sentences.",
  "citation_count": 0,
  "featured": false,
  "selected": false,
  "pdf_url": null,
  "thumbnail": null
}
```

`topic` 只能填这些值（决定 Publications 页的筛选按钮）：

| 填写值 | 页面上显示 |
|---|---|
| `rotating_convection` | Rotating Convection |
| `boundary_layers` | Boundary Layers |
| `geostrophic_turbulence` | Geostrophic Turbulence |
| `vortex_dynamics` | Vortex Dynamics |
| `atmospheric_flows` | Atmospheric Flows |
| `other` | Other |

`doi` 只填编号，不要加 `https://doi.org/`。

主页「精选论文 / Selected Publications」由 JSON 标记决定，不必改代码：

- `"selected": true` — 出现在精选列表
- `"selected_order": 1` — 数字越小越靠前（现在 1–7 对应 PRL 2026 → JFM 2025 → JFM 2024 → JFM 2023 → JFM 2022 → Nature Communications 2021 → PRF 2019）

改精选列表：把不要的论文改成 `"selected": false`（或删掉这两项），给要展示的论文写上 `selected` 和顺序号。

### 论文页缩略图（可选）

论文条目可加一页 PDF/论文截图，供以后使用。仓库里目前没有现成的论文内页图。

1. 把图片放到例如 `assets/papers/prl-2026.jpg`。
2. 在对应论文条目里加上：

```json
"thumbnail": "assets/papers/prl-2026.jpg"
```

路径相对网站根目录（和 `assets/hero.jpeg` 同一层写法）。也可以写 `../assets/papers/prl-2026.jpg`。

### 删除一篇

删掉对应的整段 `{ ... }`，并检查前后逗号是否还正确。

---

## 4. 发布 / 删除新闻

编辑 `data/news.json`。

### 发布一条

```json
{
  "date": "2026-09-01",
  "title": "Short headline",
  "title_zh": "中文标题",
  "category": "publication",
  "content": "You can use *italic*, **bold**, and [links](https://example.com).",
  "content_zh": "中文正文。论文题目、期刊名、报道标题保持英文原文。",
  "link_url": "https://doi.org/10.xxxx/xxxxx",
  "image": null,
  "pinned": false
}
```

- `date` 格式必须是 `YYYY-MM-DD`。
- `category` 常用：`publication`、`press`、`talk`、`award`、`opening`。会显示在日期旁边。
- `title_zh` / `content_zh` 供中文界面使用；论文题目、期刊名、会议名、报道标题等专有名词保持英文。
- `pinned: true` 会在 News 页显示 Pinned 标签。
- 没有外链时：`"link_url": null`。
- 主页时间线只显示日期最新的 **5** 条新闻；**越早越靠上，越新越靠下**。论文在时间线下方的「精选论文」模块单独列出。

### 新闻配图（可选）

时间线新闻可显示一张相关照片。没有图时不要占假图，把 `"image"` 设为 `null` 即可。

1. 把照片放到例如 `assets/news/egu-2026.jpg`（或沿用 `assets/gallery/` 里已有的相关图）。
2. 在该条新闻里写：

```json
"image": "assets/news/egu-2026.jpg"
```

EGU 2026 墙报目前用 `assets/news/egu-2026-poster.jpg`（由 `poster_21April.pdf` 导出）。PRL 2026 发表那条用 `assets/news/prl-2026-annuli.jpg`。要换图时覆盖同名文件，或改 JSON 里的 `"image"` 路径。

### 删除一条

删掉对应的整段 `{ ... }`。

---

## 5. 增加 / 删除 Gallery

现在 Gallery 已有牛津主页对应的图与视频。新增时把文件放到 `assets/gallery/`，再编辑 `data/gallery.json`。

### 增加一张图

1. 把图片复制到 `assets/gallery/my-figure.jpg`。
2. 在 `gallery.json` 里加入：

```json
[
  {
    "title": "Zonal jets in the rotating annulus",
    "media_type": "image",
    "file_url": "../assets/gallery/my-figure.jpg"
  }
]
```

### 增加一段动画 / 视频

把 `.mp4` 放到 `assets/gallery/`，然后：

```json
{
  "title": "Vortex motion",
  "media_type": "animation",
  "file_url": "../assets/gallery/vortex.mp4"
}
```

`media_type` 只能是 `image`、`animation` 或 `youtube`。YouTube 条目把 `file_url` 写成完整视频链接即可。

### 删除

同时删掉 `gallery.json` 里的条目，以及 `assets/gallery/` 里对应的文件。

---

## 6. 更换主页背景图

1. 准备一张尽量大的横图（建议宽度 2000 像素以上）。
2. 用新图覆盖 `assets/hero.jpeg`（文件名保持 `hero.jpeg` 最省事）。
3. 如果新图是 `.png` 或 `.jpg`，覆盖后把 `index.html` 里这一行改成新文件名：

```html
<img src="assets/hero.jpeg" alt="Abstract research visualization">
```

图片会铺满顶部，科学图靠右；左侧偏白，姓名和简介使用深色字。

主页简介旁的圆形照片是 `assets/portrait.jpg`。用同名文件覆盖即可更换。若改文件名，同步改 `index.html` 里 `hero-portrait` 的 `src`。

---

## 7. 修改主页基本信息

打开 `index.html`，直接改文字：

| 页面上看到的 | 在文件里搜 |
|---|---|
| 大标题姓名 | `Shan-Shan Ding`（中文为 `丁姗姗`，在 `js/i18n.js` 的 `hero.name`） |
| 职位 / 单位 | `hero.role`、`hero.affil` |
| 关于我 | `hero.about` |
| 主页时间线 | 最新 5 条新闻，见第 4 节 |
| 精选论文 | `data/publications.json` 的 `selected` / `selected_order` |
| 招生信息 | `#openings` 这一段 |
| 浏览器标签标题 | `<title>ScholarsArchive</title>` |

页眉左上角的短名 `S.-S. Ding`、页脚邮箱在 `js/site.js` 里，搜：

- `S.-S. Ding`
- `dingshanshan@fudan.edu.cn`

中英文界面文案（导航、页脚、招生、按钮）在 `js/i18n.js`。右上角 EN / 中文 切换后会记住选择。论文题目、作者、期刊、摘要始终保持英文。

改邮箱时，`index.html`、`js/site.js` 里的 `EMAIL`、以及 `data/cv.json` 复旦条目的 `email` 都要改。

---

## 8. 添加 / 修改个人信息（简历）

编辑 `data/cv.json`。每一条是一段经历：

```json
{
  "title": "Assistant Professor",
  "title_zh": "助理教授",
  "institution": "Fudan University",
  "institution_zh": "复旦大学",
  "start_year": 2026,
  "end_year": null,
  "category": "position",
  "email": "dingshanshan@fudan.edu.cn",
  "description": "One or two sentences about what you did.",
  "description_zh": "中文描述。项目名、会议名等专有名词可保持英文。"
}
```

- 仍在进行中：`"end_year": null`，页面会显示 `2023–Present`。
- 已结束：`"end_year": 2025`。
- `category` 只能填：

| 填写值 | 页面筛选 |
|---|---|
| `education` | Education |
| `position` | Positions |
| `grant` | Grants |
| `award` | Awards |
| `service` | Service |

条目按 `start_year` 从新到旧排列。

---

## 9. 招生信息

主页 `#openings` 这一段。英文和中文分别在 `js/i18n.js` 的 `openings.phd`、`openings.postdoc`、`openings.contact`。

邮箱与页脚相同：`dingshanshan@fudan.edu.cn`。

---

## 10. 中英文切换

右上角 **EN | 中文**。选择会记在浏览器 `localStorage`（键名 `sa-lang`）。

- 界面、新闻叙述、简历描述：可写中文对照（`title_zh`、`content_zh`、`description_zh`）。
- **不翻译**：论文题目、作者、期刊、摘要，以及会议名、报道标题、期刊名等专有名词。

界面短句改 `js/i18n.js` 里 `en` / `zh` 两套键值。

---

## 10. 常见问题

**改了但网站没变**  
多半是还没 `git push`，或浏览器缓存。用 `Cmd + Shift + R` 强制刷新。

**页面空白 / 论文列表消失**  
通常是 JSON 少了引号或多了逗号。用 jsonlint 检查对应的 `data/*.json`。

**图片不显示**  
检查文件名大小写是否和 JSON / HTML 里完全一致，以及路径是否以 `assets/` 或 `../assets/` 开头。

**只想改一处、怕改坏**  
在 GitHub 网页上改文件最安全：改错了可以在仓库的 History 里点 Revert。
