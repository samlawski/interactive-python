#!/usr/bin/env node
/* ===================================================================
   build.js — Static-site generator for Python Exercises
   ===================================================================

   Usage:   node build.js
   Output:  dist/

   Reads exercises/, assignments/, exams/ and pages/, renders Markdown,
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

/** Render one clickable link box (used by link grids on pages). */
function linkBoxHtml({ titleHtml, href, descriptionHtml }) {
  const external = /^https?:/i.test(href);
  return `<a class="link-box" href="${escapeHtml(href)}" target="_blank" rel="noopener">
          <span class="link-box-title">${titleHtml}${external ? ' ↗' : ''}</span>
          ${descriptionHtml ? `<span class="link-box-description">${descriptionHtml}</span>` : ''}
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
 * the site root, and (if `linkBoxes` is true) lists made only of
 * described links (`- [Title](url "description")`) become link boxes.
 */
function renderPageMarkdown(md, basePath, linkBoxes = false) {
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

function readPages() {
  if (!fs.existsSync(PAGES_DIR)) return [];

  const reserved = [
    ...RESERVED_PAGE_IDS,
    ...(fs.existsSync(PUBLIC_DIR) ? fs.readdirSync(PUBLIC_DIR) : []),
  ];

  return listMarkdownFiles(PAGES_DIR).map((file) => {
    const raw = fs.readFileSync(path.join(PAGES_DIR, file), 'utf-8');
    const { meta, body } = parseFrontmatter(raw);

    /* "os01.md" → "os01", "se19/index.md" → "se19", "se19/1-html.md" → "se19/1-html" */
    const id = file.replace(/\.md$/, '').replace(/(^|\/)index$/, '');
    const topLevel = id.split('/')[0] || 'index';

    if (reserved.includes(topLevel)) {
      throw new Error(`pages/${file}: "${topLevel}" is reserved, please rename the page.`);
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
      descriptionHtml: renderPageMarkdown(body, basePath, linkBoxes),
    };
  });
}

/* ------------------------------------------------------------------ */
/*  5. Generate HTML pages                                             */
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
      .map(
        (ex) =>
          `<li>
            <span id="status-${ex.id}" class="status-icon">⚪️</span>
            <a href="${basePath}exercises/${ex.id}/?from=${a.id}">${escapeHtml(ex.title)}</a>
          </li>`,
      )
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
        (task) =>
          `<section id="${task.id}" class="exam-task card" data-task-id="${task.id}" data-has-editor="${task.hasEditor}">
        <h2>${escapeHtml(task.title)}</h2>
        ${task.contentHtml ? `<div class="task-content">${task.contentHtml}</div>` : ''}
        <div class="task-answer-area"></div>
      </section>`,
      )
      .join('\n      <hr class="task-separator">\n');

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

/** Copy static files from public/ to the dist/ root as they are. */
function copyPublic() {
  if (!fs.existsSync(PUBLIC_DIR)) return;
  fs.cpSync(PUBLIC_DIR, DIST, { recursive: true });
  console.log('  ✓ Public files copied');
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
/*  6. Copy Pyodide runtime                                            */
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
/*  7. Bundle JS / CSS with Vite                                       */
/* ------------------------------------------------------------------ */

async function bundle() {
  await viteBuild({
    configFile: path.join(__dirname, 'vite.config.js'),
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
  const pages = readPages();
  console.log(
    `  Found ${exercises.length} exercise(s), ${assignments.length} assignment(s), ${exams.length} exam(s), ${pages.length} page(s)`,
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

  console.log('  ✓ HTML pages generated');

  console.log(`\n✅ Done → ${path.relative(process.cwd(), DIST)}/\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
