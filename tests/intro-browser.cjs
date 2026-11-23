const assert = require('node:assert/strict');
const { after, before, test } = require('node:test');
const { chromium } = require('playwright-core');

const url = process.argv[2];
if (!url) throw new Error('Usage: node tests/intro-browser.cjs <portfolio-url>');
let browser;
before(async () => { browser = await chromium.launch({ channel: 'chrome' }); });
after(async () => { await browser?.close(); });

async function openIntro(t, options) {
  const page = await browser.newPage(options);
  t.after(() => page.close());
  await page.goto(url);
  await page.locator('#intro-card').waitFor();
  await page.locator('#card-arrival').evaluate(el => Promise.all(el.getAnimations().map(a => a.finished)));
  return page;
}

async function cornerPoint(page, corner) {
  // A bounding rectangle includes empty space beyond the rotated paper.
  const session = await page.context().newCDPSession(page);
  let quad;
  try {
    const { root } = await session.send('DOM.getDocument');
    const { nodeId } = await session.send('DOM.querySelector', { nodeId: root.nodeId, selector: '#card-front' });
    const { model } = await session.send('DOM.getBoxModel', { nodeId });
    quad = model.border;
  } finally {
    await session.detach();
  }
  const x = quad[corner * 2], y = quad[corner * 2 + 1];
  const dx = (quad[0] + quad[2] + quad[4] + quad[6]) / 4 - x;
  const dy = (quad[1] + quad[3] + quad[5] + quad[7]) / 4 - y;
  const inset = 4 / Math.hypot(dx, dy);
  return [x + dx * inset, y + dy * inset];
}

async function clickTiltedCorner(page, corner) {
  await page.mouse.move(...await cornerPoint(page, corner));
  // The spring changes the projected corner while the pointer stays still.
  const tilt = await page.locator('#card-tilt').elementHandle();
  await tilt.waitForElementState('stable', { timeout: 4000 });
  await page.mouse.click(...await cornerPoint(page, corner));
}

for (const [corner, name] of ['top left', 'top right', 'bottom right', 'bottom left'].entries()) {
  test('click the tilted paper at ' + name, async t => {
    const page = await openIntro(t, { viewport: { width: 1280, height: 860 } });
    await clickTiltedCorner(page, corner);
    await page.locator('#portfolio-intro').waitFor({ state: 'hidden', timeout: 4000 });
    assert.equal(await page.locator('#card-fold').evaluate(el => el.inert), false);
  });
}

test('after entry the upper left flips the paper and controls on both faces receive clicks', async t => {
  const page = await browser.newPage({ viewport: { width: 1280, height: 860 } });
  t.after(() => page.close());
  await page.goto(new URL('#home', url).href);
  assert.equal(await page.locator('.site-header .brand img, .site-header .brand svg').count(), 0);
  assert.equal(await page.locator('link[rel~="icon"]:not([href="data:,"])').count(), 0);
  const visibleCards = page.locator('#projects-grid .project-card:visible');
  const allProjects = await visibleCards.count();
  assert.ok(allProjects > 0);
  assert.ok(await page.locator('#reset-filter').isHidden());
  await clickTiltedCorner(page, 0);
  await page.locator('#card-back[aria-hidden="false"]').waitFor({ timeout: 4000 });
  await page.locator('#radar button[data-area="game"]').click({ timeout: 4000 });
  assert.ok(await visibleCards.count() < allProjects);
  assert.ok(await page.locator('#projects-grid [data-project="typing-royale"]').isVisible());
  assert.ok(await page.locator('#projects-grid [data-project="SlideIt"]').isHidden());
  await page.locator('#reset-filter').click();
  assert.equal(await visibleCards.count(), allProjects);
  await page.getByRole('button', { name: '앞면', exact: true }).click();
  await page.locator('#card-front .front-mail').click({ trial: true, timeout: 4000 });
});

test('the hand presents the card on the first phone visit, reload, and return visit', async t => {
  const page = await openIntro(t, { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  for (const visit of ['first', 'reload', 'return']) {
    if (visit === 'reload') {
      // Existing visitors may have this value from the earlier site and a saved scroll position.
      await page.evaluate(() => {
        localStorage.setItem('portfolio.intro.seen', '1');
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' });
      });
      await page.reload();
    } else if (visit === 'return') {
      await page.goto('about:blank');
      await page.goto(url);
    }
    const hand = page.locator('.intro-grip img');
    await hand.waitFor({ timeout: 4000 });
    await page.locator('#card-arrival').evaluate(el => Promise.all(el.getAnimations().map(a => a.finished)));
    assert.ok(await hand.evaluate(async img => {
      await img.decode();
      const box = img.getBoundingClientRect();
      return img.naturalWidth > 0 && box.bottom > 0 && box.top < innerHeight && box.right > 0 && box.left < innerWidth;
    }), 'visible hand artwork on ' + visit);
    await page.touchscreen.tap(...await cornerPoint(page, 0));
    await page.locator('#portfolio-intro').waitFor({ state: 'hidden', timeout: 4000 });
  }
});

test('shared project and contact addresses open their destinations directly', async t => {
  const page = await browser.newPage();
  t.after(() => page.close());
  await page.goto(new URL('#project/SlideIt', url).href);
  await page.getByRole('dialog', { name: 'SlideIT', exact: true }).waitFor();
  assert.ok(await page.locator('#intro-card').isHidden());
  await page.goto('about:blank');
  await page.goto(new URL('#contact', url).href);
  await page.waitForFunction(() => {
    const el = document.querySelector('#contact a[href^="mailto:"]');
    const box = el.getBoundingClientRect();
    return !el.closest('[inert]') && box.top >= 0 && box.bottom <= innerHeight;
  }, null, { timeout: 4000 });
  assert.ok(await page.locator('#intro-card').isHidden());
});

test('enter with the keyboard when reduced motion is enabled', async t => {
  const page = await openIntro(t, { reducedMotion: 'reduce' });
  assert.equal(await page.locator(':focus').getAttribute('id'), 'intro-card');
  await page.keyboard.press('Enter');
  await page.locator('#portfolio-intro').waitFor({ state: 'hidden', timeout: 4000 });
  assert.equal(await page.locator(':focus').getAttribute('id'), 'home');
});
