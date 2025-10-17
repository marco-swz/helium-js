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

test('multi-select with creation', async ({ page }) => {
    let locs = [
        page.locator('#test-multiple-create'),
    ];

    for (const loc of locs) {
        await expect(loc.getByRole('button', { name: 'A' })).toBeVisible();
        await loc.evaluate(($el) => {
            // Making sure, the create event is triggered
            $el.addEventListener('create', (e) => {
                const $sel = e.currentTarget;
                const val = e.detail.text;
                $sel.setAttribute('create-value', val);
            });

            // Making sure, the change change event is triggered after creation
            $el.addEventListener('change', (e) => {
                e.currentTarget.setAttribute('change-value', e.currentTarget.value.join(','))
            });

            window.createCallback = async function($option, text) {
                this.setAttribute('option-value', 'C');
                $option.setAttribute('value', text.toLowerCase());
                return $option;
            }
        });
        await loc.getByRole('button', { name: 'A', exact: true }).click();
        // await page.waitForTimeout(500);
        await loc.getByRole('textbox').fill('C');
        await loc.getByRole('textbox').press('Enter');
        await expect(loc).toHaveAttribute('create-value', 'C');
        await expect(loc).toHaveAttribute('change-value', 'a,c');
    }
});
