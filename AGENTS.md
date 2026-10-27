# Python Exercises

A static site of beginner Python exercises, assignments, exams, interactive tutorials and content pages for students at CODE. Python runs **in the browser** through Pyodide (WebAssembly). Students edit code in CodeMirror, run it, and test it against `test.py`. Progress is saved in `localStorage`. Exams have to work with **WiFi turned off**.

These instructions apply to any AI coding agent or assistant working in this repository.

## Commands

- `npm run build` (= `node build.js`): builds everything into `dist/` (about 1s). It is the only build entry point.
- `npm run preview`: serves `dist/` locally.
- `node verify-exam.js <file.md>...`: checks the integrity hash of a student's downloaded exam answers.

There is no test suite for the JS. **Run `npm run build` after every change** to code or content and fix any failure before you finish; a clean build plus checking the page in the browser is the bar.

## Architecture

- `build.js`: a hand-written static-site generator. It reads `exercises/`, `assignments/`, `exams/`, `pages/` and `tutorials/`, copies `public/`, renders Markdown with `marked`, fills the `src/templates/*.html` placeholders (`{{...}}`), bundles the JS/CSS with Vite, copies Pyodide from `node_modules/pyodide` into `dist/pyodide/`, and copies `sw.js`, `404.html` and `kitchen-sink.html` (a design reference of every component, served unlinked at `/kitchen-sink/`; add new components to it).
- `vite.config.js`: one entry per page type (`exercise-page`, `assignment-page`, `index-page`, `exam-page`, `tutorial-page`). Vite is used only as a bundler, called from `build.js`, never as a dev server.
- `src/js/`: ES modules, one `*-page.js` per page type plus shared modules (`python-runner`, `editor`, `terminal`, `storage`, `integrity`).
- `src/js/submission/`: exam submission, kept separate from the rest of the app. `exam-page.js` only uses `index.js` (`isSubmissionEnabled`, `getPrivacyPolicyUrl`, `submitAnswers`, `SubmissionError`). Each backend is a provider module (`baserow.js`) with `isConfigured(options)` and `submit(submission, options, signal)`, chosen in `config.js`. Never import a provider directly from page code. To switch backends, add a provider instead of changing `exam-page.js`. See "Exam submission" in `README.md`.
- `src/sw.js`: service worker. It precaches Pyodide (cache-first) and serves everything else network-first with a cache fallback. Bump `CACHE` whenever the caching behavior or precache list changes.
- `pages/` and `public/`: static content pages and the files they reference (see Content conventions).
- `dist/`: build output, gitignored. Never edit it by hand.
- `_draft/`: gitignored scratch material. Don't read or rely on it unless asked.

## Tech restrictions (hard rules)

1. **No new dependencies.** Don't add, upgrade, remove or swap npm packages, and don't add Python packages (no `micropip`), unless the user explicitly approves it. Don't run `npm install <pkg>`, `yarn add`, `pnpm add` or `pip install` without that approval. The runtime stack is fixed at CodeMirror 6, `@codemirror/lang-python`, `@codemirror/theme-one-dark`, `marked` and `pyodide`; the dev stack is Vite.
2. **Vanilla only.** Plain ES modules and plain CSS. No frameworks (React/Vue/Svelte/Lit…), no TypeScript, no JSX, no CSS frameworks or preprocessors, no Tailwind, no state libraries.
3. **Static only.** No backend, no server functions, no databases, no auth. The output is a folder of files that any static host can serve. The exam submission backend (rule 10) is an external service, not part of the site; building and serving the site must never depend on it.
4. **Offline-first, no external network at runtime.** No CDNs, web fonts, analytics, trackers, external images or `fetch` calls to other origins. Everything a page needs ships in `dist/`. Any change touching loading, assets or `sw.js` must keep exam pages working offline after the first load. **One exception:** `src/js/submission/` may send a POST to the single backend set in its `config.js`, and only when a student clicks Submit while online. Exams must still work fully offline. Submitting stays optional, and the download link must always work as a fallback.
5. **Keep the build simple.** Extend `build.js` rather than adding build tools, plugins, task runners or config files. Don't add a Vite dev server workflow, linters or formatters unless asked.
6. **Browser storage stays local.** Student progress lives in `localStorage` via `src/js/storage.js`. Don't add other storage mechanisms or send student data anywhere. **One exception:** exam answers a student actively submits through `src/js/submission/`. Only send what the downloaded file contains (exam id, email, integrity hash, timestamp, the Markdown). Keep the privacy fine print and link in the submit dialog.
7. **Exam integrity.** `HMAC_KEY` in `src/js/integrity.js` and `verify-exam.js` must stay identical. Don't change the key, the hash format or the `**Integrity:** <hash>` line format without asking, because that would invalidate every downloaded exam. Submitted answers must be the exact same Markdown as the download, so `verify-exam.js` works on both.
8. **Ask before touching core config.** Get approval before editing `package.json`, `package-lock.json`, `vite.config.js`, `src/js/integrity.js`, `verify-exam.js` or `src/js/submission/config.js` (it holds the live backend token and table). Never edit `dist/` or `node_modules/`.
9. **Don't add tooling to enforce these rules.** This file is the single source of project context and restrictions. Don't add agent-specific config folders, check scripts, git hooks or CI for it unless asked.
10. **Submission backend safety.** Everything in `src/js/submission/config.js` ships to every browser. Only use tokens that can *create* submissions and cannot read, change or delete them. Never send test submissions to the live backend: test with a mocked `fetch`, or with a separate test table the user approved.

## Content conventions

### Exercises (`exercises/<N>-<M>-<slug>/`)

