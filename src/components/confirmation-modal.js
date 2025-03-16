import { LitElement, html, css, unsafeCSS } from 'lit';
import { colors } from '../styles/colors.js';
import { I18nMixin } from '../mixins/i18n-mixin.js';

export class ConfirmationModal extends I18nMixin(LitElement) {
  static properties = {
    isOpen: { type: Boolean },
    message: { type: String },
    confirmText: { type: String },
    cancelText: { type: String },
    isSubmitting: { type: Boolean }
  };

  static styles = css`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 1001;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 1rem;
    }

    .confirmation-modal {
      position: relative;
      background: white;
      border-radius: 12px;
      width: 100%;
      max-width: 460px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
      box-sizing: border-box;
    }

    .modal-header {
      padding: 1.5rem 1.5rem 1rem;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .modal-header h4 {
      margin: 0;
      font-size: 1.2rem;
      font-weight: 600;
      color: ${unsafeCSS(colors.primary)};
    }

    .title-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }

    .close-button {
      background: none;
      border: none;
      padding: 0;
      cursor: pointer;
      color: ${unsafeCSS(colors.primary)};
      font-size: 1.5rem;
      line-height: 1;
      font-weight: 300;
      width: auto;
    }

    .modal-content {
      padding: 0 1.5rem 1.5rem;
    }

    p {
      margin: 0;
      color: #666;
      font-size: 1rem;
      line-height: 1.5;
    }

    .button-group {
      padding: 0 1.5rem 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    button {
      padding: 0.875rem;
      border: none;
      border-radius: 6px;
      font-size: 1rem;
      font-weight: 400;
      cursor: pointer;
      transition: all 0.2s;
      text-align: center;
    }

    .button-group button {
      width: 100%;
    }

    .confirm-btn {
      background: ${unsafeCSS(colors.primary)};
      color: white;
    }

    .confirm-btn:hover {
      background: ${unsafeCSS(colors.primaryHover)};
    }

    .cancel-btn {
      background: white;
      color: #666;
      border: 1px solid #e0e0e0;
    }

    .cancel-btn:hover {
      background: #f5f5f5;
    }

    .confirm-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    @media (max-width: 600px) {
      .confirmation-modal {
        margin: 1rem;
        width: calc(100% - 2rem);
      }
    }
  `;

  constructor() {
    super();
    this.isOpen = false;
    this.message = '';
    this.confirmText = 'Proceed';
    this.cancelText = 'Cancel';
    this.isSubmitting = false;
  }

  render() {
    if (!this.isOpen) return null;

    return html`
      <div class="modal-overlay">
        <div class="confirmation-modal">
          <div class="modal-header">
            <div class="title-container">
              <h4>${this.t('common.messages.areYouSure')}</h4>
              <button class="close-button" @click=${this._handleCancel}>×</button>
            </div>
          </div>
          <div class="modal-content">
            <p>${this.message}</p>
          </div>
          <div class="button-group">
            <button 
              type="button" 
              class="confirm-btn" 
              @click=${this._handleConfirm}
              ?disabled=${this.isSubmitting}
            >
              ${this.isSubmitting ? this.t('common.messages.processing') : this.confirmText}
            </button>
            <button 
              type="button" 
              class="cancel-btn" 
              @click=${this._handleCancel}
            >
              ${this.t('common.actions.cancel')}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  _handleCancel() {
    this.dispatchEvent(new CustomEvent('cancel'));
  }

  _handleConfirm() {
    this.dispatchEvent(new CustomEvent('confirm'));
  }
}

customElements.define('confirmation-modal', ConfirmationModal);
