import { test, expect } from '@playwright/test';

test.beforeEach(async({ page }) => {
    await page.goto('http://localhost:8080/tests/radio');
});

test("The element should exist in the DOM", async({ page }) => {
    const element = page.locator("#switch-test-click");
    await expect(element).toHaveCount(1);
});

