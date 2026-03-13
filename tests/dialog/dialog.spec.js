import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:8080/tests/dialog');
});

test('Slots are correctly filled', async ({ page }) => {
    const loc = page.locator('#test-slots-default');

    await loc.evaluate($diag => $diag.showModal());

    await expect(loc.getByText('Default')).toBeVisible();
    await expect(loc.getByText('Title')).toBeVisible();
    await expect(loc.getByText('Footer')).toBeVisible();

    await loc.evaluate($diag => $diag.close());

    const loc2 = page.locator('#test-slots-body');
    await loc2.evaluate($diag => $diag.showModal());

    await expect(loc2.getByText('Body')).toBeVisible();

    await loc2.evaluate($diag => $diag.close());
});

test('Opening and closing through various ways', async ({ page }) => {
    const loc = page.locator('#test-open-close');

    await expect(loc.getByText('Open')).toBeHidden();

    // We also want to check, if the events are triggered correctly

    await loc.evaluate($diag => {
        $diag.addEventListener('show', (e) => {
            e.currentTarget.setAttribute(
                'show-triggered', 
                Number(e.currentTarget.getAttribute('show-triggered')) + 1
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

    await expect(loc).toHaveAttribute('show-triggered', '1');
    await expect(loc).not.toHaveAttribute('close-triggered', '1');
    await expect(loc.getByText('Open')).toBeVisible();

    await loc.evaluate($diag => $diag.close());

    await expect(loc).toHaveAttribute('show-triggered', '1');
    await expect(loc).toHaveAttribute('close-triggered', '1');
    await expect(loc.getByText('Open')).toBeHidden();

    // Open and close with `showModal`
    
    await loc.evaluate($diag => {
        $diag.showModal();
    });

    await expect(loc).toHaveAttribute('show-triggered', '2');
    await expect(loc).toHaveAttribute('close-triggered', '1');
    await expect(loc.getByText('Open')).toBeVisible();

    await loc.evaluate($diag => $diag.close());

    await expect(loc).toHaveAttribute('show-triggered', '2');
    await expect(loc).toHaveAttribute('close-triggered', '2');
    await expect(loc.getByText('Open')).toBeHidden();

    // Open and close with `.open = true/false`
    
    await loc.evaluate($diag => {
        $diag.open = true;
    });

    await expect(loc).toHaveAttribute('show-triggered', '3');
    await expect(loc).toHaveAttribute('close-triggered', '2');
    await expect(loc.getByText('Open')).toBeVisible();

    await loc.evaluate($diag => $diag.open = false);

    await expect(loc).toHaveAttribute('show-triggered', '3');
    await expect(loc).toHaveAttribute('close-triggered', '3');
    await expect(loc.getByText('Open')).toBeHidden();

    // Open and close with attribute
    
    await loc.evaluate($diag => {
        $diag.setAttribute('open', '');
    });

    await expect(loc).toHaveAttribute('show-triggered', '4');
    await expect(loc).toHaveAttribute('close-triggered', '3');
    await expect(loc.getByText('Open')).toBeVisible();

    await loc.evaluate($diag => {
        $diag.removeAttribute('open');
    });

    await expect(loc).toHaveAttribute('show-triggered', '4');
    await expect(loc).toHaveAttribute('close-triggered', '4');
    await expect(loc.getByText('Open')).toBeHidden();
});

test('Clicking outside closes the dialog', async ({ page }) => {
    const loc = page.locator('#test-outside-close');

    await loc.evaluate($diag => {
        $diag.showModal();
    });
    await expect(loc.getByText('OutsideClose')).toBeVisible();

    await page.locator('#test-open-close').click();

    await expect(loc.getByText('OutsideClose')).toBeHidden();
});

test('Opening error dialog', async ({ page }) => {

    // The default error dialog

    await page.evaluate(() => {
        HeliumDialog.showDialog('showDialogError', 'error');
    });

    await expect(page.getByText('Fehler')).toBeVisible();
    await expect(page.getByText('showDialogError')).toBeVisible();
    await expect(page.getByText('Schließen')).toBeVisible();

    await page.getByText('Schließen').click();

    // The default warning dialog

    await page.evaluate(() => {
        HeliumDialog.showDialog('showDialogWarn', 'warn');
    });

    await expect(page.getByText('Warnung')).toBeVisible();
    await expect(page.getByText('showDialogWarn')).toBeVisible();
    await expect(page.getByText('Schließen')).toBeVisible();

    await page.getByText('Schließen').click();

    // The default info dialog

    await page.evaluate(() => {
        HeliumDialog.showDialog('showDialogInfo', 'info');
    });

    await expect(page.getByText('Info', { exact: true })).toBeVisible();
    await expect(page.getByText('showDialogInfo')).toBeVisible();
    await expect(page.getByText('Schließen')).toBeVisible();

    await page.getByText('Schließen').click();

    // The default success dialog

    await page.evaluate(() => {
        HeliumDialog.showDialog('showDialogSuccess', 'success');
    });

    await expect(page.getByText('Erfolg')).toBeVisible();
    await expect(page.getByText('showDialogSuccess')).toBeVisible();
    await expect(page.getByText('Schließen')).toBeVisible();

    await page.getByText('Schließen').click();

    // Dialog with custom title

    await page.evaluate(() => {
        HeliumDialog.showDialog('showDialogCustom', 'success', 'CustomTitle');
    });

    await expect(page.getByText('CustomTitle')).toBeVisible();
    await expect(page.getByText('showDialogCustom')).toBeVisible();
    await expect(page.getByText('Schließen')).toBeVisible();

    await page.getByText('Schließen').click();
});
