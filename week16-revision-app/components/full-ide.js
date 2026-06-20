/* Full IDE — CodeMirror 5 + window.PyRunner */
(function () {

  function FullIDE(mountEl, options) {
    this.mountEl     = mountEl;
    this.starterCode = (options && options.starterCode) || '';
    this.editor      = null;
  }

  FullIDE.prototype.init = function () {
    if (!window.CodeMirror) {
      this.mountEl.innerHTML =
        '<div style="padding:20px;color:#f87171;font-family:monospace;font-size:13px">' +
        'CodeMirror failed to load — check your internet connection and refresh.</div>';
      return;
    }

    this.mountEl.innerHTML = '';

    this.editor = window.CodeMirror(this.mountEl, {
      value:          this.starterCode,
      mode:           'python',
      theme:          'one-dark',
      lineNumbers:    true,
      indentUnit:     4,
      tabSize:        4,
      indentWithTabs: false,
      lineWrapping:   true,
      autofocus:      false,
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

    // Size after the IDE CSS has applied (body.ide-active must be present first)
    var self = this;
    setTimeout(function () { self.resize(); }, 80);
  };

  /* Measure the container and set CodeMirror to that exact pixel height */
  FullIDE.prototype.resize = function () {
    if (!this.editor) return;

    var h = this.mountEl.clientHeight;

    /* If the container reports 0 (CSS not yet applied), walk up to find a
       real height and subtract the pane-header (~33 px) */
    if (!h || h < 50) {
      var pane = this.mountEl.closest('.editor-pane');
      if (pane) {
        var header = pane.querySelector('.pane-header');
        h = pane.clientHeight - (header ? header.offsetHeight : 0);
      }
    }

    /* Absolute fallback — still renders a usable editor */
    if (!h || h < 50) h = 480;

    this.editor.setSize(null, h);
    this.editor.refresh();
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
    outputEl.innerHTML =
      '<div class="output-running"><div class="spinner"></div><span>Running…</span></div>';

    window.PyRunner.runPython(code, function (msg) {
      var span = outputEl.querySelector('span');
      if (span) span.textContent = msg;
    }).then(function (result) {
      runBtn.disabled = false;
      outputEl.innerHTML = '';

      if (result.loadError) {
        appendBlock(outputEl, 'output-error-block',
          'Could not load Python:\n' + result.error);
        return;
      }

      if (result.stdout) appendBlock(outputEl, 'output-result', result.stdout);

      if (result.error) {
        if (result.stdout) {
          var sep = document.createElement('hr');
          sep.className = 'output-separator';
          outputEl.appendChild(sep);
        }
        appendBlock(outputEl, 'output-error-block', result.error);
      } else if (result.stderr) {
        appendBlock(outputEl, 'output-error-block', result.stderr);
      }

      if (!result.stdout && !result.error && !result.stderr) {
        appendBlock(outputEl, 'output-idle', 'No output');
      }
    });
  };

  function appendBlock(parent, cls, text) {
    var el = document.createElement('div');
    el.className = cls;
    el.textContent = text;
    parent.appendChild(el);
  }

  window.FullIDE = FullIDE;
})();
