import {LitElement, html, css, unsafeCSS} from 'lit';
import {employeeStore} from '../store/employee-store.js';
import {ref} from 'lit/directives/ref.js';
import {colors} from '../styles/colors.js';
import '../components/employee-modal.js';
import '../components/confirmation-modal.js';
import {I18nMixin} from '../mixins/i18n-mixin.js';

export class EmployeeList extends I18nMixin(LitElement) {
  static properties = {
    _employees: {state: true},
    _currentPage: {state: true},
    _totalPages: {state: true},
    _viewType: {state: true},
    _searchQuery: {state: true},
    _selectedEmployees: {state: true},
    _showDeleteConfirmation: {state: true},
    _employeeToDelete: {state: true},
  };

  static styles = css`
    :host {
      display: block;
      padding: 2rem;
      background: ${unsafeCSS(colors.background)};
      min-height: 100vh;
    }

    .content-wrapper {
      max-width: 100%;
      margin: 0 1rem;
    }

    .content-header {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .header-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .page-title {
      font-size: 1.75rem;
      color: ${unsafeCSS(colors.primary)};
      font-weight: 600;
      margin: 0;
      white-space: nowrap;
    }

    .view-controls {
      display: flex;
      gap: 0.5rem;
      background: #eeeeee;
      padding: 4px;
      border-radius: 4px;
    }

    .view-btn {
      padding: 8px;
      border: none;
      background: none;
      cursor: pointer;
      color: #666;
      border-radius: 4px;
      transition: all 0.2s;
    }

    .view-btn.active {
      background: white;
      color: #ff6200;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .view-btn svg {
      width: 20px;
      height: 20px;
      fill: currentColor;
    }

    .table-container {
      background: ${unsafeCSS(colors.white)};
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      overflow-x: auto;
      margin: 0;
      width: 100%;
    }

    table {
      min-width: 1200px;
      width: 100%;
      border-collapse: collapse;
      background: ${unsafeCSS(colors.white)};
    }

    th {
      padding: 1rem;
      text-align: left;
      font-weight: 500;
      color: ${unsafeCSS(colors.primary)};
      border-bottom: 1px solid ${unsafeCSS(colors.border)};
      white-space: nowrap;
    }

    td {
      padding: 1rem;
      border-bottom: 1px solid ${unsafeCSS(colors.border)};
      color: ${unsafeCSS(colors.text.primary)};
    }

    .checkbox-cell {
      width: 40px;
      text-align: center;
    }

    .checkbox-cell input[type='checkbox'] {
      width: 16px;
      height: 16px;
      border: 2px solid ${unsafeCSS(colors.text.light)};
      border-radius: 3px;
      cursor: pointer;
    }

    .actions-cell {
      width: 100px;
      text-align: right;
    }

    .action-btn {
      padding: 6px;
      background: none;
      border: none;
      cursor: pointer;
      color: ${unsafeCSS(colors.primary)};
      border-radius: 4px;
      transition: all 0.2s;
      margin: 0 2px;
    }

    .action-btn:hover {
      background: ${unsafeCSS(colors.hover)};
    }

    .action-btn svg {
      width: 18px;
      height: 18px;
      fill: currentColor;
    }

    .grid-view {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
      padding: 0;
    }

    .employee-card {
      background: white;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .employee-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .employee-info {
      display: grid;
      gap: 0.75rem;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
    }

    .info-label {
      color: #666;
      font-size: 0.875rem;
    }

    .info-value {
      color: #333;
      font-weight: 500;
    }

    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.5rem;
      margin-top: 2rem;
      padding: 1rem;
    }

    .pagination button {
      min-width: 32px;
      height: 32px;
      border: none;
      background: none;
      color: #666;
      font-size: 0.875rem;
      cursor: pointer;
      border-radius: 50%;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
    }

    .pagination button:hover:not(:disabled):not(.active) {
      background: rgba(255, 98, 0, 0.1);
      color: ${unsafeCSS(colors.primary)};
    }

    .pagination button.active {
      background: ${unsafeCSS(colors.primary)};
      color: white;
    }

    .pagination button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      color: #999;
    }

    .pagination .nav-btn {
      color: ${unsafeCSS(colors.primary)};
    }

    .pagination .nav-btn:disabled {
      color: #999;
    }

    .pagination .nav-btn svg {
      width: 20px;
      height: 20px;
      fill: currentColor;
    }

    .ellipsis {
      color: #666;
      padding: 0 0.5rem;
    }

    tr:hover {
      background: ${unsafeCSS(colors.hover)};
    }

    .search-container {
      margin-bottom: 1.5rem;
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .search-field {
      flex: 1;
      max-width: 400px;
      position: relative;
      display: flex;
      align-items: center;
    }

    .search-field input {
      width: 100%;
      padding: 0.75rem 1rem 0.75rem 2.5rem;
      border: 1px solid ${unsafeCSS(colors.border)};
      border-radius: 6px;
      font-size: 0.875rem;
      color: ${unsafeCSS(colors.text.primary)};
      transition: all 0.2s;
      background: white;
    }

    .search-field input:focus {
      outline: none;
      border-color: ${unsafeCSS(colors.primary)};
      box-shadow: 0 0 0 3px rgba(255, 98, 0, 0.1);
    }

    .search-field svg {
      position: absolute;
      left: 0.75rem;
      width: 18px;
      height: 18px;
      fill: #999;
      pointer-events: none;
    }

    .clear-search {
      position: absolute;
      right: 0.75rem;
      width: 18px;
      height: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #999;
      transition: color 0.2s;
    }

    .clear-search:hover {
      color: ${unsafeCSS(colors.primary)};
    }

    .clear-search svg {
      position: static;
      pointer-events: auto;
    }

    @media (max-width: 768px) {
      .content-wrapper {
        margin: 0 0.5rem;
      }

      .header-top {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }

      .header-left {
        width: 100%;
        justify-content: space-between;
      }

      .search-container {
        width: 100%;
      }

      .search-field {
        max-width: 100%;
      }
    }

    .empty-state {
      text-align: center;
      padding: 3rem 1rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      margin: 0 1rem;
    }

    .empty-state svg {
      width: 64px;
      height: 64px;
      fill: #999;
      margin-bottom: 1rem;
    }

    .empty-state h3 {
      color: #333;
      font-size: 1.25rem;
      margin: 0 0 0.5rem;
    }

    .empty-state p {
      color: #666;
      margin: 0;
      font-size: 0.875rem;
    }
  `;

