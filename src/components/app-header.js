import {LitElement, html, css, unsafeCSS} from 'lit';
import {I18nMixin} from '../mixins/i18n-mixin.js';
import i18next from 'i18next';
import {TRFlag} from '../assets/icons/tr-flag.js';
import {ENFlag} from '../assets/icons/en-flag.js';
import {colors} from '../styles/colors.js';

export class AppHeader extends I18nMixin(LitElement) {
  static properties = {
    showLanguagePopup: {type: Boolean},
  };

  static styles = css`
    :host {
      display: block;
      background: white;
      padding: 0.75rem 1rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      width: 100%;
      box-sizing: border-box;
    }

    .header-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 100%;
      flex-wrap: nowrap;
    }

    .logo-container {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-shrink: 0;
    }

    .logo {
      width: 36px;
      height: 36px;
    }

    @media (min-width: 768px) {
      :host {
        padding: 0.75rem 2rem;
      }

      .logo {
        width: 48px;
        height: 48px;
      }
    }

    .logo-text {
      color: #1f1f1f;
      font-size: 1.25rem;
      font-weight: 600;
    }

    .actions {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-wrap: nowrap;
    }

    @media (min-width: 768px) {
      .actions {
        gap: 1rem;
      }

      .logo-text {
        font-size: 1.5rem;
      }
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
      font-size: 0.875rem;
    }

    .nav-link span {
      font-weight: 500;
      color: ${unsafeCSS(colors.primary)};
      display: none;
    }

    @media (min-width: 768px) {
      .nav-link span {
        display: inline;
      }
    }

    .nav-link svg {
      width: 20px;
      height: 20px;
      fill: ${unsafeCSS(colors.primary)};
    }

    .add-new-btn {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.5rem;
      background: white;
      color: ${unsafeCSS(colors.primary)};
      border: 1px solid ${unsafeCSS(colors.primary)};
      border-radius: 4px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .add-new-btn span {
      display: none;
    }

    @media (min-width: 768px) {
      .add-new-btn {
        padding: 0.5rem 1rem;
        gap: 0.5rem;
      }

      .add-new-btn span {
        display: inline;
      }
    }

    .add-new-btn:hover {
      background: #fff8f3;
    }

    .add-new-btn svg {
      width: 20px;
      height: 20px;
      fill: ${unsafeCSS(colors.primary)};
    }

    .login-btn {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.5rem;
      background: ${unsafeCSS(colors.primary)};
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .login-btn span {
      display: none;
    }

    @media (min-width: 768px) {
      .login-btn {
        padding: 0.5rem 1rem;
        gap: 0.5rem;
      }

      .login-btn span {
        display: inline;
      }
    }

    .login-btn:hover {
      background: #e55800;
    }

    .login-btn svg {
      width: 20px;
      height: 20px;
      fill: currentColor;
    }

    .language-selector {
      position: relative;
      cursor: pointer;
    }

    .language-selector svg {
      width: 24px;
      height: 24px;
      border-radius: 50%;
    }

    .language-popup {
      position: absolute;
      top: 100%;
      right: 0;
      background: white;
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      padding: 0.5rem;
      margin-top: 0.5rem;
      display: none;
      z-index: 1000;
    }

    .language-popup[data-show='true'] {
      display: block;
    }

    .language-option {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem;
      cursor: pointer;
      border: none;
      background: none;
      width: 100%;
      text-align: left;
      white-space: nowrap;
    }

    .language-option:hover {
      background: #f5f5f5;
    }

    .language-option svg {
      width: 24px;
      height: 24px;
      border-radius: 50%;
    }
  `;

  constructor() {
    super();
    this.showLanguagePopup = false;
    this._handleClickOutside = this._handleClickOutside.bind(this);
    this._handleLocationChange = this._handleLocationChange.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('click', this._handleClickOutside);
    window.addEventListener('popstate', this._handleLocationChange);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('click', this._handleClickOutside);
    window.removeEventListener('popstate', this._handleLocationChange);
  }

