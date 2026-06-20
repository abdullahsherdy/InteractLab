import { runPython, loadPyodideIfNeeded } from '../pyodide-runner.js';

export function createInlineRunner(container, code) {
  const textarea = container.querySelector('.runner-code');
  const outputEl = container.querySelector('.runner-output');
  const runBtn   = container.querySelector('.runner-run-btn');

  if (!textarea || !outputEl || !runBtn) return;

  textarea.value = code;

  textarea.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = textarea.selectionStart;
      const end   = textarea.selectionEnd;
      textarea.value = textarea.value.substring(0, start) + '    ' + textarea.value.substring(end);
      textarea.selectionStart = textarea.selectionEnd = start + 4;
    }
  });

  runBtn.addEventListener('click', async () => {
    const code = textarea.value;
    if (!code.trim()) return;

    runBtn.disabled = true;
    outputEl.innerHTML = '<div class="output-loading"><div class="spinner"></div><span>Running…</span></div>';
    outputEl.style.display = 'block';

    const { stdout, stderr, error, loadError } = await runPython(code, (msg) => {
      outputEl.innerHTML = `<div class="output-loading"><div class="spinner"></div><span>${escHtml(msg)}</span></div>`;
    });

    runBtn.disabled = false;

    if (loadError) {
      outputEl.innerHTML = `<div class="output-error">Could not load Python: ${escHtml(error)}</div>`;
      return;
    }

    let html = '';
    if (stdout) {
      html += `<div class="output-stdout">${escHtml(stdout)}</div>`;
    }
    if (error) {
      html += `<div class="output-error">${escHtml(error)}</div>`;
    } else if (stderr) {
      html += `<div class="output-error">${escHtml(stderr)}</div>`;
    }
    if (!html) {
      html = '<div style="color:var(--text-tertiary);font-size:12px;font-style:italic">No output</div>';
    }
    outputEl.innerHTML = html;
  });
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
