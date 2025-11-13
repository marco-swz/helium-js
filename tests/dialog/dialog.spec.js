import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:8080/tests/dialog');
});

test('event triggering when opening and closing', async ({ page }) => {
    let loc = page.locator('#test-open-close-events');
    await loc.evaluate($diag => {
        $diag.addEventListener('open', (e) => {
            e.currentTarget.setAttribute(
                'open-triggered', 
                Number(e.currentTarget.getAttribute('open-triggered')) + 1
            );
        });
        $diag.addEventListener('close', (e) => {
            e.currentTarget.setAttribute(
                'close-triggered', 
                Number(e.currentTarget.getAttribute('close-triggered')) + 1
            );
        });
        $diag.show();
    });

    await expect(loc).not.toHaveAttribute('close-triggered', '1');
    await expect(loc).toHaveAttribute('open-triggered', '1');

    await loc.evaluate($diag => $diag.close());

    await expect(loc).toHaveAttribute('close-triggered', '1');
    await expect(loc).toHaveAttribute('open-triggered', '1');

    await loc.evaluate($diag => {
        $diag.show()
    });
    
    await loc.locator('#he-icon-close').click();

    await expect(loc).toHaveAttribute('close-triggered', '2');
    await expect(loc).toHaveAttribute('open-triggered', '2');
});
