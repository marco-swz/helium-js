import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:8080/tests/tabs');
});

test('rendering the tabs correctly and responds to clicks', async ({ page }) => {
    let loc = page.locator('#test-render');

    await expect(loc.getByText('Tab 0', { exact: true })).toBeVisible();
    await expect(loc.getByText('Title B', { exact: true })).toBeVisible();
    await expect(loc.getByText('Tab 2', { exact: true })).toBeHidden();
    await expect(loc.getByText('Title D', { exact: true })).toBeVisible();
    await expect(loc.getByText('A', { exact: true })).toBeHidden();
    await expect(loc.getByText('B', { exact: true })).toBeVisible();
    await expect(loc.getByText('C', { exact: true })).toBeHidden();
    await expect(loc.getByText('D', { exact: true })).toBeHidden();

    await loc.getByText('Title D', { exact: true }).click();

    await expect(loc.getByText('A', { exact: true })).toBeHidden();
    await expect(loc.getByText('B', { exact: true })).toBeHidden();
    await expect(loc.getByText('C', { exact: true })).toBeHidden();
    await expect(loc.getByText('D', { exact: true })).toBeVisible();

    await loc.evaluate($tabs => {
        $tabs.unhideTab(2);
    });

    await expect(loc.getByText('Tab 2', { exact: true })).toBeVisible();

    await loc.evaluate($tabs => {
        $tabs.hideTab(1);
    });

    await expect(loc.getByText('Title B', { exact: true })).toBeHidden();
});
