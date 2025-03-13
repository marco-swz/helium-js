import './form_dialog.js';
import './check.js';
import './dialog.js';
import './toggle.js';
import './toast.js';
import './button.js';
import './input.js';
import './utils-BGzlNXdX.js';
import './select.js';

const sheet = new CSSStyleSheet();sheet.replaceSync(":host {\n    --he-table-row-backgroundColor: white;\n    --he-table-column-maxWidth: 300px;\n    --he-table-borderRadius: 4px;\n    --he-table-header-color: black;\n    --he-table-header-backgroundColor: white;\n    --he-table-header-borderBottom: 1px solid black;\n    --he-table-tableLayout: auto;\n    --he-table-width: fit-content;\n    --he-table-row-borderBottomColor: hsl(from var(--he-table-row-backgroundColor) h s calc(l - 20));\n\n    overflow: auto;\n    display: inline-block;\n    scrollbar-gutter: stable both-edges;\n    outline: none;\n}\n\n:host::-webkit-scrollbar {\n    width: 10px !important;\n}\n\n:host::-webkit-scrollbar-thumb {\n    background-color: darkgrey !important;\n    border-radius: 10px !important;\n}\n\ntable {\n    table-layout: var(--he-table-tableLayout);\n    width: var(--he-table-width);\n    border-spacing: 0;\n    border-collapse: separate;\n    border-radius: var(--he-table-borderRadius);\n}\n\nthead {\n    position: sticky;\n    top: -1px;\n    z-index: 2;\n}\n\nthead tr:last-child {\n    display: none;\n}\n\nthead th {\n    background-color: var(--he-table-header-backgroundColor);\n    color: var(--he-table-header-color);\n    font-weight: 500;\n    padding: 5px 0px 5px 15px;\n    text-align: center;\n    vertical-align: middle;\n    text-wrap: nowrap;\n    width: inherit;\n}\n\n:host([filter=below]) {\n    & thead th {\n        padding-bottom: 0;\n    }\n}\n\n:host([filter=button]) {\n    & thead tr:last-child {\n        display: none;\n    }\n\n    & thead {\n        & tr:first-child th {\n            border-bottom: var(--he-table-header-borderBottom);\n        }\n\n        & th:not([type=check]) {\n            padding: 5px 0 5px 5px;\n\n            & .cont-colname {\n                width: 100%;\n                background-color: var(--he-table-header-backgroundColor);\n                cursor: pointer;\n                border-radius: 4px;\n\n                &:hover {\n                    transition:\n                        background-color 0.2s;\n                    background-color: hsl(from var(--he-table-header-backgroundColor) h s calc(l - 7));\n                }\n            }\n\n            & .span-colname {\n                padding: 7px 10px;\n                width: fit-content;\n                text-align: left;\n                position: relative;\n\n                &::after {\n                    font-family: \"Font Awesome 5 Pro\";\n                    content: \"\";\n                    /* position: absolute; */\n                    width: 10px;\n                    height: 15px;\n                    color: steelblue;\n                    right: 5px;\n                    padding: 0 5px;\n                }\n            }\n\n            &.filter-active .span-colname::after {\n                content: \"\\f0b0\";\n                background-color: inherit;\n            }\n\n            &.desc-active .span-colname::after {\n                content: \"\\f354\";\n                background-color: inherit;\n            }\n\n            &.asc-active .span-colname::after {\n                content: \"\\f357\";\n                background-color: inherit;\n            }\n\n            &.asc-active.filter-active .span-colname::after {\n                content: \"\\f0b0\\f357\";\n                background-color: inherit;\n                padding-right: 15px;\n                padding-bottom: 2px;\n            }\n\n            &.desc-active.filter-active .span-colname::after {\n                content: \"\\f0b0\\f354\";\n                background-color: inherit;\n                padding-right: 15px;\n                padding-bottom: 2px;\n            }\n        }\n\n    }\n}\n\n#diag-column {\n    & #form-column {\n        display: flex;\n        gap: 10px;\n        flex-direction: column;\n        width: 250px;\n\n        & label {\n            font-weight: 500;\n            font-size: 16px;\n        }\n\n        & #sel-filter-column, & #inp-filter-column {\n            width: 100%;\n        }\n\n        #toggle-asc, #toggle-desc {\n            width: 40%;\n        }\n    }\n}\n\nthead th:hover .label-sorter {\n    opacity: 0.5;\n}\n\nthead th div {\n    display: flex;\n    align-items: center;\n    gap: 0.7rem;\n    justify-content: space-between;\n}\n\nthead td {\n    background-color: var(--he-table-header-backgroundColor);\n    width: 0;\n}\n\nthead td:has(#check-all) {\n    display: flex;\n    align-items: center;\n    padding: 6px 16px;\n    width: fit-content;\n}\n\nthead td:last-child {\n    border-radius: 0;\n    padding-right: 15px;\n}\n\nthead select {\n    padding: 0px 3px;\n}\n\nthead a {\n    color: rgba(255, 255, 255, 0.5411764706);\n    padding-left: 5px;\n\n}\n\nthead a:hover {\n    color: white;\n}\n\nthead .cont-filter {\n    position: relative;    \n    width: 100%;\n}\n\n.span-colname {\n    font-weight: 600;\n}\n\n:host([filter=below]) {\n    & thead tr:last-child {\n        display: table-row;\n\n        & td {\n            border-bottom: var(--he-table-header-borderBottom);\n        }\n    }\n}\n\n:host(:not([filter])), :host([filter=behind]) {\n    & thead tr:last-child {\n        display: none;\n    }\n\n    & thead tr:first-child th {\n        border-bottom: var(--he-table-header-borderBottom);\n    }\n}\n\n:host([filter=behind]) {\n    & .span-colname {\n        position: absolute;\n        left: 0.3rem;\n        pointer-events: none;\n        transition: 0.1s ease all;\n        top: 0px;\n    }\n\n    & .inp-filter:focus,\n    & .cont-filter input:not(:placeholder-shown),\n    & .cont-filter select:has(option:checked:not([value=\"\"])) {\n        transform: translateY(7px);\n        font-weight: 600;\n        border-bottom: 0.1rem solid darkgrey;\n        padding: 4px 5px;\n        padding-bottom: 1px;\n    }\n\n    & .inp-filter:focus + .span-colname, \n    & .cont-filter input:not(:placeholder-shown):not([hidden]) + .span-colname,\n    & .cont-filter select:has(option:checked:not([value=\"\"])) + .span-colname {\n        transform: translateY(-5px);\n        font-size: 0.7rem;\n        opacity: 1;\n    }\n}\n\nthead .inp-filter {\n    margin: 0;\n    padding: 1px 5px;\n    font-size: 12px;\n    font-weight: 500;\n    background-color: transparent;\n    outline: none;\n    border: 0;\n    color: black;\n    -webkit-appearance: none;\n    -moz-appearance: none;\n    appearance: none;\n    text-indent: 1px;\n}\n\ntbody tr:last-child td:first-child {\n    border-bottom-left-radius: var(--he-table-borderRadius);\n}\ntbody tr:last-child td:last-child {\n    border-bottom-right-radius: var(--he-table-borderRadius);\n}\nthead tr:first-child th:first-child {\n    border-top-left-radius: var(--he-table-borderRadius);\n}\nthead tr:first-child th:last-child {\n    border-top-right-radius: var(--he-table-borderRadius);\n}\n\nthead th[type=\"check\"] {\n    padding: 14px 0 6px 0;\n}\n\nthead tr.row-filter {\n    & .inp-filter {\n        background-color: whitesmoke;\n        border-bottom: 1px solid grey;\n        font-size: 14px;\n        padding: 2px 5px;\n        font-weight: 700;\n        width: 100%;\n    }\n\n    & td {\n        overflow: hidden;\n        padding: 2px 7px;\n        padding-top: 0;\n    }\n}\n\ntbody tr {\n    background-color: var(--he-table-row-backgroundColor);\n}\n\ntbody tr:hover {\n    background-color: hsl(from var(--he-table-row-backgroundColor) h s calc(l - 5));\n}\n\n/*tbody tr[selected] {*/\n    /*background-color: hsl(from var(--he-table-row-backgroundColor) h s calc(l - 7));*/\n/*}*/\n\ntbody td {\n    text-wrap: nowrap;\n    overflow: hidden;\n    text-overflow: ellipsis;\n    max-width: var(--he-table-column-maxWidth);\n    padding: 5px 15px;\n    vertical-align: middle;\n    width: 0;\n    border-bottom: 1px solid black;\n    border-bottom-color: var(--he-table-row-borderBottomColor);\n    height: 20px;\n}\n\ntbody td > * {\n    filter: unset;\n}\n\ntbody td:first-child:has(he-check) {\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    width: unset;\n}\n\ntbody tr[selected] td {\n    border-bottom-color: var(--he-table-row-selected-borderBottomColor, var(--he-table-row-borderBottomColor));\n}\n\n\ntbody td xmp {\n    margin: 0;\n    overflow: hidden;\n    text-overflow: ellipsis;\n}\n\ntbody #row-btn-more {\n    background-color: white;\n    color: black;\n    cursor: pointer;\n    text-align: center;\n}\n\ntbody #row-btn-more td:hover {\n    border-color: grey;\n    background-color: whitesmoke;\n}\n\ntbody #row-btn-more td {\n    padding: 0.4rem;\n    border: 1px solid darkgrey;\n    display: table-cell;\n}\n\ntbody #row-empty {\n    &:hover {\n        background-color: white;\n    }\n\n    & td {\n        border-bottom: 0;\n    }\n}\n\n.cont-sorters {\n    display: inline-flex;\n    flex-direction: column;\n    font-size: 0.7rem;\n    gap: 0;\n    cursor: pointer;\n}\n\n.label-sorter {\n    opacity: 0;\n}\n\nthead th div .label-sorter:hover {\n    opacity: 1;\n}\n\nthead th div .label-sorter:has(input:checked) {\n    opacity: 1;\n}\n\n.label-sorter input {\n    display: none;\n}\n\ntable[loading] {\n    pointer-events: none;\n    cursor: no-drop;\n}\n\ntable[loading] tbody {\n    position: relative;\n}\n\ntable[loading] tbody::after {\n    content: \"\";\n    position: absolute;\n    height: 100%;\n    width: 100%;\n    top: 0;\n    left: 0;\n    right: 0;\n    bottom: 0;\n    margin: auto;\n    background: linear-gradient(-90deg, #dbd8d8 0%, #fcfcfc 50%, #dbd8d8 100%);\n    background-size: 400% 400%;\n    animation: pulse 1.2s ease-in-out infinite;\n}\n\n@keyframes pulse {\n    0% {\n        background-position: 0% 0%\n    }\n    100% {\n        background-position: -135% 0%\n    }\n}\n\nhe-form-dialog {\n    --he-form-dialog-width: 350px;\n}\n");

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
 * @attr {null|'behind'|'below'} filter - If set, disables the filters for all rows.
 * @attr {on|off} require-filter - If set, at least one filter value has to be applied, otherwise no data is requested. This can be used to improve performance for time intensive queries.
 *
 * @attr {string} column - [th] The internal name of the column. This name needs to be unique for each column
 * @attr {?string} filter - [th] The filter value for a given column
 * @attr {?string} pattern - [th] The regex pattern to determine if the input for a given column is valid
 * @attr {'hidden'|'check'|'edit'|'number'|'date'|'datetime'|'text'|null} type - [th] The type of the column
 * @attr {?string} remap - [th] A mapping of old value to new value, in JSON format
 * @attr {?string} options - [th] A JSON list of allowed values. The selection is enforced via `select` elements
 * @attr {on|off} no-edit - [th] If set, the input field is hidden when editing a row
 * @attr {?string} default - [th] The default value for a column
 * @attr {'asc'|'desc'} sort - [th] The direction for sorting the table by the given column
 * @attr {Object.<string, string>} row-color - [th] If a cell of the column has the given value, the background color of the row is set to the provided value. The color has to be in HSL format and is passed to the CSS `hsl()` function.
 * @attr {on|off} strict-filter - [th] If set, the filter will only show rows, which match the exact filter value, no partial matches
 * @attr {?string} row-color - [th] A mapping of value to color in JSON format
 *
 * @listens HeliumFormDialog#he-dialog-show - Shows the dialog
 * @listens HeliumFormDialog#he-dialog-close - Closes the dialog
 *
 * @fires check - The selection of rows in the table has changed
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
    /** @type {ElementInternals} */
    internals;
    /** @type {Object.<string, ?Object.<string, string>>} */
    rowColors = {};
    /** @type {Object.<string, ?Object.<string, string>>} */
    rowStyles = {};
    /** @type {Object.<string, Object.<string, ?Object.<string, string>>>} */
    cellStyles = {};

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

        // All internal input events are not allowed to propagate outwards.
        // Only custom input events are triggered to the outside
        this.$form.addEventListener('input', (e) => e.stopPropagation());
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
     * Filters a column based on the provided value.
     * @param {string} colName The name of the column to filter (NOT the display name)
     * @param {string} filterValue The filter value
     * @param {boolean} [partial=false] Does not filter partial matches if set to `true`
     * @returns {Self}
     */
    filterColumn(colName, filterValue, partial = false) {
        let $col = this._columnFromName(colName);
        this._filterColumn($col, filterValue, partial);
        return this;
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
     * Returns a mapping of column name to display name
     * @returns {<Object.<string, string>}
     */
    getColumnNames() {
        const cols = this._getColumns(true);
        const colNames = [];
        for (const $col of cols) {
            const colName = $col.getAttribute('column');
            if (colName == null) {
                continue;
            }
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
            const key = keyColumn.map((x) => rowData[x]).join('-');
            rowMap[key] = $row;
        }

        const cols = this._getColumns(true);
        for (const entry of data) {
            const key = keyColumn.map((x) => entry[x]).join('-');
            let $row = rowMap[key];
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
                if (!(colName in entry)) {
                    continue;
                }

                const newVal = entry[colName] ?? '';
                let $cell = $row.cells[$col.cellIndex];
                $cell.setAttribute('data', newVal);
                const text = this._renderText($col, newVal);
                $cell.innerHTML = text;
                $cell.title = text;
                this._applyRowStyles($row, colName, newVal);
            }
            this._applyRowFilter($row, cols);
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
        this.$diagEdit.reset();
        let $check = this.shadowRoot.querySelector('.check-row:state(checked)');
        if ($check == null) {
            throw new Error('No row selected');
        }

        let $row = $check.parentElement.parentElement;
        this._showDialogEdit($row);
    }

    showDialogDuplicate() {
        this.$diagEdit.reset();
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
        let styles = this.cellStyles[colName];
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

    _applyColumnClickCallback() {
        const data = Object.fromEntries(new FormData(this.$diagColumn.querySelector('#form-column')).entries());
        this.disableRequest = true;
        let $col = this._columnFromName(data['column']);
        const filterVal = data['filter'] ?? data['filter-sel'];
        this._filterColumn($col, filterVal, true);
        this.disableRequest = false;
        this._sortColumn($col, data['sort']);
        this.$diagColumn.close();
    }

    /**
    * @param {HTMLTableRowElement} $row 
    * @param {string} $colName
    * @param {string} val
    * @returns {void}
    */
    _applyRowStyles($row, colName, val) {
        let styles = this.rowStyles[colName];
        if (styles) {
            let style = styles[val];
            if (style) {
                $row.style.cssText = style;
            } else {
                $row.style.cssText = '';
            }
        }
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
            const strict = $col.getAttribute('strict-filter') != null;
            const $filter = this.$form.querySelector(`.inp-filter[name="${$col.getAttribute('column')}"]`);
            if ($filter == null) {
                continue;
            }
            let filterValue = $filter.value;

            const data = $row.children[$col.cellIndex].getAttribute('data');

            filterValue = filterValue.toLowerCase();
            const isMatch = strict
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
            $check.checked = false;
        } else {
            //$row.hidden = false;
            $row.style.visibility = null;
        }

        if ($check.checked) {
            return $check;
        }
        return null;
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

    /**
     * @param {HTMLTableCellElement} $column 
     */
    _colClickCallback($column) {
        this.$diagColumn.reset();
        const colName = $column.getAttribute('column');
        const dispName = $column.querySelector('.span-colname').innerHTML;
        const filterVal = this.$form.querySelector('#filter-' + colName).value;
        const checkedDesc = this.$form.querySelector(`#${colName}-desc`).checked;
        const checkedAsc = this.$form.querySelector(`#${colName}-asc`).checked;
        let $inpFilter = this.$diagColumn.querySelector('#inp-filter-column');
        let $selFilter = this.$diagColumn.querySelector('#sel-filter-column');
        let valMap = this.remap[colName] ?? {};

        let options = this.options[colName];
        if (options != null) {
            options.sort(function(a, b) {
                return a.localeCompare(b);
            });

            options = Object.fromEntries(options.map(x => [x, valMap[x] ?? x]));
            options = { '': '', ...options };
            $selFilter.disabled = false;
            $selFilter.replaceOptions(options);
            $selFilter.value = filterVal;
            $selFilter.style.display = '';
            $inpFilter.style.display = 'none';
            $inpFilter.disabled = true;
            
        } else {
            $inpFilter.disabled = false;
            $inpFilter.value = filterVal;
            $inpFilter.select();
            $selFilter.disabled = true;
            $selFilter.style.display = 'none';
            $inpFilter.style.display = '';
        }

        this.$diagColumn.querySelector('#inp-colname-column').value = colName;
        this.$diagColumn.querySelector('#toggle-asc').checked = checkedAsc;
        this.$diagColumn.querySelector('#toggle-desc').checked = checkedDesc;
        this.$diagColumn.setAttribute('title-text', dispName);
        this.$diagColumn.show();
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


    _filterChangeCallback(e) {
        const $col = e.currentTarget.closest('th');
        this.offset = 0;

        if (this.endpoint != null) {
            this._requestRows(this.replaceBody);
            return;
        }


        this._applyFilters([$col]);
    }

    /**
     * Filters a column based on the provided value.
     * @param {HTMLTableCellElement} $column The column element
     * @param {string} filterValue The filter value
     * @param {boolean} [partial=false] Does not filter partial matches if set to `true`
     * @returns {Self}
     */
    _filterColumn($column, filterValue, partial) {
        const colName = $column.getAttribute('column');
        let $filter = this.$form.querySelector(`.inp-filter[name="${colName}"]`);
        $filter.value = filterValue;

        if (partial) {
            $column.removeAttribute('strict-filter');
        } else {
            $column.setAttribute('strict-filter', '');
        }

        if (filterValue === '') {
            $column.classList.remove('filter-active');
        } else {
            $column.classList.add('filter-active');
        }

        this._applyFilters([$column]);
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
            if (returnDisplayValues && ['hidden', 'check'].includes($column.getAttribute('type'))) {
                continue;
            }

            let $cell = $row.children[$column.cellIndex];

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

    _renderDialogColumn() {
        let $dialog = document.createElement('he-dialog');
        $dialog.id = 'diag-column';
        $dialog.setAttribute('title-text', 'Spalte');

        let $body = document.createElement('form');
        $body.slot = 'body';
        $body.id = 'form-column';
        $body.innerHTML = `
            <label>Sortierung</label>
            <div id="cont-sort-diag-col">
                <he-toggle id="toggle-asc" variant="outline" name="sort" value="asc">Aufsteigend</he-toggle>
                <he-toggle id="toggle-desc" variant="outline" name="sort" value="desc">Absteigend</he-toggle>
            </div>
            <label>Filter</label>
            <he-input id="inp-filter-column" name="filter"></he-input>
            <he-select id="sel-filter-column" name="filter-sel"></he-select>
            <he-input id="inp-colname-column" type="hidden" name="column"></he-input>
        `;
        $dialog.append($body);

        let $footer = document.createElement('div');
        $footer.slot = 'footer';

        let $btnApply = document.createElement('he-button');
        $btnApply.innerHTML = 'Anwenden';
        $btnApply.setAttribute('variant', 'primary');
        $btnApply.onclick = () => this._applyColumnClickCallback.bind(this)();
        $footer.append($btnApply);
        $dialog.append($footer);

        $dialog.addEventListener('keyup', (event) => {
            if (event.key === 'Enter') {
                $btnApply.click();
            }
        });
        return $dialog;
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
                    optionMap[val] = val;
                    if (remap == null) {
                        continue;
                    }

                    const mapped = remap[val];
                    if (mapped == null) {
                        continue;
                    }
                    optionMap[val] = mapped;
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
                case 'callback':
                    $cell.innerHTML = window[$column.getAttribute('onrender')](data) ?? '';
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

        let formData = new FormData(this.$form);

        let params = new URLSearchParams();
        for (const [key, value] of formData.entries()) {
            if (value.length === 0) {
                continue;
            }
            params.append(key, value);
        }

        const isNoFilter = params.size === 0 || (params.size === 1 && params.get('sort') != null);

        if (this.getAttribute('require-filter') && isNoFilter) {
            this.loading = false;
            callback.bind(this)([]);
            return;
        }

        if (this.pagination != null) {
            params.append('offset', this.offset);
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
        const options = $column.getAttribute('options');

        let $filter = null;
        if (options) {
            try {
                this.options[colName] = JSON.parse(options);
            } catch (error) {
                throw new Error('The provided options are not valid JSON!');
            }

            $filter = document.createElement('select');
            let $optionEmpty = document.createElement('option');
            $optionEmpty.value = '';
            $filter.append($optionEmpty);

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
            $filter.autocomplete = 'efase';
            $filter.placeholder = ' ';
        }

        $filter.onchange = (e) => this._filterChangeCallback(e);
        $filter.value = $column.getAttribute('filter') ?? '';
        $filter.id = 'filter-' + colName;
        $filter.name = colName;
        $filter.classList.add('inp-filter');

        return $filter;
    }

    _renderHead(columns) {
        let $rowFilters = document.createElement('tr');
        $rowFilters.classList.add('row-filter');
        let $rowColNames = document.createElement('tr');
        $rowColNames.classList.add('row-colName');

        for (let $column of columns) {
            let colName = $column.getAttribute('column') ?? $column.innerText;

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

            try {
                this.rowStyles[colName] = JSON.parse($column.getAttribute('row-style'));
            } catch (error) {
                throw new Error('The provided row-style is not valid JSON!');
            }

            try {
                this.cellStyles[colName] = JSON.parse($column.getAttribute('cell-style'));
            } catch (error) {
                throw new Error('The provided cell-style is not valid JSON!');
            }

            let $filterCell = document.createElement('td');
            $rowFilters.append($filterCell);

            const attrFilter = this.getAttribute('filter');

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
                    this.$checkAll.onchange = (e) => this._checkAllCheckCallback.bind(this)(e);
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

            let $filter = this._renderFilter($column, colName);
            if (attrFilter === 'behind') {
                let $contFilter = document.createElement('div');
                $contFilter.classList.add('cont-filter');
                $contHeaderCell.append($contFilter);
                $contFilter.prepend($filter);
                $contFilter.append($spanName);

            } else if (attrFilter === 'below') {
                $contHeaderCell.append($spanName);
                $filterCell.append($filter);

            } else if (attrFilter === 'button') {
                $contHeaderCell.append($spanName);
                $contHeaderCell.classList.add('cont-colname');
                $filterCell.append($filter);
                $contHeaderCell.addEventListener('click', () => this._colClickCallback.bind(this)($column));

            } else {
                $contHeaderCell.append($spanName);
                $filterCell.append($filter);
                $spanName.style.position = 'unset';
            }

            const sort = $column.getAttribute('sort');
            let $contSorters = this._renderSorters(colName, sort);
            $column.setAttribute('column', colName);
            $contHeaderCell.append($contSorters);

            $column.append($contHeaderCell);
            $rowColNames.append($column);

            //const options = this._getColumnOptions($column);
        }

        let $tHead = document.createElement('thead');
        $tHead.append($rowColNames);
        $tHead.append($rowFilters);

        return $tHead;
    }

    _renderTable() {
        const shadow = this.shadowRoot;
        const columns = this.querySelectorAll('th');

        this.id = this.id == ''
            ? 'he-table-' + Math.floor(Math.random() * (1e10 + 1))
            : this.id;

        let $table = document.createElement('table');

        this.$form = document.createElement('form');
        this.$form.id = "form-tbl";
        this.$form.append($table);

        shadow.append(this.$form);

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
        }
        $table.append(this.$body);

        this.$diagEdit = this._renderDialogEdit();
        shadow.append(this.$diagEdit);
        this.innerHTML = '';

        if (this.getAttribute('filter') === 'button') {
            this.$diagColumn = this._renderDialogColumn();
            shadow.append(this.$diagColumn);
        }
    }

    /**
     * 
     * @param {InputEvent} e
     * @returns void
     */
    _rowClickCallback(e) {
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

        if (dir != null) {
            let $elem = this.$form.querySelector('.asc-active');
            if ($elem != null) {
                $elem.classList.remove('asc-active');
            }
            $elem = this.$form.querySelector('.desc-active');
            if ($elem != null) {
                $elem.classList.remove('desc-active');
            }
        }

        if (dir === 'desc') {
            $column.classList.add('desc-active');
        } else if (dir === 'asc') {
            $column.classList.add('asc-active');
        }

        let $btnSort = this.$form.querySelector('input[name=sort]:checked');
        if ($btnSort != null) {
            $btnSort.checked = false;
        }

        if (dir != null) {
            const colName = $column.getAttribute('column');
            $column.querySelector(`#${colName}-${dir}`).checked = true;
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
     * @param {InputEvent} e 
     * @param {bool} isDesc 
     * @returns void
     */
    _sortClickCallback(e, isDesc) {
        /** @type {HTMLElement} */
        let $sort = e.currentTarget;
        let $col = $sort.closest('th');
        let dir = isDesc ? 'desc' : 'asc';
        this._sortColumn($col, dir);
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

        const evt = new CustomEvent('input', {
            detail: {
                numRows: checked.length,
            }
        });
        this.dispatchEvent(evt);
    }
}

if (!customElements.get('he-table')) {
    customElements.define("he-table", HeliumTable);
}

export { HeliumTable };
