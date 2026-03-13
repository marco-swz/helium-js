import { test, expect } from '@playwright/test';

const TEST_URL = 'http://localhost:8080/tests/button';
const DUMMY_URL = 'http://localhost:8080/dummy';

test.beforeEach(async ({ page }) => {
    await page.goto(TEST_URL);
});

test('The button gets correctly rendered', async ({ page }) => {
    let loc = page.locator('#test-rendering');
    await expect(loc).toHaveText('Text');
});

test('The text can be changed dynamically', async ({ page }) => {
    let loc = page.locator('#test-rendering');
    await loc.evaluate($btn => $btn.innerHTML = 'New Text');
    await expect(loc).toHaveText('New Text');
});

test('The loading state correctly renders and disables clicks', async ({ page }) => {
    const loc = page.locator('#test-loading');
    await expect(loc).toHaveAttribute('count', '0');
    await loc.click();
    await expect(loc).toHaveAttribute('count', '1');

    await loc.evaluate($btn => {
        $btn.loading = true;
    })

    await loc.click({ force: true });
    await expect(loc).toHaveAttribute('count', '1');

    await loc.evaluate($btn => {
        $btn.loading = false;
    })

    await loc.click();
    await expect(loc).toHaveAttribute('count', '2');

    // The link should not be followed

    await loc.evaluate(($btn) => {
        $btn.href = '/dummy';
        $btn.loading = true;
    });

    await loc.click({ force: true });
    await expect(page).not.toHaveURL(DUMMY_URL);
});

test('The disabled state correctly renders and disables clicks', async ({ page }) => {
    let loc = page.locator('#test-disabled');
    await expect(loc).toHaveAttribute('count', '0');
    await loc.click();
    await expect(loc).toHaveAttribute('count', '1');

    await page.evaluate(() => {
        document.querySelector('#test-disabled').disabled = true;
    })

    await loc.click({ force: true });
    await expect(loc).toHaveAttribute('count', '1');

    await page.evaluate(() => {
        document.querySelector('#test-disabled').disabled = false;
    })

    await loc.click();
    await expect(loc).toHaveAttribute('count', '2');

    // The link should not be followed if `href` is set

    await loc.evaluate(($btn) => {
        $btn.href = '/dummy';
        $btn.disabled = true;
    });

    await loc.click({ force: true });
    await expect(page).not.toHaveURL(DUMMY_URL);
});

test('The href property correctly sets links', async ({ page }) => {
    let loc = page.locator('#test-href');

    // `href` should open the link

    await loc.click();
    await expect(page).toHaveURL(DUMMY_URL);
    await page.goto(TEST_URL);

    // Removing `href` should not open the link

    await loc.evaluate($btn => {
        $btn.href = '';
    })
    await loc.click();
    await expect(page).not.toHaveURL(DUMMY_URL);
});

test('Form elements are submitted', async ({ page }) => {
    let loc = page.locator('#test-submit');

    await loc.click();
});
