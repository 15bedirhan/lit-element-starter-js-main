import {html, fixture, assert} from '@open-wc/testing';
import '../src/components/app-header.js';
import {AppHeader} from '../src/components/app-header.js';
import i18next from 'i18next';
import en from '../src/i18n/translations/en.js';
import tr from '../src/i18n/translations/tr.js';

suite('app-header', () => {
  suiteSetup(async () => {
    await i18next.init({
      lng: 'en',
      fallbackLng: 'en',
      resources: {
        en: { translation: en },
        tr: { translation: tr }
      },
      interpolation: {
        escapeValue: false
      }
    });
  });

  test('is defined', () => {
    const el = document.createElement('app-header');
    assert.instanceOf(el, AppHeader);
  });

  test('renders with default properties', async () => {
    const el = await fixture(html`<app-header></app-header>`);
    const logo = el.shadowRoot.querySelector('.logo');
    assert.exists(logo, 'Logo should exist');
  });

  test('shows correct text in add new button', async () => {
    const el = await fixture(html`<app-header></app-header>`);
    const addNewBtn = el.shadowRoot.querySelector('.add-new-btn');
    assert.include(addNewBtn.textContent.trim(), 'Add New');
  });

  test('toggles language popup when clicked', async () => {
    const el = await fixture(html`<app-header></app-header>`);
    const langSelector = el.shadowRoot.querySelector('.language-selector');
    const popup = el.shadowRoot.querySelector('.language-popup');
    
    langSelector.click();
    await el.updateComplete;
    
    assert.isTrue(el.showLanguagePopup);
    assert.equal(popup.getAttribute('data-show'), 'true');
  });

  test('changes language when language option is clicked', async () => {
    const el = await fixture(html`<app-header></app-header>`);
    const trButton = el.shadowRoot.querySelector('.language-option:last-child');
    
    trButton.click();
    await el.updateComplete;
    
    assert.equal(document.documentElement.lang, 'tr');
  });

  test('opens employee modal when add new button is clicked', async () => {
    const el = await fixture(html`<app-header></app-header>`);
    const addNewBtn = el.shadowRoot.querySelector('.add-new-btn');
    
    const mockModal = document.createElement('div');
    mockModal.isOpen = false;
    mockModal.setAttribute = () => {};
    mockModal.style = {};
    mockModal.addEventListener = () => {};

    const originalCreateElement = document.createElement.bind(document);
    document.createElement = (tagName) => {
      if (tagName === 'employee-modal') {
        return mockModal;
      }
      return originalCreateElement(tagName);
    };
    
    addNewBtn.click();
    await el.updateComplete;
    
    assert.isTrue(mockModal.isOpen, 'Employee modal should be opened');
    document.createElement = originalCreateElement;
  });

  test('login button navigates to login page when clicked', async () => {
    const el = await fixture(html`<app-header></app-header>`);
    const loginBtn = el.shadowRoot.querySelector('.login-btn');
    
    let navigatedToLogin = false;
    el.navigateToLogin = () => {
      navigatedToLogin = true;
    };
    
    loginBtn.click();
    await el.updateComplete;
    
    assert.isTrue(navigatedToLogin);
  });
});
