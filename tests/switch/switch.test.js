import { test, expect } from '@playwright/test';

test.beforeEach(async({ page }) => {
    await page.goto('http://localhost:8080/tests/switch');
});

test("The element should exist in the DOM", async({ page }) => {
    const element = page.locator("#switch-test-click");
    await expect(element).toHaveCount(1);
});

test("The element should be visible", async({ page }) => {
    const element = page.locator("#switch-test-click");
    await expect(element).toBeVisible();
});

test("The initial state of the element should be off", async({ page }) => {
    const switchElement = page.locator("#switch-test-click");
    await expect(switchElement).not.toHaveClass("checked");
});

test("Should toggle the switch on click", async({ page }) => {
    const element = page.locator("#switch-test-click");
    await expect(element).not.toHaveAttribute("checked");
    await element.click();
    await expect(element).toHaveAttribute("checked");
});