  constructor() {
    super();
    this._unsubscribe = employeeStore.subscribe(() => this._updateFromStore());
    this._updateFromStore();
    this._showDeleteConfirmation = false;
    this._employeeToDelete = null;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._unsubscribe();
  }

  _updateFromStore() {
    const state = employeeStore.getState();
    const {items, total} = state.getFilteredEmployees();
    this._employees = items;
    this._currentPage = state.currentPage;
    this._totalPages = Math.ceil(total / state.itemsPerPage);
    this._viewType = state.viewType;
    this._searchQuery = state.searchQuery;
    this._selectedEmployees = state.selectedEmployees;
    this.requestUpdate();
  }

  render() {
    return html`
      <div class="content-wrapper">
        <div class="content-header">
          <div class="header-top">
            <div class="header-left">
              <h1 class="page-title">${this.t('employeeList.title')}</h1>
            </div>
            <div class="view-controls">
              <button
                class="view-btn ${this._viewType === 'table' ? 'active' : ''}"
                @click=${() => this._setViewType('table')}
              >
                <svg viewBox="0 0 24 24">
                  <path d="M3 5v14h18V5H3zm16 12H5V7h14v10z" />
                </svg>
              </button>
              <button
                class="view-btn ${this._viewType === 'grid' ? 'active' : ''}"
                @click=${() => this._setViewType('grid')}
              >
                <svg viewBox="0 0 24 24">
                  <path
                    d="M3 3v8h8V3H3zm6 6H5V5h4v4zm-6 4v8h8v-8H3zm6 6H5v-4h4v4zm4-16v8h8V3h-8zm6 6h-4V5h4v4zm-6 4v8h8v-8h-8zm6 6h-4v-4h4v4z"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div class="search-container">
            <div class="search-field">
              <svg viewBox="0 0 24 24">
                <path
                  d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
                />
              </svg>
              <input
                type="text"
                placeholder=${this.t('employeeList.search')}
                .value=${this._searchQuery || ''}
                @input=${this._handleSearch}
              />
              ${this._searchQuery
                ? html`
                    <div class="clear-search" @click=${this._clearSearch}>
                      <svg viewBox="0 0 24 24">
                        <path
                          d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                        />
                      </svg>
                    </div>
                  `
                : ''}
            </div>
          </div>
        </div>

        ${this._employees.length
          ? html`
              ${this._viewType === 'table'
                ? this._renderTable()
                : this._renderGrid()}

              <div class="pagination">${this._renderPaginationNumbers()}</div>
            `
          : html`
              <div class="empty-state">
                <svg viewBox="0 0 24 24">
                  <path
                    d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
                  />
                </svg>
                <h3>${this.t('employeeList.noResults')}</h3>
                <p>${this.t('employeeList.description')}</p>
              </div>
            `}
      </div>

      <employee-modal ${ref(this._setEmployeeModalRef)}></employee-modal>

      <confirmation-modal
        .isOpen=${this._showDeleteConfirmation}
        title="Confirm Delete"
        message=${this.t('common.messages.confirmDelete', {
          name: `${this._employeeToDelete?.firstName} ${this._employeeToDelete?.lastName}`,
        })}
        confirmText=${this.t('common.actions.delete')}
        @confirm=${this._handleDeleteConfirm}
        @cancel=${() => {
          this._showDeleteConfirmation = false;
          this._employeeToDelete = null;
        }}
      ></confirmation-modal>
    `;
  }

