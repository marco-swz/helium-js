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
 *   - All filter value in the form `<columnName>=<filterValue>` 
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
 *
 * @element he-table
 *
 * @attr {?string} endpoint - The endpoint for table operations. 
 * @attr {?string} pagination - The amount rows for each pagination step
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
    static observedAttributes = [
        'endpoint',
        'pagination',
    ];

    /** @type {?string} */
    endpoint;
    /** @type {HeliumCheck} */
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

    constructor() {
        super();
        let shadow = this.attachShadow({ mode: "open" });

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

    connectedCallback() {
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

            let $contHeaderCell = document.createElement('div');
            let $contFilter = document.createElement('div');
            $contFilter.classList.add('cont-filter')
            $contHeaderCell.append($contFilter);

            let $spanName = document.createElement('span');
            $spanName.innerHTML = $column.innerHTML.trim();
            $spanName.classList.add('span-colname');
            $column.innerHTML = '';
            $contFilter.append($spanName);

            let $contSorters = this._renderSorters(colName);
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
                $contFilter.prepend($inpFilter);
            }
        }

        this.$checkAll = document.createElement('he-check');
        this.$checkAll.id = 'check-all';
        this.$checkAll.onchange = (e) => this._checkAllCheckCallback.bind(this)(e);

        let cellCheckAll = document.createElement('th');
        cellCheckAll.append(this.$checkAll);
        $rowColNames.prepend(cellCheckAll);

        let tHead = document.createElement('thead');
        tHead.append($rowColNames);
        tHead.append($rowFilters);
        $table.append(tHead);

        this.$body = document.createElement('tbody');

        const rows = this.querySelectorAll('tr:has(td)');
        for (const row of rows) {
            let rowData = {};
            for (let i = 0; i < columns.length; ++i) {
                const cell = row.children[i];
                const column = columns[i]
                const data = cell.getAttribute('data') ?? cell.innerText;
                const colName = column.getAttribute('column') ?? column.innerText;
                rowData[colName] = data;
            }
            let $rowRendered = this._renderRow(rowData);
            this.$body.append($rowRendered);
        }
        $table.append(this.$body);

        this.$diagEdit = this._renderDialogEdit();
        shadow.append(this.$diagEdit);
        this.innerHTML = '';

        for (let $cont of this.$form.querySelectorAll('.cont-filter')) {
            let $input = $cont.querySelector('.span-colname');
            let $filter = $cont.querySelector('.inp-filter');
            $filter.style.minWidth = $input.offsetWidth + 'px';
        }

        this._requestRows(this.replaceBody);
        this._updateExternElements([]);
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

        this.$checkAll.checked = false;
        this.$checkAll.indeterminate = false;

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

        let columns = this._getColumns();
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
    }

    showDialogEdit() {
        let $check = this.shadowRoot.querySelector('.check-row:state(checked)');
        if ($check == null) {
            throw new Error('No row selected');
        }

        let $row = $check.parentElement.parentElement;
        let data = this._getRowData($row, true);

        this.$diagEdit.setValues(data);
        this.dataOld = data;
        this.idsEdit = [$row.id];
        this.editRequestType = 'PATCH';
        this.$diagEdit.setAttribute('title-text', 'Bearbeiten');
        this.$diagEdit.showModal();
    }

    showDialogDuplicate() {
        let $check = this.shadowRoot.querySelector('.check-row:state(checked)');
        if ($check == null) {
            throw new Error('No row selected');
        }

        let row = $check.parentElement.parentElement;
        let data = this._getRowData(row, true);

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
        const $checks = this.$body.querySelectorAll('.check-row');

        if (this.$checkAll.checked) {
            for (const check of $checks) {
                check.checked = true;
            }
            this._updateExternElements($checks);
        } else {
            for (const check of $checks) {
                check.checked = false;
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
        const filterValue = $filter.value.toLowerCase();
        const colIdx = Array.prototype.indexOf.call(
            $filter.parentElement.parentElement.parentElement.parentElement.children,
            $filter.parentElement.parentElement.parentElement
        );
        for (const $row of this.$body.children) {
            const data = $row.children[colIdx].getAttribute('data');
            let hideMask = $row.getAttribute('mask') ?? 0;

            if (data.toLowerCase().includes(filterValue)) {
                // Clear bit for column filter
                hideMask &= ~1 << colIdx;
            } else {
                // Set bit bit for column filter
                hideMask |= 1 << colIdx;
            }

            $row.setAttribute('mask', hideMask);

            if (hideMask > 0) {
                $row.style.visibility = 'collapse';
            } else {
                $row.style.visibility = null;
            }
        }
    }

    /**
     * @returns {NodeListOf<HTMLTableCellElement>}
     */
    _getColumns() {
        return this.shadowRoot.querySelectorAll('th[column]')
    }

    /**
     * @param {HTMLTableRowElement} row The table row to get the values from
     * @param {boolean} [returnDisplayValues=false] If `true`, returns the visible values instead of the `data` values
     * @returns {Object.<string, string>}
     */
    _getRowData(row, returnDisplayValues = false) {
        let data = {};
        let columns = this._getColumns();
        for (let i = 0; i < columns.length; ++i) {
            // `i+1` to skip the checkbox column
            let $cell = row.children[i + 1];
            let column = columns[i];

            const colName = column.getAttribute('column');
            data[colName] = returnDisplayValues
                ? $cell.innerText
                : $cell.getAttribute('data');
        }

        return data;
    }

    _handlePagination() {
        this.offset += this.pagination ?? 0;
        this._requestRows(this._appendRows);
    }

    /**
     * @param {string} colName The name of column for the sorters
     * @returns HTMLDivElement
     */
    _renderSorters(colName) {
        let $radioSortAsc = document.createElement('input');
        $radioSortAsc.type = 'radio';
        $radioSortAsc.name = 'sort';
        $radioSortAsc.value = colName + '-asc';
        $radioSortAsc.id = colName + '-asc';
        $radioSortAsc.onclick = (e) => this._sortClickCallback.bind(this)(e, false);

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

        let $labelSortDesc = document.createElement('label');
        $labelSortDesc.for = colName + 'desc';
        $labelSortDesc.classList.add('label-sorter');
        $labelSortDesc.innerHTML = '▼';
        $labelSortDesc.append($radioSortDesc);

        let $contSorters = document.createElement('div');
        $contSorters.classList.add('cont-sorters')
        $contSorters.append($labelSortAsc);
        $contSorters.append($labelSortDesc);

        return $contSorters;
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
        for (let $column of this._getColumns()) {
            let required = $column.getAttribute('required') === 'true';
            let hidden = $column.getAttribute('type') === 'hidden';
            if ($column.getAttribute('no-edit')) {
                hidden = true;
                required = false;
            }
            const colName = $column.getAttribute('column');
            const options = this.options[colName];

            data.push({
                name: $column.getAttribute('column'),
                required: required,
                label: $column.querySelector('span').innerHTML,
                placeholder: $column.getAttribute('default'),
                pattern: $column.getAttribute('pattern'),
                hidden: hidden,
                options: options,
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
        let $inpCheck = document.createElement('he-check');
        $inpCheck.name = 'rows[]'
        $inpCheck.value = data['id'] ?? '';
        $inpCheck.classList.add('check-row');
        let $cellCheck = document.createElement('td');
        $cellCheck.append($inpCheck);

        let $row = document.createElement('tr');
        $row.id = 'row-' + this.nextRowId++;
        $row.append($cellCheck);
        $row.onclick = (e) => this._rowClickCallback.bind(this)(e);

        for (let $column of this._getColumns()) {
            let colName = $column.getAttribute('column');
            let colType = $column.getAttribute('type');
            let $cell = document.createElement('td');
            let val = data[colName] ?? '';
            let text = val;

            $cell.innerHTML = this._renderText($column, text);
            $cell.setAttribute('data', val);
            $cell.title = val;

            if (colType === 'hidden') {
                $cell.style.display = 'none';
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


    /**
     * 
     * @param {InputEvent} e
     * @returns void
     */
    _rowClickCallback(e) {
        const row = e.currentTarget;
        let checked = this.$body.querySelectorAll('.check-row:state(checked)');
        let numChecked = checked.length;

        if (!e.target.classList.contains('check-row')) {
            for (let check of checked) {
                check.checked = false;
            }

            row.children[0].children[0].checked = true;
            numChecked = 1;
        }

        if (numChecked === 0) {
            this.$checkAll.checked = false;
            this.$checkAll.indeterminate = false;
        } else if (numChecked < this.$body.children.length) {
            this.$checkAll.checked = true;
            this.$checkAll.indeterminate = true;
        } else {
            this.$checkAll.indeterminate = false;
            this.$checkAll.checked = true;
        }

        checked = this.$body.querySelectorAll('.check-row:state(checked)');
        this._updateExternElements(checked);
    }

    _updateExternElements(checked) {
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

        for (const elem of document.querySelectorAll(`[he-table-checked="#${this.id}"]`)) {
            elem.classList.remove('.he-table-checked-none');
            elem.classList.remove('.he-table-checked-one');
            elem.classList.remove('.he-table-checked-multiple');
            switch (checked.length) {
                case 0:
                    elem.setAttribute('he-table-state', 'none');
                    break;
                case 1:
                    elem.setAttribute('he-table-state', 'one');
                    break;
                default:
                    elem.setAttribute('he-table-state', 'multiple');
                    break;
            }
        }
    }
}

if (!customElements.get('he-table')) {
    customElements.define("he-table", HeliumTable);
}
