/* Inline Try-It runner — uses global window.PyRunner */
(function () {
  function createInlineRunner(container, code) {
    var textarea = container.querySelector('.runner-code');
    var outputEl = container.querySelector('.runner-output');
    var runBtn   = container.querySelector('.runner-run-btn');

    if (!textarea || !outputEl || !runBtn) return;

    textarea.value = code;

    textarea.addEventListener('keydown', function (e) {
      if (e.key === 'Tab') {
        e.preventDefault();
        var start = textarea.selectionStart;
        var end   = textarea.selectionEnd;
        textarea.value = textarea.value.substring(0, start) + '    ' + textarea.value.substring(end);
        textarea.selectionStart = textarea.selectionEnd = start + 4;
      }
    });

    runBtn.addEventListener('click', function () {
      var userCode = textarea.value;
      if (!userCode.trim()) return;

      runBtn.disabled = true;
      outputEl.innerHTML = '<div class="output-loading"><div class="spinner"></div><span>Running…</span></div>';
      outputEl.style.display = 'block';

      window.PyRunner.runPython(userCode, function (msg) {
        outputEl.innerHTML = '<div class="output-loading"><div class="spinner"></div><span>' + esc(msg) + '</span></div>';
      }).then(function (result) {
        runBtn.disabled = false;
        var html = '';
        if (result.stdout) html += '<div class="output-stdout">' + esc(result.stdout) + '</div>';
        if (result.error) {
          html += '<div class="output-error">' + esc(result.error) + '</div>';
        } else if (result.stderr) {
          html += '<div class="output-error">' + esc(result.stderr) + '</div>';
        }
        if (!html) html = '<div style="color:var(--text-tertiary);font-size:12px;font-style:italic">No output</div>';
        outputEl.innerHTML = html;
      });
    });
  }

  function esc(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  window.InlineRunner = { create: createInlineRunner };
})();
