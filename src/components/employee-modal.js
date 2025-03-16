import { LitElement, html, css, unsafeCSS } from 'lit';
import { employeeStore, DEPARTMENTS, POSITIONS } from '../store/employee-store.js';
import { colors } from '../styles/colors.js';
import { I18nMixin } from '../mixins/i18n-mixin.js';

export class EmployeeModal extends I18nMixin(LitElement) {
  static properties = {
    isOpen: { type: Boolean },
    employee: { type: Object },
    _formData: { state: true },
    _errors: { state: true },
    _isSubmitting: { state: true },
    _showConfirmation: { state: true }
  };

  static styles = css`
    .modal {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      border-radius: 8px;
      width: 90%;
      max-width: 500px;
      min-height: 400px;
      max-height: 80vh;
      z-index: 1000;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      display: flex;
      flex-direction: column;
    }

    .modal-header {
      padding: 1.5rem;
      border-bottom: 1px solid #eee;
      flex-shrink: 0;
    }

    .modal-title {
      font-size: 1.5rem;
      color: #333;
      margin: 0;
      font-weight: 500;
    }

    .modal-content {
      padding: 1.5rem;
      overflow-y: auto;
      flex: 1;
    }

    .modal-footer {
      padding: 1.25rem 1.5rem;
      border-top: 1px solid #eee;
      background: white;
      border-radius: 0 0 8px 8px;
      flex-shrink: 0;
    }

    .form-group {
      margin-bottom: 1.25rem;
    }

    .form-group:last-child {
      margin-bottom: 0;
    }

    label {
      display: block;
      color: #666;
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
      font-weight: 500;
    }

    input, select {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      color: #333;
      transition: all 0.2s;
      background-color: white;
      height: 48px;
      box-sizing: border-box;
    }

    input::placeholder {
      color: #999;
    }

    input[type="date"] {
      font-family: inherit;
    }

    input[type="date"]::-webkit-calendar-picker-indicator {
      opacity: 0.7;
      cursor: pointer;
    }

    input:focus, select:focus {
      outline: none;
      border-color: ${unsafeCSS(colors.primary)};
      box-shadow: 0 0 0 3px rgba(255, 98, 0, 0.1);
    }

    select {
      appearance: none;
      background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
      background-repeat: no-repeat;
      background-position: right 1rem center;
      background-size: 1em;
      padding-right: 2.5rem;
    }

    select:not([value=""]) {
      color: #333;
    }

    select option {
      color: #333;
    }

    select option:first-child {
      color: #999;
    }

    .error {
      color: ${unsafeCSS(colors.error)};
      font-size: 0.75rem;
      margin-top: 0.375rem;
    }

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 999;
    }

    .button-group {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
    }

    button {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .cancel-btn {
      background: #f0f0f0;
      color: #666;
    }

    .cancel-btn:hover {
      background: #e0e0e0;
    }

    .submit-btn {
      background: ${unsafeCSS(colors.primary)};
      color: white;
    }

    .submit-btn:hover {
      background: ${unsafeCSS(colors.primaryHover)};
    }

    .submit-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    input.has-error, select.has-error {
      border-color: ${unsafeCSS(colors.error)};
    }

    input.has-error:focus, select.has-error:focus {
      box-shadow: 0 0 0 3px ${unsafeCSS(colors.errorLight)};
    }
  `;

  constructor() {
    super();
    this.isOpen = false;
    this.employee = null;
    this._showConfirmation = false;
    this._resetForm();
  }

  updated(changedProperties) {
    if (changedProperties.has('employee') && this.employee) {
      this._formData = {
        firstName: this.employee.firstName,
        lastName: this.employee.lastName,
        dateOfEmployment: this.employee.dateOfEmployment,
        dateOfBirth: this.employee.dateOfBirth,
        phone: this.employee.phone,
        email: this.employee.email,
        department: this.employee.department,
        position: this.employee.position
      };
    }
  }

  _resetForm() {
    this._formData = {
      firstName: '',
      lastName: '',
      dateOfEmployment: '',
      dateOfBirth: '',
      phone: '',
      email: '',
      department: '',
      position: ''
    };
    this._errors = {};
  }

  _validateForm() {
    const errors = {};
    const phoneRegex = /^\+90 [0-9]{3} [0-9]{3} [0-9]{2} [0-9]{2}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!this._formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }

    if (!this._formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }

