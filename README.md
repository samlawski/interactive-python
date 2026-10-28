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
| `site.json` | — | site-wide settings, see below |

## Site settings (`site.json`)

Values used on many pages, such as the exam upload form, live in `site.json` as `"key": "text"` pairs. The build replaces every `{{site.<key>}}` in the templates (and in raw HTML inside content) with the value. A placeholder without a matching key fails the build.

| Key | Description |
| --- | --- |
| `site_name` | Shown after the page title in the browser tab. |
| `exam_upload_url` | Form students upload their exam answers to. Linked from the dialog after "Download My Answers". |

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
