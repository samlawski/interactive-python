#!/usr/bin/env node
/* ===================================================================
   build.js — Static-site generator for Python Exercises
   ===================================================================

   Usage:   node build.js
   Output:  dist/

   Reads exercises/, assignments/, exams/, pages/ and tutorials/, renders Markdown,
   bundles JS/CSS with Vite, copies Pyodide and public/ files, and produces a fully self-contained
   static site ready for deployment.
   =================================================================== */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build as viteBuild } from 'vite';
import { marked, Marked } from 'marked';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST = path.join(__dirname, 'dist');
const EXERCISES_DIR = path.join(__dirname, 'exercises');
const ASSIGNMENTS_DIR = path.join(__dirname, 'assignments');
const EXAMS_DIR = path.join(__dirname, 'exams');
const PAGES_DIR = path.join(__dirname, 'pages');
const PUBLIC_DIR = path.join(__dirname, 'public');
const TUTORIALS_DIR = path.join(__dirname, 'tutorials');
const TUTORIALS_URL = 'tutorials'; /* dist/ folder and URL of the tutorials */
const TEMPLATES_DIR = path.join(__dirname, 'src', 'templates');

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Recursively remove a directory (sync). */
function rmDir(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

/** Create a directory tree (sync). */
function mkDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

/** Read a UTF-8 file; return empty string when missing. */
function readOpt(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch {
    return '';
  }
}

/**
 * Parse simple YAML-ish frontmatter delimited by `---`.
 * Supports scalar values and arrays (lines starting with `  - `).
 *
 * Returns { meta: {…}, body: "…" }
 */
function parseFrontmatter(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: text };

  const meta = {};
  let currentKey = null;

  for (const line of match[1].split(/\r?\n/)) {
    const kvMatch = line.match(/^(\w[\w-]*):\s*(.*)/);
    if (kvMatch) {
      currentKey = kvMatch[1];
      const val = kvMatch[2].trim();
      if (val) {
        meta[currentKey] = val;
      } else {
        meta[currentKey] = []; /* will be filled by "- " lines */
      }
    } else if (currentKey && line.match(/^\s+-\s+/)) {
      if (!Array.isArray(meta[currentKey])) meta[currentKey] = [];
      meta[currentKey].push(line.replace(/^\s+-\s+/, '').trim());
    }
  }

  return { meta, body: match[2] };
}

/** Convert a folder name like "1-1-hello-world" to a readable title. */
function folderToTitle(name) {
  return name
    .replace(/^(\d+)-(\d+)-/, '$1.$2 ')  /* "1-1-" → "1.1 " */
    .replace(/^\d+-/, '')                 /* fallback: strip single leading number */
    .replace(/-/g, ' ')                   /* dashes → spaces */
    .replace(/\b[a-zA-Z]/g, (c) => c.toUpperCase()); /* Title Case (skip digits) */
}

/** Render Markdown → HTML (with raw HTML pass-through). */
function renderMarkdown(md) {
  return marked.parse(md, { breaks: false, gfm: true });
}

/* ------------------------------------------------------------------ */
/*  1. Read exercises                                                  */
/* ------------------------------------------------------------------ */

function readExercises() {
  if (!fs.existsSync(EXERCISES_DIR)) return [];

  return fs
    .readdirSync(EXERCISES_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }))
    .map((d) => {
      const dir = path.join(EXERCISES_DIR, d.name);
      const instructionsMd = readOpt(path.join(dir, 'instructions.md'));
      const startCode = readOpt(path.join(dir, 'start.py'));
      const testCode = readOpt(path.join(dir, 'test.py'));

      return {
        id: d.name,
        title: folderToTitle(d.name),
        instructionsHtml: renderMarkdown(instructionsMd),
        startCode,
        testCode: testCode || null,
        hasTest: testCode.length > 0,
      };
    });
}

/* ------------------------------------------------------------------ */
/*  2. Read assignments                                                */
/* ------------------------------------------------------------------ */

