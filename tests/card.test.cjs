const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { runInNewContext } = require('node:vm');
const { test } = require('node:test');

function setup() {
  const frames = new Map();
  let time = 0;
  let frameId = 0;
  const elements = new Map();
  function element() {
    const events = new Map();
    const classes = new Set();
    return {
      hidden: true, inert: false, dataset: {}, style: new Map(), attributes: new Map(),
      addEventListener(name, fn) { events.set(name, [...(events.get(name) || []), fn]); },
      emit(name, event = {}) {
        for (const fn of events.get(name) || []) fn({ type: name, target: this, ...event });
      },
      setAttribute(name, value) { this.attributes.set(name, value); },
      contains() { return false; }, closest() { return null; },
      getBoundingClientRect() { return { left: 0, top: 0, width: 600, height: 330 }; },
      setPointerCapture(id) { this.capture = id; },
      hasPointerCapture(id) { return this.capture === id; },
      releasePointerCapture() { this.capture = null; },
      classList: {
        add(name) { classes.add(name); }, remove(name) { classes.delete(name); },
        toggle(name, active) { active ? classes.add(name) : classes.delete(name); }
      }
    };
  }
  const document = element();
  document.getElementById = id => {
    if (!elements.has(id)) {
      const node = element();
      node.style.setProperty = node.style.set.bind(node.style);
      elements.set(id, node);
    }
    return elements.get(id);
  };
  document.querySelectorAll = () => [];
  const motion = Object.assign(element(), { matches: false });
  const window = Object.assign(element(), { matchMedia: () => motion });
  runInNewContext(readFileSync(require.resolve('../card.js'), 'utf8'), {
    document, window, performance: { now: () => time },
    requestAnimationFrame(fn) { frames.set(++frameId, fn); return frameId; },
    cancelAnimationFrame(id) { frames.delete(id); }
  });
  function settle() {
    for (let step = 0; frames.size && step < 600; step++) {
      time += 16;
      const pending = [...frames.values()];
      frames.clear();
      pending.forEach(fn => fn(time));
    }
    assert.equal(frames.size, 0, 'animation must stop when settled');
  }
  const pointer = { isPrimary: true, pointerType: 'mouse', pointerId: 1, button: 0, clientX: 540, clientY: 33 };
  return { elements, window, motion, settle, pointer, tilt: elements.get('card-tilt'), arrival: document.getElementById('card-arrival') };
}

test('hover reaches all four corners of the stationary card area', () => {
  const { tilt, arrival, pointer, settle } = setup();
  const bounds = { left: 750, top: 400, width: 600, height: 330 };
  arrival.getBoundingClientRect = () => bounds;
  const corners = [
    [751, 401, 1, -1], [1349, 401, 1, 1],
    [751, 729, -1, -1], [1349, 729, -1, 1]
  ];
  for (const [clientX, clientY, pitchSign, yawSign] of corners) {
    arrival.emit('pointermove', { ...pointer, clientX, clientY });
    tilt.emit('pointerleave'); // A tilted edge can move away while the pointer stays inside the wrapper.
    settle();
    assert.equal(Math.sign(parseFloat(tilt.style.get('--rx')) - 3), pitchSign);
    assert.equal(Math.sign(parseFloat(tilt.style.get('--ry')) + 5), yawSign);
  }
});

test('hover settles back to rest after leaving the wrapper or blurring the window', () => {
  const { tilt, arrival, pointer, settle, window } = setup();
  for (const [target, event] of [[arrival, 'pointerleave'], [window, 'blur']]) {
    arrival.emit('pointerenter', pointer);
    settle();
    assert.ok(parseFloat(tilt.style.get('--rx')) > 3);
    target.emit(event);
    settle();
    assert.equal(tilt.style.get('--rx'), '3.00deg');
    assert.equal(tilt.style.get('--ry'), '-5.00deg');
  }
});

test('drag moves the card and cancellation releases it back to rest', () => {
  const { tilt, pointer, settle, window } = setup();
  tilt.emit('pointerdown', pointer);
  window.emit('pointermove', { ...pointer, clientX: 1200, clientY: -100 });
  settle();
  assert.equal(tilt.capture, pointer.pointerId);
  assert.ok(parseFloat(tilt.style.get('--card-x')) > 0);
  window.emit('pointercancel', pointer);
  settle();
  assert.equal(tilt.capture, null);
  assert.equal(tilt.style.get('--card-x'), '0.00px');
  assert.equal(tilt.style.get('--card-y'), '0.00px');
});

test('touch scroll yields; horizontal swipe still flips the card', () => {
  const { tilt, pointer, settle, window, elements } = setup();
  const touch = { ...pointer, pointerType: 'touch', clientX: 300, clientY: 165 };
  tilt.emit('pointerdown', touch);
  window.emit('pointermove', { ...touch, clientY: 220 });
  settle();
  assert.equal(tilt.hasPointerCapture(touch.pointerId), false);
  assert.equal(elements.get('card-front').inert, false);
  tilt.emit('pointerdown', touch);
  window.emit('pointermove', { ...touch, clientX: 400 });
  window.emit('pointerup', { ...touch, clientX: 400 });
  settle();
  assert.equal(elements.get('card-front').inert, true);
  assert.equal(elements.get('card-back').attributes.get('aria-hidden'), 'false');
});

test('entering the intro card tilts its upper-left corner before any pointermove', () => {
  const { tilt, arrival, pointer, settle, elements } = setup();
  elements.get('intro-presentation').hidden = false;
  arrival.emit('pointerenter', { ...pointer, clientX: 1, clientY: 1 });
  settle();
  assert.ok(parseFloat(tilt.style.get('--rx')) > 3);
  assert.ok(parseFloat(tilt.style.get('--ry')) < -5);
});

test('enabling reduced motion resets hover and preserves keyboard flipping', () => {
  const { tilt, arrival, pointer, settle, motion, elements } = setup();
  arrival.emit('pointerenter', pointer);
  motion.matches = true;
  motion.emit('change');
  settle();
  arrival.emit('pointermove', pointer);
  settle();
  assert.equal(tilt.style.get('--rx'), '3.00deg');
  assert.equal(tilt.style.get('--ry'), '-5.00deg');
  elements.get('flip-front').emit('click', { detail: 0 });
  assert.equal(elements.get('card-front').inert, true);
});
