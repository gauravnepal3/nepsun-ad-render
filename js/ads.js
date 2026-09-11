/*
 * Test harness helpers for ad delivery.
 * Nothing here talks to an ad server - it just makes it easier to see what
 * your own ad code is doing on the page.
 *
 * URL params:
 *   ?clean=1   hide the dashed slot outlines and labels
 *   ?debug=1   show a small panel listing every slot and whether it filled
 */
(function () {
  var params = new URLSearchParams(location.search);

  if (params.get('clean') === '1') {
    document.body.classList.add('clean-ads');
  }

  // Dismiss button on the sticky footer slot
  var footer = document.querySelector('.ad-slot--footer-sticky');
  if (footer) {
    var btn = document.createElement('button');
    btn.className = 'close';
    btn.textContent = 'close ×';
    btn.addEventListener('click', function () { footer.remove(); });
    footer.appendChild(btn);
  }

  var slots = Array.prototype.slice.call(document.querySelectorAll('.ad-slot'));

  // Log when a slot scrolls into view - useful for lazy-load / viewability checks
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          console.log('[ads] slot in view:', e.target.id || e.target.dataset.label);
        }
      });
    }, { threshold: 0.5 });
    slots.forEach(function (s) { io.observe(s); });
  }

  if (params.get('debug') !== '1') return;

  var panel = document.createElement('div');
  panel.style.cssText =
    'position:fixed;top:10px;right:10px;z-index:99999;background:#111;color:#eee;' +
    'font:11px/1.5 ui-monospace,Menlo,monospace;padding:10px 12px;border-radius:6px;' +
    'max-width:280px;max-height:60vh;overflow:auto;opacity:.92';
  document.body.appendChild(panel);

  function filled(slot) {
    // Anything beyond the label pseudo-element counts as a fill
    return slot.children.length > 0 || slot.offsetHeight > 100;
  }

  function render() {
    var rows = slots.map(function (s) {
      var ok = filled(s);
      return '<div style="color:' + (ok ? '#7fe07f' : '#e07f7f') + '">' +
        (ok ? '●' : '○') + ' ' + (s.id || s.dataset.label) +
        ' <span style="color:#888">' + s.offsetWidth + '×' + s.offsetHeight + '</span></div>';
    }).join('');
    panel.innerHTML = '<div style="color:#888;margin-bottom:6px">AD SLOTS (' +
      window.innerWidth + 'px viewport)</div>' + rows;
  }

  render();
  setInterval(render, 1000);
  window.addEventListener('resize', render);
})();
