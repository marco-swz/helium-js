import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:8080/tests/button');
});

test('test loading state', async ({ page }) => {
    let loc = page.locator('#btn-test');
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
