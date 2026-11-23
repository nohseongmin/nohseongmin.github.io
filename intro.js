(() => {
  'use strict';

  const intro = document.getElementById('portfolio-intro');
  const button = document.getElementById('intro-card');
  const card = document.getElementById('card-tilt');
  const arrival = document.getElementById('card-arrival');
  const presentation = document.getElementById('intro-presentation');
  const home = document.getElementById('home');
  if (!intro || !button || !card || !arrival || !presentation || !home ||
      window.location.hash || window.scrollY > 0) return;

  const blocked = Array.from(document.querySelectorAll('[data-intro-block]'));
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mask = 'radial-gradient(circle, transparent 0px, black 1px)';
  const supportsHole = window.CSS?.supports('mask-image', mask) ||
    window.CSS?.supports('-webkit-mask-image', mask);
  const duration = 920;
  let opening = false;
  let frame = 0;
  let endRadius = 0;
  let descent;

  function measureHole() {
    const bounds = intro.getBoundingClientRect();
    const paper = card.getBoundingClientRect();
    const x = paper.left + paper.width / 2 - bounds.left;
    const y = paper.top + paper.height / 2 - bounds.top;
    const horizontal = Math.max(x, bounds.width - x);
    const vertical = Math.max(y, bounds.height - y);
    endRadius = Math.hypot(horizontal, vertical) + 3;
    intro.style.setProperty('--intro-x', x + 'px');
    intro.style.setProperty('--intro-y', y + 'px');
  }

  function finish() {
    if (intro.hidden) return;
    window.cancelAnimationFrame(frame);
    window.removeEventListener('resize', measureHole);
    motion.removeEventListener?.('change', onMotionChange);
    button.removeEventListener('click', enter);
    presentation.hidden = true;
    intro.hidden = true;
    blocked.forEach(element => { element.inert = false; });
    document.documentElement.classList.remove('intro-active', 'intro-revealing');
    home.focus({ preventScroll: true });
  }

  function onMotionChange() {
    if (!motion.matches) return;
    if (opening) finish();
    else descent?.cancel();
  }

  function enter() {
    if (opening) return;
    opening = true;
    // An early click keeps the exact visible translation, including after the veil is gone.
    if (descent && (descent.playState === 'running' || descent.pending)) {
      arrival.style.transform = window.getComputedStyle(arrival).transform;
      descent.cancel();
    }
    if (motion.matches || !supportsHole) {
      finish();
      return;
    }

    intro.style.setProperty('--intro-radius', '0px');
    intro.classList.add('is-opening');
    document.documentElement.classList.add('intro-revealing');
    measureHole();
    window.addEventListener('resize', measureHole);
    const started = performance.now();
    function expand(now) {
      const t = Math.min(1, Math.max(0, (now - started) / duration));
      const eased = t * t * (3 - 2 * t);
      intro.style.setProperty('--intro-radius', (endRadius * eased) + 'px');
      if (t === 1) finish();
      else frame = window.requestAnimationFrame(expand);
    }
    frame = window.requestAnimationFrame(expand);
  }

  button.addEventListener('click', enter);
  motion.addEventListener?.('change', onMotionChange);
  blocked.forEach(element => { element.inert = true; });
  document.documentElement.classList.add('intro-active');
  intro.hidden = false;
  presentation.hidden = false;
  if (!motion.matches && arrival.animate) {
    descent = arrival.animate(
      [{ transform: 'translateY(-48px)' }, { transform: 'translateY(0px)' }],
      { duration: 720, easing: 'cubic-bezier(.17,.73,.19,1)' }
    );
  }
  button.focus({ preventScroll: true });
})();
