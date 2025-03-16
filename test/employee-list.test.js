import {html, fixture, assert} from '@open-wc/testing';
import '../src/pages/employee-list.js';
import {employeeStore} from '../src/store/employee-store.js';
import {EmployeeList} from '../src/pages/employee-list.js';

suite('employee-list', () => {
  let originalGetState;

  setup(() => {
    originalGetState = employeeStore.getState;
  });

  teardown(() => {
    employeeStore.getState = originalGetState;
  });

  test('is defined', () => {
    const el = document.createElement('employee-list');
    assert.instanceOf(el, EmployeeList);
  });

  test('renders empty state when no employees', async () => {
    employeeStore.getState = () => ({
      getFilteredEmployees: () => ({
        items: [],
        total: 0
      }),
      viewType: 'table',
      currentPage: 1,
      searchQuery: '',
      selectedEmployees: new window.Set()
    });

    const el = await fixture(html`<employee-list></employee-list>`);
    await el.updateComplete;

    const emptyState = el.shadowRoot.querySelector('.empty-state');
    assert.exists(emptyState, 'Empty state should be rendered');
    assert.notExists(el.shadowRoot.querySelector('table'), 'Table should not exist');
  });

  test('renders table view by default', async () => {
    const mockEmployee = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      department: 'IT',
      position: 'Developer',
      dateOfEmployment: '2023-01-01',
      dateOfBirth: '1990-01-01',
      phone: '+1234567890'
    };

    employeeStore.getState = () => ({
      getFilteredEmployees: () => ({
        items: [mockEmployee],
        total: 1
      }),
      viewType: 'table',
      currentPage: 1,
      searchQuery: '',
      selectedEmployees: new window.Set()
    });

    const el = await fixture(html`<employee-list></employee-list>`);
    await el.updateComplete;

    const table = el.shadowRoot.querySelector('table');
    assert.exists(table, 'Table should be rendered');
    
    // Check if employee data is rendered correctly
    const firstRow = table.querySelector('tbody tr');
    assert.exists(firstRow, 'Table should have at least one row');
    assert.include(firstRow.textContent, mockEmployee.firstName);
    assert.include(firstRow.textContent, mockEmployee.email);
  });

  test('switches to grid view when grid button clicked', async () => {
    let viewTypeChanged = false;
    employeeStore.getState = () => ({
      getFilteredEmployees: () => ({
        items: [],
        total: 0
      }),
      viewType: 'table',
      setViewType: (type) => {
        viewTypeChanged = true;
        assert.equal(type, 'grid');
      },
      currentPage: 1,
      searchQuery: '',
      selectedEmployees: new window.Set()
    });

    const el = await fixture(html`<employee-list></employee-list>`);
    const gridBtn = el.shadowRoot.querySelector('.view-btn:last-child');
    
    gridBtn.click();
    await el.updateComplete;
    
    assert.isTrue(viewTypeChanged, 'View type should be changed to grid');
  });

  test('filters employees when search input changes', async () => {
    let searchQueryUpdated = false;
    let currentPageReset = false;
    
    employeeStore.getState = () => ({
      getFilteredEmployees: () => ({
        items: [],
        total: 0
      }),
      viewType: 'table',
      setSearchQuery: (query) => {
        searchQueryUpdated = true;
        assert.equal(query, 'John');
      },
      setCurrentPage: (page) => {
        currentPageReset = true;
        assert.equal(page, 1);
      },
      currentPage: 1,
      searchQuery: '',
      selectedEmployees: new window.Set()
    });

    const el = await fixture(html`<employee-list></employee-list>`);
    const searchInput = el.shadowRoot.querySelector('.search-field input');
    
    searchInput.value = 'John';
    searchInput.dispatchEvent(new Event('input'));
    await el.updateComplete;
    
    assert.isTrue(searchQueryUpdated, 'Search query should be updated');
    assert.isTrue(currentPageReset, 'Current page should be reset to 1');
  });

  test('handles employee selection', async () => {
    const mockEmployee = { id: 1, firstName: 'John', lastName: 'Doe' };
    const selectedEmployees = new window.Set();

    employeeStore.getState = () => ({
      getFilteredEmployees: () => ({
        items: [mockEmployee],
        total: 1
      }),
      viewType: 'table',
      currentPage: 1,
      searchQuery: '',
      selectedEmployees,
      toggleEmployeeSelection: (id) => {
        if (selectedEmployees.has(id)) {
          selectedEmployees.delete(id);
        } else {
          selectedEmployees.add(id);
        }
      }
    });

    const el = await fixture(html`<employee-list></employee-list>`);
    await el.updateComplete;

    const checkbox = el.shadowRoot.querySelector('tbody input[type="checkbox"]');
    checkbox.click();
    await el.updateComplete;
    
    assert.isTrue(selectedEmployees.has(mockEmployee.id), 'Employee should be selected');

    checkbox.click();
    await el.updateComplete;

    assert.isFalse(selectedEmployees.has(mockEmployee.id), 'Employee should be deselected');
  });

  test('handles employee deletion', async () => {
    const mockEmployee = { id: 1, firstName: 'John', lastName: 'Doe' };

    employeeStore.getState = () => ({
      getFilteredEmployees: () => ({
        items: [mockEmployee],
        total: 1
      }),
      viewType: 'table',
      currentPage: 1,
      searchQuery: '',
      selectedEmployees: new window.Set()
    });

    const el = await fixture(html`<employee-list></employee-list>`);
    await el.updateComplete;

    const deleteBtn = el.shadowRoot.querySelector('.action-btn:last-child');
    deleteBtn.click();
    await el.updateComplete;

    assert.isTrue(el._showDeleteConfirmation, 'Delete confirmation should be shown');
    assert.deepEqual(el._employeeToDelete, mockEmployee, 'Correct employee should be marked for deletion');
  });

  test('handles pagination navigation', async () => {
    let currentPageChanged = false;
    const state = {
      employees: Array(50).fill({ id: 1, firstName: 'John', lastName: 'Doe' }),
      currentPage: 1,
      itemsPerPage: 12,
      viewType: 'table',
      searchQuery: '',
      selectedEmployees: new window.Set(),
      getFilteredEmployees: function() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        return {
          items: this.employees.slice(start, end),
          total: this.employees.length
        };
      },
      setCurrentPage: function(page) {
        currentPageChanged = true;
        assert.equal(page, 2);
        this.currentPage = page;
      }
    };

    employeeStore.getState = () => state;

    const el = await fixture(html`<employee-list></employee-list>`);
    await el.updateComplete;

    const paginationButtons = el.shadowRoot.querySelectorAll('.pagination button');
    const nextBtn = Array.from(paginationButtons).find(btn => btn.textContent.includes('2'));
    assert.exists(nextBtn, 'Next page button should exist');
    
    nextBtn.click();
    await el.updateComplete;

    assert.isTrue(currentPageChanged, 'Current page should be updated');
    assert.equal(state.currentPage, 2, 'Current page should be 2');
  });

  test('handles delete confirmation modal', async () => {
    const mockEmployee = { id: 1, firstName: 'John', lastName: 'Doe' };
    let employeeDeleted = false;

    employeeStore.getState = () => ({
      getFilteredEmployees: () => ({
        items: [mockEmployee],
        total: 1
      }),
      viewType: 'table',
      currentPage: 1,
      searchQuery: '',
      selectedEmployees: new window.Set(),
      deleteEmployee: (id) => {
        employeeDeleted = true;
        assert.equal(id, mockEmployee.id);
      }
    });

    const el = await fixture(html`<employee-list></employee-list>`);
    await el.updateComplete;

    // Open delete confirmation
    const deleteBtn = el.shadowRoot.querySelector('.action-btn:last-child');
    deleteBtn.click();
    await el.updateComplete;

    assert.isTrue(el._showDeleteConfirmation, 'Delete confirmation should be shown');

    // Confirm deletion
    const confirmationModal = el.shadowRoot.querySelector('confirmation-modal');
    confirmationModal.dispatchEvent(new CustomEvent('confirm'));
    await el.updateComplete;

    assert.isTrue(employeeDeleted, 'Employee should be deleted');
    assert.isFalse(el._showDeleteConfirmation, 'Delete confirmation should be hidden');
  });

  test('handles delete confirmation modal cancellation', async () => {
    const mockEmployee = { id: 1, firstName: 'John', lastName: 'Doe' };
    let employeeDeleted = false;

    employeeStore.getState = () => ({
      getFilteredEmployees: () => ({
        items: [mockEmployee],
        total: 1
      }),
      viewType: 'table',
      currentPage: 1,
      searchQuery: '',
      selectedEmployees: new window.Set(),
      deleteEmployee: () => {
        employeeDeleted = true;
      }
    });

    const el = await fixture(html`<employee-list></employee-list>`);
    await el.updateComplete;

    // Open delete confirmation
    const deleteBtn = el.shadowRoot.querySelector('.action-btn:last-child');
    deleteBtn.click();
    await el.updateComplete;

    // Cancel deletion
    const confirmationModal = el.shadowRoot.querySelector('confirmation-modal');
    confirmationModal.dispatchEvent(new CustomEvent('cancel'));
    await el.updateComplete;

    assert.isFalse(employeeDeleted, 'Employee should not be deleted');
    assert.isFalse(el._showDeleteConfirmation, 'Delete confirmation should be hidden');
  });

  test('handles bulk selection', async () => {
    const mockEmployees = [
      { id: 1, firstName: 'John', lastName: 'Doe' },
      { id: 2, firstName: 'Jane', lastName: 'Smith' }
    ];
    const selectedEmployees = new window.Set();

    const state = {
      employees: mockEmployees,
      currentPage: 1,
      itemsPerPage: 12,
      viewType: 'table',
      searchQuery: '',
      selectedEmployees,
      getFilteredEmployees: function() {
        return {
          items: this.employees,
          total: this.employees.length
        };
      },
      toggleEmployeeSelection: function(id) {
        if (this.selectedEmployees.has(id)) {
          this.selectedEmployees.delete(id);
        } else {
          this.selectedEmployees.add(id);
        }
      }
    };

    employeeStore.getState = () => state;

    const el = await fixture(html`<employee-list></employee-list>`);
    await el.updateComplete;

    const checkboxes = el.shadowRoot.querySelectorAll('tbody input[type="checkbox"]');
    assert.equal(checkboxes.length, 2, 'Should have two checkboxes');

    // Select first employee
    checkboxes[0].click();
    await el.updateComplete;
    assert.isTrue(selectedEmployees.has(1), 'First employee should be selected');

    // Select second employee
    checkboxes[1].click();
    await el.updateComplete;
    assert.isTrue(selectedEmployees.has(2), 'Second employee should be selected');

    // Deselect first employee
    checkboxes[0].click();
    await el.updateComplete;
    assert.isFalse(selectedEmployees.has(1), 'First employee should be deselected');
    assert.isTrue(selectedEmployees.has(2), 'Second employee should remain selected');
  });

  test('handles clear search', async () => {
    let searchCleared = false;
    let pageReset = false;

    employeeStore.getState = () => ({
      getFilteredEmployees: () => ({
        items: [],
        total: 0
      }),
      viewType: 'table',
      currentPage: 1,
      searchQuery: 'test',
      selectedEmployees: new window.Set(),
      setSearchQuery: (query) => {
        searchCleared = true;
        assert.equal(query, '');
      },
      setCurrentPage: (page) => {
        pageReset = true;
        assert.equal(page, 1);
      }
    });

    const el = await fixture(html`<employee-list></employee-list>`);
    await el.updateComplete;

    const clearSearchBtn = el.shadowRoot.querySelector('.clear-search');
    clearSearchBtn.click();
    await el.updateComplete;

    assert.isTrue(searchCleared, 'Search query should be cleared');
    assert.isTrue(pageReset, 'Page should be reset to 1');
  });

  test('handles employee edit', async () => {
    const mockEmployee = { id: 1, firstName: 'John', lastName: 'Doe' };
    let modalCreated = false;

    // Mock document.createElement
    const originalCreateElement = document.createElement;
    document.createElement = (tagName) => {
      if (tagName === 'employee-modal') {
        modalCreated = true;
        const modal = originalCreateElement.call(document, 'div');
        modal.isOpen = false;
        return modal;
      }
      return originalCreateElement.call(document, tagName);
    };

    employeeStore.getState = () => ({
      getFilteredEmployees: () => ({
        items: [mockEmployee],
        total: 1
      }),
      viewType: 'table',
      currentPage: 1,
      searchQuery: '',
      selectedEmployees: new window.Set()
    });

    const el = await fixture(html`<employee-list></employee-list>`);
    await el.updateComplete;

    const editBtn = el.shadowRoot.querySelector('.action-btn');
    editBtn.click();
    await el.updateComplete;

    assert.isTrue(modalCreated, 'Employee modal should be created');

    // Restore original createElement
    document.createElement = originalCreateElement;
  });
});
