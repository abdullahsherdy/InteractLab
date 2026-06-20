/* global Pyodide loader — works from file:// and HTTP */
(function () {
  var PYODIDE_CDN = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/';
  var pyodide = null;
  var loadState = 'idle'; // 'idle' | 'loading' | 'ready' | 'error'
  var loadError = null;
  var waiters = [];

  function isPyodideReady() { return loadState === 'ready'; }

  function loadPyodideIfNeeded(onProgress) {
    if (loadState === 'ready') return Promise.resolve({ ok: true });
    if (loadState === 'error') return Promise.resolve({ ok: false, error: loadError });

    if (loadState === 'loading') {
      return new Promise(function (resolve) { waiters.push(resolve); });
    }

    loadState = 'loading';
    if (onProgress) onProgress('Setting up Python in your browser — this happens once and takes a few seconds...');

    return new Promise(function (resolve) {
      var script = document.createElement('script');
      script.src = PYODIDE_CDN + 'pyodide.js';

      script.onload = function () {
        window.loadPyodide({ indexURL: PYODIDE_CDN }).then(function (py) {
          pyodide = py;
          loadState = 'ready';
          var result = { ok: true };
          waiters.forEach(function (fn) { fn(result); });
          waiters = [];
          resolve(result);
        }).catch(function (err) {
          loadState = 'error';
          loadError = err.message || String(err);
          var result = { ok: false, error: loadError };
          waiters.forEach(function (fn) { fn(result); });
          waiters = [];
          resolve(result);
        });
      };

      script.onerror = function () {
        loadState = 'error';
        loadError = 'Could not load Pyodide from CDN. Check your internet connection.';
        var result = { ok: false, error: loadError };
        waiters.forEach(function (fn) { fn(result); });
        waiters = [];
        resolve(result);
      };

      document.head.appendChild(script);
    });
  }

  function runPython(code, onProgress) {
    return loadPyodideIfNeeded(onProgress).then(function (loaded) {
      if (!loaded.ok) {
        return { stdout: '', stderr: '', error: loaded.error, loadError: true };
      }

      return pyodide.runPythonAsync(
        'import sys\nfrom io import StringIO\n_il_out = StringIO()\n_il_err = StringIO()\nsys.stdout = _il_out\nsys.stderr = _il_err\n'
      ).then(function () {
        return pyodide.runPythonAsync(code);
      }).then(function () {
        var stdout = pyodide.runPython('_il_out.getvalue()');
        var stderr = pyodide.runPython('_il_err.getvalue()');
        pyodide.runPython('sys.stdout = sys.__stdout__; sys.stderr = sys.__stderr__');
        return { stdout: stdout, stderr: stderr, error: null };
      }).catch(function (err) {
        var stdout = '';
        var stderr = '';
        try { stdout = pyodide.runPython('_il_out.getvalue()'); } catch (e) {}
        try { pyodide.runPython('sys.stdout = sys.__stdout__; sys.stderr = sys.__stderr__'); } catch (e) {}
        return { stdout: stdout, stderr: '', error: cleanError(err.message || String(err)) };
      });
    });
  }

  function cleanError(raw) {
    if (!raw) return 'Unknown error';
    return raw.split('\n')
      .filter(function (l) { return l.indexOf('_il_out') === -1 && l.indexOf('_il_err') === -1 && l.indexOf('StringIO') === -1; })
      .join('\n').trim() || raw;
  }

  window.PyRunner = { isPyodideReady: isPyodideReady, loadPyodideIfNeeded: loadPyodideIfNeeded, runPython: runPython };
})();
