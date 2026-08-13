/* 南传经典网 · 交互脚本 */
(function () {
  'use strict';

  // ---------- 阅读页：竖排 / 横排 + 字号 ----------
  var body = document.getElementById('body');
  if (body) {
    var modeBtn = document.getElementById('modeBtn');
    var fsPlus = document.getElementById('fsPlus');
    var fsMinus = document.getElementById('fsMinus');
    var fsVal = document.getElementById('fsVal');

    var KEY_MODE = 'nz_mode';
    var KEY_FS = 'nz_fs';

    function applyMode(v) {
      if (v === 'vertical') {
        body.classList.add('vertical');
        if (modeBtn) modeBtn.textContent = '橫排';
      } else {
        body.classList.remove('vertical');
        if (modeBtn) modeBtn.textContent = '豎排';
      }
    }
    function applyFs(v) {
      v = Math.max(15, Math.min(28, v));
      body.style.fontSize = v + 'px';
      if (fsVal) fsVal.textContent = v;
    }

    var savedMode = localStorage.getItem(KEY_MODE) || 'horizontal';
    var savedFs = parseInt(localStorage.getItem(KEY_FS) || '19', 10);
    applyMode(savedMode);
    applyFs(savedFs);

    if (modeBtn) modeBtn.addEventListener('click', function () {
      var next = body.classList.contains('vertical') ? 'horizontal' : 'vertical';
      applyMode(next);
      localStorage.setItem(KEY_MODE, next);
    });
    if (fsPlus) fsPlus.addEventListener('click', function () {
      savedFs += 1; applyFs(savedFs); localStorage.setItem(KEY_FS, savedFs);
    });
    if (fsMinus) fsMinus.addEventListener('click', function () {
      savedFs -= 1; applyFs(savedFs); localStorage.setItem(KEY_FS, savedFs);
    });
  }

  // ---------- 列表页：筛选 ----------
  var filter = document.getElementById('filter');
  var list = document.getElementById('list');
  if (filter && list) {
    filter.addEventListener('input', function () {
      var q = filter.value.trim().toLowerCase();
      var items = list.getElementsByTagName('li');
      for (var i = 0; i < items.length; i++) {
        var t = items[i].textContent.toLowerCase();
        items[i].style.display = (q === '' || t.indexOf(q) !== -1) ? '' : 'none';
      }
    });
  }

  // ---------- 首页：全局搜索 ----------
  var search = document.getElementById('search');
  var results = document.getElementById('results');
  if (search && results && window.SUTRA_INDEX) {
    var idx = window.SUTRA_INDEX;
    search.addEventListener('input', function () {
      var q = search.value.trim().toLowerCase();
      if (q === '') { results.innerHTML = ''; return; }
      var out = [];
      for (var i = 0; i < idx.length && out.length < 150; i++) {
        var e = idx[i];
        var hay = (e.b + ' ' + e.n + ' ' + e.t).toLowerCase();
        if (hay.indexOf(q) !== -1) {
          out.push('<a href="' + e.p + '"><span class="r-book">' + e.b +
                   '</span>' + escapeHtml(e.t) + '</a>');
        }
      }
      if (out.length === 0) {
        results.innerHTML = '<div class="none">未找到相关经文，试试经名或编号（如：梵網經、DN01）。</div>';
      } else {
        results.innerHTML = out.join('');
      }
    });
  }

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
})();
