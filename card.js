(() => {
  'use strict';

  const tilt = document.getElementById('card-tilt');
  const hoverArea = document.getElementById('card-arrival');
  const fold = document.getElementById('card-fold');
  const front = document.getElementById('card-front');
  const back = document.getElementById('card-back');
  const frontButton = document.getElementById('flip-front');
  const presentation = document.getElementById('intro-presentation');
  const switches = [...document.querySelectorAll('[data-face]')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const HOVER_TILT = 18;
  const GRIP_TILT = 24;
  let showingBack = false;
  let drag = null;
  let suppressClickUntil = 0;

  // The grip is anchored at pointer-down. Sliding across the face moves the
  // card without changing which edge is held. Every axis returns to rest
  // through the same damped spring, including the contact shadow.
  const target = { x: 0, y: 0, pitch: 0, yaw: 0, roll: 0, lift: 0 };
  const pose = { ...target };
  const velocity = { ...target };
  const axes = Object.keys(target);
  let frame = 0;
  let previousTime = 0;

  function paint() {
    const style = tilt.style;
    style.setProperty('--card-x', pose.x.toFixed(2) + 'px');
    style.setProperty('--card-y', (pose.y - pose.lift * 6).toFixed(2) + 'px');
    style.setProperty('--rx', (3 + pose.pitch).toFixed(2) + 'deg');
    style.setProperty('--ry', (-5 + pose.yaw).toFixed(2) + 'deg');
    style.setProperty('--rz', (-3 + pose.roll).toFixed(2) + 'deg');
    style.setProperty('--shadow-x', (pose.yaw * .45).toFixed(2) + 'px');
    style.setProperty('--shadow-y', (9 + pose.lift * 14).toFixed(2) + 'px');
    style.setProperty('--shadow-blur', (15 + pose.lift * 15).toFixed(2) + 'px');
  }

  function step(time) {
    const elapsed = Math.min(.032, Math.max(.001, (time - previousTime) / 1000));
    previousTime = time;
    // Short integration steps give comparable motion on 30 Hz and 120 Hz displays.
    const steps = Math.ceil(elapsed / .008);
    const dt = elapsed / steps;
    const stiffness = drag ? 310 : 205;
    const damping = drag ? 34 : 26;
    let moving = false;
    for (const axis of axes) {
      for (let i = 0; i < steps; i++) {
        velocity[axis] += ((target[axis] - pose[axis]) * stiffness - velocity[axis] * damping) * dt;
        pose[axis] += velocity[axis] * dt;
      }
      if (Math.abs(target[axis] - pose[axis]) > .002 || Math.abs(velocity[axis]) > .018) {
        moving = true;
      } else {
        pose[axis] = target[axis];
        velocity[axis] = 0;
      }
    }
    paint();
    frame = moving ? requestAnimationFrame(step) : 0;
  }

  function animate() {
    if (reducedMotion.matches || frame) return;
    previousTime = performance.now();
    frame = requestAnimationFrame(step);
  }

  function rest() {
    for (const axis of axes) target[axis] = 0;
    if (reducedMotion.matches) {
      cancelAnimationFrame(frame);
      frame = 0;
      for (const axis of axes) pose[axis] = velocity[axis] = 0;
      paint();
    } else {
      animate();
    }
  }

  function setFace(toBack) {
    if (showingBack === toBack) return;
    const oldFace = showingBack ? back : front;
    const newFace = toBack ? back : front;
    const focusWasOnFace = oldFace.contains(document.activeElement);
    showingBack = toBack;
    fold.classList.toggle('is-back', toBack);
    newFace.inert = false;
    newFace.setAttribute('aria-hidden', 'false');
    switches.forEach(button => {
      const selected = (button.dataset.face === 'back') === toBack;
      button.setAttribute('aria-pressed', String(selected));
      if (selected && focusWasOnFace) button.focus({ preventScroll: true });
    });
    oldFace.inert = true;
    oldFace.setAttribute('aria-hidden', 'true');
    rest();
  }

  switches.forEach(button => button.addEventListener('click', () => setFace(button.dataset.face === 'back')));
  frontButton.addEventListener('click', event => {
    if (presentation && !presentation.hidden) return;
    if (event.detail === 0 || performance.now() >= suppressClickUntil) setFace(true);
  });

  const clamp = (value, limit = 1) => Math.max(-limit, Math.min(limit, value));

  function tiltTowardPointer(event) {
    if (drag || !event.isPrimary || event.pointerType === 'touch' || reducedMotion.matches) return;
    // The paper turns under a stationary pointer; its hit area stays on the table.
    const bounds = hoverArea.getBoundingClientRect();
    target.pitch = clamp(1 - 2 * (event.clientY - bounds.top) / bounds.height) * HOVER_TILT;
    target.yaw = clamp(2 * (event.clientX - bounds.left) / bounds.width - 1) * HOVER_TILT;
    animate();
  }
  hoverArea.addEventListener('pointerenter', tiltTowardPointer);
  hoverArea.addEventListener('pointermove', tiltTowardPointer);
  hoverArea.addEventListener('pointerleave', () => { if (!drag) rest(); });

  function hold(dx, dy) {
    if (reducedMotion.matches) return;
    const { gripX, gripY } = drag;
    const lever = clamp(Math.hypot(gripX, gripY));
    target.x = clamp(dx * .22, 22);
    target.y = clamp(dy * .18, 15);
    target.pitch = gripY * GRIP_TILT + clamp(dy / 24, 3) * lever;
    target.yaw = -gripX * GRIP_TILT - clamp(dx / 28, 3) * lever;
    target.roll = gripX * 2 + clamp((gripX * dy - gripY * dx) / 28, 4);
    target.lift = .14 + .7 * lever + .16 * clamp(Math.hypot(dx, dy) / 65);
    animate();
  }

  tilt.addEventListener('pointerdown', event => {
    if ((presentation && !presentation.hidden) || drag || !event.isPrimary || event.button !== 0) return;
    const control = event.target.closest('a,button');
    if (control && control !== frontButton) return;
    const bounds = tilt.getBoundingClientRect();
    drag = {
      id: event.pointerId, type: event.pointerType, x: event.clientX, y: event.clientY,
      gripX: clamp(2 * (event.clientX - bounds.left) / bounds.width - 1),
      gripY: clamp(2 * (event.clientY - bounds.top) / bounds.height - 1),
      captured: false
    };
    tilt.classList.add('is-moving');
    hold(0, 0);
  });

  function release() {
    const previous = drag;
    drag = null;
    if (previous?.captured && tilt.hasPointerCapture(previous.id)) tilt.releasePointerCapture(previous.id);
    tilt.classList.remove('is-moving');
    rest();
  }

  // Mouse drags can briefly leave the face before crossing the capture threshold.
  window.addEventListener('pointermove', event => {
    if (!drag || event.pointerId !== drag.id) return;
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    if (drag.type === 'touch' && !drag.captured && Math.abs(dy) > 7 && Math.abs(dy) > Math.abs(dx)) {
      suppressClickUntil = performance.now() + 400;
      release();
      return;
    }
    if (!drag.captured && Math.hypot(dx, dy) > 7) {
      tilt.setPointerCapture(event.pointerId);
      drag.captured = true;
    }
    hold(dx, dy);
  });

  function finish(event) {
    if (!drag || event.pointerId !== drag.id) return;
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    const swiped = drag.type === 'touch' && Math.abs(dx) >= 46 && Math.abs(dx) > Math.abs(dy) * 1.25;
    if (drag.captured || event.type !== 'pointerup') suppressClickUntil = performance.now() + 400;
    release();
    if (event.type === 'pointerup' && swiped) setFace(!showingBack);
  }

  window.addEventListener('pointerup', finish);
  window.addEventListener('pointercancel', finish);
  tilt.addEventListener('lostpointercapture', event => { if (event.target === tilt) finish(event); });
  window.addEventListener('blur', release);
  reducedMotion.addEventListener('change', release);

  document.getElementById('about-slideit')?.addEventListener('click', event => {
    window.openPortfolioProject('SlideIt', event.currentTarget);
  });

  const fields = [
    ['game','게임',50,5], ['service','웹 서비스',84,24], ['app','앱·SW',84,76],
    ['skills','Claude 스킬',50,96], ['automation','자동화',15,76], ['ai','AI 실험',15,24]
  ];
  const radar = document.getElementById('radar');
  const radarButtons = new Map();
  radar.setAttribute('role', 'group');

  function buildRadar() {
    if (radarButtons.size || !window.portfolioAreaCounts) return;
    const counts = window.portfolioAreaCounts();
    const max = Math.max(1, ...fields.map(([key]) => counts[key]));
    function svgElement(tag, attributes) {
      const node = document.createElementNS('http://www.w3.org/2000/svg', tag);
      for (const [key, value] of Object.entries(attributes)) node.setAttribute(key, value);
      return node;
    }
    const svg = svgElement('svg', { viewBox: '0 0 260 200', 'aria-hidden': 'true' });
    function point(i, fraction) {
      const angle = (i - 1.5) * Math.PI / 3;
      return [130 + 71 * fraction * Math.cos(angle), 100 + 71 * fraction * Math.sin(angle)];
    }
    function points(values) { return values.map(pair => pair.join(',')).join(' '); }
    const rings = Math.min(4, max);
    for (let level = 1; level <= rings; level++) {
      svg.append(svgElement('polygon', { points: points(fields.map((_, i) => point(i, level / rings))),
        fill: 'none', stroke: '#ffffff', 'stroke-opacity': '.52', 'stroke-width': '.8' }));
    }
    fields.forEach((_, i) => {
      const [x, y] = point(i, 1);
      svg.append(svgElement('line', { x1: 130, y1: 100, x2: x, y2: y,
        stroke: '#ffffff', 'stroke-opacity': '.4', 'stroke-width': '.8' }));
    });
    const values = fields.map(([key], i) => point(i, counts[key] / max));
    svg.append(svgElement('polygon', { points: points(values), fill: '#35ed7e', 'fill-opacity': '.22',
      stroke: '#35ed7e', 'stroke-width': 2.5 }));
    for (const [x, y] of values) svg.append(svgElement('circle', { cx: x, cy: y, r: 3.2, fill: '#ffffff' }));
    radar.replaceChildren(svg);
    fields.forEach(([key, label, x, y]) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = label + ' ' + counts[key];
      button.dataset.area = key;
      button.setAttribute('aria-label', label + ' 프로젝트 ' + counts[key] + '개 보기');
      button.setAttribute('aria-pressed', 'false');
      button.setAttribute('aria-controls', 'projects-grid');
      button.style.left = x + '%';
      button.style.top = y + '%';
      button.addEventListener('click', () => window.selectProjectArea(key));
      radarButtons.set(key, button);
      radar.append(button);
    });
  }
  document.addEventListener('project-area-change', event => {
    radarButtons.forEach((button, key) => button.setAttribute('aria-pressed', String(key === event.detail)));
  });
  buildRadar();
  document.addEventListener('archive-ready', buildRadar, { once: true });
})();