function readAssignments(exercises) {
  if (!fs.existsSync(ASSIGNMENTS_DIR)) return [];

  const exerciseMap = Object.fromEntries(exercises.map((e) => [e.id, e]));

  return fs
    .readdirSync(ASSIGNMENTS_DIR)
    .filter((f) => f.endsWith('.md'))
    .sort()
    .map((file) => {
      const raw = fs.readFileSync(path.join(ASSIGNMENTS_DIR, file), 'utf-8');
      const { meta, body } = parseFrontmatter(raw);
      const id = file.replace(/\.md$/, '');
      const exerciseIds = meta.exercises || [];

      return {
        id,
        title: meta.title || folderToTitle(id),
        descriptionHtml: renderMarkdown(body),
        exercises: exerciseIds.map((eid) => ({
          id: eid,
          title: exerciseMap[eid]?.title || folderToTitle(eid),
          startCode: exerciseMap[eid]?.startCode || '',
        })),
      };
    });
}

/* ------------------------------------------------------------------ */
/*  3. Read exams                                                      */
/* ------------------------------------------------------------------ */

function readExams() {
  if (!fs.existsSync(EXAMS_DIR)) return [];

  return fs
    .readdirSync(EXAMS_DIR)
    .filter((f) => f.endsWith('.md'))
    .sort()
    .map((file) => {
      const raw = fs.readFileSync(path.join(EXAMS_DIR, file), 'utf-8');
      const id = file.replace(/\.md$/, '');

      /* Split by --- separator into sections */
      const sections = raw.split(/\r?\n---\r?\n/);

      /* First section: title (h1) + description */
      const headerSection = sections[0];
      const titleMatch = headerSection.match(/^#\s+(.+)/m);
      const title = titleMatch ? titleMatch[1].trim() : 'Exam';
      const descriptionMd = titleMatch
        ? headerSection.replace(/^#\s+.+\n*/m, '').trim()
        : headerSection.trim();

      /* Remaining sections: tasks */
      const tasks = sections.slice(1).map((section, index) => {
        const trimmed = section.trim();
        if (!trimmed) return null;

        const taskTitleMatch = trimmed.match(/^##\s+(.+)/m);
        const taskTitle = taskTitleMatch
          ? taskTitleMatch[1].trim()
          : `Task ${index + 1}`;
        const contentMd = taskTitleMatch
          ? trimmed.replace(/^##\s+.+\n*/m, '').trim()
          : trimmed;

        const hasEditor = contentMd.includes('[[PYTHON-EDITOR]]');

        /* Extract optional starter code from [[PYTHON-EDITOR]]```python...```[[/PYTHON-EDITOR]] */
        let starterCode = '';
        const starterMatch = contentMd.match(
          /\[\[PYTHON-EDITOR\]\]\s*```python\s*\n([\s\S]*?)```\s*\[\[\/PYTHON-EDITOR\]\]/,
        );
        if (starterMatch) {
          starterCode = starterMatch[1].trimEnd();
        }

        const cleanedContentMd = contentMd
          .replace(/\[\[PYTHON-EDITOR\]\]\s*```python\s*\n[\s\S]*?```\s*\[\[\/PYTHON-EDITOR\]\]/g, '')
          .replace(/\[\[PYTHON-EDITOR\]\]\s*/g, '')
          .replace(/\[\[\/PYTHON-EDITOR\]\]\s*/g, '')
          .trim();

        return {
          id: `task-${index + 1}`,          title: taskTitle,
          contentHtml: cleanedContentMd ? renderMarkdown(cleanedContentMd) : '',
          hasEditor,
          starterCode,
        };
      }).filter(Boolean);

      return {
        id,
        title,
        descriptionHtml: renderMarkdown(descriptionMd),
        tasks,
      };
    });
}

/* ------------------------------------------------------------------ */
/*  4. Read pages                                                      */
/* ------------------------------------------------------------------ */

/** Top-level names in dist/ that a page must not overwrite. */
const RESERVED_PAGE_IDS = [
  'index', '404', 'assets', 'pyodide', 'exercises', 'assignments', 'exams', 'sw',
  TUTORIALS_URL,
];

/**
 * Resolve a link URL for a page at `basePath`. URLs with a scheme
 * (https:, mailto:, …), absolute paths and anchors are kept as they
 * are; anything else is treated as relative to the site root.
 */
function resolveLinkUrl(url, basePath) {
  if (/^([a-z][a-z0-9+.-]*:|\/|#)/i.test(url)) return url;
  return basePath + url.replace(/^\.\//, '');
}

/** Inline stroke icons for link boxes (currentColor, no external files). */
const LINK_ICONS = {
  external: '<path d="M7 17L17 7M9 7h8v8"/>',
  internal: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  chevron: '<path d="M9 6l6 6-6 6"/>',
};

/** Wrap an icon's path in an SVG element. */
function linkIconSvg(name, size) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${LINK_ICONS[name]}</svg>`;
}

/** Render one clickable link box (used by link grids on pages). */
function linkBoxHtml({ titleHtml, href, descriptionHtml }) {
  const external = /^https?:/i.test(href);
  return `<a class="link-box" href="${escapeHtml(href)}" target="_blank" rel="noopener">
          <span class="link-box-icon">${linkIconSvg(external ? 'external' : 'internal', 20)}</span>
          <span class="link-box-text">
            <span class="link-box-title">${titleHtml}</span>
            ${descriptionHtml ? `<span class="link-box-description">${descriptionHtml}</span>` : ''}
          </span>
          <span class="link-box-chevron">${linkIconSvg('chevron', 18)}</span>
        </a>`;
}

/**
 * If a list item contains nothing but one link with a title, e.g.
 * `- [Title](url "description")`, return that link token.
 */
function getDescribedLink(item) {
  if (item.tokens.length !== 1) return null;
  const inline = (item.tokens[0].tokens || []).filter(
    (t) => !(t.type === 'text' && !t.text.trim()),
  );
  const [link] = inline;
  return inline.length === 1 && link.type === 'link' && link.title ? link : null;
}

/**
 * Render a page's Markdown. Relative links and images resolve against
 * the site root. Options:
 * - `linkBoxes`: lists made only of described links
 *   (`- [Title](url "description")`) become link boxes.
 * - `headingIds`: headings get Jupyter-style ids ("My Title" →
 *   "My-Title") so notebook table-of-contents links work.
 */
function renderPageMarkdown(md, basePath, { linkBoxes = false, headingIds = false } = {}) {
  const pageMarked = new Marked({ breaks: false, gfm: true });

  pageMarked.use({
    walkTokens(token) {
      if (token.type === 'link' || token.type === 'image') {
        token.href = resolveLinkUrl(token.href, basePath);
      }
    },
    renderer: {
      list(token) {
        const links = token.items.map(getDescribedLink);
        if (!linkBoxes || token.ordered || links.some((l) => !l)) return false;

        const boxes = links.map((link) => linkBoxHtml({
          titleHtml: this.parser.parseInline(link.tokens),
          href: link.href,
          descriptionHtml: marked.parseInline(link.title),
        }));
        return `<div class="link-grid">\n        ${boxes.join('\n        ')}\n</div>\n`;
      },
      heading({ tokens, depth }) {
        if (!headingIds) return false;

        const html = this.parser.parseInline(tokens);
        const text = html
          .replace(/<[^>]*>/g, '')
          .replace(/&amp;/g, '&')
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>');
        const id = text.trim().replace(/\s+/g, '-');
        return `<h${depth} id="${escapeHtml(id)}">${html}</h${depth}>\n`;
      },
    },
  });

  return pageMarked.parse(md);
}

/** List all .md files below a directory as sorted, `/`-separated paths. */
function listMarkdownFiles(dir) {
  return fs
    .readdirSync(dir, { recursive: true })
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.split(path.sep).join('/'))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

/**
 * Read Markdown pages from `dir`. Pages are served below `urlPrefix`
 * ("" for the site root, "tutorials" for the index.md files in tutorials/).
 */
function readPages(dir = PAGES_DIR, urlPrefix = '') {
  if (!fs.existsSync(dir)) return [];

  const label = path.relative(__dirname, dir);
  const reserved = urlPrefix ? [] : [
    ...RESERVED_PAGE_IDS,
    ...(fs.existsSync(PUBLIC_DIR) ? fs.readdirSync(PUBLIC_DIR) : []),
  ];

  return listMarkdownFiles(dir).map((file) => {
    const raw = fs.readFileSync(path.join(dir, file), 'utf-8');
    const { meta, body } = parseFrontmatter(raw);

    /* "os01.md" → "os01", "se19/index.md" → "se19", "se19/1-html.md" → "se19/1-html" */
    const pageId = file.replace(/\.md$/, '').replace(/(^|\/)index$/, '');
    const id = [urlPrefix, pageId].filter(Boolean).join('/');
    const topLevel = id.split('/')[0] || 'index';

    if (reserved.includes(topLevel)) {
      throw new Error(`${label}/${file}: "${topLevel}" is reserved, please rename the page.`);
    }

    const basePath = '../'.repeat(id.split('/').length);

    if (meta.redirect) {
      return { id, basePath, redirect: resolveLinkUrl(meta.redirect, basePath) };
    }

    /* Link boxes are off unless the page sets `link_boxes: true` */
    const linkBoxes = /^(true|yes|on)$/i.test(meta.link_boxes || '');

    return {
      id,
      basePath,
      title: meta.title || folderToTitle(id.split('/').pop()),
      icon: meta.icon || '',
      descriptionHtml: renderPageMarkdown(body, basePath, { linkBoxes }),
    };
  });
}

/* ------------------------------------------------------------------ */
/*  5. Read tutorials (Jupyter notebooks)                              */
/* ------------------------------------------------------------------ */

/** Join a notebook cell's source, which may be a string or a list of lines. */
function cellSource(cell) {
  return Array.isArray(cell.source) ? cell.source.join('') : cell.source || '';
}

function readTutorials() {
  if (!fs.existsSync(TUTORIALS_DIR)) return [];

  const seen = new Set();

  return fs
    .readdirSync(TUTORIALS_DIR, { recursive: true })
    .filter((f) => f.endsWith('.ipynb'))
    .map((f) => f.split(path.sep).join('/'))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((file) => {
      /* "python/01-strings.ipynb" → "python/strings" (the number only sets the order) */
      const folder = path.posix.dirname(file);
      const slug = path.posix.basename(file, '.ipynb').replace(/^\d+-/, '');
      const id = folder === '.' ? slug : `${folder}/${slug}`;
      if (seen.has(id)) {
        throw new Error(`tutorials/${file}: another notebook already uses the URL "${id}".`);
      }
      seen.add(id);

      const basePath = '../'.repeat(id.split('/').length + 1);
      const notebook = JSON.parse(fs.readFileSync(path.join(TUTORIALS_DIR, file), 'utf-8'));
      const firstMarkdown = notebook.cells.findIndex((c) => c.cell_type === 'markdown');
      const attachments = [];
      let title = null;

      const cells = notebook.cells
        .map((cell, index) => {
          let source = cellSource(cell);

          if (cell.cell_type === 'code') {
            return {
              type: 'code',
              key: cell.id || `cell-${index}`, /* localStorage key for saved code */
              code: source,
              readOnly: cell.metadata?.editable === false,
            };
          }
          if (cell.cell_type !== 'markdown') return null;

          /* The notebook's first "# Heading" becomes the page title */
          if (index === firstMarkdown) {
            const h1 = source.match(/^#\s+(.+)$/m);
            if (h1) {
              title = h1[1].trim();
              source = source.replace(h1[0], '');
            }
          }

          /* Embedded images → separate files next to the page */
          for (const [name, data] of Object.entries(cell.attachments || {})) {
            const [base64] = Object.values(data);
            attachments.push({ name, content: Buffer.from(base64, 'base64') });
            source = source.split(`attachment:${name}`).join(`${TUTORIALS_URL}/${id}/${name}`);
          }

          return {
            type: 'markdown',
            html: renderPageMarkdown(source, basePath, { headingIds: true }),
          };
        })
        .filter(Boolean);

      return { id, folder, basePath, title: title || folderToTitle(slug), cells, attachments };
    });
}

/* ------------------------------------------------------------------ */
/*  6. Generate HTML pages                                             */
/* ------------------------------------------------------------------ */

function generateExercisePages(exercises) {
  const template = fs.readFileSync(
    path.join(TEMPLATES_DIR, 'exercise.html'),
    'utf-8',
  );

  for (const ex of exercises) {
    const basePath = '../../';
    const json = JSON.stringify({
      id: ex.id,
      title: ex.title,
      startCode: ex.startCode,
      testCode: ex.testCode,
      hasTest: ex.hasTest,
      basePath,
    });

    const html = template
      .replace(/\{\{TITLE\}\}/g, escapeHtml(ex.title))
      .replace('{{INSTRUCTIONS_HTML}}', ex.instructionsHtml)
      .replace('{{INSTRUCTIONS_ATTR}}', ex.instructionsHtml.trim() ? '' : 'style="display:none"')
      .replace('{{TEST_ATTR}}', ex.hasTest ? '' : 'style="display:none"')
      .replace('{{EXERCISE_DATA}}', json)
      .replace(/\{\{BASE\}\}/g, basePath);

    const dir = path.join(DIST, 'exercises', ex.id);
    mkDir(dir);
    fs.writeFileSync(path.join(dir, 'index.html'), html);
  }
}

function generateAssignmentPages(assignments) {
  const template = fs.readFileSync(
    path.join(TEMPLATES_DIR, 'assignment.html'),
    'utf-8',
  );

  for (const a of assignments) {
    const basePath = '../../';

    /* Build exercise list HTML */
    const listHtml = a.exercises
      .map((ex) => {
        /* "1.2 Dad Jokes" → number column + title */
        const [, num = '', title = ex.title] = ex.title.match(/^(\d+\.\d+)\s+(.*)$/) || [];
        return `<li>
            <span class="exercise-num">${num}</span>
            <a href="${basePath}exercises/${ex.id}/?from=${a.id}">${escapeHtml(title)}</a>
            <span id="status-${ex.id}" class="status">Not started</span>
          </li>`;
      })
      .join('\n        ');

    const json = JSON.stringify({
      id: a.id,
      title: a.title,
      exercises: a.exercises,
    });

    const html = template
      .replace(/\{\{TITLE\}\}/g, escapeHtml(a.title))
      .replace('{{DESCRIPTION_HTML}}', a.descriptionHtml)
      .replace('{{EXERCISE_LIST_HTML}}', listHtml)
      .replace('{{ASSIGNMENT_DATA}}', json)
      .replace(/\{\{BASE\}\}/g, basePath);

    const dir = path.join(DIST, 'assignments', a.id);
    mkDir(dir);
    fs.writeFileSync(path.join(dir, 'index.html'), html);
  }
}

function generateExamPages(exams) {
  const template = fs.readFileSync(
    path.join(TEMPLATES_DIR, 'exam.html'),
    'utf-8',
  );

  for (const exam of exams) {
    const basePath = '../../';
    const needsPyodide = exam.tasks.some((t) => t.hasEditor);

    /* Build tasks HTML */
    const tasksHtml = exam.tasks
      .map(
        (task, i) =>
          `<section id="${task.id}" class="exam-task card" data-task-id="${task.id}" data-has-editor="${task.hasEditor}">
        <div class="exam-task-header">Question ${i + 1} of ${exam.tasks.length}</div>
        <div class="exam-task-body">
          <h2>${escapeHtml(task.title)}</h2>
          ${task.contentHtml ? `<div class="task-content">${task.contentHtml}</div>` : ''}
          <div class="task-answer-area"></div>
        </div>
      </section>`,
      )
      .join('\n      ');

    /* JSON data for client-side JS (only metadata, not full HTML) */
    const json = JSON.stringify({
      id: exam.id,
      title: exam.title,
      tasks: exam.tasks.map((t) => ({
        id: t.id,
        title: t.title,
        hasEditor: t.hasEditor,
        starterCode: t.starterCode || '',
      })),
      basePath,
    });

    const pyodideScript = needsPyodide
      ? `<script src="${basePath}pyodide/pyodide.js"></script>`
      : '';

    const html = template
      .replace(/\{\{TITLE\}\}/g, escapeHtml(exam.title))
      .replace('{{DESCRIPTION_HTML}}', exam.descriptionHtml)
      .replace('{{TASKS_HTML}}', tasksHtml)
      .replace('{{EXAM_DATA}}', json)
      .replace('{{PYODIDE_SCRIPT}}', pyodideScript)
      .replace(/\{\{BASE\}\}/g, basePath);

    const dir = path.join(DIST, 'exams', exam.id);
    mkDir(dir);
    fs.writeFileSync(path.join(dir, 'index.html'), html);
  }
}

function generatePages(pages) {
  const template = fs.readFileSync(
    path.join(TEMPLATES_DIR, 'page.html'),
    'utf-8',
  );
  const redirectTemplate = fs.readFileSync(
    path.join(TEMPLATES_DIR, 'redirect.html'),
    'utf-8',
  );

  for (const page of pages) {
    let html;

    if (page.redirect) {
      /* Escape "<" so the URL can't close the inline <script> */
      const urlJson = JSON.stringify(page.redirect).replace(/</g, '\\u003c');
      html = redirectTemplate
        .replace(/\{\{URL\}\}/g, () => escapeHtml(page.redirect))
        .replace('{{URL_JSON}}', () => urlJson)
        .replace(/\{\{BASE\}\}/g, page.basePath);
    } else {
      const heading = page.icon ? `${page.icon} ${page.title}` : page.title;

      html = template
        .replace(/\{\{TITLE\}\}/g, escapeHtml(page.title))
        .replace('{{HEADING}}', escapeHtml(heading))
        .replace('{{DESCRIPTION_HTML}}', () => page.descriptionHtml) /* function: keeps "$" literal */
        .replace('{{DESCRIPTION_ATTR}}', page.descriptionHtml.trim() ? '' : 'style="display:none"')
        .replace(/\{\{BASE\}\}/g, page.basePath);
    }

    const dir = path.join(DIST, page.id);
    mkDir(dir);
    fs.writeFileSync(path.join(dir, 'index.html'), html);
  }
}

/**
 * Replace the {{FOOTER}} placeholder in every generated HTML file
 * (templates and 404.html) with src/templates/footer.html.
 */
function insertFooter() {
  const footer = fs.readFileSync(path.join(TEMPLATES_DIR, 'footer.html'), 'utf-8').trim();

  for (const file of fs.readdirSync(DIST, { recursive: true })) {
    if (!file.endsWith('.html') || file.startsWith(`pyodide${path.sep}`)) continue;
    const filePath = path.join(DIST, file);
    const html = fs.readFileSync(filePath, 'utf-8');
    if (html.includes('{{FOOTER}}')) {
      fs.writeFileSync(filePath, html.replace('{{FOOTER}}', () => footer));
    }
  }
}

/** Copy static files from public/ to the dist/ root as they are. */
function copyPublic() {
  if (!fs.existsSync(PUBLIC_DIR)) return;
  fs.cpSync(PUBLIC_DIR, DIST, { recursive: true });
  console.log('  ✓ Public files copied');
}

/** Embed JSON in a <script> tag without letting "</script>" end it. */
function scriptJson(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

function generateTutorialPages(tutorials) {
  const template = fs.readFileSync(
    path.join(TEMPLATES_DIR, 'tutorial.html'),
    'utf-8',
  );

  tutorials.forEach((tut, i) => {
    /* Markdown cells are rendered here; code cells are placeholders that
       tutorial-page.js fills with an editor, Run button and output. */
    let codeIndex = 0;
    const cellsHtml = tut.cells
      .map((cell) => (cell.type === 'markdown'
        ? `<div class="nb-markdown">${cell.html}</div>`
        : `<div class="nb-code" data-cell="${codeIndex++}"></div>`))
      .join('\n      ');

    const json = scriptJson({
      id: tut.id,
      basePath: tut.basePath,
      cells: tut.cells
        .filter((c) => c.type === 'code')
        .map(({ key, code, readOnly }) => ({ key, code, readOnly })),
    });

    /* "Next" links stay within the same folder (e.g. tutorials/python/) */
    const next = tutorials[i + 1]?.folder === tut.folder ? tutorials[i + 1] : null;
    const nextLink = next
      ? `<a class="btn btn-primary" href="../${next.id.split('/').pop()}/">Next: ${escapeHtml(next.title)} →</a>`
      : '';

    const html = template
      .replace(/\{\{TITLE\}\}/g, escapeHtml(tut.title))
      .replace('{{CELLS_HTML}}', () => cellsHtml)
      .replace('{{NEXT_LINK}}', () => nextLink)
      .replace('{{TUTORIAL_DATA}}', () => json)
      .replace(/\{\{BASE\}\}/g, tut.basePath);

    const dir = path.join(DIST, TUTORIALS_URL, tut.id);
    mkDir(dir);
    fs.writeFileSync(path.join(dir, 'index.html'), html);
    for (const file of tut.attachments) {
      fs.writeFileSync(path.join(dir, file.name), file.content);
    }
  });
}

function generateIndexPage(assignments, exercises) {
  const template = fs.readFileSync(
    path.join(TEMPLATES_DIR, 'index.html'),
    'utf-8',
  );
  const basePath = './';

  const json = JSON.stringify({
    startCode: '# Write your Python code here and press ▶ Run\n\n\n\n',
    basePath,
  });

  const html = template
    .replace(/\{\{BASE\}\}/g, basePath)
    .replace('{{PLAYGROUND_DATA}}', json);

  fs.writeFileSync(path.join(DIST, 'index.html'), html);
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ------------------------------------------------------------------ */
/*  7. Copy Pyodide runtime                                            */
/* ------------------------------------------------------------------ */

function copyPyodide() {
  const src = path.join(__dirname, 'node_modules', 'pyodide');
  const dest = path.join(DIST, 'pyodide');
  mkDir(dest);

  /* Copy only essential files — skip large .whl packages */
  const keep = ['.js', '.mjs', '.wasm', '.json', '.zip', '.ts', '.map'];

  for (const file of fs.readdirSync(src)) {
    if (file === 'node_modules') continue;
    const ext = path.extname(file);
    if (!keep.includes(ext) && ext !== '') continue;

    const stat = fs.statSync(path.join(src, file));
    if (stat.isFile()) {
      fs.copyFileSync(path.join(src, file), path.join(dest, file));
    }
  }

  console.log('  ✓ Pyodide runtime copied');
}

/* ------------------------------------------------------------------ */
/*  8. Bundle JS / CSS with Vite                                       */
/* ------------------------------------------------------------------ */

async function bundle() {
  await viteBuild({
    configFile: path.join(__dirname, 'vite.config.js'),
    publicDir: false, /* public/ is copied to the dist/ root by copyPublic() */
    logLevel: 'warn',
  });
  console.log('  ✓ JS & CSS bundled');
}

/* ------------------------------------------------------------------ */
/*  Main                                                               */
/* ------------------------------------------------------------------ */

async function main() {
  console.log('\n🔨 Building Python Exercises site…\n');

  /* Clean dist/ */
  rmDir(DIST);
  mkDir(DIST);

  /* Read content */
  const exercises = readExercises();
  const assignments = readAssignments(exercises);
  const exams = readExams();
  const pages = [...readPages(), ...readPages(TUTORIALS_DIR, TUTORIALS_URL)];
  const tutorials = readTutorials();
  console.log(
    `  Found ${exercises.length} exercise(s), ${assignments.length} assignment(s), ${exams.length} exam(s), ${pages.length} page(s), ${tutorials.length} tutorial(s)`,
  );

  /* Bundle JS/CSS first (outputs to dist/assets/) */
  await bundle();

  /* Copy Pyodide runtime and static files */
  copyPyodide();
  copyPublic();

  /* Generate HTML pages */
  generateExercisePages(exercises);
  generateAssignmentPages(assignments);
  generateExamPages(exams);
  generatePages(pages);
  generateTutorialPages(tutorials);
  generateIndexPage(assignments, exercises);

  /* Copy service worker to dist root (for exam offline support) */
  const swSrc = path.join(__dirname, 'src', 'sw.js');
  if (fs.existsSync(swSrc)) {
    fs.copyFileSync(swSrc, path.join(DIST, 'sw.js'));
  }

  /* Copy 404 page to dist root */
  const notFoundSrc = path.join(__dirname, 'src', '404.html');
  if (fs.existsSync(notFoundSrc)) {
    fs.copyFileSync(notFoundSrc, path.join(DIST, '404.html'));
  }

  /* Fine-print footer on every page */
  insertFooter();

  console.log('  ✓ HTML pages generated');

  console.log(`\n✅ Done → ${path.relative(process.cwd(), DIST)}/\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
