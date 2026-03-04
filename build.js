#!/usr/bin/env node
/* ===================================================================
   build.js — Static-site generator for Python Exercises
   ===================================================================

   Usage:   node build.js
   Output:  dist/

   Reads exercises/ and assignments/, renders Markdown, bundles JS/CSS
   with Vite, copies Pyodide files, and produces a fully self-contained
   static site ready for deployment.
   =================================================================== */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build as viteBuild } from 'vite';
import { marked } from 'marked';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST = path.join(__dirname, 'dist');
const EXERCISES_DIR = path.join(__dirname, 'exercises');
const ASSIGNMENTS_DIR = path.join(__dirname, 'assignments');
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
/*  3. Generate HTML pages                                             */
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

function generateIndexPage(assignments, exercises) {
  const template = fs.readFileSync(
    path.join(TEMPLATES_DIR, 'index.html'),
    'utf-8',
  );
  const basePath = './';

  /* Assignments section */
  let assignmentsSection = '';
  if (assignments.length) {
    const items = assignments
      .map(
        (a) =>
          `<li><a href="assignments/${a.id}/">${escapeHtml(a.title)}</a></li>`,
      )
      .join('\n        ');
    assignmentsSection = `
      <p class="section-title">Assignments</p>
      <ul class="card-list">${items}</ul>`;
  }

  /* Exercises section */
  let exercisesSection = '';
  if (exercises.length) {
    const items = exercises
      .map(
        (e) =>
          `<li><a href="exercises/${e.id}/">${escapeHtml(e.title)}</a></li>`,
      )
      .join('\n        ');
    exercisesSection = `
      <p class="section-title">All Exercises</p>
      <ul class="card-list">${items}</ul>`;
  }

  const html = template
    .replace(/\{\{BASE\}\}/g, basePath)
    .replace('{{ASSIGNMENTS_SECTION}}', assignmentsSection)
    .replace('{{EXERCISES_SECTION}}', exercisesSection);

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
/*  4. Copy Pyodide runtime                                            */
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
/*  5. Bundle JS / CSS with Vite                                       */
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
  console.log(
    `  Found ${exercises.length} exercise(s), ${assignments.length} assignment(s)`,
  );

  /* Bundle JS/CSS first (outputs to dist/assets/) */
  await bundle();

  /* Copy Pyodide runtime */
  copyPyodide();

  /* Generate HTML pages */
  generateExercisePages(exercises);
  generateAssignmentPages(assignments);
  generateIndexPage(assignments, exercises);
  console.log('  ✓ HTML pages generated');

  console.log(`\n✅ Done → ${path.relative(process.cwd(), DIST)}/\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
