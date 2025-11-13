import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:8080/tests/button');
});

test('The button gets correctly rendered', async ({ page }) => {
    let loc = page.locator('#test-rendering');
    await expect(loc).toHaveText('Text');
});

test('The text can be changed by method', async ({ page }) => {
    let loc = page.locator('#test-rendering');
    await loc.evaluate($btn => $btn.setText('New Text'));
    await expect(loc).toHaveText('New Text');
});

test('The loading state correctly renders and disables clicks', async ({ page }) => {
    let loc = page.locator('#test-loading');
    await expect(loc).toHaveAttribute('count', '0');
    await loc.click();
    await expect(loc).toHaveAttribute('count', '1');

    await page.evaluate(() => {
        document.querySelector('#btn-test').loading = true;
    })

    await loc.click({force: true});
    await expect(loc).toHaveAttribute('count', '1');

    await page.evaluate(() => {
        document.querySelector('#btn-test').loading = false;
    })

    await loc.click();
    await expect(loc).toHaveAttribute('count', '2');
});
