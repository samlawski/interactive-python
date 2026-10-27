# Python Exercises

A static site of beginner Python exercises, assignments, exams, interactive tutorials and pages. Python runs in the browser with [Pyodide](https://pyodide.org).

```bash
npm install
npm run build    # builds the site into dist/
npm run preview  # serves dist/ locally
```

## Content

| Folder | URL | Frontmatter |
| --- | --- | --- |
| `exercises/<N>-<M>-<slug>/` | `/exercises/<N>-<M>-<slug>/` | none (`instructions.md`, `start.py`, `test.py`) |
| `assignments/<slug>.md` | `/assignments/<slug>/` | see below |
| `exams/<slug>.md` | `/exams/<slug>/` | none (`# Title`, then tasks separated by `---`) |
| `pages/<path>.md` | `/<path>/` | see below |
| `tutorials/<topic>/<NN>-<slug>.ipynb` | `/tutorials/<topic>/<slug>/` | none (Jupyter notebook) |
| `tutorials/<topic>/index.md` | `/tutorials/<topic>/` | same as pages |
| `public/` | copied as-is to `/` | — |

## Frontmatter reference

Frontmatter sits between `---` lines at the top of a file. Only simple `key: value` pairs and `- item` lists are supported.

### Assignments

| Field | Required | Description |
| --- | --- | --- |
| `title` | no | Page title. Defaults to the file name. |
| `exercises` | no | List of exercise folder names, shown in this order. |

```yaml
---
title: Week 1 – Python Basics
exercises:
  - 1-1-brick-in-the-wall
  - 1-2-dad-jokes
---
```

### Pages

| Field | Required | Description |
| --- | --- | --- |
| `title` | no | Page title. Defaults to the file name. |
| `icon` | no | Emoji shown before the title. |
| `link_boxes` | no | `true` or `false` (default). When `true`, a list made only of links with descriptions renders as clickable boxes. |
| `redirect` | no | Turns the page into a redirect to this URL. All other fields and the body are ignored. |

```yaml
---
title: OS_01
icon: 🐣
link_boxes: true
---

## Install Python

- [python.org](https://python.org "The official Python website. Download Python here.")
- [VS Code](https://code.visualstudio.com/ "A free code editor.")
```

A link box is a list item that contains only `[Title](url "description")`. The description supports **bold**, *italics* and `code`.

URLs with a scheme (`https://`, `mailto:`) are used as they are. Anything else is relative to the site root, for example `assignments/os01-week-1/` or `random-files/slides.pdf`. Don't start them with `/`.

```yaml
---
redirect: https://github.com/samlawski/hackable-flask
---
```

## Exam submission

Students can submit their exam answers to a backend with one click, instead of downloading a file. The download stays available as a text link in the same dialog. Submitting needs a connection, so the Submit button stays disabled while the page is offline.

The code lives in `src/js/submission/`, separate from the rest of the app:

| File | Purpose |
| --- | --- |
| `index.js` | The only module the exam page uses: `isSubmissionEnabled()` and `submitAnswers(submission)`. Handles timeouts and retries. Documents the provider contract. |
| `config.js` | Picks the provider and holds its settings. Leave the settings empty to turn submitting off (download only). |
| `baserow.js` | Provider for [Baserow](https://baserow.io) (hosted or self-hosted). |
| `errors.js` | `SubmissionError`, shared by all providers. |

A submission contains the exam id, the email, the integrity hash, a timestamp and the full Markdown, the same text as the download. Copy the Markdown into a `.md` file to check it with `node verify-exam.js`.

To use another backend, add a `<name>.js` provider with `isConfigured(options)` and `submit(submission, options, signal)`, register it in `PROVIDERS` in `index.js` and select it in `config.js`.

### Baserow setup

1. Create a table, e.g. "Exam submissions", with these fields (names must match `FIELDS` in `baserow.js`): `Exam`, `Email`, `Integrity`, `Submitted at` (single line text) and `Answers` (long text, with **rich text formatting turned off**; otherwise Baserow converts the Markdown, which breaks code blocks and drops the activity log table). Optionally add a `Created on` field to record the server time.
2. Create a database token (Settings → Database tokens) that can **only create** rows in this table, with no read, update or delete rights. The token is visible to anyone who opens the exam page, so it must not be able to read submissions.
3. Fill in `apiUrl`, `tableId` (the number in the table URL), `token` and `privacyPolicyUrl` (linked in the fine print under the Submit button) in `src/js/submission/config.js` and rebuild.
4. During and after the exam, watch submissions arrive in the table view. Export the view as CSV for a spreadsheet.

Retries can create duplicate rows. Rows with the same `Integrity` value are identical. If a student submits several times, the latest row counts.
