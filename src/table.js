import { HeliumFormDialog } from './form_dialog.js';
import { HeliumCheck } from './check.js';
import sheet from './table.css';

export class HeliumTable extends HTMLElement {
    static observedAttributes = [
        'endpoint',
        'pagination',
    ];

    /** @type {?string} */
    endpoint;
    /** @type {HeliumCheck} */
    checkAll;
    /** @type {HTMLFormElement} */
    form;
    /** @type {HTMLFormElement} */
    formDialogEdit;
    /** @type {HTMLTableSectionElement} */
    body;
    /** @type {HeliumFormDialog} */
    diagEdit;
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

    constructor() {
        super();
        let shadow = this.attachShadow({ mode: "open" });

        shadow.adoptedStyleSheets = [sheet];
    }

    connectedCallback() {
        const shadow = this.shadowRoot;

        this.id = this.id == ''
            ? 'he-table-' + Math.floor(Math.random() * (1e10 + 1))
            : this.id;

        let table = document.createElement('table');

        this.form = document.createElement('form');
        this.form.id = "form-tbl";
        this.form.append(table);

        shadow.append(this.form);

        let rowFilters = document.createElement('tr');
        let rowColNames = document.createElement('tr');

        const columns = this.querySelectorAll('th');
        for (let column of columns) {
            let colName = column.getAttribute('column') ?? column.innerText;

            let contHeaderCell = document.createElement('div');
            let contFilter = document.createElement('div');
            contFilter.classList.add('cont-filter')
            contHeaderCell.append(contFilter);

            let spanName = document.createElement('span');
            spanName.innerHTML = column.innerHTML.trim();
            spanName.classList.add('span-colname');
            column.innerHTML = '';
            contFilter.append(spanName);

            let contSorters = this._renderSorters(colName);
            column.setAttribute('column', colName);
            contHeaderCell.append(contSorters);
            column.append(contHeaderCell);
            rowColNames.append(column);

            const options = this._getColumnOptions(column);

            if (options && options.length > 0) {
                let selFilter = document.createElement('select');
                selFilter.id = 'filter-' + colName;
                selFilter.name = colName;
                selFilter.classList.add('inp-filter');
                selFilter.onchange = (e) => this._filterChangeCallback(e);
                let optionEmpty = document.createElement('option');
                optionEmpty.value = '';
                selFilter.append(optionEmpty);
                for (const option of options) {
                    selFilter.append(option.cloneNode(true));
                }
                contFilter.prepend(selFilter);
            } else {
                let inpFilter = document.createElement('input');
                inpFilter.id = 'filter-' + colName;
                inpFilter.type = 'search';
                inpFilter.name = colName;
                inpFilter.autocomplete = 'off';
                inpFilter.placeholder = ' ';
                inpFilter.classList.add('inp-filter');
                inpFilter.value = column.getAttribute('filter') ?? '';
                inpFilter.onchange = (e) => this._filterChangeCallback(e);
                contFilter.prepend(inpFilter);
            }
        }

        this.checkAll = document.createElement('he-check');
        this.checkAll.id = 'check-all';
        this.checkAll.onchange = (e) => this._checkAllCheckCallback.bind(this)(e);

        let cellCheckAll = document.createElement('th');
        cellCheckAll.append(this.checkAll);
        rowColNames.prepend(cellCheckAll);

        let tHead = document.createElement('thead');
        tHead.append(rowColNames);
        tHead.append(rowFilters);
        table.append(tHead);

        this.body = document.createElement('tbody');

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
            let rowRendered = this._renderRow(rowData);
            this.body.append(rowRendered);
        }
        table.append(this.body);

        this.diagEdit = this._renderDialogEdit();
        shadow.append(this.diagEdit);
        this.innerHTML = '';

        for (let cont of this.form.querySelectorAll('.cont-filter')) {
            let input = cont.querySelector('.span-colname');
            let filter = cont.querySelector('.inp-filter');
            filter.style.minWidth = input.offsetWidth + 'px';
        }

