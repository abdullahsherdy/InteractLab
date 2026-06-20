/* Full IDE — uses CodeMirror 5 (loaded via CDN in index.html) and window.PyRunner */
(function () {
  function FullIDE(mountEl, options) {
    this.mountEl     = mountEl;
    this.starterCode = (options && options.starterCode) || '';
    this.editor      = null;
  }

  FullIDE.prototype.init = function () {
    if (!window.CodeMirror) {
      console.error('CodeMirror not loaded');
      return;
    }
    this.mountEl.innerHTML = '';
    this.editor = window.CodeMirror(this.mountEl, {
      value:         this.starterCode,
      mode:          'python',
      theme:         'one-dark',
      lineNumbers:   true,
      indentUnit:    4,
      tabSize:       4,
      indentWithTabs: false,
      lineWrapping:  true,
      autofocus:     false,
      extraKeys: {
        Tab: function (cm) {
          if (cm.somethingSelected()) {
            cm.indentSelection('add');
          } else {
            cm.replaceSelection('    ', 'end');
          }
        }
      }
    });
    // Let CSS control the size; refresh after layout settles
    var ed = this.editor;
    setTimeout(function () { ed.refresh(); }, 50);
  };

  FullIDE.prototype.getCode = function () {
    return this.editor ? this.editor.getValue() : '';
  };

  FullIDE.prototype.setCode = function (code) {
    if (this.editor) this.editor.setValue(code);
  };

  FullIDE.prototype.reset = function () {
    this.setCode(this.starterCode);
  };

  FullIDE.prototype.run = function (outputEl, runBtn) {
    var code = this.getCode();
    if (!code.trim()) return;

    runBtn.disabled = true;
    outputEl.innerHTML = '<div class="output-running"><div class="spinner"></div><span>Running…</span></div>';

    window.PyRunner.runPython(code, function (msg) {
      var span = outputEl.querySelector('span');
      if (span) span.textContent = msg;
    }).then(function (result) {
      runBtn.disabled = false;
      outputEl.innerHTML = '';

      if (result.loadError) {
        var el = document.createElement('div');
        el.className = 'output-error-block';
        el.textContent = 'Could not load Python:\n' + result.error;
        outputEl.appendChild(el);
        return;
      }

      if (result.stdout) {
        var el = document.createElement('div');
        el.className = 'output-result';
        el.textContent = result.stdout;
        outputEl.appendChild(el);
      }

      if (result.error) {
        if (result.stdout) {
          var sep = document.createElement('hr');
          sep.className = 'output-separator';
          outputEl.appendChild(sep);
        }
        var el = document.createElement('div');
        el.className = 'output-error-block';
        el.textContent = result.error;
        outputEl.appendChild(el);
      } else if (result.stderr) {
        var el = document.createElement('div');
        el.className = 'output-error-block';
        el.textContent = result.stderr;
        outputEl.appendChild(el);
      }

      if (!result.stdout && !result.error && !result.stderr) {
        var el = document.createElement('div');
        el.className = 'output-idle';
        el.textContent = 'No output';
        outputEl.appendChild(el);
      }
    });
  };

  window.FullIDE = FullIDE;
})();