    if (!this._formData.dateOfEmployment) {
      errors.dateOfEmployment = 'Date of employment is required';
    }

    if (!this._formData.dateOfBirth) {
      errors.dateOfBirth = 'Date of birth is required';
    } else {
      const birthDate = new Date(this._formData.dateOfBirth);
      const age = new Date().getFullYear() - birthDate.getFullYear();
      if (age < 18) {
        errors.dateOfBirth = 'Employee must be at least 18 years old';
      }
    }

    if (!this._formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(this._formData.phone)) {
      errors.phone = 'Phone number must be in format: +90 XXX XXX XX XX';
    }

    if (!this._formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(this._formData.email)) {
      errors.email = 'Invalid email format';
    }

    if (!this._formData.department) {
      errors.department = 'Department is required';
    }

    if (!this._formData.position) {
      errors.position = 'Position is required';
    }

    this._errors = errors;
    return Object.keys(errors).length === 0;
  }

  async _handleSubmit(e) {
    e.preventDefault();

    if (!this._validateForm()) {
      return;
    }

    if (this.employee) {
      this._showConfirmation = true;
      return;
    }

    await this._submitForm();
  }

  async _submitForm() {
    this._isSubmitting = true;
    try {
      if (this.employee) {
        await employeeStore.getState().updateEmployee(this.employee.id, this._formData);
      } else {
        await employeeStore.getState().addEmployee(this._formData);
      }
      this._resetForm();
      this.isOpen = false;
    } catch (error) {
      this._errors.email = error.message;
    } finally {
      this._isSubmitting = false;
      this._showConfirmation = false;
    }
  }

  _handleInput(e) {
    const { name, value } = e.target;
    this._formData = {
      ...this._formData,
      [name]: value
    };
    // Clear error when user starts typing
    if (this._errors[name]) {
      this._errors = {
        ...this._errors,
        [name]: ''
      };
    }
  }

  _formatPhoneNumber(value) {
    const numbers = value.replace(/\D/g, '');
    
    if (!numbers || numbers === '90') {
      return '+90 ';
    }

    let formatted = '+90 ';
    if (numbers.length > 2) {
      formatted += numbers.slice(2, 5);
      if (numbers.length > 5) {
        formatted += ' ' + numbers.slice(5, 8);
        if (numbers.length > 8) {
          formatted += ' ' + numbers.slice(8, 10);
          if (numbers.length > 10) {
            formatted += ' ' + numbers.slice(10, 12);
          }
        }
      }
    }

    return formatted;
  }

  render() {
    if (!this.isOpen) return null;

    const isEditMode = Boolean(this.employee);
    const title = isEditMode ? this.t('employeeForm.titles.edit') : this.t('employeeForm.titles.create');
    const submitText = isEditMode 
      ? (this._isSubmitting ? this.t('common.actions.updating') : this.t('common.actions.updateEmployee'))
      : (this._isSubmitting ? this.t('common.actions.adding') : this.t('common.actions.addEmployee'));

    return html`
      <div class="modal-overlay" @click=${() => this.isOpen = false}>
        <div class="modal" @click=${(e) => e.stopPropagation()}>
          <div class="modal-header">
            <h2 class="modal-title">${title}</h2>
          </div>
          
          <div class="modal-content">
            <form @submit=${this._handleSubmit} id="employeeForm">
              <div class="form-group">
                <label for="firstName">${this.t('employeeForm.fields.firstName.label')}</label>
                <input 
                  type="text" 
                  id="firstName" 
                  name="firstName"
                  class=${this._errors.firstName ? 'has-error' : ''}
                  .value=${this._formData.firstName}
                  @input=${this._handleInput}
                  placeholder=${this.t('employeeForm.fields.firstName.placeholder')}
                >
                ${this._errors.firstName ? html`<div class="error">${this._errors.firstName}</div>` : ''}
              </div>

              <div class="form-group">
                <label for="lastName">${this.t('employeeForm.fields.lastName.label')}</label>
                <input 
                  type="text" 
                  id="lastName" 
                  name="lastName"
                  class=${this._errors.lastName ? 'has-error' : ''}
                  .value=${this._formData.lastName}
                  @input=${this._handleInput}
                  placeholder=${this.t('employeeForm.fields.lastName.placeholder')}
                >
                ${this._errors.lastName ? html`<div class="error">${this._errors.lastName}</div>` : ''}
              </div>

              <div class="form-group">
                <label for="dateOfEmployment">${this.t('employeeForm.fields.dateOfEmployment.label')}</label>
                <input 
                  type="date" 
                  id="dateOfEmployment" 
                  name="dateOfEmployment"
                  class=${this._errors.dateOfEmployment ? 'has-error' : ''}
                  .value=${this._formData.dateOfEmployment}
                  @input=${this._handleInput}
                >
                ${this._errors.dateOfEmployment ? html`<div class="error">${this._errors.dateOfEmployment}</div>` : ''}
              </div>

              <div class="form-group">
                <label for="dateOfBirth">${this.t('employeeForm.fields.dateOfBirth.label')}</label>
                <input 
                  type="date" 
                  id="dateOfBirth" 
                  name="dateOfBirth"
                  class=${this._errors.dateOfBirth ? 'has-error' : ''}
                  .value=${this._formData.dateOfBirth}
                  @input=${this._handleInput}
                >
                ${this._errors.dateOfBirth ? html`<div class="error">${this._errors.dateOfBirth}</div>` : ''}
              </div>

              <div class="form-group">
                <label for="phone">${this.t('employeeForm.fields.phone.label')}</label>
                <input
                  type="tel"
                  id="phone"
                  class=${this._errors.phone ? 'has-error' : ''}
                  .value=${this._formatPhoneNumber(this._formData.phone) || '+90 '}
                  @input=${(e) => {
                    const formatted = this._formatPhoneNumber(e.target.value);
                    this._formData.phone = formatted;
                    e.target.value = formatted;
                  }}
                  placeholder=${this.t('employeeForm.fields.phone.placeholder')}
                >
                ${this._errors.phone ? html`<div class="error">${this._errors.phone}</div>` : ''}
              </div>

              <div class="form-group">
                <label for="email">${this.t('employeeForm.fields.email.label')}</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email"
                  class=${this._errors.email ? 'has-error' : ''}
                  .value=${this._formData.email}
                  @input=${this._handleInput}
                  placeholder=${this.t('employeeForm.fields.email.placeholder')}
                >
                ${this._errors.email ? html`<div class="error">${this._errors.email}</div>` : ''}
              </div>

              <div class="form-group">
                <label for="department">${this.t('employeeForm.fields.department.label')}</label>
                <select 
                  id="department" 
                  name="department"
                  class=${this._errors.department ? 'has-error' : ''}
                  .value=${this._formData.department}
                  @change=${this._handleInput}
                >
                  <option value="">${this.t('employeeForm.fields.department.placeholder')}</option>
                  ${Object.values(DEPARTMENTS).map(dept => html`
                    <option value=${dept}>${dept}</option>
                  `)}
                </select>
                ${this._errors.department ? html`<div class="error">${this._errors.department}</div>` : ''}
              </div>

              <div class="form-group">
                <label for="position">${this.t('employeeForm.fields.position.label')}</label>
                <select 
                  id="position" 
                  name="position"
                  class=${this._errors.position ? 'has-error' : ''}
                  .value=${this._formData.position}
                  @change=${this._handleInput}
                >
                  <option value="">${this.t('employeeForm.fields.position.placeholder')}</option>
                  ${Object.values(POSITIONS).map(pos => html`
                    <option value=${pos}>${pos}</option>
                  `)}
                </select>
                ${this._errors.position ? html`<div class="error">${this._errors.position}</div>` : ''}
              </div>
            </form>
          </div>

          <div class="modal-footer">
            <div class="button-group">
              <button type="button" class="cancel-btn" @click=${() => this.isOpen = false}>
                ${this.t('common.actions.cancel')}
              </button>
              <button 
                type="submit" 
                class="submit-btn" 
                form="employeeForm" 
                ?disabled=${this._isSubmitting}
              >
                ${submitText}
              </button>
            </div>
          </div>
        </div>
      </div>

      <confirmation-modal
        .isOpen=${this._showConfirmation}
        title=${this.t('common.messages.confirmUpdate')}
        message=${this.t('common.messages.confirmUpdate')}
        confirmText=${this.t('common.actions.updateEmployee')}
        .isSubmitting=${this._isSubmitting}
        @confirm=${this._submitForm}
        @cancel=${() => this._showConfirmation = false}
      ></confirmation-modal>
    `;
  }
}

customElements.define('employee-modal', EmployeeModal); 