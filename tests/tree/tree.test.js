import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:8080/tests/tree');
});

test('should allow me to mark all items as completed', async ({ page }) => {
    let loc = page.locator('#tree-open-closed');
    await expect(loc.getByText('A11')).toBeVisible();
    await expect(loc.getByText('B11')).toBeVisible({ visible: false });

    await loc.getByText('B1', { exact: true }).click();
    await expect(loc.getByText('B11')).toBeVisible({ visible: true });
    await expect(loc.getByText('B121')).toBeVisible({ visible: false });

    await loc.getByText('B12', { exact: true }).click();
    await expect(loc.getByText('B121')).toBeVisible({ visible: true });

    await loc.getByText('B12', { exact: true }).click();
    await expect(loc.getByText('B121')).toBeVisible({ visible: false });
});
