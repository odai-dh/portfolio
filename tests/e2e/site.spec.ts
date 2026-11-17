import { AxeBuilder } from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

// The tests are about this site only. Embedded previews of other people's sites are blocked, so
// a slow or broken third party can't fail (or hang) a test.
test.beforeEach(async ({ page, baseURL }) => {
  const origin = new URL(baseURL!).origin;
  await page.route(
    (url) => url.origin !== origin && url.protocol.startsWith('http'),
    (route) => route.abort()
  );
});

// One page of every kind the site has. The note and cooking addresses are read from the site
// itself, so the list never goes stale.
async function onePageOfEachKind(page: Page): Promise<string[]> {
  const sitemap = await (await page.request.get('/sitemap.xml')).text();
  const paths = [...sitemap.matchAll(/<loc>https?:\/\/[^/]+([^<]*)<\/loc>/g)].map((match) => match[1] || '/');
  const project = paths.find((path) => path.startsWith('/projects/'));
  const note = paths.find((path) => path.startsWith('/notes/'));

  await page.goto('/cooking/archive');
  const dish = await page.locator('a[href^="/cooking/"]:not([href="/cooking/archive"])').first().getAttribute('href');

  expect(project, 'a project in the sitemap').toBeTruthy();
  expect(note, 'a note in the sitemap').toBeTruthy();
  expect(dish, 'a dish on the cooking archive').toBeTruthy();
  return ['/', project!, '/notes', note!, '/cooking', '/cooking/archive', dish!];
}

// Sections below the screen fade in when scrolled to; walk the page so everything is visible
async function scrollThrough(page: Page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += 400) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(700);
}

test('every kind of page loads', async ({ page }) => {
  for (const path of await onePageOfEachKind(page)) {
    const response = await page.request.get(path);
    expect(response.status(), path).toBe(200);
    expect(response.headers()['content-type'], path).toContain('text/html');
  }
  for (const path of ['/llms.txt', '/sitemap.xml', '/robots.txt', '/OdaiDahi-CV-En.pdf', '/OdaiDahi-CV-Sv.pdf', '/og-image.png']) {
    expect((await page.request.get(path)).status(), path).toBe(200);
  }
  expect((await page.request.get('/this-page-does-not-exist')).status()).toBe(404);
  expect((await page.request.get('/projects/this-project-does-not-exist')).status()).toBe(404);
});

test('cooking links preview as the dish, not as the developer profile', async ({ page }) => {
  await page.goto('/cooking/archive');
  const dish = await page.locator('a[href^="/cooking/"]:not([href="/cooking/archive"])').first().getAttribute('href');
  for (const path of ['/cooking', dish!]) {
    await page.goto(path);
    const title = await page.locator('meta[property="og:title"]').getAttribute('content');
    expect(title, path).toContain('Odai cooks');
    const image = await page.locator('meta[property="og:image"]').getAttribute('content');
    const response = await page.request.get(new URL(image!).pathname);
    expect(response.status(), image!).toBe(200);
    expect(response.headers()['content-type']).toBe('image/jpeg');
    expect((await response.body()).length, 'small enough for every app to show').toBeLessThan(300_000);
  }
});

// Only against the deployed site: locally there are no API keys, so the check would always fail
test('the chat\'s outside services work (Groq model, rate limiter)', async ({ page }) => {
  test.skip(!process.env.E2E_BASE_URL, 'needs the deployed site and its keys');
  const response = await page.request.get('/api/health');
  const body = await response.json();
  expect(body, 'a false check names the broken service').toMatchObject({ ok: true, checks: { chatModel: true, rateLimit: true } });
});

test('llms.txt is generated from the content', async ({ page }) => {
  const body = await (await page.request.get('/llms.txt')).text();
  expect(body).toContain('## Experience');
  expect(body).toContain('## Selected Projects');
  expect(body).toContain('mailto:');
});

test('pages have no errors and never scroll sideways', async ({ page, baseURL }) => {
  const origin = new URL(baseURL!).origin;
  const problems: string[] = [];
  page.on('pageerror', (error) => problems.push(`${page.url()}: ${error.message}`));
  page.on('console', (message) => {
    // only errors from this site's own files count (blocked third-party requests log errors too)
    const source = message.location().url;
    if (message.type() === 'error' && (!source || source.startsWith(origin)) && !/ERR_FAILED/.test(message.text())) {
      problems.push(`${page.url()}: ${message.text()}`);
    }
  });

  for (const path of await onePageOfEachKind(page)) {
    await page.goto(path, { waitUntil: 'load' });
    await page.waitForTimeout(400);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, `${path} is wider than the screen`).toBeLessThanOrEqual(0);
    expect(await page.locator('h1').count(), `${path} should have exactly one h1`).toBe(1);
  }
  expect(problems).toEqual([]);
});

test('on tablets and laptops the content uses the space next to the sidebar', async ({ page, isMobile }) => {
  test.skip(isMobile, 'phones have no fixed sidebar');
  // A second, hidden sidebar once reserved an empty 256 px column on the right at every width,
  // squeezing tablets to a 256 px column
  for (const width of [768, 1024]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const main = await page.locator('main.container').boundingBox();
    expect(main!.width, `content width at ${width} px`).toBeGreaterThanOrEqual(width - 256 - 1);
  }
  // On wide screens the content stays close to the sidebar instead of drifting to the middle
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const main = await page.locator('main.container').boundingBox();
  expect(main!.x, 'gap between the sidebar and the content at 1440 px').toBeLessThanOrEqual(256 + 32);
});

