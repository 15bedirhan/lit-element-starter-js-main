import { i18next } from '../i18n/i18n.js';

export const I18nMixin = (superClass) => class extends superClass {
  t(key, options = {}) {
    return i18next.t(key, options);
  }

  // Dil değişikliğini dinle ve componenti güncelle
  connectedCallback() {
    super.connectedCallback();
    this._boundLanguageChanged = this._languageChanged.bind(this);
    i18next.on('languageChanged', this._boundLanguageChanged);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    i18next.off('languageChanged', this._boundLanguageChanged);
  }

  _languageChanged() {
    this.requestUpdate();
  }
};
