import { LitElement, html, css } from 'lit';

export class NotFoundView extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 2rem;
      text-align: center;
    }

    h1 {
      color: #666;
      font-size: 2rem;
      margin-bottom: 1rem;
    }

    a {
      color: var(--primary-color);
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }
  `;

  render() {
    return html`
      <div>
        <h1>Page Not Found</h1>
        <p>The page you're looking for doesn't exist.</p>
        <a href="/employees">Go to Employee List</a>
      </div>
    `;
  }
}

customElements.define('not-found-view', NotFoundView);
