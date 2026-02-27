/* ===================================================================
   python-runner.js — Pyodide wrapper for running & testing Python code
   ===================================================================
   Interactive input() is handled via a "replay" mechanism:
   1. Code runs until input() is needed (raises _NeedInputError).
   2. An inline <input> appears in the terminal; user types + Enter.
   3. The value is stored, the terminal is cleared, and the code
      restarts from scratch with all collected inputs pre-filled.
   4. Repeat until the code completes or throws a real error.
   This avoids window.prompt() and keeps everything inside the terminal.
   =================================================================== */

/* ------------------------------------------------------------------ */
/*  Python bootstrap — installed once when Pyodide loads               */
/* ------------------------------------------------------------------ */

const PYTHON_SETUP = `
import builtins as _builtins
import sys     as _sys
import io      as _io

class _NeedInputError(BaseException):
    """Raised when interactive input() is needed and the buffer is empty.
       Inherits BaseException so student 'except Exception' blocks
       do not accidentally swallow it."""
    pass

_input_buffer = []
_input_pos    = 0

def _custom_input(prompt=""):
    global _input_pos

    # --- Test mode ---------------------------------------------------
    # When the test harness redirects sys.stdin to a StringIO, honour
    # that directly so tests run without any user interaction.
    if isinstance(_sys.stdin, _io.StringIO):
        if prompt:
            _sys.stdout.write(prompt)
        line = _sys.stdin.readline()
        return line.rstrip("\\n")

    # --- Interactive mode --------------------------------------------
    # Write the prompt directly to the JS terminal (bypassing Python
    # stdout) so it appears immediately without a trailing newline.
    if prompt:
        from js import _terminal_write
        _terminal_write(prompt)

    # Return a previously-collected value (replay phase)
    if _input_pos < len(_input_buffer):
        val = _input_buffer[_input_pos]
        _input_pos += 1
        from js import _terminal_echo_input
        _terminal_echo_input(val)
        return val

    # Buffer exhausted → ask the user for new input
    raise _NeedInputError()

_builtins.input = _custom_input
`;

/* ------------------------------------------------------------------ */
/*  Public API                                                         */
/* ------------------------------------------------------------------ */

/**
 * Initialise Pyodide and install the custom input() infrastructure.
 */
export async function initPyodide(basePath) {
  // eslint-disable-next-line no-undef
  const pyodide = await loadPyodide({
    indexURL: basePath + 'pyodide/',
  });

  pyodide.runPython(PYTHON_SETUP);
  return pyodide;
}

/**
 * Run student code interactively.
 *
 * Uses the replay mechanism described at the top of this file so that
 * every input() call is fulfilled inline inside the terminal widget.
 */
export async function runCode(pyodide, code, terminal) {
  const inputs = [];

  // eslint-disable-next-line no-constant-condition
  while (true) {
    terminal.clear();
    _setupStdio(pyodide, terminal);
    _resetInputBuffer(pyodide, inputs);

    try {
      await pyodide.runPythonAsync(code);
      break; /* code completed — done */
    } catch (err) {
      const msg = err.message || String(err);
      if (msg.includes('_NeedInputError')) {
        /* Code needs a new input value — collect it inline */
        const value = await terminal.promptInput();
        inputs.push(value);
        /* loop → clear + replay with all collected inputs */
      } else {
        terminal.writeError(_cleanError(err));
        break;
      }
    }
  }
}

/**
 * Run the automated test suite for an exercise.
 *
 * Tests redirect sys.stdin / sys.stdout internally so they never
 * trigger _NeedInputError — no user interaction is required.
 */
export async function runTests(pyodide, solutionCode, testCode, terminal) {
  _setupStdio(pyodide, terminal);
  pyodide.FS.writeFile('/home/pyodide/solution.py', solutionCode);

  try {
    await pyodide.runPythonAsync(testCode);
  } catch (err) {
    terminal.writeError(_cleanError(err));
  }
}

/* ------------------------------------------------------------------ */
/*  Internal helpers                                                   */
/* ------------------------------------------------------------------ */

/**
 * Configure stdout / stderr routing and expose JS helpers to Python.
 */
function _setupStdio(pyodide, terminal) {
  pyodide.setStdout({
    batched: (text) => terminal.write(text + '\n'),
  });
  pyodide.setStderr({
    batched: (text) => terminal.writeError(text + '\n'),
  });

  /* Callable from Python via `from js import _terminal_write` */
  globalThis._terminal_write = (text) => terminal.write(text);
  globalThis._terminal_echo_input = (val) =>
    terminal.writeInput(val + '\n');
}

/**
 * Load the JS array of previously-collected inputs into the Python
 * buffer so the replay phase can return them instantly.
 */
function _resetInputBuffer(pyodide, inputs) {
  pyodide.globals.set('_input_buffer', pyodide.toPy(inputs));
  pyodide.runPython('_input_pos = 0');
}

/**
 * Strip internal Pyodide frames from error messages to keep output
 * readable for students.
 */
function _cleanError(err) {
  let msg = err.message || String(err);
  const pyErr = msg.indexOf('File "<exec>"');
  if (pyErr !== -1) {
    msg = msg.slice(pyErr);
  }
  return '\n' + msg + '\n';
}
