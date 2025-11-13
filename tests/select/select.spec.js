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

test('multi-select with option creation', async ({ page }) => {
    await page.evaluate(() => {
        window.createCallback = async function($option, text) {
            if (text === 'D') {
                return null;
            }
            this.setAttribute('option-value', text);
            return $option;
        }

        const $sel = document.createElement('he-select');
        $sel.id = 'test-multiple-create-js'
        $sel.replaceOptions(['a','b'], {a: 'A', b: 'B'});
        $sel.setAttribute('filter', '');
        $sel.setAttribute('multiple', '');
        $sel.setAttribute('create', '');
        $sel.createCallback = window.createCallback;
        document.body.append($sel);
    });

    let locs = [
        page.locator('#test-multiple-create'),
        page.locator('#test-multiple-create-js'),
    ];

    for (const loc of locs) {
        await expect(loc.getByRole('button', { name: 'A' })).toBeVisible();
        await loc.evaluate(($el) => {
            // Making sure, the create event is triggered
            $el.addEventListener('create', (e) => {
                const $sel = e.currentTarget;
                console.log($sel);
                const val = e.detail.text;
                $sel.setAttribute('create-value', val);
            });

            // Making sure, the change change event is triggered after creation
            $el.addEventListener('change', (e) => {
                e.currentTarget.setAttribute('change-value', e.currentTarget.value.join(','))
            });
        });
        await loc.getByRole('button', { name: 'A', exact: true }).click();
        await loc.getByRole('textbox').fill('C');
        await loc.getByRole('textbox').press('Enter');
        // These attributes get set by the event callbacks
        await expect(loc).toHaveAttribute('create-value', 'C');
        await expect(loc).toHaveAttribute('change-value', 'a,C');
        await expect(loc).toHaveAttribute('option-value', 'C');
        // The option should also be created and visible
        await expect(loc.getByRole('option', {name: 'C'})).toBeVisible();

        // Pressing double enter should NOT create another entry
        await loc.getByRole('textbox').press('Enter');
        // The create callback attributes should be unchanged
        await expect(loc).toHaveAttribute('create-value', 'C');
        await expect(loc).toHaveAttribute('option-value', 'C');
        // But the change callback should be triggered, since C was deselected
        await expect(loc).toHaveAttribute('change-value', 'a');
        // This would fail if a second option for `C` was created
        await expect(loc.getByRole('option', {name: 'C'})).toBeVisible();

        // This creation should be stopped by the `createCallback`
        await loc.getByRole('textbox').fill('D');
        await loc.getByRole('textbox').press('Enter');
        // The attributes should be unchanged
        await expect(loc).toHaveAttribute('create-value', 'C');
        await expect(loc).toHaveAttribute('change-value', 'a');
        await expect(loc).toHaveAttribute('option-value', 'C');

        await loc.getByRole('textbox').fill('');
        // The old options should still be there
        await expect(loc.getByRole('option', {name: 'A'})).toBeVisible();
        await expect(loc.getByRole('option', {name: 'B'})).toBeVisible();
        await expect(loc.getByRole('option', {name: 'C'})).toBeVisible();
        // The new option should NOT be added
        await expect(loc.getByRole('option', {name: 'D'})).toBeHidden();
    }
});

test('readonly attribute is set', async ({ page }) => {
    await page.evaluate(() => {
        const $sel = document.createElement('he-select');
        $sel.id = 'test-readonly-js';
        $sel.readonly = true;

        $sel.innerHTML = `
            <option value="a">A</option>
            <option value="b">B</option>
        `;

        document.body.append($sel);
    })

    let locs = [
        page.locator('#test-readonly'),
        page.locator('#test-readonly-js'),
    ];

    for (const loc of locs) {
        await loc.getByRole('button', { name: 'A' }).click({force: true});
        await expect(loc.getByRole('option', {name: 'B'})).toBeHidden();
    }
});

