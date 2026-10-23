# Python Exercises

A static site of beginner Python exercises, assignments and exams for students at CODE. Python runs **in the browser** through Pyodide (WebAssembly). Students edit code in CodeMirror, run it, and test it against `test.py`. Progress is saved in `localStorage`. Exams have to work with **WiFi turned off**.

These instructions apply to any AI coding agent or assistant working in this repository.

## Commands

- `npm run build` (= `node build.js`): builds everything into `dist/` (about 1s). It is the only build entry point.
- `npm run preview`: serves `dist/` locally.
- `node verify-exam.js <file.md>...`: checks the integrity hash of a student's downloaded exam answers.

There is no test suite for the JS. **Run `npm run build` after every change** to code or content and fix any failure before you finish; a clean build plus checking the page in the browser is the bar.

## Architecture

- `build.js`: a hand-written static-site generator. It reads `exercises/`, `assignments/`, `exams/` and `pages/`, renders Markdown with `marked`, fills the `src/templates/*.html` placeholders (`{{...}}`), bundles the JS/CSS with Vite, copies Pyodide from `node_modules/pyodide` into `dist/pyodide/`, and copies `sw.js` and `404.html`.
- `vite.config.js`: one entry per page type (`exercise-page`, `assignment-page`, `index-page`, `exam-page`). Vite is used only as a bundler, called from `build.js`, never as a dev server.
- `src/js/`: ES modules, one `*-page.js` per page type plus shared modules (`python-runner`, `editor`, `terminal`, `storage`, `integrity`).
- `src/sw.js`: service worker. It precaches Pyodide (cache-first) and serves everything else network-first with a cache fallback. Bump `CACHE` whenever the caching behavior or precache list changes.
- `dist/`: build output, gitignored. Never edit it by hand.
- `_draft/`: gitignored scratch material. Don't read or rely on it unless asked.

## Tech restrictions (hard rules)

1. **No new dependencies.** Don't add, upgrade, remove or swap npm packages, and don't add Python packages (no `micropip`), unless the user explicitly approves it. Don't run `npm install <pkg>`, `yarn add`, `pnpm add` or `pip install` without that approval. The runtime stack is fixed at CodeMirror 6, `@codemirror/lang-python`, `@codemirror/theme-one-dark`, `marked` and `pyodide`; the dev stack is Vite.
2. **Vanilla only.** Plain ES modules and plain CSS. No frameworks (React/Vue/Svelte/Lit…), no TypeScript, no JSX, no CSS frameworks or preprocessors, no Tailwind, no state libraries.
3. **Static only.** No backend, no server functions, no databases, no auth. The output is a folder of files that any static host can serve.
4. **Offline-first, no external network at runtime.** No CDNs, web fonts, analytics, trackers, external images or `fetch` calls to other origins. Everything a page needs ships in `dist/`. Any change touching loading, assets or `sw.js` must keep exam pages working offline after the first load.
5. **Keep the build simple.** Extend `build.js` rather than adding build tools, plugins, task runners or config files. Don't add a Vite dev server workflow, linters or formatters unless asked.
6. **Browser storage stays local.** Student progress lives in `localStorage` via `src/js/storage.js`. Don't add other storage mechanisms or send student data anywhere.
7. **Exam integrity.** `HMAC_KEY` in `src/js/integrity.js` and `verify-exam.js` must stay identical. Don't change the key, the hash format or the `**Integrity:** <hash>` line format without asking, because that would invalidate every downloaded exam.
8. **Ask before touching core config.** Get approval before editing `package.json`, `package-lock.json`, `vite.config.js`, `src/js/integrity.js` or `verify-exam.js`. Never edit `dist/` or `node_modules/`.
9. **Don't add tooling to enforce these rules.** This file is the single source of project context and restrictions. Don't add agent-specific config folders, check scripts, git hooks or CI for it unless asked.

## Content conventions

### Exercises (`exercises/<N>-<M>-<slug>/`)

- `N` is the week, `M` the position within it, and `slug` is kebab-case. Course-specific series use a prefix, e.g. `SE19-1-test-intro`.
- Each one has `instructions.md`, `start.py` and `test.py`. `*-do-what-you-want` exercises and the `SE19-*` test-writing exercises have no `test.py`.
- `instructions.md` starts with `# <N>.<M> Title (topic)`, then `## Task`, and puts hints in a `<details><summary>💡 Hints</summary>` block.
- `start.py` is a minimal scaffold with a comment prompt. Never put the solution in it.
- `test.py` follows the existing pattern: `run_code(input_data)` executes `/home/pyodide/solution.py` with mocked stdin/stdout, `check(condition, message)` prints ✅/❌, and the file ends with the summary block. Copy it from an existing exercise rather than inventing a new harness.
- Python must work in Pyodide using **only the standard library**. No file or network I/O in student-facing code.

### Assignments (`assignments/*.md`) and exams (`exams/*.md`)

- YAML-ish frontmatter (`title`, `exercises:` list of folder names) parsed by the custom `parseFrontmatter` in `build.js`. It supports scalars, `- item` lists and lists of flat `key: value` objects (see Pages) only, so don't use deeper nesting, multi-line values or other YAML features.
- Exams are added before an exam session and removed afterwards (see the git history). Don't add or remove exams unless asked.

### Pages (`pages/<slug>.md`)

- Static pages served from the site root: `pages/os01.md` → `/os01/`. Slugs must not clash with top-level build output (`index`, `404`, `assets`, `pyodide`, `exercises`, `assignments`, `exams`, `sw`); the build fails if they do.
- Same format as assignments: frontmatter, then a Markdown body (raw HTML allowed) shown at the top of the page.
- `links:` is an optional list of link boxes, shown as a two-column grid below the body (one column on small screens). Each item needs `title` and `url`; `description` is optional and supports inline Markdown only (bold, italics, code; no links, since the whole box is already a link):

  ```yaml
  links:
    - title: Week 1 – Python Basics
      url: assignments/os01-week-1/
      description: Start here with **printing** and *variables*.
  ```

- `url` values with a scheme (`https://`, `mailto:`) are used as is. All link boxes open in a new tab; `http(s)` links also get a ↗ after the title. Anything else is relative to the site root (`assignments/os01-week-1/`, `./` for the home page). Don't start internal links with `/`, because the site may be hosted in a subfolder.
- External links are fine here because students click them; pages still must not *load* anything from other origins (rule 4).

### Tone

Student-facing text is in English and written for first-semester beginners: plain language, short sentences, encouraging. Students are told not to use AI, so never add solutions, solution hints beyond the existing hints style, or answer keys anywhere that ships in `dist/`.

## Code style

- Match the surrounding code: 2-space indent, single quotes, semicolons, `/* ... */` section banners like the existing files, and JSDoc on helper functions.
- Prefer small, focused changes. Don't refactor unrelated code while fixing something.
- Git commits use a gitmoji prefix (🐛 fix, 🎨 style/UI, 📝 content/docs, ✨ feature, 🔧 config).
