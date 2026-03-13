import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:8080/tests/popover');
});

test('rendering the tabs correctly and responds to clicks', async ({ page }) => {
    let loc = page.locator('#test-default');

    await expect(page.getByText('Test', { exact: true })).toBeHidden();

    await loc.evaluate($popover => {
        $popover.show();
    });

    await expect(page.getByText('Test', { exact: true })).toBeVisible();

    await loc.evaluate($popover => {
        $popover.hidePopover();
    });
    await expect(page.getByText('Test', { exact: true })).toBeHidden();

    await loc.evaluate($popover => {
        $popover.show();
    });

    await expect(page.getByText('Test', { exact: true })).toBeVisible();

    await page.getByText('Default', { exact: true }).click();

    await expect(page.getByText('Test', { exact: true })).toBeHidden();
});
