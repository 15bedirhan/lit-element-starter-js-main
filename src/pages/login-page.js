import { LitElement, html, css } from 'lit';
import { Router } from '@vaadin/router';
import { I18nMixin } from '../mixins/i18n-mixin.js';

export class LoginPage extends I18nMixin(LitElement) {
  static styles = css`
    :host {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: white;
    }

    .login-container {
      background: white;
      padding: 2.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 400px;
    }

    .logo {
      text-align: center;
      margin-bottom: 3rem;
      color: #FF6200;
      font-size: 2.5rem;
      font-weight: bold;
      font-family: sans-serif;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.75rem;
      color: #666;
      font-size: 1rem;
      font-weight: 500;
    }

    input {
      width: 100%;
      padding: 0.875rem;
      border: 1px solid #E0E0E0;
      border-radius: 4px;
      font-size: 1rem;
      box-sizing: border-box;
      transition: border-color 0.2s;
    }

    input:focus {
      outline: none;
      border-color: #FF6200;
    }

    button {
      width: 100%;
      padding: 0.875rem;
      margin-top: 0.5rem;
      background: #FF6200;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s;
    }

    button:hover {
      background: #FF4400;
    }

    /* Form grupları arasındaki boşlukları eşitle */
    .form-group + .form-group {
      margin-top: 1.5rem;
    }

    /* Input alanlarının yüksekliklerini eşitle */
    input, button {
      height: 48px;
    }

    /* Placeholder stilleri */
    input::placeholder {
      color: #999;
    }

    /* Focus ring */
    input:focus {
      box-shadow: 0 0 0 2px rgba(255, 98, 0, 0.1);
    }
  `;

  handleLogin(e) {
    e.preventDefault();
    Router.go('/employees');
  }

  render() {
    return html`
      <div class="login-container">
        <div class="logo">ING</div>
        <form @submit=${this.handleLogin}>
          <div class="form-group">
            <label for="username">${this.t('login.username')}</label>
            <input 
              type="text" 
              id="username" 
              placeholder=${this.t('login.usernamePlaceholder')}
            >
          </div>
          <div class="form-group">
            <label for="password">${this.t('login.password')}</label>
            <input 
              type="password" 
              id="password" 
              placeholder=${this.t('login.passwordPlaceholder')}
            >
          </div>
          <button type="submit">${this.t('common.actions.proceed')}</button>
        </form>
      </div>
    `;
  }
}

customElements.define('login-page', LoginPage); 