  _handleClickOutside(event) {
    const languageSelector =
      this.shadowRoot.querySelector('.language-selector');
    if (languageSelector && !languageSelector.contains(event.target)) {
      this.showLanguagePopup = false;
    }
  }

  _handleLocationChange() {
    this.requestUpdate();
  }

  toggleLanguagePopup(e) {
    e.stopPropagation();
    this.showLanguagePopup = !this.showLanguagePopup;
  }

  async changeLanguage(lang, e) {
    e.stopPropagation();

    try {
      await i18next.changeLanguage(lang);
      document.documentElement.lang = lang;
      this.showLanguagePopup = false;
      this.requestUpdate();
    } catch (error) {
      console.error('Error changing language:', error);
    }
  }

  _isLoginPage() {
    return window.location.pathname === '/login' || window.location.pathname === '/login-page';
  }

  render() {
    return html`
      <div class="header-container">
        <div class="logo-container">
          <svg
            version="1.1"
            class="logo"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 77.7 77.7"
          >
            <style>
              .st0 {
                fill: ${unsafeCSS(colors.primary)};
              }
              .st1 {
                fill: #ffffff;
              }
            </style>
            <g>
              <path
                class="st0"
                d="M62.1,77.7H15.5C7,77.7,0,70.8,0,62.2V15.5C0,7,7,0,15.5,0h46.6c8.6,0,15.5,7,15.5,15.5v46.6 C77.7,70.8,70.7,77.7,62.1,77.7L62.1,77.7z"
              ></path>
              <path
                class="st1"
                d="M75.6,67.5c-0.6-0.3-0.6-0.3-1.6-0.3c-0.3-0.3-1-0.3-1.3-0.3c0.2,1.1,0.6,2.1,1,3.2c0.2,0.5,0.6,0.9,1.1,1.2 c0.5-0.7,1-1.5,1.4-2.3C75.8,68.3,75.6,67.8,75.6,67.5 M65.3,77.4c-0.2-0.8-0.4-1.7-0.5-2.3v-5.1c-1.3,0.3-1.6,0.6-1.9,0.6 c-1,0.6-1.6,0.9-1.6,1.6c0,1.3,0.3,2.5,0.3,3.2c0,1,0,1.6,0.3,1.9c0.5,0.2,0.8,0.2,1.1,0.3C63.8,77.6,64.6,77.5,65.3,77.4 M45.2,70.7c0,0-0.3-1.6-0.6-2.2c-0.3-0.8-0.9-1.4-1.6-1.9c-0.3,0-0.9-0.6-1.3-0.3c0,0-0.3,2.5-0.6,2.8c0.6,1,1.3,1.6,1.6,2.5 c0.3,0.9,0.6,2.2,1.3,3.2C44.2,73.5,45.2,72.9,45.2,70.7 M71.1,72.6c-0.6-0.6,0.6-2.9-1-2.9c-0.6-0.3-2.5-1-2.5-1 c-0.3,1-0.3,2.8,0,3.8c0,0.7,0.9,2.4,1.6,3.4c0.8-0.4,1.6-0.9,2.4-1.5C71.4,73.9,71.2,73.3,71.1,72.6L71.1,72.6z M68.9,45 c1.3,0-1.6-1.3-2.8-2.2c-0.2,0-0.5-0.1-0.6-0.3c-0.6-0.6-1-1.9-2.2-2.2c-0.2,0-0.3-0.1-0.3-0.3c0,0,0,0,0,0c0-0.9-0.3-4.7-0.3-4.7 c0.6,1.3,1.9,1.3,2.5,1.3c1.3,0,2.2-0.3,2.8-1.3c0-0.3,0.3-0.9,0.6-0.9c0.6-0.3,1.3-0.6,1.6-1.3c0.3,0,0.6-0.6,0.6-0.6 C68,32,62,32,62,32c-1,0.3-1.9,1.3-1.9,1.6c0,0,0.6,3.5,0.6,3.8c0,2.2,0.3,2.2,0.3,4.4c1,0.6,1.3,0.6,1.9,1.3 c0.3,0.6,0.6,1.3,1,1.9c1.3,0.6,2.8,1.3,3.8,2.2C68,47.3,68.9,45.7,68.9,45L68.9,45z M67,50.7c-0.9-0.3-1.9-1-3.8-0.6 c-0.3,0.3-0.3,0.3-0.3,1.3c1.6,0,2.5,1,3.8,1.3C66.7,52.6,67,51.1,67,50.7L67,50.7z M60.4,27.3c0.6,0,0.6,1.3,0.6,1.9 c1.6,0,3.2,0.3,3.8-0.3c3.5-1.6-1.9-2.9-2.5-2.9c-1.6-0.3-4.7-1.3-3.5,0C58.8,26.7,59.7,26.7,60.4,27.3L60.4,27.3z M67,23.2 c2.2,0.6,3.8,1.9,5.4,3.8c1,0,1.9-0.6,2.2-1.6c0.3-1.6,0.6-4.1-0.3-5.4c-0.6-0.6-0.9-1-2.5-1.3c-1.2-0.3-2.6,0-3.5,1 C67.7,20.6,66.7,21.9,67,23.2L67,23.2z M53.7,26c0-0.6-1.3-0.3-1.9,0c-0.6,0-1.6,0.6-2.5,1.3c-0.9,1-1.6,1.3-1.6,2.2h1.6 c1.6,0,1.9,0.6,2.5-0.3C52.8,27.9,53.7,27.3,53.7,26L53.7,26z M51.8,33.6c0-0.6-0.6-1.3-1.6-1.6h-4.1c-1.6,0-2.9,0-4.4,0.3 c0.6,1.3,2.2,2.5,2.8,3.2c0.6,0.6,1.3,1.3,2.5,1.3c1.3-0.3,1.3,0,1.9-0.3c0,0.6,0.3,1.6,0,2.2c0,0.3,0.3,2.9-0.9,3.2 c-0.9,0.3-2.2,1-2.8,1.9c-0.6,0.9-1,2.5,0,3.2c0.6,0.3,1.3-0.6,2.2-1c1-0.3,0.9-1,1.3-1.9c0.6-0.6,1.9-1,2.2-1.6v-1 c0.3-2.9,0.3-3.5,0.6-5.4C51.5,35.8,51.8,34,51.8,33.6L51.8,33.6z M49.3,50.7c-0.6-0.3-1.3-0.3-1.9-0.3c-0.7,0-1.5,0.1-2.2,0.3 c0.2,0.6,0.4,1.3,0.6,1.9c0.9-0.3,1.3-0.6,1.9-0.9C47.7,51.7,49,51.1,49.3,50.7L49.3,50.7z M42.7,25.1c0.6-0.6,2.5-1.9,2.5-1.9 c0.3,0,0.3-0.3,0.3-0.6c-0.6-2.2-1.3-2.2-2.5-2.9c-0.6-0.5-1.4-0.7-2.2-0.6c-1.3,0.3-3.5,1-4.1,2.9c0,0.3-0.3,1.6,0.6,2.8 c0.6,1.3,1.9,2.2,2.5,2.9C40.7,27.6,41.1,26,42.7,25.1L42.7,25.1z M68.9,49.2c2.4,0,5.3,0.6,8.8,2v2.1c-3.5-1.4-6.7-1.7-8.4-2.2 v2.5c1.3,0.3,1.9,1,3.2,1.3c0.5,0.2,3.2,1.7,5.3,2.8v2.2c-3.8-2.4-6.5-3.3-9.7-4.7c-0.6,0.6-0.9,1.6-1.9,2.2 c-0.3,0.3-2.5-1.6-3.8-2.2c-0.9-0.6-2.8-0.9-4.1-1.3c-0.3,0-0.3-0.6-0.3-0.9c-0.3-1-0.6-1.9-0.3-2.2c1.6-0.6,2.2-1.9,2.2-2.8 s0.9,0.3,1.9,0c0.6-0.6,0.9-1.3,0.6-1.9c0-0.6-0.3-1.3-0.9-1.3c-3.1-1.3-6.7-1.3-9.8,0c-1,0.3-1,1.6-0.6,2.5c0.3,1.3,1.6,0.6,2.5,0 c0.3,0-0.3,1,0.3,1.9c0.6,1.3,1.9,1.6,1.9,1.9c0,1,0,1-0.3,1.6c0,0.6,0,1.3-0.6,1.6c-1.9,0.3-3.5,0.9-5.4,1.6 c-0.9,0.3-1.9,1.3-2.8,1.3c-0.6,0-1.3-1.3-1.6-1.6c-0.6,0-0.6-0.3-1.9,0c-3.7,1.5-7.3,3.3-10.8,5.4c-0.6-0.6-0.3-1.6-0.6-2.2 c3.5-2.2,7.2-4.1,11.1-5.7c0.3-0.3,0-1.3-0.3-1.9c0,0-2.2-0.3-6.3,1c-2.5,0.6-5.4,2.2-5.7,2.2C30.1,53.5,30,52.8,30,52 c1.9-1,4-1.8,6-2.5c2.2-0.6,4.4-0.6,6.7-1c-0.3,0-0.3-0.6-0.3-1c-0.9-1.9-2.5-3.5-4.1-5.1c-0.6-1.3-1.3-2.8-1.3-3.5 c0.6-0.6,1.3,0.3,2.2,0.3c-0.4-1.1-0.6-2.3-0.6-3.5c-0.3-1.3-0.3-1.3-0.3-2.8c0-1.9,0.6-2.8,0.3-3.2c-0.3-0.3-1.6-0.9-1.9-0.9 c-0.6-0.3-0.9-0.3-1.3-1c-1-1.6-1.9-2.8-1.9-4.4c0-1.6,0.6-2.9,1.3-4.4c0.3-1.3,1.9-1.9,2.9-2.5c1-0.6,1.9-0.3,2.8-0.3 c2.2,0,4.1,1.3,5.7,2.2c1.1,0.9,1.9,2.1,2.2,3.5h2.8c1.6,0.3,3.2,0.6,5.1,1.6c2.2-1.9,6-2.2,7.9-2.2c0-3.5,2.5-5.4,4.4-5.4 c1.6-0.3,2.5-0.6,4.8,0.3c1.6,0.9,3.8,4.1,3.8,4.4c0.6,1.3,0.3,2.9,0.3,4.8c-0.2,0.8-0.3,1.7-0.3,2.5c-0.3,1.3-1.9,2.2-2.8,2.5 c0,2.2-0.6,3.5-0.9,5.4c0,1-0.3,1.9-0.6,2.8c0.9-0.3,1.3-0.9,2.2-0.9c-0.6,4.1-1.6,3.5-2.5,5.4c-0.4,1.4-1,2.7-1.9,3.8 c-0.5,0.5-1,0.9-1.6,1.3C68.3,48.5,68.9,48.8,68.9,49.2 M52.1,73.5c-0.3-0.6-0.9-1-1.6-0.9c-0.6,0-2.2-1-2.2-0.3 c-1.6,0-0.3,1.6-0.3,2.5c0,0.7,0.9,1.9,1.8,2.9h2.9c-0.1-0.4-0.2-0.9-0.3-1.3C52.1,75.4,52.5,74.5,52.1,73.5L52.1,73.5z M46.8,59.3 c0.3,1.2,0.7,2.4,1.3,3.5c0.3,0,0.6,0.6,0.9,0.6c0.6-0.6,1.3-1.6,2.2-1.9v1.3c0,1,0,1.6,0.3,2.5c0,1,1,1,2.2,1 c1.3,0,1.6-2.2,1.6-2.5c0,0,0.3,1.3,2.2,2.2c0,0,2.2,0,2.2-0.3c0.3-1.6,0.6-1.9,0.3-3.2c0,0,1.9,1.3,2.9,2.5 c0.6-0.6,1.3-1.9,1.3-2.2c0.6-1.3,0.6-2.8,0.6-4.1c-2.5-1.6-5.7-1.9-8.9-1.9C53.1,56.8,49.9,57.1,46.8,59.3L46.8,59.3z M58.8,71.3 C57.5,71.6,55,72,55,72.9c-0.3,0.9,0,1.9,0,2.5c0.3,0.6,0.3,1.3,0.3,2.2v0.1h2.4c0.6-0.8,1.1-1.4,1.4-2.3 C59.4,74.5,59.1,72.9,58.8,71.3L58.8,71.3z M26.8,20c-0.6,0.9-0.6,1.9-0.6,2.8c0,1.6,0.3,2.8,0.6,4.8c-1.3,0.9-1.9,1.6-3.2,2.2 c0.3,1.9,0.6,5.4,0.6,5.4c0.6-0.9,0.6-0.9,1.3-1.6c1.3-0.9,1.9-1.6,3.5-2.8c0.3-0.6,0.6-0.3,1.6-1c0.3-0.3,0.6-0.6,0.6-0.9 c0-0.6-0.3-1.3-0.6-1.9c-0.3-0.6-0.9-2.2-0.9-2.5c0-2.5,0.3-3.2,0.6-5.4C29,18.7,27.4,18.7,26.8,20 M31.2,41.6 c-3.2,1-5.4,1.6-6,2.2c-1.6,1-2.2,1.6-3.8,2.5c0,1.9,0,1.9,0.3,2.9l0.3,3.8c0.6-1,2.5-2.9,3.5-4.1c1.4-1.6,3.1-2.9,5.1-3.8 C30.9,43.8,31.2,42.8,31.2,41.6 M25.2,71.6c0,0,1-0.6,1-1.3c1.6-1.9,3.5-3.5,3.8-3.8c-0.6-1.6-0.9-1.9-1.9-2.8 c-0.3,0.3-1.9,1.3-2.2,1.9c-0.6,0.3-1.3,0.6-1.6,0.9c0,0.6,0.3,1,0.6,1.6C24.9,68.8,25.2,70.4,25.2,71.6 M37.3,65 c-0.3-0.6-1.3-1-1.9-1.3c-0.6,0-1.3,1.3-1.3,2.5c0.1,1.3,0.3,2.6,0.6,3.8c0,0.3,0.6,0.6,1.3,0.9c1,0.6,1.9,1,2.8,1.6 c0,0-0.9-2.9-1.3-4.4C37.3,67.2,37.9,65.9,37.3,65 M40.4,10.2c0.3,0.6,4.1,2.9,5.7,3.8c1.3,1,2.5,1.3,3.8,1.9 c0.9-1.2,1.5-2.6,1.9-4.1c1,0.6,2.2,0.6,3.2,1c0,1.3,0,2.5,0.3,3.8c0,0.6,0.6,0.3,1.9-0.3c1.9-0.6,3.8-1,4.7-1.3 c2.2-1.3,3.5-3.8,5.4-3.8c1.6,0,4.4,0.9,5.1,1.6c0.9,0.3,1.6,0.6,2.5,0.6c0.9,0,1.7-0.7,2.4-1.3c-0.1-0.5-0.2-1-0.4-1.4 c-2.5-1.6-5.3-3.2-8-4.3C67,8,65.7,9.3,64.8,9.3c-1,0-0.3-1.9-0.3-3.2c-0.9,0-1.6,0-2.5-0.3c-0.6,2.2-1,5.1-2.5,5.7 c-0.4,0.2-0.8,0.3-1.3,0.3V9.2c0-0.3,1.3-2.5,1-2.8c0,0-2.8,0.6-3.5,1c-0.3,0.3-2.2,1.3-2.5,1.3c-0.4-0.1-0.8-0.3-1.3-0.3 c-0.9-0.6-1.6-0.6-2.5-1.3c-1.3,3.8-1.6,4.7-1.6,4.1c0,0-4.4-2.9-6-4.8c-4.1,0.6-4.1,1.3-7.6,2.5c-1.3,1.3-3.2,2.8-4.4,4.8 c-0.6,1.3-1.3,1.9-1.9,3.2l3.2,1.3c0.8-1,1.6-2.1,2.2-3.2C35.4,13.7,39.2,11.5,40.4,10.2L40.4,10.2z M22.4,54.2v1.6 c0,0.6,0.3,4.1,0.3,5.1c0.3,1,0.3,1.9,0.6,2.8c0.3,0.6,0.6,1.3,0.6,1.9c0.4-0.2,0.7-0.6,1-1c0.9-1,1.3-1.9,1.9-3.2 c-0.3-2.2-1-4.1-1-4.7c0-2.5,0.3-3.2,0.6-4.8C25.2,52.6,23.7,53.6,22.4,54.2L22.4,54.2z M31.6,36.8c0-1.9,0.6-1.9,0.3-2.5 s-2.8,0-3.5,0c-1.6,0.3-4.4,1.3-4.4,1.9c-0.3,0.9-0.3,3.2-0.3,3.5c0.3,1,0.3,1.9,0.6,2.8c0.9-1,1.3-1.3,1.9-1.6 c0.3-0.3,3.8-2.8,4.1-3.2C30.9,37.1,31.2,37.4,31.6,36.8L31.6,36.8z M29,77c-0.3,0.3-0.5,0.5-0.9,0.7h-1.2c-0.5-1.6-1.2-3.1-2-4.5 c0,0,4.7-1.9,6-1.9c0.3,0.6,0.6,1.6,1.3,2.2C31.6,74.2,29.7,76.1,29,77"
              ></path>
            </g>
          </svg>
          <span class="logo-text">ING</span>
        </div>

        <div class="actions">
          <a href="/employees" class="nav-link">
            <svg viewBox="0 0 24 24">
              <path
                d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"
              />
            </svg>
            <span>${this.t('header.employees')}</span>
          </a>

          ${!this._isLoginPage() ? html`
            <button class="add-new-btn" @click=${this._handleAddNew}>
              <svg viewBox="0 0 24 24">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
              </svg>
              <span>${this.t('header.addNew')}</span>
            </button>
          ` : ''}

          <button class="login-btn" @click=${this._handleLogin}>
            <svg viewBox="0 0 24 24">
              <path d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z"/>
            </svg>
            <span>${this.t('header.login')}</span>
          </button>

          <div
            class="language-selector"
            @click=${(e) => this.toggleLanguagePopup(e)}
          >
            ${document.documentElement.lang === 'tr' ? TRFlag : ENFlag}

            <div class="language-popup" data-show=${this.showLanguagePopup}>
              <button
                class="language-option"
                @click=${(e) => this.changeLanguage('en', e)}
              >
                ${ENFlag}
                <span>English</span>
              </button>
              <button
                class="language-option"
                @click=${(e) => this.changeLanguage('tr', e)}
              >
                ${TRFlag}
                <span>Türkçe</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  _handleAddNew() {
    const modal = document.createElement('employee-modal');
    modal.isOpen = true;
    document.body.appendChild(modal);
  }

  _handleLogin() {
    this.navigateToLogin();
  }

  navigateToLogin() {
    window.location.assign('/login-page');
  }
}

customElements.define('app-header', AppHeader);
