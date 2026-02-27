/* ===================================================================
   terminal.js — Simple terminal UI component
   =================================================================== */

export class Terminal {
  /**
   * @param {HTMLElement} element — the container div
   */
  constructor(element) {
    this.el = element;
  }

  /** Remove all output. */
  clear() {
    this.el.innerHTML = '';
  }

  /** Append plain text (preserves whitespace via CSS white-space: pre-wrap). */
  write(text) {
    const node = document.createTextNode(text);
    this.el.appendChild(node);
    this._scroll();
  }

  /** Append text followed by a newline. */
  writeLine(text) {
    this.write(text + '\n');
  }

  /** Append error-styled text. */
  writeError(text) {
    const span = document.createElement('span');
    span.className = 'error';
    span.textContent = text;
    this.el.appendChild(span);
    this._scroll();
  }

  /** Append success-styled text. */
  writeSuccess(text) {
    const span = document.createElement('span');
    span.className = 'success';
    span.textContent = text;
    this.el.appendChild(span);
    this._scroll();
  }

  /** Append muted/info text. */
  writeInfo(text) {
    const span = document.createElement('span');
    span.className = 'muted';
    span.textContent = text;
    this.el.appendChild(span);
    this._scroll();
  }

  /** Append input-echo text (styled differently). */
  writeInput(text) {
    const span = document.createElement('span');
    span.className = 'input-echo';
    span.textContent = text;
    this.el.appendChild(span);
    this._scroll();
  }

  /**
   * Show an inline input field inside the terminal.
   * Returns a Promise that resolves with the entered string when
   * the user presses Enter.
   */
  promptInput() {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'terminal-input-field';
      input.setAttribute('autocomplete', 'off');
      input.setAttribute('autocorrect', 'off');
      input.setAttribute('autocapitalize', 'off');
      input.setAttribute('spellcheck', 'false');

      this.el.appendChild(input);
      input.focus();
      this._scroll();

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const value = input.value;
          input.remove();
          this.writeInput(value + '\n');
          resolve(value);
        }
      });
    });
  }

  /** Scroll to the bottom. */
  _scroll() {
    this.el.scrollTop = this.el.scrollHeight;
  }
}
