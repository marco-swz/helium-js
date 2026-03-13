// @ts-nocheck
import { styles } from './table_styles.ts';
import { LitElement, TemplateResult, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { createRef, Ref, ref } from 'lit/directives/ref.js';
import { HeliumFormDialog, HeliumFormDialogResponseEvent, HeliumFormDialogSubmitEvent } from './form_dialog.js';
import { HeliumCheck } from './check.js';
import { HeliumPopover } from './popover.js';
import { HeliumDialog } from './dialog.js';
import { HeliumToggle } from './toggle.js';
import { HeliumToast } from './toast.js';

export type ColumnType = 'check' | 'edit' | 'duplicate' | 'delete';

export type TableColumn = HTMLElement & {
    type?: ColumnType,
}

/**
 * A table supporting CRUD operations and with many additional features.
 *
 * Features:
 *   - Builtin dialog to create, remove, update and duplicate rows
 *   - Synchronize with backend: When an endpoint is defined, all CRUD operations, filtering and sorting are handled via the backend
 *   - Sorting: Sort rows ascending or descending
 *   - Filtering: Filter one or multiple rows
 *   - Pagination: Don't show all rows at once
 *   - Notify other elements: Events are emitted when rows are selected
 *   - Form compatibility: Selected rows can be submitted as part of a form
 *
 * ## Defintion
 *
 * When parsing the HTML of the table, the `innerHTML` is used to define the state.
 * All `th` elements in the `innerHTML` are used as column definition.
 * They are moved inside the shadow DOM after initialization and cannot be modified from the outside.
 * The same happens with `td` elements, except that they are used as the initial table data.
 * Since `th` and `td` cannot exist outside a table, they need to be wrapped inside a dummy `table` element.
 *
 * ```html
 * <he-table>
 *   <table>
 *      <th column="COL1" type>My Column 1</th>
 *      <th column="COL2">My Column 2</th>
 *   </table>
 * </he-table>
 *
 * ```
 *
 * ## Element notification
 *
 * When a row is selected, the `check` event is emitted.
 * It contains as detail the count of checked rows in the table.
 *
 * ```javascript
 * table.addEventListener('check', 
 *   (e) => console.log('Number of checked rows:', e.detail.numRows)
 * );
 * ```
 * TODO: Document notification attribute
 *
 * ## Column Types
 * ### Callback
 *
 * If the column type is set to `callback`, a callback function needs to be provided on the `th` element via a `onrender` attribute.
 * ```html
 * <th column="mycol" type="callback" onrender"(data) => mycallback(data)">Column Name</th>
 * ```
 *
 * ## Backend API
 *
 * If the attribute `endpoint` is set, all table operations are expected to be handled by the defined endpoint.
 * 
 * ### Retrieving Data
 *
 * The table makes a `GET` request to the endpoint
 * and all parameters are passed as query string in the URL.
 * These parameters are:
 *   - All filter values in the form `<columnName>=<filterValue>` 
 *   - `offset`: The current pagination offset
 *   - `count`: The amount of requested rows
 *   - The column currently sorted by and direction, in the form `sort=<columnName>-<'asc'|'desc'>` (e.g. `sort=COL1-desc`)
 *
 * Example request:
 * ```
 * GET https://myserver/myendpoint?COL1=1&COL2=foo&sort=COL1-asc&offset=10&count=10
 * ```
 *
 * The table expects as response a JSON list of objects, where
 * each list entry represents a row and each row is an object, with 
 * the column names as keys.
 *
 * Example response:
 * ```json
 * [
 *  { "COL1": 1, "COL2": "foo" },
 *  { "COL1": 2, "COL2": "bar" },
 * ]
 * ```
 * 
 * ### Creating Rows
 *
 * When inserting new rows, the table makes a `POST` request to the endpoint.
 * The request contains a JSON object in the body.
 * This has the form:
 *
 * ```json
 * {
 *   data: [
 *    { "COL1": 1, "COL2": "foo" },
 *    { "COL1": 2, "COL2": "bar" },
 *   ]
 * }
 * ```
 *
 * As response, the table expects a list of boolean values, indicating if the insertion of the
 * corresponding row was successful or not.
 *
 * ```json
 * [ true, false ]
 * ```
 *
 * ### Editing Rows
 *
 * To modify a row, the table sends a `PATCH` request to the endpoint.
 * The request is a JSON object of the form:
 *
 * ```json
 * {
 *   data: [
 *    { "COL1": 1, "COL2": "baz" },
 *    { "COL1": 100, "COL2": "bar" },
 *   ],
 *   old: [
 *    { "COL1": 1, "COL2": "foo" },
 *    { "COL1": 2, "COL2": "bar" },
 *   ]
 * }
 * ```
 *
 * For each modified value, the entire old and new row is submitted, even the values that are not modified.
 * The backend can use this information to make the appropriate updates.
 *
 * The response is expected to return the updated entries only:
 *
 * ```json
 * [
 *  { "COL1": 1, "COL2": "baz" },
 *  { "COL1": 100, "COL2": "bar" },
 * ]
 * ```
 *
 * ### Deleting Rows
 *
 * The table makes a `DELETE` request to the specified endpoint.
 * The request is a JSON object containing a list of all rows to be deleted.
 *
 * ```json
 * {
 *   data: [
 *    { "COL1": 1, "COL2": "foo" },
 *    { "COL1": 2, "COL2": "bar" },
 *   ]
 * }
 * ```
 *
 * As response, the table expects a list of boolean values, indicating if an error occured during deletion or not.
 *
 * ```json
 * [ true, false ]
 * ```
 * ## Column Attributes
 *
 * The `th` element for each column can have additional attributes, which are specific to the single column.
 * They are marked with `[th]` in font of the description.
 *
 * @element he-table
 *
 * @attr {?string} endpoint - The endpoint for table operations. 
 * @attr {?string} pagination - The amount rows for each pagination step
 * @attr {on|off} submit-all - If set, all rows of the table are passed on to forms, instead of checked one.
 * @attr {on|off} sorter - If set, show a sorting button for all columns.
 * @attr {null|'below'|'true'} filter - If set, disables the filters for all rows.
 * @attr {on|off} column-menu - Shows a menu when a column name is clicked. This menu controls the filter and sorting.
 * @attr {on|off} require-filter - If set, at least one filter value has to be applied, otherwise no data is requested. This can be used to improve performance for time intensive queries.
 *
 * @attr {string} column - [th] The internal name of the column. This name needs to be unique for each column
 * @attr {?string} filter - [th] The filter value for a given column
 * @attr {?string} pattern - [th] The regex pattern to determine if the input for a given column is valid
 * @attr {'hidden'|'check'|'edit'|'number'|'date'|'datetime'|'text'|'callback'|null} type - [th] The type of the column
 * @attr {?string} remap - [th] A mapping of old value to new value, in JSON format
 * @attr {?string} options - [th] A JSON list of allowed values. The selection is enforced via `select` elements
 * @attr {on|off} no-edit - [th] If set, the input field is hidden when editing a row
 * @attr {?string} default - [th] The default value for a column
 * @attr {'asc'|'desc'} sort - [th] The direction for sorting the table by the given column
 * @attr {Object.<string, string>} row-color - [th] If a cell of the column has the given value, the background color of the row is set to the provided value. The color has to be in HSL format and is passed to the CSS `hsl()` function.
 * @attr {on|off} exact-filter - [th] If set, the filter will only show rows, which match the exact filter value, no partial matches
 * @attr {?string} row-color - [th] A mapping of value to color in JSON format
 *
 * @listens HeliumFormDialog#he-dialog-show - Shows the dialog
 * @listens HeliumFormDialog#he-dialog-close - Closes the dialog
 *
 * @extends HTMLElement
 *
 * @todo Univeral datetime conversion
 * @todo Language abstraction
 * #todo Remove multiple `oncheck` calls when unselecting all rows
 */
export class HeliumTable extends LitElement {
    static formAssociated = true;

    @property({ reflect: true, type: String })
    endpoint: string | null = null;
    @property({ reflect: true, type: Boolean })
    columnMenu: boolean = false;
    @property({ reflect: true, type: String })
    filter: string | null = null;
    /** @type {?HeliumCheck} */
    $checkAll;
    /** @type {HTMLFormElement} */
    $form;
    /** @type {HTMLTableSectionElement} */
    $body;
    /** @type {?HeliumPopover} */
    $menuOpen;
    /** @type {HeliumFormDialog} */
    $diagEdit;
    /** @type {?HeliumDialog} */
    $diagColumn;
    /** @type {?Object.<string, string>} */
    dataOld;
    /** @type {?string} */
    editRequestType;
    /** @type {array<string>} */
    idsEdit = [];
    /** @type {number} */
    nextRowId = 0;
    /** @type {?number} */
    pagination;
    /** @type {boolean} If this flag is `true`, no request is sent to the endpoint */
    disableRequest = false;
    /** @type {number} */
    offset = 0;
    /** @type {Object.<string, Object.<string, string>>} */
    remap = {};
    /** @type {Object.<string, Array<string>>} */
    options = {};
    _internals: ElementInternals;
    /** @type {Object.<string, ?Object.<string, string>>} */
    rowColors = {};
    /** @type {Object.<string, ?Object.<string, string>>} */
    rowStyles = {};
    /** @type {Object.<string, Object.<string, ?Object.<string, string>>>} */
    cellStyles = {};

    constructor() {
        super();
        this._internals = this.attachInternals();
    }

    set loading(val) {
        if (val) {
            this.$body.parentElement.setAttribute('loading', true);
        } else {
            this.$body.parentElement.removeAttribute('loading');
        }
    }

    get loading() {
        return this.$body.parentElement.getAttribute('loading') != null;
    }

    get value() {
        return this.getCheckedData();
    }

    get validationMessage() {
        return this._internals.validationMessage;
    }

    get validity() {
        return this._internals.validity;
    }

    checkValidity() {
        return this._internals.checkValidity();
    }

    connectedCallback() {
        this._renderTable();
        for (let $cont of this.$form.querySelectorAll('.cont-filter')) {
            let $input = $cont.querySelector('.span-colname');
            let $filter = $cont.querySelector('.inp-filter');
            $filter.style.minWidth = $input.offsetWidth + 'px';
        }

        this._requestRows(this.replaceBody);
        this._updateExternElements([]);
        if (this.getAttribute('submit-all')) {
            this._internals.setFormValue(JSON.stringify(this.getTableData()));
        }

        // All internal input events are not allowed to propagate outwards.
        // Only custom input events are triggered to the outside
        this.$form.addEventListener('input', (e: any) => e.stopPropagation());
    }

    deleteChecked(confirm = true) {
        // @ts-ignore
        let checks = this.shadowRoot.querySelectorAll('.check-row:state(checked)');

        let request = {
            data: [],
        }

        for (let $check of checks) {
            let row = $check.closest('tr');
            let data = this._getRowData(row);
        // @ts-ignore
            request.data.push(data);
        }

        let numDelete = request.data.length;
        if (numDelete === 0) {
            window.alert('Keine Zeilen ausgewählt.');
            return;
        }

        const msg = numDelete > 1
            ? `werden ${numDelete} Zeilen`
            : `wird 1 Zeile`;
        if (confirm && !window.confirm(`Es ${msg} gelöscht.\nSind Sie sicher?`)) {
            return;
        }

        if (this.endpoint != null) {
            fetch(this.endpoint, {
                method: 'DELETE',
                body: JSON.stringify(request),
            })
                .then(resp => resp.json())
                .then(data => {
        // @ts-ignore
                    data.forEach((delError, i) => {
                        if (!delError) {
        // @ts-ignore
                            checks[i].closest('tr').remove();
                        }
                    })
                })
                .catch(errorMsg => {
                    const event = new CustomEvent("he-toast-error", { detail: errorMsg });
                    this.dispatchEvent(event);
                });
            return;
        }

        for (const $check of checks) {
        // @ts-ignore
            $check.parentElement.parentElement.remove();
        }

        if (this.getAttribute('submit-all')) {
            this._internals.setFormValue(JSON.stringify(this.getTableData()));
        }
    }

    /**
     * Filters a column based on the provided value.
     * @param {string} colName The name of the column to filter (NOT the display name)
     * @param {string} filterValue The filter value
     * @param {boolean} [exact=true] Does not filter exact matches if set to `false`
     * @returns {Self}
     */
    filterColumn(colName, filterValue, exact=true) {
        let $col = this._columnFromName(colName);
        this._filterColumn($col, filterValue, exact);
        return this;
    }

    /**
     * 
     * @param {HeliumFormDialogSubmitEvent} evt
     * @param {HeliumFormDialog} $dialog
     * @returns void
     */
    formEditBeforeSubmitCallback(evt) {
        if (this.endpoint == null) {
            switch (this.editRequestType) {
                case 'POST':
                    this._appendRows([this.$diagEdit.getValues()]);
                    break;
                case 'PATCH':
                    this.replaceRowData(this.idsEdit[0], this.$diagEdit.getValues());
                    break;
            }
            this.$diagEdit.close();
            return;
        }

        evt.fetchArgs.body = {
            data: [JSON.parse(evt.fetchArgs.body)],
        };

        if (this.dataOld != null) {
            evt.fetchArgs.body.old = [this.dataOld];
        }
        evt.fetchArgs.method = this.editRequestType;
        evt.fetchArgs.headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }

        evt.fetchArgs.body = JSON.stringify(evt.fetchArgs.body);
    }

    /**
     * 
     * @param {HeliumFormDialogResponseEvent} evt
     * @returns void
     */
    formEditAfterSubmitCallback(evt) {
        // @ts-ignore
        evt.response.json().then(data => {
            switch (this.editRequestType) {
                case 'POST':
                    this._requestRows(this.replaceBody);
                    break;
                case 'PATCH':
        // @ts-ignore
                    data.forEach((entry, i) => {
                        const rowId = this.idsEdit[i];
                        this.replaceRowData(rowId, entry);
                    });
                    break;
            }
            this.$diagEdit.close();
        });
    }

    /**
     * Returns a mapping of column name to display name
     * @returns {<Object.<string, string>}
     */
    getColumnNames() {
        const cols = this._getColumns(true);
        const colNames = {}
        for (const $col of cols) {
            const colName = $col.getAttribute('column');
            if (colName == null) {
                continue;
            }
        // @ts-ignore
            colNames[colName] = $col.querySelector('.span-colname').innerText;
        }

        return colNames;
    }

    /**
     * Returns the data for all checked rows.
     * @param {boolean} [returnDisplayValues=false] - If true, returns the displayed values, if false, the values of the `data` attribute
     * @returns {Array<Object.<string, string>>}
     */
    getCheckedData(returnDisplayValues = false) {
        // @ts-ignore
        let checks = this.shadowRoot.querySelectorAll('.check-row:state(checked)');
        let data = [];
        for (let $check of checks) {
            let row = $check.closest('tr');
            let rowData = this._getRowData(row, returnDisplayValues);
            data.push(rowData);
        }

        return data;
    }

    /**
     * Returns all form data inside the table.
     * @returns {FormData}
     */
    getFormData() {
        return new FormData(this.$form);
    }

    /**
     * Returns the data of all rows, checked or not
     * @param {boolean} [returnDisplayValues=false] - If true, returns the displayed values, if false, the values of the `data` attribute
     * @returns {Array<Array<Object.<string, string>>>}
     */
    getTableData(returnDisplayValues = false) {
        return this._getTableData(returnDisplayValues);
    }

    /**
     * 
     * @param {string|Array<string>} keyColumn
     * @param {Array<Object.<string, string>>} data 
     * @returns {Self}
     */
    mergeData(keyColumn, data, removeOld = false) {
        if (!Array.isArray(keyColumn)) {
            keyColumn = [keyColumn];
        }

        /** @type {Object.<string, HTMLTableRowElement>} */
        let rowMap = {};
        for (const $row of this.$body.rows) {
            if ($row.id === 'row-empty') {
                if (data.length > 0) {
                    $row.remove();
                }
                continue;
            }
            const rowData = this._getRowData($row);
        // @ts-ignore
            const key = keyColumn.map((x) => rowData[x]).join('-');
        // @ts-ignore
            rowMap[key] = $row;
        }

        const cols = this._getColumns(true);
        for (const entry of data) {
        // @ts-ignore
            const key = keyColumn.map((x) => entry[x]).join('-');
        // @ts-ignore
            let $row = rowMap[key];
        // @ts-ignore
            delete rowMap[key];

            if ($row == null) {
                $row = this._renderRow(entry);
                this.$body.append($row);

                this._applyRowFilter($row, cols);
                continue;
            }

            $row.style.removeProperty('--he-table-row-backgroundColor');

            for (const $col of cols) {
                const colName = $col.getAttribute('column');
        // @ts-ignore
                if (!(colName in entry)) {
                    continue;
                }

        // @ts-ignore
                const newVal = entry[colName] ?? '';
        // @ts-ignore
                let $cell = $row.cells[$col.cellIndex];
                $cell.setAttribute('data', newVal);
                const text = this._renderText($col, newVal);
                $cell.innerHTML = text;
                $cell.title = text;
                this._applyRowStyles($row, colName, newVal)
            }
            this._applyRowFilter($row, cols);
        }

        if (removeOld) {
            for (const $row of Object.values(rowMap)) {
        // @ts-ignore
                $row.remove();
            }
        }
    }

    refresh() {
        this._requestRows(this.replaceBody);
    }

    /**
     * @param {Array<Object.<string, string>>} data 
     */
    replaceBody(data) {
        this.$body.innerHTML = '';
        this.offset = 0;
        this._updateExternElements([]);

        if (this.$checkAll) {
            this.$checkAll.checked = false;
            this.$checkAll.indeterminate = false;
        }

        if (data.length === 0) {
            this.$body.append(this._renderRowEmpty());
        }

        let renderMore = false;
        if (this.pagination != null && data.length > this.pagination) {
            data.pop();
            renderMore = true;
        }

        for (let rowData of data) {
            this.$body.append(this._renderRow(rowData));
        }

        if (renderMore) {
            this.$body.append(this._renderButtonMore());
        }

        if (this.getAttribute('submit-all')) {
            this._internals.setFormValue(JSON.stringify(this.getTableData()));
        }
    }

    reset() {
        // @ts-ignore
        this.$body.querySelectorAll('.check-row').forEach(x => x.checked = false);
        if (this.$checkAll != null) {
            this.$checkAll.checked = false;
            this.$checkAll.indeterminate = false;
        }
    }

    /**
     * Replaces the row with the provided ID with new data.
     * @param {string} rowId The HTML id of the row to update
     * @throws If no row is found with this ID
     */
    replaceRowData(rowId, newData) {
        let $row = this.$body.querySelector('#' + rowId);
        if ($row == null) {
            throw new Error('No row found with the row ID ' + rowId);
        }

        let columns = this._getColumns(true);
        for (let i = 0; i < columns.length; ++i) {
            const $column = columns[i];
            const colName = $column.getAttribute('column');
        // @ts-ignore
            const val = newData[colName];
            if (val == null) {
                continue;
            }

            // `+1` because of checkbox
            let $cell = $row.children[i + 1];
            $cell.setAttribute('data', val);
            $cell.innerHTML = this._renderText($column, val);
        }

        if (this.getAttribute('submit-all')) {
            this._internals.setFormValue(JSON.stringify(this.getTableData()));
        }
    }

    reportValidity() {
        return this._internals.reportValidity();
    }


    /**
    * @param {Object.<string, string> | Array<Object.<string, string>>} where 
    */
    selectRows(where) {
        if (!Array.isArray(where)) {
            where = [where];
        }

        for (const cond of where) {
            for (let $row of this.$body.children) {
                const rowData = this._getRowData($row);
                let isMatch = true;
                for (const [colName, val] of Object.entries(cond)) {
        // @ts-ignore
                    if (rowData[colName] !== val) {
                        isMatch = false;
                        break;
                    }
                }

                if (!isMatch) {
                    continue;
                }

                let $el = $row.querySelector('.check-row') ?? $row;
                $el.click();
            }
        }
    }

    /**
     * Changes values of a table row selected by the `where` argument.
     * @param {Object.<string, string>} where A mapping of column name to value, to filter which row is modified.
     * @param {Object.<string, string>} to A mappig from column name to new value.
     * @returns {Self}
     */
    setRowData(where, to) {
        /** @type {Object.<string, HTMLTableCellElement>} */
        let colMap = {};
        for (const $col of this._getColumns(true)) {
        // @ts-ignore
            colMap[colName] = $col;
        }

        for (const $row of this.$body.rows) {
            let isMatch = true;
            for (const [colName, filterVal] of Object.entries(where)) {
        // @ts-ignore
                const $col = colMap[colName];
        // @ts-ignore
                if (idx == null) {
                    throw new Error(`No column with name '${colName}'!`);
                }

                const val = $row.cells[$col.cellIndex].getAttribute('data');
                if (filterVal !== val) {
                    isMatch = false;
                    break;
                }
            }

            if (!isMatch) {
                continue;
            }

            for (const [colName, newVal] of Object.entries(to)) {
        // @ts-ignore
                const $col = colMap[colName];
                const $cell = $row.cells[$col.cellIndex];
                $cell.setAttribute('data', newVal);
                $cell.innerHTML = this._renderText($col, newVal);
            }
        }

        return this;
    }

    showDialogEdit() {
        this.$diagEdit.reset();
        // @ts-ignore
        let $check = this.shadowRoot.querySelector('.check-row:state(checked)');
        if ($check == null) {
            throw new Error('No row selected');
        }

        // @ts-ignore
        let $row = $check.parentElement.parentElement;
        this._showDialogEdit($row);
    }

    showDialogDuplicate() {
        this.$diagEdit.reset();
        // @ts-ignore
        let $check = this.shadowRoot.querySelector('.check-row:state(checked)');
        if ($check == null) {
            throw new Error('No row selected');
        }

        // @ts-ignore
        let row = $check.parentElement.parentElement;
        let data = this._getRowData(row, false);

        this.$diagEdit.setValues(data);
        this.editRequestType = 'POST';
        this.$diagEdit.setAttribute('title-text', 'Duplizieren');
        this.$diagEdit.showModal();
    }

    showDialogNew() {
        this.$diagEdit.reset();
        this.editRequestType = 'POST';
        this.$diagEdit.setAttribute('title-text', 'Erstellen');
        this.$diagEdit.showModal();
    }

    /**
     * @param {string} colName 
     * @param {null|'desc'|'asc'} dir 
     * @returns {Self}
     */
    sortColumn(colName, dir) {
        let $col = this._columnFromName(colName);
        this._sortColumn($col, dir);
        return this;
    }

    /**
     * @param {array<Object<string, string>>} rowData 
     */
    _appendRows(rowData) {
        if (this.pagination != null && rowData.length > this.pagination) {
            rowData.pop();
        }

        let $rowMore = null;
        if (this.$body.lastChild.id === 'row-btn-more') {
            $rowMore = this.$body.lastChild;
            this.$body.removeChild($rowMore);
        }

        for (let row of rowData) {
            this.$body.append(this._renderRow(row));
        }

        if ($rowMore != null && rowData.length === this.pagination) {
            this.$body.append($rowMore);
        }
    }

    /**
    * @param {HTMLTableRowElement} $row 
    * @param {string} $colName
    * @param {string} val
    * @returns {void}
    */
    _applyCellStyles($cell, colName, val) {
        // @ts-ignore
        let styles = this.cellStyles[colName]
        if (styles === null) {
            return;
        }

        styles = styles[val];
        if (styles === null) {
            $cell.style.cssText = '';
            return;
        }

        let style = styles[val];
        if (style) {
            $cell.style.cssText = style;
        } else {
            $cell.style.cssText = '';
        }
    }

    /**
    * @param {HTMLTableRowElement} $row 
    * @param {string} $colName
    * @param {string} val
    * @returns {void}
    */
    _applyRowStyles($row, colName, val) {
        // @ts-ignore
        let styles = this.rowStyles[colName];
        if (styles) {
            let style = styles[val];
            if (style) {
                $row.style.cssText = style;
            } else {
                $row.style.cssText = '';
            }
        }
        // @ts-ignore
        let colors = this.rowColors[colName];
        if (colors) {
            let color = colors[val];
            if (color) {
                $row.style.setProperty('--he-table-row-backgroundColor', color);
            }
        }
    }

    /**
     * 
     * @param {Array<HTMLTableCellElement>} cols
     * @returns {void}
     */
    _applyFilters(cols) {
        /** @type {Object.<string, HeliumCheck} */
        let checks = {};

        for (const $row of this.$body.children) {
            const $check = this._applyRowFilter($row, cols);
            if ($check != null) {
        // @ts-ignore
                checks[$row.id] = $check;
            }
        }

        //for (const $col of this._getColumns(true)) {
        //    $col.setAttribute('filter', $col.querySelector('.inp-filter').value);
        //}

        this._updateCheckAll(Object.values(checks));
        this._updateExternElements(Object.values(checks));
    }

    /**
     * 
     * @param {HTMLTableRowElement} $row
     * @param {Array<HTMLTableCellElement>} cols
     * @returns {void}
     */
    _applyRowFilter($row, cols) {
        if ($row.id === 'row-empty') {
            return;
        }
        const $check = $row.querySelector('he-check');
        let hideMask = $row.getAttribute('mask') ?? 0;

        for (const $col of cols) {
            const exact = $col.getAttribute('exact-filter') != null;
            let filterValue = $col.getAttribute('filter') ?? '';

            const data = $row.children[$col.cellIndex].getAttribute('data');

            filterValue = filterValue.toLowerCase();
            const isMatch = exact
                ? data === filterValue
                : data.toLowerCase().includes(filterValue);

            if (isMatch) {
                // Clear bit for column filter
                hideMask &= ~(1 << $col.cellIndex);
            } else {
                // Set bit bit for column filter
                hideMask |= 1 << $col.cellIndex;
            }
        }

        $row.setAttribute('mask', hideMask);
        if (hideMask > 0) {
            $row.style.visibility = 'collapse';
            //$row.hidden = true;
            if ($check) {
                $check.checked = false;
            }
        } else {
            //$row.hidden = false;
            $row.style.visibility = null;
        }

        if ($check && $check.checked) {
            return $check;
        }
        return null;
    }

    /**
     * @param {HTMLDivElement} $menu
     * @returns void
     */
    _closeColumnMenu() {
        if (this.$menuOpen) {
            this.$menuOpen.open = false;
            this.$menuOpen = null;
        }
    }

    /**
     * @param {string} colName
     * @returns {HTMLTableCellElement}
     */
    _columnFromName(colName) {
        let columns = this._getColumns();
        for (let i = 0; i < columns.length; ++i) {
            let $col = columns[i];
            if ($col.getAttribute('column') === colName) {
                return $col;
            }
        }

        throw new Error(`No column found with name ${colName}`);
    }

    /**
     * Filters a column based on the provided value.
     * @param {HTMLTableCellElement} $column The column element
     * @param {string} filterValue The filter value
     * @param {boolean} [exact=true] Does not filter exact matches if set to `false`
     * @returns {Self}
     */
    _filterColumn($column, filterValue, exact=true) {
        const colName = $column.getAttribute('column');
        let $filter = this.$form.querySelector(`.inp-filter[name="${colName}"]`);
        if ($filter != null) {
            $filter.value = filterValue;
        }

        let isExact = $column.getAttribute('exact-filter');
        if (exact) {
            $column.setAttribute('exact-filter', '');
        } else {
            $column.removeAttribute('exact-filter');
        }

        if (filterValue === '') {
            $column.removeAttribute('filter');
        } else {
            $column.setAttribute('filter', filterValue);
        }

        if (this.endpoint != null) {
            this._requestRows(this.replaceBody);
            return;
        }

        this._applyFilters([$column]);

        // Restore original exact attribute
        if (isExact) {
            $column.setAttribute('exact-filter', '');
        } else {
            $column.removeAttribute('exact-filter');
        }
    }

    /**
     * @param {boolean} [dataOnly=false] Also includes non-data column like check cols if `true`
     * @returns {NodeListOf<HTMLTableCellElement>}
     */
    _getColumns(dataOnly = false) {
        if (dataOnly) {
        // @ts-ignore
            return this.shadowRoot.querySelectorAll('th[column]');
        }
        // @ts-ignore
        return this.shadowRoot.querySelectorAll('th');
    }

    /**
     * @param {HTMLTableRowElement} $row The table row to get the values from
     * @param {boolean} [returnDisplayValues=false] If `true`, returns the visible values instead of the `data` values
     * @returns {Object.<string, string>}
     */
    _getRowData($row, returnDisplayValues = false) {
        if ($row.id === 'row-empty') {
            throw new Error('Attempt to get data of empty row!');
        }
        let data = {};
        let columns = this._getColumns(true);
        for (let i = 0; i < columns.length; ++i) {
            let $column = columns[i];
        // @ts-ignore
            if (returnDisplayValues && ['hidden', 'check'].includes($column.getAttribute('type'))) {
                continue;
            }

        // @ts-ignore
            let $cell = $row.children[$column.cellIndex];

            const colName = $column.getAttribute('column');
        // @ts-ignore
            data[colName] = returnDisplayValues
                ? $cell.innerText
                : $cell.getAttribute('data');
        }

        return data;
    }

    /**
     * @param {boolean} [returnDisplayValues=false] If `true`, returns the visible values instead of the `data` values
     * @returns {Arra<Object.<string, string>>}
     */
    _getTableData(returnDisplayValues = false) {
        return Array.from(this.$body.children)
            .map((row) => this._getRowData(row, returnDisplayValues));
    }

        // @ts-ignore
    _handleChangeFilter(e) {
        this.offset = 0;

        const filterValue = e.currentTarget.value;
        const idx = e.currentTarget.closest('td').cellIndex;
        const $col = this._getColumns(false)[idx];
        this._filterColumn($col, filterValue, false);
    }

    /**
     * Callback when the checkbox on top has changed.
     * @returns void
     */
    _handleCheckAll() {
        this.$checkAll.indeterminate = false;
        const checks = this.$body.querySelectorAll('.check-row');

        if (this.$checkAll.checked) {
            for (const check of checks) {
                check.checked = true;
            }
            this._updateExternElements(checks);
        } else {
            for (const $check of checks) {
                $check.checked = false;
            }
            this._updateExternElements([]);
        }
    }

        // @ts-ignore
    _handleClickApplyColumn(e, $col) {
        e.preventDefault();
        const filterVal = $col.querySelector('.column-filter').value;
        this.disableRequest = true;
        this._filterColumn($col, filterVal, false);
        this.disableRequest = false;
        const asc = $col.querySelector('.btn-sort-asc').hasAttribute('selected');
        const desc = $col.querySelector('.btn-sort-desc').hasAttribute('selected');
        let sort = null;
        if (asc) {
            sort = 'asc';
        } else if (desc) {
            sort = 'desc';
        }
        this._sortColumn($col, sort);
        $col.querySelector('.column-menu').removeAttribute('open');
    }

    /**
     * @param {HTMLTableCellElement} $column 
     */
    _handleClickColumn(e, $column) {
        e.stopPropagation();
        this._closeColumnMenu();
        switch ($column.getAttribute('sort')) {
            case 'desc':
                $column.querySelector('.btn-sort-desc').setAttribute('selected', '');
                $column.querySelector('.btn-sort-asc').removeAttribute('selected');
                break;
            case 'asc':
                $column.querySelector('.btn-sort-asc').setAttribute('selected', '');
                $column.querySelector('.btn-sort-desc').removeAttribute('selected');
                break;
            default:
                $column.querySelector('.btn-sort-desc').removeAttribute('selected');
                $column.querySelector('.btn-sort-asc').removeAttribute('selected');
        }

        let $menu = $column.querySelector('.column-menu');
        $menu.open = true;

        let $filter = $column.querySelector('.column-filter');
        $filter.value = $column.getAttribute('filter') ?? '';
        if ($filter.nodeName === 'HE-INPUT') {
            setTimeout(() => {
                $filter.select();
            }, 10);
        }

        this.$menuOpen = $menu;
    }

    _handleClickPagination() {
        this.offset += this.pagination ?? 0;
        this._requestRows(this._appendRows);
    }

    /**
     * 
     * @param {InputEvent} e
     * @returns void
     */
    _handleClickRow(e) {
        const $row = e.currentTarget;
        let checked = null;
        if (this.$checkAll) {
            const allowMultiple = this.$checkAll.parentElement.getAttribute('multiple') !== 'false';
            checked = this.$body.querySelectorAll('.check-row:state(checked)');

            if (!allowMultiple || !e.target.classList.contains('check-row')) {
                for (let check of checked) {
                    check.checked = false;
                }

                $row.children[0].children[0].checked = true;
            }

            checked = this.$body.querySelectorAll('.check-row:state(checked)');
            this._updateCheckAll(checked);
        }

        const $rowOld = this.$body.querySelector('tr[selected]');
        if ($rowOld) {
            $rowOld.removeAttribute('selected');
        }
        $row.setAttribute('selected', '');
        this._updateExternElements(checked ?? [$row]);
    }

    /**
     * @param {InputEvent} e 
     * @param {bool} isDesc 
     * @returns void
     */
    _handleClickSort(e, isDesc) {
        /** @type {HTMLElement} */
        let $sort = e.currentTarget;
        let $col = $sort.closest('th');
        let dir = isDesc ? 'desc' : 'asc';
        this._sortColumn($col, dir);
    }

    _handleClickWindow() {
        this._closeColumnMenu();
    }

    /**
     * Creates and returns the `show more` button for pagination.
     * @returns {HTMLTableRowElement}
     */
    _renderButtonMore() {
        let $row = document.createElement('tr');
        $row.id = 'row-btn-more';
        let $cell = document.createElement('td');
        // @ts-ignore
        $cell.colSpan = '100';
        $cell.title = 'Mehr anzeigen';
        $cell.innerHTML = 'Mehr anzeigen';
        $cell.onclick = () => this._handleClickPagination();

        $row.append($cell);
        return $row;
    }

    _renderDialogEdit() {
        let data = [];
        for (let $column of this._getColumns(true)) {
            const colType = $column.getAttribute('type');
            const colName = $column.getAttribute('column');

            let required = $column.getAttribute('required') === 'true';
            let hidden = colType === 'hidden';
            if ($column.getAttribute('no-edit')) {
                hidden = true;
                required = false;
            }

        // @ts-ignore
            const options = this.options[colName];
            let optionMap = {};
            if (options != null) {
        // @ts-ignore
                const remap = this.remap[colName];
                for (const val of options) {
        // @ts-ignore
                    optionMap[val] = val;
                    if (remap == null) {
                        continue;
                    }

                    const mapped = remap[val];
                    if (mapped == null) {
                        continue;
                    }
        // @ts-ignore
                    optionMap[val] = mapped;
                }
            }

            let type = $column.getAttribute('type');
            let attributes = null;
            if (type === 'datetime') {
                type = 'datetime-local';
                attributes = { step: '1' };
            }

            data.push({
                name: $column.getAttribute('column'),
                required: required,
        // @ts-ignore
                label: $column.querySelector('.span-colname').innerHTML,
                placeholder: $column.getAttribute('default'),
                pattern: $column.getAttribute('pattern'),
                hidden: hidden,
                attributes: attributes,
                options: optionMap,
                type: type,
            })
        }

        /** @type {HeliumFormDialog} */
        let $dialog = document.createElement('he-form-dialog');
        // @ts-ignore
        $dialog.renderRows(data);

        $dialog.setAttribute('endpoint', this.endpoint ?? '');
        $dialog.onsubmit = (evt) => this.formEditBeforeSubmitCallback.bind(this)(evt);
        // @ts-ignore
        $dialog.onresponse = (evt) => this.formEditAfterSubmitCallback.bind(this)(evt);
        return $dialog;
    }

    /**
     * @param {Object.<string, string>} data 
     * @returns {HTMLTableRowElement}
     */
    _renderRow(data) {
        let $row = document.createElement('tr');
        $row.id = 'row-' + this.nextRowId++;
        $row.onclick = (e) => this._handleClickRow.bind(this)(e);

        for (let $column of this._getColumns()) {
            const colName = $column.getAttribute('column');
        // @ts-ignore
            let val = data[colName] ?? '';
            let text = val;
            let $cell = document.createElement('td');

            const colType = $column.getAttribute('type');
            switch (colType) {
                case 'check':
                    let $inpCheck = document.createElement('he-check');
        // @ts-ignore
                    $inpCheck.name = 'rows[]'
        // @ts-ignore
                    $inpCheck.value = data['id'] ?? '';
                    $inpCheck.classList.add('check-row');
                    $cell.append($inpCheck);
                    break;
                case 'edit':
                    $cell.addEventListener('click', () => this._showDialogEdit.bind(this)($row))
                    $cell.innerHTML = 'E';
                    break;
                case 'callback':
                    $cell.setAttribute('data', val);
        // @ts-ignore
                    $cell.innerHTML = window[$column.getAttribute('onrender')](data, colName) ?? '';
                    break;
                case 'hidden':
                    $cell.style.display = 'none';
                // no break
                default:
                    $cell.setAttribute('data', val);
                    $cell.innerHTML = this._renderText($column, text);
                    $cell.title = val;
                    this._applyCellStyles($cell, colName, val);
                    this._applyRowStyles($row, colName, val);
                    break;
            }

            $row.append($cell);
        }

        return $row;
    }

    _renderRowEmpty() {
        let $row = document.createElement('tr');
        $row.id = 'row-empty';
        for (let i = 0; i < this._getColumns().length; ++i) {
            let $cell = document.createElement('td');
            //$cell.colSpan = '1000';
            $row.append($cell);
        }
        return $row;
    }

    /**
     * Sends a new `GET` request to update all rows.
     * Only if an endpoint is defined!
     * @param {function(array<Object<string, string>>): void} callback 
     * @returns void
     */
    _requestRows(callback) {
        if (this.endpoint == null || this.disableRequest) {
            return;
        }

        this.loading = true;
        
        let params = new URLSearchParams();
        let hasFilter = false;
        for (const $col of this._getColumns(true)) {
            const filterVal = $col.getAttribute('filter');
            const colName = $col.getAttribute('column');
            if (filterVal != null && filterVal !== '') {
        // @ts-ignore
                params.append(colName, filterVal);
            }

            const sortDir = $col.getAttribute('sort');
            if (sortDir != null) {
                params.append('sort', colName + '-' + sortDir);
                hasFilter = true;
            }
        }

        if (this.getAttribute('require-filter') && !hasFilter) {
            this.loading = false;
            callback.bind(this)([]);
            return;
        }

        if (this.pagination != null) {
        // @ts-ignore
            params.append('offset', this.offset)
            params.append('count', this.pagination + 1);
        }

        fetch(this.endpoint + '/?' + params.toString(), {
            method: 'GET',
        })
            .then(resp => resp.json())
            .then(data => {
                callback.bind(this)(data);
            })
            .catch(errorMsg => { console.error(errorMsg); })
            .finally(() => this.loading = false);
    }

    /**
     * @param {string} colName - The name of column for the sorters
     * @param {'asc'|'desc'} checked - Sets the corresponding sorter to `checked`
     * @returns HTMLDivElement
     */
    _renderSorters(colName, checked) {
        let $radioSortAsc = document.createElement('input');
        $radioSortAsc.type = 'radio';
        $radioSortAsc.name = 'sort';
        $radioSortAsc.value = colName + '-asc';
        $radioSortAsc.id = colName + '-asc';
        $radioSortAsc.onclick = (e) => this._handleClickSort.bind(this)(e, false);
        if (checked === 'asc') {
            $radioSortAsc.checked = true;
        }

        let $labelSortAsc = document.createElement('label');
        // @ts-ignore
        $labelSortAsc.for = colName + 'asc';
        $labelSortAsc.innerHTML = '▲';
        $labelSortAsc.classList.add('label-sorter');
        $labelSortAsc.append($radioSortAsc);

        let $radioSortDesc = document.createElement('input');
        $radioSortDesc.type = 'radio';
        $radioSortDesc.name = 'sort';
        $radioSortDesc.value = colName + '-desc';
        $radioSortDesc.id = colName + '-desc';
        $radioSortDesc.onclick = (e) => this._handleClickSort.bind(this)(e, true);
        if (checked === 'desc') {
            $radioSortDesc.checked = true;
        }

        let $labelSortDesc = document.createElement('label');
        // @ts-ignore
        $labelSortDesc.for = colName + 'desc';
        $labelSortDesc.classList.add('label-sorter');
        $labelSortDesc.innerHTML = '▼';
        $labelSortDesc.append($radioSortDesc);

        let $contSorters = document.createElement('div');
        $contSorters.classList.add('cont-sorters')
        $contSorters.append($labelSortAsc);
        $contSorters.append($labelSortDesc);

        if (this.getAttribute('sorter') == null) {
            $contSorters.style.display = 'none';
        }

        return $contSorters;
    }


    /**
      * Returns the *text* representation of a value depending on the data type.
      * @param {HTMLTableCellElement} $column 
      * @param {string} val 
      * @returns string
      */
    _renderText($column, val) {
        let text = val;
        if ((val ?? '') !== '') {
            switch ($column.getAttribute('type')) {
                case 'date':
                    text = val.split('-').reverse().join('.');
                    break;
                case 'datetime':
                    val = val.replace('T', ' ');
                    const [date, time] = val.split(' ');
                    text = date.split('-').reverse().join('.') + ' ' + time;
                    break;
            }
        }

        // @ts-ignore
        const colRemap = this.remap[$column.getAttribute('column')];
        if (colRemap) {
            const valRemap = colRemap[val];
            if (valRemap) {
                text = valRemap;
            }
        }

        return text ?? '';
    }

    /**
     * 
     * @param {HTMLTableCellElement} $column
     * @returns {HTMLElement}
     */
    _renderFilter($column, colName) {
        let $filter = null;
        // @ts-ignore
        if (this.options[colName]) {
            $filter = document.createElement('select');
            let $optionEmpty = document.createElement('option');
            $optionEmpty.value = '';
            $filter.append($optionEmpty);

        // @ts-ignore
            for (const val of this.options[colName]) {
                const text = this._renderText($column, val);
                let $option = document.createElement('option');
                $option.innerHTML = text;
                $option.value = val;
                $filter.append($option);
            }
        } else {
            $filter = document.createElement('input');
            $filter.type = $column.getAttribute('filter-type') ?? 'text';
            // Using a random text seems to disable autocomplete properly
        // @ts-ignore
            $filter.autocomplete = 'efase';
            $filter.placeholder = ' ';
        }

        $filter.onchange = (e) => this._handleChangeFilter(e);
        $filter.value = $column.getAttribute('filter') ?? '';
        $filter.id = 'filter-' + colName;
        $filter.name = colName;
        $filter.classList.add('inp-filter');

        return $filter;
    }

    _renderHead(columns: Array<TableColumn>): TemplateResult<1> {
        const colNameTemplates: Array<TemplateResult<1>> = [];
        const colFilterTemplates: Array<TemplateResult<1>> = [];

        for (let $column of columns) {
            let colName = $column.getAttribute('column');
            if (colName == null) {
                colName = $column.innerText;  
                if (!['check', 'edit', 'duplicate', 'delete'].includes(getAttribute($column, 'type') ?? '')) {
                    $column.setAttribute('column', colName);
                }
            }

            try {
                // Numbers are converted to strings to simplify sorting later on
        // @ts-ignore
                this.options[colName] = JSON.parse(getAttribute($column, 'options') ?? '');
        // @ts-ignore
            } catch (error) {
                throw new Error('The provided options are not valid JSON!');
            }

            try {
        // @ts-ignore
                this.remap[colName] = JSON.parse(getAttribute($column, 'remap') ?? '');
            } catch (error) {
                throw new Error('The provided remap is not valid JSON!');
            }

            try {
        // @ts-ignore
                this.rowColors[colName] = JSON.parse(getAttribute($column, 'row-color') ?? '');
            } catch (error) {
                throw new Error('The provided row-color is not valid JSON!');
            }

            try {
        // @ts-ignore
                this.rowStyles[colName] = JSON.parse(getAttribute($column, 'row-style') ?? '');
            } catch (error) {
                throw new Error('The provided row-style is not valid JSON!');
            }

            try {
        // @ts-ignore
                this.cellStyles[colName] = JSON.parse(getAttribute($column, 'cell-style') ?? '');
            } catch (error) {
                throw new Error('The provided cell-style is not valid JSON!');
            }

            let $filterCell = document.createElement('td');
            $rowFilters.append($filterCell);

            const isHidden = $column.getAttribute('type') === 'hidden';
            if (isHidden) {
                $column.style.display = 'none';
                $filterCell.style.display = 'none';
            }

            const colType = $column.getAttribute('type');
            switch (colType) {
                case 'check':
                    this.$checkAll = document.createElement('he-check');
                    this.$checkAll.id = 'check-all';
                    this.$checkAll.onchange = (e) => this._handleCheckAll.bind(this)(e);
                    $column.setAttribute('type', 'check');
                    if (attrFilter === 'below') {
                        $filterCell.append(this.$checkAll);
                    } else {
                        $column.append(this.$checkAll);
                    }
                    $rowColNames.append($column);
                    continue;
                case 'edit':
                case 'delete':
                case 'duplicate':
                    let $cell = document.createElement('th');
                    $cell.setAttribute('type', colType);
                    $rowColNames.append($cell);
                    continue;
                case 'callback':
                    let $cont = document.createElement('span');
                    $cont.innerHTML = $column.innerHTML.trim();
                    $cont.classList.add('span-colname');
                    $column.innerHTML = '';
                    $column.append($cont);
                    $rowColNames.append($column);
                    continue;
            }

            let $contHeaderCell = document.createElement('div');
            let $spanName = document.createElement('span');
            $spanName.innerHTML = $column.innerHTML.trim();
            $column.innerHTML = '';
            $spanName.classList.add('span-colname');

            if (useColumnMenu) {
                $contHeaderCell.append($spanName);
                $contHeaderCell.classList.add('cont-colname');
                $contHeaderCell.append(this._renderColumnMenu($column));
                $spanName.addEventListener('click', (e) => this._handleClickColumn.bind(this)(e, $column));
                window.addEventListener('click', () => this._handleClickWindow.bind(this)());

            } else if (attrFilter === 'below') {
                let $filter = this._renderFilter($column, colName);

                $contHeaderCell.append($spanName);
                $filterCell.append($filter);
                const sort = $column.getAttribute('sort');
                let $contSorters = this._renderSorters(colName, sort);
                $column.setAttribute('column', colName);
                $contHeaderCell.append($contSorters);

            } else {
                $contHeaderCell.append($spanName);
                $spanName.style.position = 'unset';
            }

            html`
                <td>
                </td>
            `;
            $column.append($contHeaderCell);
            $rowColNames.append($column);
        }

        let $tHead = document.createElement('thead');
        $tHead.append($rowColNames);
        if (!useColumnMenu) {
            $tHead.append($rowFilters);
        }

        return html`
            <thead>
                <tr class="row-colName">
                    ${colNameTemplates}
                </tr>
                ${
                    this.columnMenu 
                        ? nothing 
                        : html`
                            <tr class="row-filter">
                                ${colFilterTemplates}
                            </tr>
                        `
                }
            </thead>
        `;

    }

    _renderColumnMenu($column) {
        const colName = $column.getAttribute('column');

        let $menu = document.createElement('he-popover');
        $menu.classList.add('column-menu');
        $menu.addEventListener('click', (e) => e.stopPropagation());
        $menu.$anchor = $column;

        let $content = document.createElement('div');
        $content.slot = "content";
        $menu.append($content);

        const description = $column.getAttribute('description');
        if (description != null) {
            let $btnDescr = document.createElement('div');
            $btnDescr.classList.add('btn-description');
            $btnDescr.innerHTML = 'Beschreibung';
            $content.append($btnDescr);
        }

        const filterVal = $column.getAttribute('filter');
        let valMap = this.remap[colName] ?? {};
        let options = this.options[colName];
        if (options != null) {
            options = [...options];
            options.sort(function(a, b) {
                return a.localeCompare(b);
            });
            options.unshift('');

            let $selFilter = document.createElement('he-select');
            $selFilter.setAttribute('filter', 'inline');
            $selFilter.classList.add("column-filter");
            $selFilter.name = "filter";
            $selFilter.replaceOptions(options, valMap);
            $selFilter.value = filterVal ?? '';
            $content.append($selFilter);
            
        } else {
            let $inpFilter = document.createElement('he-input');
            $inpFilter.setAttribute('filter', 'true');
            $inpFilter.classList.add("column-filter");
            $inpFilter.name = "filter";
            $inpFilter.value = filterVal ?? '';
            $inpFilter.select();
            $content.append($inpFilter);
        }

        let $btnAsc = document.createElement('div');
        $btnAsc.classList.add('btn-sort-asc');
        $btnAsc.innerHTML = 'Aufsteigend sortieren'
        $content.append($btnAsc);

        let $btnDesc = document.createElement('div');
        $btnDesc .classList.add('btn-sort-desc');
        $btnDesc.innerHTML = 'Absteigend sortieren'
        $content.append($btnDesc);

        $btnAsc.onclick = () => {
            if ($btnAsc.hasAttribute('selected')) {
                $btnAsc.removeAttribute('selected');
            } else {
                $btnAsc.setAttribute('selected', '');
            }
            $btnDesc.removeAttribute('selected');
        };
        $btnDesc.onclick = () => {
            if ($btnDesc.hasAttribute('selected')) {
                $btnDesc.removeAttribute('selected');
            } else {
                $btnDesc.setAttribute('selected', '');
            }
            $btnAsc.removeAttribute('selected');
        };

        let $btnApply = document.createElement('div');
        $btnApply.classList.add('btn-apply-filter');
        $btnApply.innerHTML = 'Anwenden';
        $btnApply.onclick = (e) => this._handleClickApplyColumn.bind(this)(e, $column);
        $content.append($btnApply);

        $content.addEventListener('keyup', (event) => {
            if (event.key === 'Enter') {
                $btnApply.click();
            }
        });

        return $menu;
    }

    render() {
        html`
            <form id="form-tbl">
                <table>
                    <tr></tr>
                    <tr
                </table>
            </form>
        `;
    }

    _renderTable() {
        const shadow = this.shadowRoot;
        const columns = this.querySelectorAll('th');

        const $tHead = this._renderHead(columns);
        $table.append($tHead);

        this.$body = document.createElement('tbody');

        const rows = this.querySelectorAll('tr:has(td)');
        if (rows.length === 0) {
            this.$body.append(this._renderRowEmpty());
        } else {
            for (const row of rows) {
                let rowData = {};
                // There can be more `th`s than `td`s because of special column types.
                // This variable ensures correct indexing.
                let tdIdx = 0;
                for (let i = 0; i < columns.length; ++i) {
                    const column = columns[i]
                    const colName = column.getAttribute('column');
                    if (!colName || ['check', 'edit', 'duplicate', 'delete'].includes(column.getAttribute('type'))) {
                        continue;
                    }
                    const cell = row.children[tdIdx];
                    const data = cell.getAttribute('data') ?? cell.innerText;
                    rowData[colName] = data;
                    ++tdIdx;
                }
                let $rowRendered = this._renderRow(rowData);
                this.$body.append($rowRendered);
            }
        }
        $table.append(this.$body);

        this.$diagEdit = this._renderDialogEdit();
        shadow.append(this.$diagEdit);
        this.innerHTML = '';

        // if (this.getAttribute('column-menu')) {
        //     this.$diagColumn = this._renderDialogColumn();
        //     shadow.append(this.$diagColumn);
        // }
    }

    _showDialogEdit($row) {
        let data = this._getRowData($row, false);

        this.$diagEdit.setValues(data);
        this.dataOld = data;
        this.idsEdit = [$row.id];
        this.editRequestType = 'PATCH';
        this.$diagEdit.setAttribute('title-text', 'Bearbeiten');
        this.$diagEdit.showModal();
    }

    /**
     * @param {HTMLTableCellElement} column 
     * @param {null|'desc'|'asc'} dir 
     */
    _sortColumn($column, dir) {
        if (dir !== 'desc' && dir !== 'asc' && dir != null) {
            throw new Error(`Invalid sort direction: ${dir}`);
        }

        if (dir == null) {
            $column.removeAttribute('sort');
        } else {
            for (let $col of this._getColumns(true)) {
                $col.removeAttribute('sort');
            }
        }

        if (dir != null) {
            $column.setAttribute('sort', dir);
        }

        if (this.getAttribute('filter') === 'below') {
            let $btnSort = this.$form.querySelector('input[name=sort]:checked');
            if ($btnSort != null) {
                $btnSort.checked = false;
            }

            if (dir != null) {
                const colName = $column.getAttribute('column');
                $column.querySelector(`#${colName}-${dir}`).checked = true;
            }
        }

        if (this.endpoint) {
            this._requestRows(this.replaceBody);
            return;
        }

        const colIdx = Array.prototype.indexOf.call(
            $column.parentElement.children,
            $column
        );

        let values = [];
        for (const row of this.$body.children) {
            values.push([row.children[colIdx].getAttribute('data'), row]);
        }

        let newOrder = dir === 'desc'
            ? Array.from(values).sort((a, b) => b[0].localeCompare(a[0]))
            : Array.from(values).sort((a, b) => a[0].localeCompare(b[0]));


        for (const row of newOrder) {
            this.$body.append(row[1]);
        }
    }

    /**
     * 
     * @param {Array<HeliumCheck>} checked 
     * @returns {void}
     */
    _updateCheckAll(checked) {
        if (this.$checkAll) {
            if (checked.length === 0) {
                this.$checkAll.checked = false;
                this.$checkAll.indeterminate = false;
            } else if (checked.length < this.$body.children.length) {
                this.$checkAll.checked = true;
                this.$checkAll.indeterminate = true;
            } else {
                this.$checkAll.indeterminate = false;
                this.$checkAll.checked = true;
            }
        }
    }

    /**
     * 
     * @param {Array<HeliumCheck>} checked 
     * @returns {void}
     */
    _updateExternElements(checked) {
        // The form value only needs to be set when the name is set.
        // This avoids parsing all checked rows each click.
        if (this.getAttribute('name') && this.getAttribute('submit-all') == null) {
            this._internals.setFormValue(JSON.stringify(this.value));
        }

        const evt = new CustomEvent('input', {
            detail: {
                numRows: checked.length,
            }
        })
        this.dispatchEvent(evt);
    }
}

function getAttribute($element: HTMLElement, attr: string): null | string {
    // @ts-ignore
    return $element[attr] ?? $element.getAttribute(attr);
}

if (!customElements.get('he-table')) {
    customElements.define("he-table", HeliumTable);
}
