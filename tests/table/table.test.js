import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:8080/tests/table');
});

test('rendering the empty table', async ({ page }) => {
    let loc = page.locator('#tbl-test-render-empty');
    await expect(loc.getByRole('cell', {name: 'ID'})).toBeVisible();
    await expect(loc.getByRole('cell', {name: 'Hidden'})).toBeVisible({ visible: false });
    await expect(page.locator('#row-empty').getByRole('cell').first()).toBeVisible();
});

test('rendering a table with data in html', async ({ page }) => {
    await expect(page.getByRole('cell', { name: '0', exact: true })).toBeVisible();
    await expect(page.getByRole('cell', { name: '02.12.2025 20:30:00', exact: true })).toBeVisible();
    await expect(page.getByRole('cell', { name: '10', exact: true })).toBeVisible();

    const data = await page.evaluate(() => {
        let $tbl = document.querySelector('#tbl-test-render');
        let colNames = $tbl.getColumnNames();
        let formData = Object.fromEntries($tbl.getFormData().entries());
        let tableData = $tbl.getTableData();
        let tableDataDisp = $tbl.getTableData(true);
        return Promise.resolve({ 
            colNames: colNames, 
            formData: formData,
            tableData: tableData,
            tableDataDisp: tableDataDisp,
        });
    });

    expect(data.tableData[0]).toEqual(expect.objectContaining(
        {date: "2025-10-01 10:30:00", id: "0", num: "10"}
    ));
    expect(data.tableData[1]).toEqual(expect.objectContaining(
        {date: "2025-12-02 20:30:00", id: "1", num: "20"}
    ));
    expect(data.tableData.length).toEqual(2);

    expect(data.colNames).toEqual(expect.objectContaining(
        {id: 'ID', num: 'Num', date: 'Date'}
    ));

    expect(data.tableDataDisp[0]).toEqual(expect.objectContaining(
        {date: "01.10.2025 10:30:00", id: "0", num: "10"}
    ));
    expect(data.tableDataDisp[1]).toEqual(expect.objectContaining(
        {date: "02.12.2025 20:30:00", id: "1", num: "20"}
    ));
});

test('manipulating table data with javascript', async ({ page }) => {
    let loc = page.locator('#tbl-test-js-data');

    let data = await page.evaluate(() => {
        let $tbl = document.querySelector('#tbl-test-js-data');
        $tbl.mergeData('id', [{id: 5, num: 99, date: '2020-01-01 10:10:00'}]);
        $tbl.mergeData('id', [{id: 0, num: 2}]);

        let tableData = $tbl.getTableData();
        return Promise.resolve({ 
            tableData: tableData,
        });
    });

    await expect(loc.getByRole('cell', {name: '99', exact: true})).toBeVisible();
    await expect(loc.getByRole('cell', {name: '2', exact: true})).toBeVisible();
    await expect(loc.getByRole('cell', {name: '01.01.2020 10:10:00', exact: true})).toBeVisible();
    await expect(loc.getByRole('cell', {name: '01.10.2025 10:30:00', exact: true})).toBeVisible();

    expect(data.tableData[0]).toEqual(expect.objectContaining(
        {date: "2025-10-01 10:30:00", id: "0", num: "2"}
    ));
    expect(data.tableData[1]).toEqual(expect.objectContaining(
        {date: "2020-01-01 10:10:00", id: "5", num: "99"}
    ));

    data = await page.evaluate(() => {
        let $tbl = document.querySelector('#tbl-test-js-data');
        $tbl.replaceBody([
            {id: 5, num: 50, date: '2025-01-30 05:05:00'},
            {id: 10, num: 100, date: '2025-01-01 05:05:00'},
            {id: 10, num: 101, date: '2025-01-01 05:05:00'},
        ])

        $tbl.mergeData(['id', 'num'], [{id: 10, num: 101, date: '2000-01-01 01:01:00'}]);

        let tableData = $tbl.getTableData();
        return Promise.resolve({ 
            tableData: tableData,
        });
    });

    await expect(loc.getByRole('cell', {name: '5', exact: true})).toBeVisible();
    await expect(loc.getByRole('cell', {name: '50', exact: true})).toBeVisible();
    await expect(loc.getByRole('cell', {name: '100', exact: true})).toBeVisible();
    await expect(loc.getByRole('cell', {name: '30.01.2025 05:05:00', exact: true})).toBeVisible();
    await expect(loc.getByRole('cell', {name: '01.01.2025 05:05:00', exact: true})).toBeVisible();
    await expect(loc.getByRole('cell', {name: '01.01.2000 01:01:00', exact: true})).toBeVisible();

    expect(data.tableData[0]).toEqual(expect.objectContaining(
        {id: '5', num: '50', date: '2025-01-30 05:05:00'},
    ));
    expect(data.tableData[1]).toEqual(expect.objectContaining(
        {id: '10', num: '100', date: '2025-01-01 05:05:00'},
    ));
    expect(data.tableData[2]).toEqual(expect.objectContaining(
        {id: '10', num: '101', date: '2000-01-01 01:01:00'},
    ));

    data = await page.evaluate(() => {
        let $tbl = document.querySelector('#tbl-test-js-data');
        $tbl.mergeData(['id', 'num'], [{id: 20, num: 101, date: '2000-01-01 01:01:00'}], true);

        let tableData = $tbl.getTableData();
        return Promise.resolve({ 
            tableData: tableData,
        });
    });

    expect(data.tableData[0]).toEqual(expect.objectContaining(
        {id: '20', num: '101', date: '2000-01-01 01:01:00'},
    ));
    expect(data.tableData.length).toEqual(1);
});