test('the server HTML is kept, not rebuilt, when the page loads', async ({ page }) => {
  await page.addInitScript(() => {
    document.addEventListener('DOMContentLoaded', () => {
      (window as unknown as { __nodes: (Element | null)[] }).__nodes = [document.querySelector('h1'), document.querySelector('#about'), document.querySelector('footer')];
    });
  });
  await page.goto('/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  const kept = await page.evaluate(() => (window as unknown as { __nodes: (Element | null)[] }).__nodes.map((node) => !!node?.isConnected));
  expect(kept).toEqual([true, true, true]);
  // nothing on screen may be hidden waiting to fade in
  const hiddenOnScreen = await page.evaluate(
    () => [...document.querySelectorAll('[data-reveal="armed"]')].filter((el) => el.getBoundingClientRect().top < window.innerHeight).length
  );
  expect(hiddenOnScreen).toBe(0);
});

test('a saved light theme applies before the first paint and survives a reload', async ({ page }) => {
  await page.addInitScript(() => {
    try {
      localStorage.setItem('theme', 'light');
    } catch {}
    document.addEventListener('DOMContentLoaded', () => {
      (window as unknown as { __early: boolean }).__early = document.documentElement.classList.contains('light');
    });
  });
  await page.goto('/');
  expect(await page.evaluate(() => (window as unknown as { __early: boolean }).__early)).toBe(true);
  await expect(page.locator('html')).toHaveClass(/light/);
});

test('the experience tabs work with the keyboard', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });
  const tabs = page.getByRole('tab');
  await tabs.first().focus();
  // the tab list runs across on phones and down on wider screens
  const vertical = (await tabs.first().getAttribute('data-orientation')) === 'vertical';
  await page.keyboard.press(vertical ? 'ArrowDown' : 'ArrowRight');
  await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('[role=tabpanel]:not([inert])')).toHaveCount(1);
  const controls = await tabs.nth(1).getAttribute('aria-controls');
  expect(controls).toMatch(/^[\w-]+$/); // a valid id: no spaces
});

test('project clips wait until they are near the screen, play, and can be paused', async ({ page }) => {
  const requested: string[] = [];
  page.on('request', (request) => request.url().includes('/videos/') && requested.push(request.url()));
  await page.goto('/', { waitUntil: 'networkidle' });
  expect(requested, 'no clip downloads before the projects are near the screen').toEqual([]);

  const video = page.locator('#projects video').first();
  await video.scrollIntoViewIfNeeded();
  await expect.poll(() => video.evaluate((el: HTMLVideoElement) => !el.paused && el.currentTime > 0), { timeout: 10_000 }).toBe(true);

  await page.getByRole('button', { name: /^Pause the .* preview$/ }).first().click();
  await expect.poll(() => video.evaluate((el: HTMLVideoElement) => el.paused)).toBe(true);
  await expect(page.getByRole('button', { name: /^Play the .* preview$/ }).first()).toBeVisible();
});

test.describe('with reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('project clips do not start by themselves', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    const video = page.locator('#projects video').first();
    await video.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500);
    expect(await video.evaluate((el: HTMLVideoElement) => el.paused)).toBe(true);
  });
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('the page is still readable', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('#about')).toBeVisible();
    await expect(page.locator('#contact h2')).toBeVisible();
    const opacity = await page.locator('#projects > div').first().evaluate((el) => getComputedStyle(el).opacity);
    expect(opacity).toBe('1');
  });
});

for (const theme of ['dark', 'light'] as const) {
  test(`accessibility: no WCAG 2.1 AA failures in ${theme} mode`, async ({ page }) => {
    test.slow();
    // Contrast is checked at rest: pulsing or fading text would otherwise be measured mid-animation
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.addInitScript((value) => {
      try {
        localStorage.setItem('theme', value);
      } catch {}
    }, theme);

    for (const path of [...(await onePageOfEachKind(page)), '/this-page-does-not-exist']) {
      await page.goto(path, { waitUntil: 'load' });
      await scrollThrough(page);
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).exclude('iframe').analyze();
      // Deliberate exception (Odai, 2026-11-17): white text on the bright blue fill
      // (bg-primary-strong: buttons, the chat bubble, the dropdown highlight) is his chosen look,
      // although it is 2.9:1. Every other contrast failure still fails the test.
      // axe shortens the class attribute, so the exception is matched on the measured colours.
      const isBrandFill = (node: (typeof results.violations)[number]['nodes'][number]) => {
        const data = node.any[0]?.data as { bgColor?: string; fgColor?: string } | undefined;
        return data?.bgColor === '#0099ff' && /^#f[0-9a-f]{5}$/i.test(data?.fgColor ?? '');
      };
      results.violations = results.violations
        .map((violation) =>
          violation.id === 'color-contrast'
            ? { ...violation, nodes: violation.nodes.filter((node) => !isBrandFill(node)) }
            : violation
        )
        .filter((violation) => violation.nodes.length > 0);
      const failures = results.violations.map((violation) => `${violation.id} ×${violation.nodes.length}: ${violation.nodes[0].html.slice(0, 100)}`);
      expect(failures, `${path} (${theme})`).toEqual([]);
    }
  });
}