  _renderTable() {
    return html`
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th class="checkbox-cell">
                <input type="checkbox" @change=${this._handleSelectAll} />
              </th>
              <th>${this.t('employeeList.columns.firstName')}</th>
              <th>${this.t('employeeList.columns.lastName')}</th>
              <th>${this.t('employeeList.columns.dateOfEmployment')}</th>
              <th>${this.t('employeeList.columns.dateOfBirth')}</th>
              <th>${this.t('employeeList.columns.phone')}</th>
              <th>${this.t('employeeList.columns.email')}</th>
              <th>${this.t('employeeList.columns.department')}</th>
              <th>${this.t('employeeList.columns.position')}</th>
              <th class="actions-cell">
                ${this.t('employeeList.columns.actions')}
              </th>
            </tr>
          </thead>
          <tbody>
            ${this._employees.map(
              (employee) => html`
                <tr>
                  <td class="checkbox-cell">
                    <input
                      type="checkbox"
                      .checked=${this._selectedEmployees.has(employee.id)}
                      @change=${() => this._handleSelectEmployee(employee.id)}
                    />
                  </td>
                  <td>${employee.firstName}</td>
                  <td>${employee.lastName}</td>
                  <td>${employee.dateOfEmployment}</td>
                  <td>${employee.dateOfBirth}</td>
                  <td>${employee.phone}</td>
                  <td>${employee.email}</td>
                  <td>${employee.department}</td>
                  <td>${employee.position}</td>
                  <td class="actions-cell">
                    <button
                      class="action-btn"
                      @click=${() => this._handleEdit(employee)}
                    >
                      <svg viewBox="0 0 24 24">
                        <path
                          d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
                        />
                      </svg>
                    </button>
                    <button
                      class="action-btn"
                      @click=${() => this._deleteEmployee(employee)}
                    >
                      <svg viewBox="0 0 24 24">
                        <path
                          d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              `
            )}
          </tbody>
        </table>
      </div>
    `;
  }

