import { LitElement, property, html } from "lit-element";
import { ChameleonTabsStyle } from "./ChameleonTabsStyle.js";

export class ChameleonTabs extends LitElement {
  constructor() {
    super();
    this.addEventListener(
      "chameleon.tabs.selected-changed",
      this._handleSelectedChanged
    );
  }

  /**
   * Lifecycle Methods
   */
  firstUpdated() {
    // Index tabs
    const tabs = Array.from(this.querySelectorAll("chameleon-tab"));
    if (tabs.length <= 0)
      throw new Error(
        "<chameleon-tabs> must have at least one <chameleon-tab> element"
      );
    tabs.forEach((tab, i) => tab.setAttribute("data-index", i.toString()));

    // If <chameleon-tabs> has an id, allow the selected tab index to
    // be set using query params: ?tabs_<ID>=1
    if (this.id) {
      const params = new URLSearchParams(window.location.search);
      if (params.has(`tabs_${this.id}`)) {
        const index = parseInt(params.get(`tabs_${this.id}`));
        this.selected = index <= tabs.length - 1 ? index : 0;
      } else {
        if (this.urlRewrite)
          params.append(`tabs_${this.id}`, String(this.selected));
      }
    }
  }

  updated(changedProperties) {
    if (changedProperties.has("selected")) {
      const tabs = Array.from(this.querySelectorAll("chameleon-tab"));

      tabs.forEach((tab, i) => {
        tab.removeAttribute("active");
        if (i === this.selected) tab.setAttribute("active", "true");
      });
    }
  }

  /**
   * Properties
   */
  @property({ type: Number, reflect: true })
  selected = 0;

  /** Automatically rewrite URL with tab index information. Default: true. */
  @property({ type: Boolean })
  urlRewrite = true;

  /**
   * Styles
   */
  static styles = [ChameleonTabsStyle];

  /**
   * Template
   */
  render() {
    return html`<slot></slot>`;
  }

  _handleSelectedChanged(e) {
    e.preventDefault();
    this.selected = parseInt(e.detail.value);
    this.updateQueryParams();
  }

  updateQueryParams() {
    const params = new URLSearchParams(window.location.search);
    if (this.urlRewrite) params.set(`tabs_${this.id}`, String(this.selected));
  }
}