        this._requestRows(this._replaceBody);
    }

    /**
     * @param {string} colName The name of column for the sorters
     * @returns HTMLDivElement
     */
    _renderSorters(colName) {
        let radioSortAsc = document.createElement('input');
        radioSortAsc.type = 'radio';
        radioSortAsc.name = 'sort';
        radioSortAsc.value = colName + '-asc';
        radioSortAsc.id = colName + '-asc';
        radioSortAsc.onclick = (e) => this._sortClickCallback.bind(this)(e, false);

        let labelSortAsc = document.createElement('label');
        labelSortAsc.for = colName + 'asc';
        labelSortAsc.innerHTML = '▲';
        labelSortAsc.classList.add('label-sorter');
        labelSortAsc.append(radioSortAsc);

        let radioSortDesc = document.createElement('input');
        radioSortDesc.type = 'radio';
        radioSortDesc.name = 'sort';
        radioSortDesc.value = colName + '-desc';
        radioSortDesc.id = colName + '-desc';
        radioSortDesc.onclick = (e) => this._sortClickCallback.bind(this)(e, true);

        let labelSortDesc = document.createElement('label');
        labelSortDesc.for = colName + 'desc';
        labelSortDesc.classList.add('label-sorter');
        labelSortDesc.innerHTML = '▼';
        labelSortDesc.append(radioSortDesc);

        let contSorters = document.createElement('div');
        contSorters.classList.add('cont-sorters')
        contSorters.append(labelSortAsc);
        contSorters.append(labelSortDesc);

        return contSorters;
    }

    /**
     * @param {HTMLElement} column
     * @returns {?HTMLCollection<HTMLOptionElement>}
     */
    _getColumnOptions(column) {
        let selector = column.getAttribute('options');

        /** @type {HTMLDataListElement} */
        let list = document.querySelector('datalist' + selector);
        return list == null ? null : list.children;
    }


    /**
     * @param {InputEvent} e 
     * @param {bool} isDesc 
     * @returns void
     */
    _sortClickCallback(e, isDesc) {
        if (this.endpoint) {
            this._requestRows(this._replaceBody);
            return;
        }

        let sort = e.currentTarget;
        const colIdx = Array.prototype.indexOf.call(
            sort.parentElement.parentElement.parentElement.parentElement.parentElement.children,
            sort.parentElement.parentElement.parentElement.parentElement
        );

        let values = [];
        for (const row of this.body.children) {
            values.push([row.children[colIdx].getAttribute('data'), row]);
        }

        let newOrder = isDesc
            ? Array.from(values).sort((a, b) => b[0].localeCompare(a[0]))
            : Array.from(values).sort((a, b) => a[0].localeCompare(b[0]));


        for (const row of newOrder) {
            this.body.append(row[1]);
        }
    }

    _filterChangeCallback(e) {
        this.offset = 0;

        if (this.endpoint != null) {
            this._requestRows(this._replaceBody);
            return;
        }

        const filter = e.currentTarget;
        const filterValue = filter.value.toLowerCase();
        const colIdx = Array.prototype.indexOf.call(
            filter.parentElement.parentElement.parentElement.parentElement.children,
            filter.parentElement.parentElement.parentElement
        );
        for (const row of this.body.children) {
            const data = row.children[colIdx].getAttribute('data');
            let hideMask = row.getAttribute('mask') ?? 0;

            if (data.toLowerCase().includes(filterValue)) {
                // Clear bit for column filter
                hideMask &= ~1 << colIdx;
            } else {
                // Set bit bit for column filter
                hideMask |= 1 << colIdx;
            }

            row.setAttribute('mask', hideMask);

            if (hideMask > 0) {
                row.style.visibility = 'collapse';
            } else {
                row.style.visibility = null;
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
      * TODO(marco): Maybe remove
      * Returns the *text* representation of a value depending on the data type.
      * @param {string} type 
      * @param {string} val 
      * @returns string
      */
    _renderCellText(type, val) {
        switch (type) {
            case 'date':
                return val.split('-').reverse().join('.');
            case 'datetime':
                val = val.replace('T', ' ');
                const [date, time] = val.split(' ');
                return date.split('-').reverse().join('.') + ' ' + time;
            default:
                return val;
        }
    }

    /**
     * @param {Object.<string, string>} data 
     * @returns {HTMLTableRowElement}
     */
    _renderRow(data) {
        let inpCheck = document.createElement('he-check');
        inpCheck.name = 'rows[]'
        inpCheck.value = data['id'] ?? '';
        inpCheck.classList.add('check-row');
        let cellCheck = document.createElement('td');
        cellCheck.append(inpCheck);

        let row = document.createElement('tr');
        row.id = 'row-' + this.nextRowId++;
        row.append(cellCheck);
        row.onclick = (e) => this._rowClickCallback.bind(this)(e);

        for (let column of this._getColumns()) {
            let colName = column.getAttribute('column');
            let colType = column.getAttribute('type');
            let cell = document.createElement('td');
            let val = data[colName] ?? '';
            cell.innerHTML = this._renderCellText(colType, val);
            cell.setAttribute('data', val);
            cell.title = val;

            row.append(cell);
        }

        return row;
    }

    showDialogNew() {
        this.diagEdit.reset();
        this.editRequestType = 'POST';
        this.diagEdit.setAttribute('he-title', 'Erstellen');
        this.diagEdit.showModal();
    }

    showDialogEdit() {
        let check = this.shadowRoot.querySelector('.check-row:state(checked)');
        if (check == null) {
            throw new Error('No row selected');
        }

        let row = check.parentElement.parentElement;
        let data = this._getRowData(row, true);

        this.diagEdit.setValues(data);
        this.dataOld = data;
        this.idsEdit = [row.id];
        this.editRequestType = 'PATCH';
        this.diagEdit.setAttribute('he-title', 'Bearbeiten');
        this.diagEdit.showModal();
    }

    showDialogDuplicate() {
        let check = this.shadowRoot.querySelector('.check-row:state(checked)');
        if (check == null) {
            throw new Error('No row selected');
        }

        let row = check.parentElement.parentElement;
        let data = this._getRowData(row, true);

        this.diagEdit.setValues(data);
        this.editRequestType = 'POST';
        this.diagEdit.setAttribute('he-title', 'Duplizieren');
        this.diagEdit.showModal();
    }

    loading(enable = true) {
        if (enable) {
            this.body.parentElement.setAttribute('loading', true);
        } else {
            this.body.parentElement.removeAttribute('loading');
        }
    }

    deleteChecked(confirm = true) {
        let checks = this.shadowRoot.querySelectorAll('.check-row:state(checked)');

        let request = {
            data: [],
        }

        for (let check of checks) {
            let row = check.closest('tr');
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
                .catch(errorMsg => { console.log(errorMsg); });
            return;
        }

        for (const check of checks) {
            check.parentElement.parentElement.remove();
        }
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
            let cell = row.children[i + 1];
            let column = columns[i];

            const colName = column.getAttribute('column');
            data[colName] = returnDisplayValues
                ? cell.innerText
                : cell.getAttribute('data');
        }

        return data;
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

        this.loading();

        let formData = new FormData(this.form);

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
            .catch(errorMsg => { console.log(errorMsg); })
            .finally(() => this.loading(false));

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

    /**
     * Replaces the row with the provided ID with new data.
     * @param {string} rowId The HTML id of the row to update
     * @throws If no row is found with this ID
     */
    replaceRowData(rowId, newData) {
        let row = this.body.querySelector('#' + rowId);
        if (row == null) {
            throw new Error('No row found with the row ID ' + rowId);
        }

        let columns = this._getColumns();
        for (let i = 0; i < columns.length; ++i) {
            const colName = columns[i].getAttribute('column');
            const colType = columns[i].getAttribute('type') ?? 'text';
            const val = newData[colName];
            if (val == null) {
                continue;
            }

            // `+1` because of checkbox
            let cell = row.children[i + 1];
            cell.setAttribute('data', val);
            cell.innerHTML = this._renderCellText(colType, val);
        }
    }

    /**
     * @param {array<Object.<string, string>>} data 
     * @returns {HTMLDialogElement}
     */
    _replaceBody(data) {
        this.body.innerHTML = '';
        this.offset = 0;

        this.checkAll.checked = false;
        this.checkAll.indeterminate = false;

        let renderMore = false;
        if (this.pagination != null && data.length > this.pagination) {
            data.pop();
            renderMore = true;
        }

        for (let rowData of data) {
            this.body.append(this._renderRow(rowData));
        }

        if (renderMore) {
            this.body.append(this._renderButtonMore());
        }
    }

    /**
     * Creates and returns the `show more` button for pagination.
     * @returns {HTMLTableRowElement}
     */
    _renderButtonMore() {
        let row = document.createElement('tr');
        row.id = 'row-btn-more';
        let cell = document.createElement('td');
        cell.colSpan = '100';
        cell.title = 'Mehr anzeigen';
        cell.innerHTML = 'Mehr anzeigen';
        cell.onclick = () => this._handlePagination();

        row.append(cell);
        return row;
    }

    _handlePagination() {
        this.offset += this.pagination ?? 0;
        this._requestRows(this._appendRows);
    }


    /**
     * @param {array<Object<string, string>>} rowData 
     */
    _appendRows(rowData) {
        if (this.pagination != null && rowData.length > this.pagination) {
            rowData.pop();
        }

        let rowMore = null;
        if (this.body.lastChild.id === 'row-btn-more') {
            rowMore = this.body.lastChild;
            this.body.removeChild(rowMore);
        }

        for (let row of rowData) {
            this.body.append(this._renderRow(row));
        }

        if (rowMore != null && rowData.length === this.pagination) {
            this.body.append(rowMore);
        }
    }

    _renderDialogEdit() {
        let data = [];
        for (let column of this._getColumns()) {
            const options = this._getColumnOptions(column);
            let optionValues = null;
            if (options && options.length > 0) {
                optionValues = [];
                for (const option of options) {
                    optionValues[option.value] = option.innerHTML;
                }
            }

            if (column.getAttribute('no-edit') === 'true') {
                continue;
            }

            data.push({
                name: column.getAttribute('column'),
                required: column.getAttribute('required') === 'true',
                label: column.querySelector('span').innerHTML,
                placeholder: column.getAttribute('default'),
                pattern: column.getAttribute('pattern'),
                options: optionValues,
            })
        }

        /** @type {HeliumFormDialog} */
        let dialog = document.createElement('he-form-dialog');
        dialog.renderRows(data);

        dialog.setAttribute('endpoint', this.endpoint);
        dialog.setAttribute('before-submit', `document.querySelector('#${this.id}').formEditBeforeSubmitCallback`);
        dialog.setAttribute('after-submit', `document.querySelector('#${this.id}').formEditAfterSubmitCallback`);
        return dialog;
    }

    /**
     * 
     * @param {RequestInit} request
     * @returns request
     */
    formEditBeforeSubmitCallback(request) {
        request.body = {
            data: [JSON.parse(request.body)],
        };

        if (this.dataOld != null) {
            request.body.old = [this.dataOld];
        }
        request.method = this.editRequestType;
        request.headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }

        request.body = JSON.stringify(request.body);
        return request;
    }


    /**
     * 
     * @param {Response} response
     * @returns void
     */
    formEditAfterSubmitCallback(response) {
        response.json().then(data => {
            switch (this.editRequestType) {
                case 'POST':
                    this._requestRows(this._replaceBody);
                    break;
                case 'PATCH':
                    data.forEach((entry, i) => {
                        const rowId = this.idsEdit[i];
                        this.replaceRowData(rowId, entry);
                    });
                    break;
            }
            this.diagEdit.close();
        });

    }

    /**
     * Callback when the checkbox on top has changed.
     * @returns void
     */
    _checkAllCheckCallback() {
        this.checkAll.indeterminate = false;

        for (const check of this.body.querySelectorAll('.check-row')) {
            if (this.checkAll.checked) {
                check.checked = true;
            } else {
                check.checked = false;
            }
        }

    }

    _updateExternElements() {
        for (const elem of document.querySelectorAll(`[he-table-checked="#${this.id}"]`)) {
            elem.classList.remove('.he-table-checked-none');
            elem.classList.remove('.he-table-checked-one');
            elem.classList.remove('.he-table-checked-multiple');
            switch (this.countChecked) {
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

    /**
     * 
     * @param {InputEvent} e
     * @returns void
     */
    _rowClickCallback(e) {
        const row = e.currentTarget;
        const checked = this.body.querySelectorAll('.check-row:state(checked)');
        let numChecked = checked.length;

        if (!e.target.classList.contains('check-row')) {
            for (let check of checked) {
                check.checked = false;
            }

            row.children[0].children[0].checked = true;
            numChecked = 1;
        }

        if (numChecked === 0) {
            this.checkAll.checked = false;
            this.checkAll.indeterminate = false;
        } else if (numChecked < this.body.children.length) {
            this.checkAll.checked = true;
            this.checkAll.indeterminate = true;
        } else {
            this.checkAll.indeterminate = false;
            this.checkAll.checked = true;
        }
    }
}

customElements.define("he-table", HeliumTable);
