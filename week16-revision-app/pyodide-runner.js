const PYODIDE_VERSION = '0.26.4';
const PYODIDE_CDN = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

let pyodide = null;
let loadState = 'idle'; // 'idle' | 'loading' | 'ready' | 'error'
let loadError = null;
let loadListeners = [];

export function isPyodideReady() {
  return loadState === 'ready';
}

export function getPyodideState() {
  return { state: loadState, error: loadError };
}

export async function loadPyodideIfNeeded(onProgress) {
  if (loadState === 'ready') return { ok: true };
  if (loadState === 'error') return { ok: false, error: loadError };

  if (loadState === 'loading') {
    return new Promise((resolve) => loadListeners.push(resolve));
  }

  loadState = 'loading';
  onProgress?.('Setting up Python in your browser — this takes a few seconds the first time...');

  try {
    if (!window.loadPyodide) {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `${PYODIDE_CDN}pyodide.js`;
        script.onload = resolve;
        script.onerror = () => reject(new Error('Could not load Pyodide from CDN. Check your internet connection.'));
        document.head.appendChild(script);
      });
    }

    pyodide = await window.loadPyodide({ indexURL: PYODIDE_CDN });
    loadState = 'ready';

    const result = { ok: true };
    loadListeners.forEach(fn => fn(result));
    loadListeners = [];
    return result;
  } catch (err) {
    loadState = 'error';
    loadError = err.message;
    const result = { ok: false, error: err.message };
    loadListeners.forEach(fn => fn(result));
    loadListeners = [];
    return result;
  }
}

export async function runPython(code, onProgress) {
  const loaded = await loadPyodideIfNeeded(onProgress);
  if (!loaded.ok) {
    return { stdout: '', stderr: '', error: loaded.error, loadError: true };
  }

  try {
    await pyodide.runPythonAsync(`
import sys
from io import StringIO
_il_stdout = StringIO()
_il_stderr = StringIO()
sys.stdout = _il_stdout
sys.stderr = _il_stderr
`);

    let error = null;
    try {
      await pyodide.runPythonAsync(code);
    } catch (err) {
      error = formatPythonError(err.message);
    }

    const stdout = pyodide.runPython('_il_stdout.getvalue()');
    const stderr = pyodide.runPython('_il_stderr.getvalue()');

    await pyodide.runPythonAsync('sys.stdout = sys.__stdout__; sys.stderr = sys.__stderr__');

    return { stdout, stderr, error };
  } catch (err) {
    return { stdout: '', stderr: '', error: err.message };
  }
}

function formatPythonError(raw) {
  if (!raw) return 'Unknown error';
  const lines = raw.split('\n').filter(Boolean);
  const trimmed = lines
    .filter(l => !l.includes('_il_stdout') && !l.includes('_il_stderr') && !l.includes('StringIO'))
    .join('\n');
  return trimmed || raw;
}
