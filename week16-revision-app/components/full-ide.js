import { runPython } from '../pyodide-runner.js';

let EditorView, EditorState, basicSetup, python, oneDark;
let cmLoaded = false;

async function ensureCodeMirror() {
  if (cmLoaded) return;
  const cm    = await import('https://esm.sh/codemirror@6.0.1');
  const pyMod = await import('https://esm.sh/@codemirror/lang-python@6.1.6');
  const theme = await import('https://esm.sh/@codemirror/theme-one-dark@6.1.2');
  EditorView  = cm.EditorView;
  EditorState = cm.EditorState;
  basicSetup  = cm.basicSetup;
  python      = pyMod.python;
  oneDark     = theme.oneDark;
  cmLoaded    = true;
}

export class FullIDE {
  constructor(mountEl, { starterCode = '', onRun } = {}) {
    this.mountEl     = mountEl;
    this.starterCode = starterCode;
    this.onRun       = onRun;
    this.view        = null;
    this._ready      = false;
  }

  async init() {
    await ensureCodeMirror();

    const wrap = this.mountEl;
    wrap.innerHTML = '';

    this.view = new EditorView({
      state: EditorState.create({
        doc: this.starterCode,
        extensions: [
          basicSetup,
          python(),
          oneDark,
          EditorView.lineWrapping,
          EditorView.theme({
            '&': { height: '100%', position: 'absolute', inset: '0' },
            '.cm-scroller': { overflow: 'auto' }
          })
        ]
      }),
      parent: wrap
    });

    this._ready = true;
  }

  getCode() {
    return this.view ? this.view.state.doc.toString() : '';
  }

  setCode(code) {
    if (!this.view) return;
    this.view.dispatch({
      changes: { from: 0, to: this.view.state.doc.length, insert: code }
    });
  }

  reset() {
    this.setCode(this.starterCode);
  }

  async run(outputEl, runBtn) {
    const code = this.getCode();
    if (!code.trim()) return;

    runBtn.disabled = true;
    outputEl.innerHTML = '';

    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'output-running';
    loadingDiv.innerHTML = '<div class="spinner"></div><span>Running…</span>';
    outputEl.appendChild(loadingDiv);

    const { stdout, stderr, error, loadError } = await runPython(code, (msg) => {
      loadingDiv.querySelector('span').textContent = msg;
    });

    runBtn.disabled = false;
    outputEl.innerHTML = '';

    if (loadError) {
      const el = document.createElement('div');
      el.className = 'output-error-block';
      el.textContent = `Could not load Python:\n${error}`;
      outputEl.appendChild(el);
      return;
    }

    if (stdout) {
      const el = document.createElement('div');
      el.className = 'output-result';
      el.textContent = stdout;
      outputEl.appendChild(el);
    }

    if (error) {
      if (stdout) {
        const sep = document.createElement('hr');
        sep.className = 'output-separator';
        outputEl.appendChild(sep);
      }
      const el = document.createElement('div');
      el.className = 'output-error-block';
      el.textContent = error;
      outputEl.appendChild(el);
    } else if (stderr) {
      const el = document.createElement('div');
      el.className = 'output-error-block';
      el.textContent = stderr;
      outputEl.appendChild(el);
    }

    if (!stdout && !error && !stderr) {
      const el = document.createElement('div');
      el.className = 'output-idle';
      el.textContent = 'No output';
      outputEl.appendChild(el);
    }
  }
}
