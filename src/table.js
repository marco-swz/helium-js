import { HeliumFormDialog, HeliumFormDialogResponseEvent, HeliumFormDialogSubmitEvent } from './form_dialog.js';
import { HeliumCheck } from './check.js';
import { HeliumToast } from './toast.js';
import sheet from './table.css';

/**
 * A table supporting CRUD operations and with many additional features.
 *
 * # Features:
 *   - Create, remove, update and duplicate rows
 *   - Synchronize with backend: When a endpoint is defined, all CRUD operations, filtering and sorting is handled via the backend
 *   - Sorting: Sort rows ascending or descending
 *   - Filtering: Filter on or multiple rows
 *   - Pagination: Don't show all rows at once
 *   - Notify other elements: Other elements can "subscribe" to row selections of the table
 *
 * # Element notification
 * TODO(marco)
 *
 * # Backend API
 * If the attribute `endpoint` is set, all table operations are expected to be handled by the defined endpoint.
 * 
 * ## Retrieving Data
 * The table makes a `GET` request to the endpoint
 * and all parameters are passed as query string in the URL.
 * These parameters are:
 *   - All filter values in the form `<columnName>=<filterValue>` 
 *   - `offset`: The current pagination offset
 *   - `count`: The amount of requested rows
 *   - The current sort column and direction in the form `sort=<columnName>-<'asc'|'desc'>` (e.g. `sort=COL1-desc`)
 *
 * Example request:
 * ```
 * GET https://myserver/myendpoint?COL1=1&COL2=foo&sort=COL1-asc&offset=10&count=10
 * ```
 *
 * The table expects as response a JSON list of objects, where
 * each list entry represents a row and each row is object, with 
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
 * ## Creating Rows
 * TODO(marco)
 *
 * ## Deleting Rows
 * The table makes a `DELETE` request to the specified endpoint.
 *
 * TODO(marco)
 *
 * # Attributes
 *
 * @attr {?string} endpoint - The endpoint for table operations. 
 * @attr {?string} pagination - The amount rows for each pagination step
 * @attr {on|off} submit-all - If set, all rows of the table are passed on to forms, instead of checked one.
 * @attr {on|off} no-sorter - If set, hides the sorting button for all columns.
 * @attr {on|off} no-filter - If set, disables the filters for all rows.
 *
 * # Column Attributes
 * The `th` element for each column can have additional attributes, which are specific to the single column.
 * These are the following:
 *
 * @attr {string} column - The internal name of the column. This name needs to be unique for each column
 * @attr {?string} filter - The filter value for a given column
 * @attr {?string} pattern - The regex pattern to determine if the input for a given column is valid
 * @attr {'hidden'|'check'|'edit'|'number'|'date'|'datetime'|'text'|null} type - The type of the column
 * @attr {?string} remap - A mapping of old value to new value, in JSON format
 * @attr {?string} options - A JSON list of allowed values. The selection is enforced via `select` elements
 * @attr {on|off} no-edit - If set, the input field is hidden when editing a row
 * @attr {?string} default - The default value for a column
 * @attr {'asc'|'desc'} sort - The direction for sorting the table by the given column
 * @attr {Object.<string, string>} row-color - If a cell of the column has the given value, the background color of the row is set to the provided value. The color has to be in HSL format and is passed to the CSS `hsl()` function.
 *
 * @element he-table
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
export class HeliumTable extends HTMLElement {
    static formAssociated = true;
    static observedAttributes = [
        'endpoint',
        'pagination',
    ];

    /** @type {?string} */
    endpoint;
    /** @type {?HeliumCheck} */
    $checkAll;
    /** @type {HTMLFormElement} */
    $form;
    /** @type {HTMLFormElement} */
    $formDialogEdit;
    /** @type {HTMLTableSectionElement} */
    $body;
    /** @type {HeliumFormDialog} */
    $diagEdit;
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
    /** @type {number} */
    offset = 0;
    /** @type {Object.<string, Object.<string, string>>} */
    remap = {};
    /** @type {Object.<string, Array<string>>} */
    options = {};
    /** @type {ElementInternals} */
    internals;
    /** @type {Object.<string, ?Object.<string, string>>} */
    rowColors = {};

    constructor() {
        super();
        let shadow = this.attachShadow({ mode: "open" });
        this.internals = this.attachInternals();

        shadow.adoptedStyleSheets = [sheet];
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

    set oncheck(val) {
        this.setAttribute('oncheck', val);
    }

    get oncheck() {
        return this.getAttribute('oncheck');
    }

    get value() {
        return this.getCheckedData();
    }

    get validationMessage() {
        return this.internals.validationMessage;
    }

    get validity() {
        return this.internals.validity;
    }

    /**
     * Callback for attribute changes of the web component.
     * @param {string} name The attribute name
     * @param {string} _oldValue The previous attribute value
     * @param {string} newValue The new attribute value
     * @returns void
     */
    attributeChangedCallback(name, _oldValue, newValue) {
        switch (name) {
            case 'endpoint':
                this.endpoint = newValue;
                break;

            case 'pagination':
                this.pagination = Number(newValue);
                break;
        }
    }

    checkValidity() {
        return this.internals.checkValidity();
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
            this.internals.setFormValue(JSON.stringify(this.getTableData()));
        }
    }

    deleteChecked(confirm = true) {
        let checks = this.shadowRoot.querySelectorAll('.check-row:state(checked)');

        let request = {
            data: [],
        }

        for (let $check of checks) {
            let row = $check.closest('tr');
            let data = this._getRowData(row);
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
                    data.forEach((delError, i) => {
                        if (!delError) {
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
            $check.parentElement.parentElement.remove();
        }

        if (this.getAttribute('submit-all')) {
            this.internals.setFormValue(JSON.stringify(this.getTableData()));
        }
    }

    /**
     * Filters a column based on the provided value.
     * @param {string} colName The name of the column to filter (NOT the display name)
     * @param {string} filterValue The filter value
     * @param {boolean} [partial=false] Does not filter partial matches if set to `true`
     * @returns {Self}
     */
    filterColumn(colName, filterValue, partial = false) {
        let columns = this._getColumns();
        for (let i = 0; i < columns.length; ++i) {
            if (columns[i].getAttribute('column') === colName) {
                this._filterColumn(i, filterValue, !partial);
                return this;
            }
        }
        throw new Error(`No column found with name ${colName}`);
    }

    /**
     * 
     * @param {HeliumFormDialogSubmitEvent} evt
     * @returns void
     */
    formEditBeforeSubmitCallback(evt) {
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
        evt.response.json().then(data => {
            switch (this.editRequestType) {
                case 'POST':
                    this._requestRows(this.replaceBody);
                    break;
                case 'PATCH':
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
     * Returns the data for all checked rows.
     * @param {boolean} [returnDisplayValues=false] - If true, returns the displayed values, if false, the values of the `data` attribute
     * @returns {Array<Object.<string, string>>}
     */
    getCheckedData(returnDisplayValues = false) {
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
    mergeData(keyColumn, data, removeOld=false) {
        if (!Array.isArray(keyColumn)) {
            keyColumn = [keyColumn];
        }

        /** @type {Object.<string, HTMLTableRowElement} */
        let rowMap = {};
        for (const $row of this.$body.rows) {
            const rowData = this._getRowData($row);
            const key = keyColumn.map((x) => rowData[x]).join('-');
            rowMap[key] = $row;
        }

        for (const entry of data) {
            const key = keyColumn.map((x) => entry[x]).join('-');
            let $row = rowMap[key];
            delete rowMap[key];

            if ($row == null) {
                $row = this._renderRow(entry);
                this.$body.append($row);
                continue;
            }

            for (const $col of this._getColumns(true)) {
                const colName = $col.getAttribute('column');
                const newVal = entry[colName];
                if (newVal == null) {
                    continue;
                }

                let $cell = $row.cells[$col.cellIndex];
                $cell.setAttribute('data', newVal);
                $cell.innerHTML = this._renderText($cell, newVal);
            }
        }

        if (removeOld) {
            for (const $row of Object.values(rowMap)) {
                $row.remove();
            }
        }
    }

    refresh() {
        this._requestRows(this.replaceBody);
    }

    /**
     * @param {Array<Object.<string, string>>} data 
     * @returns {HTMLDialogElement}
     */
    replaceBody(data) {
        this.$body.innerHTML = '';
        this.offset = 0;
        this._updateExternElements([]);

        if (this.$checkAll) {
            this.$checkAll.checked = false;
            this.$checkAll.indeterminate = false;
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
            this.internals.setFormValue(JSON.stringify(this.getTableData()));
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
            this.internals.setFormValue(JSON.stringify(this.getTableData()));
        }
    }

    reportValidity() {
        return this.internals.reportValidity();
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
            colMap[colName] = $col;
        }

        for (const $row of this.$body.rows) {
            let isMatch = true;
            for (const [colName, filterVal] of Object.entries(where)) {
                const $col = colMap[colName];
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
                const $col = colMap[colName];
                const $cell = $row.cells[$col.cellIndex];
                $cell.setAttribute('data', newVal);
                $cell.innerHTML = this._renderText($col, newVal);
            }
        }

        return this;
    }

    showDialogEdit() {
        let $check = this.shadowRoot.querySelector('.check-row:state(checked)');
        if ($check == null) {
            throw new Error('No row selected');
        }

        let $row = $check.parentElement.parentElement;
        this._showDialogEdit($row);
    }

    showDialogDuplicate() {
        let $check = this.shadowRoot.querySelector('.check-row:state(checked)');
        if ($check == null) {
            throw new Error('No row selected');
        }

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
     * Callback when the checkbox on top has changed.
     * @returns void
     */
    _checkAllCheckCallback() {
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
                this._updateExternElements([]);
            }
        }
    }

    _filterChangeCallback(e) {
        this.offset = 0;

        if (this.endpoint != null) {
            this._requestRows(this.replaceBody);
            return;
        }

        const $filter = e.currentTarget;
        const colIdx = Array.prototype.indexOf.call(
            $filter.parentElement.parentElement.parentElement.parentElement.children,
            $filter.parentElement.parentElement.parentElement
        );

        this._filterColumn(colIdx, $filter.value);
    }

    _filterColumn(colIdx, filterValue, strict = false) {
        let checks = [];
        filterValue = filterValue.toLowerCase();
        for (const $row of this.$body.children) {
            const data = $row.children[colIdx].getAttribute('data');
            let hideMask = $row.getAttribute('mask') ?? 0;

            const isMatch = strict
                ? data === filterValue
                : data.toLowerCase().includes(filterValue);

            if (isMatch) {
                // Clear bit for column filter
                hideMask &= ~1 << colIdx;
            } else {
                // Set bit bit for column filter
                hideMask |= 1 << colIdx;
            }

            $row.setAttribute('mask', hideMask);

            const $check = $row.querySelector('he-check');
            if (hideMask > 0) {
                $row.style.visibility = 'collapse';
                $check.checked = false;
            } else {
                $row.style.visibility = null;
            }
            
            if ($check.checked) {
                checks.push($check);
            }

            this._updateCheckAll(checks);
            this._updateExternElements(checks);
        }
    }

    /**
     * @param {boolean} [dataOnly=false] Also includes non-data column like check cols if `true`
     * @returns {NodeListOf<HTMLTableCellElement>}
     */
    _getColumns(dataOnly = false) {
        if (dataOnly) {
            return this.shadowRoot.querySelectorAll('th[column]');
        }
        return this.shadowRoot.querySelectorAll('th');
    }

    /**
     * @param {HTMLTableRowElement} row The table row to get the values from
     * @param {boolean} [returnDisplayValues=false] If `true`, returns the visible values instead of the `data` values
     * @returns {Object.<string, string>}
     */
    _getRowData(row, returnDisplayValues = false) {
        let data = {};
        let columns = this._getColumns(true);
        for (let i = 0; i < columns.length; ++i) {
            let $column = columns[i];
            let $cell = row.children[$column.cellIndex];

            const colName = $column.getAttribute('column');
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

    _handlePagination() {
        this.offset += this.pagination ?? 0;
        this._requestRows(this._appendRows);
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
        $radioSortAsc.onclick = (e) => this._sortClickCallback.bind(this)(e, false);
        if (checked === 'asc') {
            $radioSortAsc.checked = true;
        }

        let $labelSortAsc = document.createElement('label');
        $labelSortAsc.for = colName + 'asc';
        $labelSortAsc.innerHTML = '▲';
        $labelSortAsc.classList.add('label-sorter');
        $labelSortAsc.append($radioSortAsc);

        let $radioSortDesc = document.createElement('input');
        $radioSortDesc.type = 'radio';
        $radioSortDesc.name = 'sort';
        $radioSortDesc.value = colName + '-desc';
        $radioSortDesc.id = colName + '-desc';
        $radioSortDesc.onclick = (e) => this._sortClickCallback.bind(this)(e, true);
        if (checked === 'desc') {
            $radioSortDesc.checked = true;
        }

        let $labelSortDesc = document.createElement('label');
        $labelSortDesc.for = colName + 'desc';
        $labelSortDesc.classList.add('label-sorter');
        $labelSortDesc.innerHTML = '▼';
        $labelSortDesc.append($radioSortDesc);

        let $contSorters = document.createElement('div');
        $contSorters.classList.add('cont-sorters')
        $contSorters.append($labelSortAsc);
        $contSorters.append($labelSortDesc);

        if (this.getAttribute('no-sorter')) {
            $contSorters.style.display = 'none';
        }

        return $contSorters;
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
     * @param {InputEvent} e 
     * @param {bool} isDesc 
     * @returns void
     */
    _sortClickCallback(e, isDesc) {
        if (this.endpoint) {
            this._requestRows(this.replaceBody);
            return;
        }

        let $sort = e.currentTarget;
        const colIdx = Array.prototype.indexOf.call(
            $sort.parentElement.parentElement.parentElement.parentElement.parentElement.children,
            $sort.parentElement.parentElement.parentElement.parentElement
        );

        let values = [];
        for (const row of this.$body.children) {
            values.push([row.children[colIdx].getAttribute('data'), row]);
        }

        let newOrder = isDesc
            ? Array.from(values).sort((a, b) => b[0].localeCompare(a[0]))
            : Array.from(values).sort((a, b) => a[0].localeCompare(b[0]));


        for (const row of newOrder) {
            this.$body.append(row[1]);
        }
    }

    /**
     * Creates and returns the `show more` button for pagination.
     * @returns {HTMLTableRowElement}
     */
    _renderButtonMore() {
        let $row = document.createElement('tr');
        $row.id = 'row-btn-more';
        let $cell = document.createElement('td');
        $cell.colSpan = '100';
        $cell.title = 'Mehr anzeigen';
        $cell.innerHTML = 'Mehr anzeigen';
        $cell.onclick = () => this._handlePagination();

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

            const options = this.options[colName];
            let optionMap = {};
            if (options != null) {
                const remap = this.remap[colName];
                for (const val of options) {
                    const mapped = remap[val];
                    if (mapped) {
                        optionMap[val] = mapped;
                    } else {
                        optionMap[val] = val;
                    }
                }
            }

            data.push({
                name: $column.getAttribute('column'),
                required: required,
                label: $column.querySelector('span').innerHTML,
                placeholder: $column.getAttribute('default'),
                pattern: $column.getAttribute('pattern'),
                hidden: hidden,
                options: optionMap,
            })
        }

        /** @type {HeliumFormDialog} */
        let $dialog = document.createElement('he-form-dialog');
        $dialog.renderRows(data);

        $dialog.setAttribute('endpoint', this.endpoint);
        $dialog.onsubmit = (evt) => this.formEditBeforeSubmitCallback.bind(this)(evt);
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
        $row.onclick = (e) => this._rowClickCallback.bind(this)(e);

        for (let $column of this._getColumns()) {
            const colName = $column.getAttribute('column');
            let val = data[colName] ?? '';
            let text = val;
            let $cell = document.createElement('td');

            const colType = $column.getAttribute('type');
            switch (colType) {
                case 'check':
                    let $inpCheck = document.createElement('he-check');
                    $inpCheck.name = 'rows[]'
                    $inpCheck.value = data['id'] ?? '';
                    $inpCheck.classList.add('check-row');
                    $cell.append($inpCheck);
                    break;
                case 'edit':
                    $cell.addEventListener('click', () => this._showDialogEdit.bind(this)($row))
                    $cell.innerHTML = 'E';
                    break;
                case 'hidden':
                    $cell.style.display = 'none';
                // no break
                default:
                    $cell.setAttribute('data', val);
                    $cell.innerHTML = this._renderText($column, text);
                    $cell.title = val;
                    let colors = this.rowColors[colName];
                    if (colors) {
                        let color = colors[val];
                        if (color) {
                            $row.style.cssText = `--he-table-row-bg: ${color}`;
                        }
                    }

                    break;
            }

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
        if (this.endpoint == null) {
            return;
        }

        this.loading = true;

        let formData = new FormData(this.$form);

        if (this.pagination != null) {
            formData.append('offset', this.offset)
            formData.append('count', this.pagination + 1);
        }

        fetch(this.endpoint + '/?' + new URLSearchParams(formData).toString(), {
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
      * Returns the *text* representation of a value depending on the data type.
      * @param {HTMLTableCellElement} $column 
      * @param {string} val 
      * @returns string
      */
    _renderText($column, val) {
        let text = val;
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

        const colRemap = this.remap[$column.getAttribute('column')];
        if (colRemap) {
            const valRemap = colRemap[val];
            if (valRemap) {
                text = valRemap;
            }
        }

        return text;
    }

    _renderTable() {
        const shadow = this.shadowRoot;

        this.id = this.id == ''
            ? 'he-table-' + Math.floor(Math.random() * (1e10 + 1))
            : this.id;

        let $table = document.createElement('table');

        this.$form = document.createElement('form');
        this.$form.id = "form-tbl";
        this.$form.append($table);

        shadow.append(this.$form);

        let $rowFilters = document.createElement('tr');
        let $rowColNames = document.createElement('tr');

        const columns = this.querySelectorAll('th');
        for (let $column of columns) {
            let colName = $column.getAttribute('column') ?? $column.innerText;
            //$column.style.maxWidth = `var(--he-table-col-max-width-${colName}, --he-table-col-max-width)`;
            //$column.style.width = `var(--he-table-col-width-${colName}, unset)`;

            const colType = $column.getAttribute('type');
            switch (colType) {
                case 'check':
                    this.$checkAll = document.createElement('he-check');
                    this.$checkAll.id = 'check-all';
                    this.$checkAll.onchange = (e) => this._checkAllCheckCallback.bind(this)(e);
                    let $cellCheckAll = document.createElement('th');
                    $cellCheckAll.setAttribute('type', 'check');
                    $cellCheckAll.append(this.$checkAll);
                    $rowColNames.append($cellCheckAll);
                    continue;
                case 'edit':
                case 'delete':
                case 'duplicate':
                    let $cell = document.createElement('th');
                    $cell.setAttribute('type', colType);
                    $rowColNames.append($cell);
                    continue;
            }

            let $contHeaderCell = document.createElement('div');
            let $contFilter = document.createElement('div');
            $contFilter.classList.add('cont-filter')
            $contHeaderCell.append($contFilter);

            let $spanName = document.createElement('span');
            $spanName.innerHTML = $column.innerHTML.trim();
            $spanName.classList.add('span-colname');
            $column.innerHTML = '';
            $contFilter.append($spanName);

            const sort = $column.getAttribute('sort');
            let $contSorters = this._renderSorters(colName, sort);
            $column.setAttribute('column', colName);
            $contHeaderCell.append($contSorters);
            $column.append($contHeaderCell);
            $rowColNames.append($column);

            if ($column.getAttribute('type') === 'hidden') {
                $column.style.display = 'none';
            }

            try {
                this.remap[colName] = JSON.parse($column.getAttribute('remap'));
            } catch (error) {
                throw new Error('The provided remap is not valid JSON!');
            }

            try {
                this.rowColors[colName] = JSON.parse($column.getAttribute('row-color'));
            } catch (error) {
                throw new Error('The provided row-color is not valid JSON!');
            }

            //const options = this._getColumnOptions($column);
            const options = $column.getAttribute('options');

            if (options) {
                try {
                    this.options[colName] = JSON.parse(options);
                } catch (error) {
                    throw new Error('The provided options are not valid JSON!');
                }

                let $selFilter = document.createElement('select');
                $selFilter.id = 'filter-' + colName;
                $selFilter.name = colName;
                $selFilter.classList.add('inp-filter');
                $selFilter.onchange = (e) => this._filterChangeCallback(e);
                let $optionEmpty = document.createElement('option');
                $optionEmpty.value = '';
                $selFilter.append($optionEmpty);

                for (const val of this.options[colName]) {
                    const text = this._renderText($column, val);
                    let $option = document.createElement('option');
                    $option.innerHTML = text;
                    $option.value = val;
                    $selFilter.append($option);
                }
                if (this.getAttribute('no-filter')) {
                    $spanName.style.position = 'unset';
                    $inpFilter.style.display = 'none';
                }
                $contFilter.prepend($selFilter);
            } else {
                let $inpFilter = document.createElement('input');
                $inpFilter.id = 'filter-' + colName;
                $inpFilter.type = 'text';
                $inpFilter.name = colName;
                $inpFilter.autocomplete = 'off';
                $inpFilter.placeholder = ' ';
                $inpFilter.classList.add('inp-filter');
                $inpFilter.value = $column.getAttribute('filter') ?? '';
                $inpFilter.onchange = (e) => this._filterChangeCallback(e);
                if (this.getAttribute('no-filter')) {
                    $spanName.style.position = 'unset';
                    $inpFilter.style.display = 'none';
                }
                $contFilter.prepend($inpFilter);
            }
        }

        let $tHead = document.createElement('thead');
        $tHead.append($rowColNames);
        $tHead.append($rowFilters);
        $table.append($tHead);

        this.$body = document.createElement('tbody');

        const rows = this.querySelectorAll('tr:has(td)');
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
        $table.append(this.$body);

        this.$diagEdit = this._renderDialogEdit();
        shadow.append(this.$diagEdit);
        this.innerHTML = '';
    }

    /**
     * 
     * @param {InputEvent} e
     * @returns void
     */
    _rowClickCallback(e) {
        const $row = e.currentTarget;
        if (this.$checkAll) {
            let checked = this.$body.querySelectorAll('.check-row:state(checked)');

            if (!e.target.classList.contains('check-row')) {
                for (let check of checked) {
                    check.checked = false;
                }

                $row.children[0].children[0].checked = true;
            }

            checked = this.$body.querySelectorAll('.check-row:state(checked)');
            this._updateCheckAll(checked);
            this._updateExternElements(checked);
        } else {
            const $rowOld = this.$body.querySelector('tr[selected]');
            if ($rowOld) {
                $rowOld.removeAttribute('selected');
            }
            $row.setAttribute('selected', '');
            this._updateExternElements([$row]);
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
            this.internals.setFormValue(JSON.stringify(this.value));
        }

        const evt = new CustomEvent('check', {
            detail: {
                numRows: checked.length,
            }
        })
        this.dispatchEvent(evt);

        const oncheck = eval(this.oncheck);
        if (typeof oncheck === 'function') {
            oncheck.call(this, evt);
        }

        for (const elem of document.querySelectorAll(`[he-table-notify="#${this.id}"]`)) {
            elem.setAttribute('he-table-checked', checked.length);
        }
    }
}

if (!customElements.get('he-table')) {
    customElements.define("he-table", HeliumTable);
}
