import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:8080/tests/select');
});

test('having multi-select enabled', async ({ page }) => {
    let locs = [
        page.locator('#test-multiple'),
    ];

    for (const loc of locs) {
        await expect(loc.getByRole('button', { name: 'A B' })).toBeVisible();
        let value = await loc.evaluate(($el) => $el.value);
        expect(value).toEqual(['a', 'b']);

        value = await loc.evaluate(($el) => {
            $el.value = ['a'];
            return $el.value;
        });

        expect(value).toEqual(['a']);

        value = await loc.evaluate(($el) => {
            $el.value = 'b';
            return $el.value;
        });

        expect(value).toEqual(['b']);
    }
});

