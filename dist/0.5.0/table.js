import './form_dialog.js';
import './check.js';
import './toast.js';
import './button.js';
import './input.js';
import './dialog.js';
import './select.js';
import './utils-BGzlNXdX.js';

const sheet = new CSSStyleSheet();sheet.replaceSync(":host {\r\n    --he-table-row-bg: 0 0% 100%;\r\n    overflow: auto;\r\n    width: fit-content;\r\n}\r\n\r\n:host::-webkit-scrollbar {\r\n    width: 10px !important;\r\n}\r\n\r\n:host::-webkit-scrollbar-thumb {\r\n    background-color: darkgrey !important;\r\n    border-radius: 10px !important;\r\n}\r\n\r\ntable {\r\n    border-spacing: 0;\r\n    border-collapse: separate;\r\n    border-radius: var(--he-table-radius, 4px);\r\n}\r\n\r\nthead {\r\n    position: sticky;\r\n    top: 1px;\r\n    z-index: 2;\r\n}\r\n\r\nthead th {\r\n    background-color: var(--he-table-clr-bg-header, white);\r\n    color: var(--he-table-clr-fg-header, black);\r\n    font-weight: 500;\r\n    padding: 7px 12px;\r\n    text-align: center;\r\n    vertical-align: middle;\r\n    text-wrap: nowrap;\r\n    width: 0;\r\n    border-bottom: 1px solid grey;\r\n}\r\n\r\nthead th:hover .label-sorter {\r\n    opacity: 0.5;\r\n}\r\n\r\nthead th div {\r\n    display: flex;\r\n    align-items: center;\r\n    gap: 0.7rem;\r\n    justify-content: space-between;\r\n}\r\n\r\nthead td {\r\n    background-color: #0082b4;\r\n    padding: 0px 4px 8px 4px;\r\n    width: 0;\r\n\r\n}\r\n\r\nthead td:first-child {\r\n    display: flex;;\r\n    align-items: center;;\r\n    padding: 3px 15px;\r\n    border-radius: 0;\r\n    width: fit-content;\r\n}\r\n\r\nthead td:last-child {\r\n    border-radius: 0;\r\n    padding-right: 15px;\r\n}\r\n\r\nthead select {\r\n    padding: 0px 3px;\r\n}\r\n\r\nthead a {\r\n    color: rgba(255, 255, 255, 0.5411764706);\r\n    padding-left: 5px;\r\n\r\n}\r\n\r\nthead a:hover {\r\n    color: white;\r\n}\r\n\r\nthead .cont-filter {\r\n    position: relative;    \r\n    width: 100%;\r\n}\r\n\r\nthead .span-colname {\r\n    position: absolute;\r\n    left: 0.3rem;\r\n    pointer-events: none;\r\n    transition: 0.1s ease all;\r\n    top: 0px;\r\n    font-weight: 600;\r\n}\r\n\r\nthead .inp-filter {\r\n    margin: 0;\r\n    padding: 1px 5px;\r\n    font-size: 0.9rem;\r\n    font-weight: 500;\r\n    background-color: transparent;\r\n    outline: none;\r\n    border: 0;\r\n    color: black;\r\n    width: 100%;\r\n    -webkit-appearance: none;\r\n    -moz-appearance: none;\r\n    appearance: none;\r\n    text-indent: 1px;\r\n}\r\n\r\ntbody tr:last-child td:first-child {\r\n    border-bottom-left-radius: var(--he-table-radius, 4px);\r\n}\r\ntbody tr:last-child td:last-child {\r\n    border-bottom-right-radius: var(--he-table-radius, 4px);\r\n}\r\nthead tr:first-child th:first-child {\r\n    border-top-left-radius: var(--he-table-radius, 4px);\r\n    padding-top: 14px;\r\n}\r\nthead tr:first-child th:last-child {\r\n    border-top-right-radius: var(--he-table-radius, 4px);\r\n}\r\n\r\nthead .inp-filter:focus,\r\n.cont-filter input:not(:placeholder-shown),\r\n.cont-filter select:has(option:checked:not([value=\"\"])) {\r\n    transform: translateY(7px);\r\n    font-weight: 600;\r\n    border-bottom: 0.1rem solid darkgrey;\r\n    padding: 4px 5px;\r\n    padding-bottom: 1px;\r\n}\r\n\r\nthead .inp-filter:focus + .span-colname, \r\n.cont-filter input:not(:placeholder-shown) + .span-colname,\r\n.cont-filter select:has(option:checked:not([value=\"\"])) + .span-colname {\r\n    transform: translateY(-5px);\r\n    font-size: 0.7rem;\r\n    opacity: 1;\r\n}\r\n\r\ntbody {\r\n    min-height: 15px;\r\n}\r\n\r\ntbody tr {\r\n    background-color: hsl(var(--he-table-row-bg));\r\n}\r\n\r\ntbody tr:nth-child(even) {\r\n    filter: brightness(0.97);\r\n}\r\n\r\ntbody tr:hover {\r\n    filter:brightness(0.93);\r\n}\r\n\r\ntbody td {\r\n    text-wrap: nowrap;\r\n    overflow: hidden;\r\n    text-overflow: ellipsis;\r\n    max-width: 400px;\r\n    padding: 5px 15px;\r\n    vertical-align: middle;\r\n    width: 0;\r\n}\r\n\r\ntbody td > * {\r\n    filter: unset;\r\n}\r\n\r\ntbody td:first-child {\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n    width: unset;\r\n}\r\n\r\ntbody td xmp {\r\n    margin: 0;\r\n    overflow: hidden;\r\n    text-overflow: ellipsis;\r\n}\r\n\r\ntbody #row-btn-more {\r\n    background-color: var(--he-table-clr-bg-more, white);\r\n    color: var(--he-table-clr-fg-more, black);\r\n    cursor: pointer;\r\n    text-align: center;\r\n}\r\n\r\ntbody #row-btn-more td:hover {\r\n    border-color: grey;\r\n    background-color: whitesmoke;\r\n}\r\n\r\ntbody #row-btn-more td {\r\n    padding: 0.4rem;\r\n    border: 1px solid darkgrey;\r\n    display: table-cell;\r\n}\r\n\r\n.cont-sorters {\r\n    display: inline-flex;\r\n    flex-direction: column;\r\n    font-size: 0.7rem;\r\n    gap: 0;\r\n    cursor: pointer;\r\n}\r\n\r\n.label-sorter {\r\n    opacity: 0;\r\n}\r\n\r\nthead th div .label-sorter:hover {\r\n    opacity: 1;\r\n}\r\n\r\nthead th div .label-sorter:has(input:checked) {\r\n    opacity: 1;\r\n}\r\n\r\n.label-sorter input {\r\n    display: none;\r\n}\r\n\r\ntable[loading] {\r\n    pointer-events: none;\r\n    cursor: no-drop;\r\n}\r\n\r\ntable[loading] tbody {\r\n    position: relative;\r\n}\r\n\r\ntable[loading] tbody::after {\r\n    content: \"\";\r\n    position: absolute;\r\n    height: 100%;\r\n    width: 100%;\r\n    top: 0;\r\n    left: 0;\r\n    right: 0;\r\n    bottom: 0;\r\n    margin: auto;\r\n    background: linear-gradient(-90deg, #dbd8d8 0%, #fcfcfc 50%, #dbd8d8 100%);\r\n    background-size: 400% 400%;\r\n    animation: pulse 1.2s ease-in-out infinite;\r\n}\r\n\r\n@keyframes pulse {\r\n    0% {\r\n        background-position: 0% 0%\r\n    }\r\n    100% {\r\n        background-position: -135% 0%\r\n    }\r\n}\r\n\r\nhe-form-dialog {\r\n    --he-form-dialog-width: 350px;\r\n}\r\n");

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
class HeliumTable extends HTMLElement {
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
        };

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
                    });
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
        };

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
    _getColumns(dataOnly=false) {
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
        $contSorters.classList.add('cont-sorters');
        $contSorters.append($labelSortAsc);
        $contSorters.append($labelSortDesc);

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
            });
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
                    $inpCheck.name = 'rows[]';
                    $inpCheck.value = data['id'] ?? '';
                    $inpCheck.classList.add('check-row');
                    $cell.append($inpCheck);
                    break;
                case 'edit':
                    $cell.addEventListener('click', () => this._showDialogEdit.bind(this)($row));
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
            formData.append('offset', this.offset);
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
            $contFilter.classList.add('cont-filter');
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
                const column = columns[i];
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
            let numChecked = checked.length;

            if (!e.target.classList.contains('check-row')) {
                for (let check of checked) {
                    check.checked = false;
                }

                $row.children[0].children[0].checked = true;
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
        } else {
            const $rowOld = this.$body.querySelector('tr[selected]');
            if ($rowOld) {
                $rowOld.removeAttribute('selected');
            }
            $row.setAttribute('selected', '');
            this._updateExternElements([$row]);
        }
    }

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
        });
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

export { HeliumTable };
