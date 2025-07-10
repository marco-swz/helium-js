import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:8080/tests/tree');
});

test('rendering the tree correctly and respond to clicks', async ({ page }) => {
    let locs = [
        page.locator('#tree-open-closed'),
        page.locator('#tree-open-closed-node-id'),
    ];

    for (const loc of locs) {
        await expect(loc.getByText('A11')).toBeVisible();
        await expect(loc.getByText('B11')).toBeVisible({ visible: false });

        await loc.getByText('B1', { exact: true }).click();
        await expect(loc.getByText('B11')).toBeVisible({ visible: true });
        await expect(loc.getByText('B121')).toBeVisible({ visible: false });

        await loc.getByText('B12', { exact: true }).click();
        await expect(loc.getByText('B121')).toBeVisible({ visible: true });

        await loc.getByText('B12', { exact: true }).click();
        await expect(loc.getByText('B121')).toBeVisible({ visible: false });
    }
});

test('filtering the tree', async ({ page }) => {
    let locs = [
        page.locator('#tree-filter'),
        page.locator('#tree-filter-slotted'),
    ];
    
    for (const loc of locs) {
        await loc.evaluate($tree => $tree.filter('B11'));
        await expect(loc.getByText('A11')).toBeHidden();
        await expect(loc.getByText('A1', {exact: true})).toBeHidden();
        await expect(loc.getByText('B1', {exact: true})).toBeVisible();
        await expect(loc.getByText('B11', {exact: true})).toBeVisible();
        await expect(loc.getByText('B12', {exact: true})).toBeHidden();
        await expect(loc.getByText('Bx121', {exact: true})).toBeHidden();

        await loc.evaluate($tree => $tree.filter(null));
        await expect(loc.getByText('A11')).toBeVisible();
        await expect(loc.getByText('A1', {exact: true})).toBeVisible();
        await expect(loc.getByText('B1', {exact: true})).toBeVisible();
        await expect(loc.getByText('B11', {exact: true})).toBeVisible();
        await expect(loc.getByText('B12', {exact: true})).toBeVisible();
        await expect(loc.getByText('Bx121', {exact: true})).toBeVisible();

        await loc.evaluate($tree => $tree.filter('B12', true));
        await expect(loc.getByText('A11')).toBeHidden();
        await expect(loc.getByText('A1', {exact: true})).toBeHidden();
        await expect(loc.getByText('B1', {exact: true})).toBeVisible();
        await expect(loc.getByText('B11', {exact: true})).toBeHidden();
        await expect(loc.getByText('B12', {exact: true})).toBeVisible();
        await expect(loc.getByText('Bx121', {exact: true})).toBeHidden();
    }
});

test('manipulating tree items', async ({ page }) => {
    let locs = [
        page.locator('#tree-manipulate'),
        // page.locator('#tree-manipulate-slotted'),
    ];
    
    for (const loc of locs) {
        await loc.evaluate($tree => $tree.toRootNode(['b11', 'b12']));
        await expect(loc.locator('.cont-elem[node-id="b11"]')).toHaveAttribute('type', 'root');
        await expect(loc.locator('.cont-elem[node-id="b12"]')).toHaveAttribute('type', 'root');

        await loc.evaluate($tree => {
            let $el = document.createElement('div');
            $el.setAttribute('node-id', 'b111');
            $el.innerHTML = 'B111';
            $tree.addNode($el, 'b11');

            $el = document.createElement('div');
            $el.setAttribute('node-id', 'x1');
            $el.innerHTML = 'X1';
            $tree.addNode($el, ['a11', 'b12']);

            $el = document.createElement('div');
            $el.id = 'x11';
            $el.innerHTML = 'X11';
            $tree.addNode($el, ['x1'], true);

            $el = document.createElement('div');
            $el.id = 'c1';
            $el.innerHTML = 'C1';
            $tree.addNode($el, null);
        });

        await expect(loc.locator('.cont-elem[node-id="b11"]').getByText('B111', {exact: true})).toBeVisible();
        await expect(loc.locator('.cont-elem[node-id="a11"]').getByText('X1', {exact: true})).toBeVisible();
        await expect(loc.locator('.cont-elem[node-id="b12"]').getByText('X1', {exact: true})).toBeVisible();
        await expect(loc.locator('.cont-elem[node-id="b12"]').locator('.cont-elem[node-id="x1"]').getByText('X11', {exact: true})).toBeVisible();
        await expect(loc.locator('.cont-elem[node-id="a11"]').locator('.cont-elem[node-id="x1"]').getByText('X11', {exact: true})).toBeVisible();
        await expect(loc.getByText('X1X11').first()).toHaveAttribute('type', 'root');
        await expect(loc.locator('.cont-elem[node-id="b12"]')).toHaveAttribute('type', 'root');
        await expect(loc.locator('.cont-elem[node-id="b111"]')).toHaveAttribute('type', 'leaf');
    }
});