  _renderGrid() {
    return html`
      <div class="grid-view">
        ${this._employees.map(
          (employee) => html`
            <div class="employee-card">
              <div class="employee-card-header">
                <input
                  type="checkbox"
                  .checked=${this._selectedEmployees.has(employee.id)}
                  @change=${() => this._handleSelectEmployee(employee.id)}
                />
                <div class="actions">
                  <button
                    class="action-btn"
                    @click=${() => this._handleEdit(employee)}
                  >
                    <svg viewBox="0 0 24 24">
                      <path
                        d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
                      />
                    </svg>
                  </button>
                  <button
                    class="action-btn"
                    @click=${() => this._deleteEmployee(employee)}
                  >
                    <svg viewBox="0 0 24 24">
                      <path
                        d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div class="employee-info">
                <div class="info-row">
                  <span class="info-label"
                    >${this.t('employeeList.columns.firstName')}:</span
                  >
                  <span class="info-value"
                    >${employee.firstName} ${employee.lastName}</span
                  >
                </div>
                <div class="info-row">
                  <span class="info-label"
                    >${this.t('employeeList.columns.department')}:</span
                  >
                  <span class="info-value">${employee.department}</span>
                </div>
                <div class="info-row">
                  <span class="info-label"
                    >${this.t('employeeList.columns.position')}:</span
                  >
                  <span class="info-value">${employee.position}</span>
                </div>
                <div class="info-row">
                  <span class="info-label"
                    >${this.t('employeeList.columns.email')}:</span
                  >
                  <span class="info-value">${employee.email}</span>
                </div>
              </div>
            </div>
          `
        )}
      </div>
    `;
  }

  _setViewType(type) {
    employeeStore.getState().setViewType(type);
  }

  _setEmployeeModalRef(element) {
    this._employeeModal = element;
  }

  _renderPaginationNumbers() {
    const pages = [];
    const maxVisiblePages = 5;
    const totalPages = this._totalPages;
    const currentPage = this._currentPage;

    // Add previous button
    pages.push(html`
      <button
        class="nav-btn"
        @click=${() => this._changePage(currentPage - 1)}
        ?disabled=${currentPage === 1}
      >
        <svg viewBox="0 0 24 24">
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
        </svg>
      </button>
    `);

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      pages.push(html`<button @click=${() => this._changePage(1)}>1</button>`);
      if (startPage > 2) {
        pages.push(html`<span class="ellipsis">...</span>`);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(html`
        <button
          @click=${() => this._changePage(i)}
          class=${i === currentPage ? 'active' : ''}
        >
          ${i}
        </button>
      `);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(html`<span class="ellipsis">...</span>`);
      }
      pages.push(
        html`<button @click=${() => this._changePage(totalPages)}>
          ${totalPages}
        </button>`
      );
    }

    // Add next button
    pages.push(html`
      <button
        class="nav-btn"
        @click=${() => this._changePage(currentPage + 1)}
        ?disabled=${currentPage === totalPages}
      >
        <svg viewBox="0 0 24 24">
          <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
        </svg>
      </button>
    `);

    return pages;
  }

  _changePage(page) {
    if (page >= 1 && page <= this._totalPages) {
      employeeStore.getState().setCurrentPage(page);
    }
  }

  _handleSelectAll(e) {
    const checked = e.target.checked;
    const state = employeeStore.getState();

    if (checked) {
      // Select all employees
      const newSelected = new window.Set(this._employees.map((emp) => emp.id));
      state.selectedEmployees = newSelected;
    } else {
      // Remove all selections
      state.selectedEmployees = new window.Set();
    }

    this._updateFromStore();
  }

  _handleSelectEmployee(id) {
    employeeStore.getState().toggleEmployeeSelection(id);
  }

  _deleteEmployee(employee) {
    this._employeeToDelete = employee;
    this._showDeleteConfirmation = true;
  }

  _handleDeleteConfirm() {
    if (this._employeeToDelete) {
      employeeStore.getState().deleteEmployee(this._employeeToDelete.id);
      this._employeeToDelete = null;
      this._showDeleteConfirmation = false;
    }
  }

  _handleEdit(employee) {
    const modal = document.createElement('employee-modal');
    modal.employee = employee;
    modal.isOpen = true;
    document.body.appendChild(modal);
  }

  _handleSearch(e) {
    const query = e.target.value;
    const state = employeeStore.getState();
    state.setSearchQuery(query);
    state.setCurrentPage(1);
  }

  _clearSearch() {
    const state = employeeStore.getState();
    state.setSearchQuery('');
    state.setCurrentPage(1);
  }
}

customElements.define('employee-list', EmployeeList);