- `N` is the week, `M` the position within it, and `slug` is kebab-case. Course-specific series use a prefix, e.g. `SE19-1-test-intro`.
- Each one has `instructions.md`, `start.py` and `test.py`. `*-do-what-you-want` exercises and the `SE19-*` test-writing exercises have no `test.py`.
- `instructions.md` starts with `# <N>.<M> Title (topic)`, then `## Task`, and puts hints in a `<details><summary>💡 Hints</summary>` block.
- `start.py` is a minimal scaffold with a comment prompt. Never put the solution in it.
- `test.py` follows the existing pattern: `run_code(input_data)` executes `/home/pyodide/solution.py` with mocked stdin/stdout, `check(condition, message)` prints ✅/❌, and the file ends with the summary block. Copy it from an existing exercise rather than inventing a new harness.
- Python must work in Pyodide using **only the standard library**. No file or network I/O in student-facing code.

### Assignments (`assignments/*.md`) and exams (`exams/*.md`)

- YAML-ish frontmatter (`title`, `exercises:` list of folder names) parsed by the custom `parseFrontmatter` in `build.js`. It supports scalars and `- item` lists only, so don't use nested YAML.
- Exams are added before an exam session and removed afterwards (see the git history). Don't add or remove exams unless asked.
- When submission is set up, exam pages show "Submit My Answers", with a download link as fallback. The instructions in `exams/*.md` should match the method in use (submit vs. download and upload). Ask before changing exam wording.

### Pages (`pages/**/*.md`)

- Static pages served from the site root: `pages/os01.md` → `/os01/`. Sub-folders nest: `pages/se19/index.md` → `/se19/`, `pages/se19/1-html.md` → `/se19/1-html/`. Top-level names must not clash with the build output (`index`, `404`, `assets`, `pyodide`, `exercises`, `assignments`, `exams`, `tutorials`, `sw`, `kitchen-sink`) or with anything in `public/`; the build fails if they do.
- Frontmatter: `title`, optional `icon` (an emoji shown before the title), optional `link_boxes` (default `false`), optional `redirect`. Then a Markdown body (raw HTML allowed). `README.md` has the full frontmatter reference; keep it in sync when fields change.
- **Link boxes:** on pages with `link_boxes: true`, a bullet list where every item is exactly one link with a description in the link title, `- [Title](url "description")`, renders as a single-column list of clickable boxes right where it stands. Lists with any other item stay normal lists. Without the flag, these lists render as normal links. There is no frontmatter link list; links always live in the Markdown.
- Box descriptions support inline Markdown only (bold, italics, code; no links, since the whole box is already a link). All link boxes open in a new tab and get an icon: ↗ for `http(s)` links, → for links within the site.
- **URLs:** values with a scheme (`https://`, `mailto:`) are used as is. Anything else, in link boxes, other links and images alike, is relative to the site root (`assignments/os01-week-1/`, `random-files/x.png`, `./` for the home page) and resolved for the page's depth. Don't start internal links with `/`, because the site may be hosted in a subfolder. Raw HTML `<a>`/`<img>` tags are not rewritten.
- **Redirects:** a page whose frontmatter has only `redirect: <url>` becomes an instant redirect (meta refresh plus a fallback link). The URL follows the same rules, e.g. `redirect: se456/`.
- External links are fine here because students click them; pages still must not *load* anything from other origins (rule 4). Put images and downloads in `public/`.

### Tutorials (`tutorials/<topic>/`)

- Jupyter notebooks, rendered without Jupyter: `tutorials/python/02-numbers-math-variables.ipynb` → `/tutorials/python/numbers-math-variables/`. Name files `<NN>-<slug>.ipynb`: the number sets the order ("Next" links stay within the folder) and is dropped from the URL.
- Each topic folder has an `index.md` landing page (`tutorials/python/index.md` → `/tutorials/python/`). It is a normal page with the same frontmatter as `pages/`, usually `link_boxes: true` with one link box per notebook. Add new notebooks to it by hand.
- Commit notebooks as they come from Jupyter/VS Code. `build.js` reads the JSON itself (no nbformat or Jupyter dependency).
- The first `# Heading` of the first Markdown cell becomes the page title and is removed from the content. Markdown cells render like pages (raw HTML allowed, headings get Jupyter-style ids so table-of-contents links work). Embedded image attachments are written next to the page.
- Code cells become a CodeMirror editor with ▶ Run (also Shift+Enter) and an output area. Cells with `"editable": false` metadata are read-only. Saved outputs in the notebook are ignored.
- At runtime (`tutorial-page.js`, `runCell()` in `python-runner.js`) all cells of a page share one Python namespace like a Jupyter kernel, the value of a cell's last expression is printed (a trailing `;` hides it), and "Restart Python" clears the namespace. `input()` replays only the current cell, after restoring the namespace from a deep-copy snapshot.
- Not supported: magics (`%`, `%%`, `!`), rich outputs (plots, HTML), LaTeX math. Write formulas as code or plain text instead.
- Edited cell code is saved in `localStorage` per cell (by the notebook's cell `id`, falling back to its position).

### Static files (`public/`)

- Everything in `public/` is copied as-is to the root of `dist/` (`public/random-files/x.pdf` → `/random-files/x.pdf`). Use it for images and downloads referenced by pages.

### Tone

Student-facing text is in English and written for first-semester beginners: plain language, short sentences, encouraging. Students are told not to use AI, so never add solutions, solution hints beyond the existing hints style, or answer keys anywhere that ships in `dist/`.

## Code style

- Match the surrounding code: 2-space indent, single quotes, semicolons, `/* ... */` section banners like the existing files, and JSDoc on helper functions.
- Prefer small, focused changes. Don't refactor unrelated code while fixing something.
- Git commits use a gitmoji prefix (🐛 fix, 🎨 style/UI, 📝 content/docs, ✨ feature, 🔧 config).
