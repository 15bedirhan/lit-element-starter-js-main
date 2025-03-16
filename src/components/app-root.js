import { LitElement, html, css } from 'lit';
import { initRouter } from '../router.js';
import { setupI18n } from '../i18n/i18n.js';
import './app-header.js';

export class AppRoot extends LitElement {
  static styles = css`
    :host {
      display: block;
      min-height: 100vh;
      background: #f5f5f5;
    }
  `;

  async firstUpdated() {
    await setupI18n();
    const outlet = this.renderRoot.querySelector('#outlet');
    const router = initRouter(outlet);
    window.router = router;
  }

  render() {
    return html`
      <app-header></app-header>
      <main id="outlet"></main>
    `;
  }
}

customElements.define('app-root', AppRoot);