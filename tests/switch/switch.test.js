import { test, expect } from '@playwright/test';
import { TIMEOUT } from 'dns';

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

test("The internals should have checked when the switch is activated", async({ page }) => {
    const element = page.locator("#switch-test-click");
    await element.click();
    await expect(element).toHaveAttribute("checked");
    const hasChecked = await page.$eval("#switch-test-click", (el) => {
        return el.$internals.states.has("checked");
    });
    expect(hasChecked).toBe(true);
});


test("The switch should have the right color when it's on", async({ page }) => {
    const component = await page.locator("#switch-test-click");
    await component.click();
    await expect(component).toHaveAttribute("checked");
    await page.waitForTimeout(1000);
    const color = await component.evaluate((el) => {
        const innerElement = el.shadowRoot.querySelector(".slider");
        return window.getComputedStyle(innerElement).backgroundColor;
    });
    expect(color).toBe("rgb(243, 131, 33)");
});

test("The switch should have the right color when it's off", async({ page }) => {
    const component = await page.locator("#switch-test-click");
    const color = await component.evaluate((el) => {
        const innerElement = el.shadowRoot.querySelector(".slider");
        return window.getComputedStyle(innerElement).backgroundColor;
    });
    expect(color).toBe("rgb(204, 204, 204)");
});

test("The switch should have the right width", async({ page }) => {
    const component = await page.locator("#switch-test-click");
    const width = await component.evaluate((el) => {
        const innerElement = el.shadowRoot.querySelector(".switch");
        return window.getComputedStyle(innerElement).width;
    });
    expect(width).toBe("60px");
});

test("The switch should the right height", async({ page }) => {
    const component = await page.locator("#switch-test-click");
    const height = await component.evaluate((el) => {
        const innerElement = el.shadowRoot.querySelector(".switch");
        return window.getComputedStyle(innerElement).height;
    });
    expect(height).toBe("34px");
});