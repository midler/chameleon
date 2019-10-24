import {
  LitElement,
  TemplateResult,
  customElement,
  html,
  property
} from "lit-element";
import { classMap } from "lit-html/directives/class-map";
import base from "@chameleon-ds/theme/base";
import style from "@chameleon-ds/theme/base/button";

@customElement("chameleon-button")
export default class ChameleonButton extends LitElement {
  /**
   * Properties
   */
  @property({ type: Boolean, reflect: true })
  disabled = false;
  @property({ type: String, reflect: true })
  theme = "primary";
  // Element has a left icon
  @property({ type: Boolean, reflect: true })
  "icon-left" = false;

  // Element has a right icon
  @property({ type: Boolean, reflect: true })
  "icon-right" = false;

  // Element has a icon only
  @property({ type: Boolean, reflect: true })
  "icon-only" = false;

  // Element has an href
  @property({ type: String, reflect: true })
  "href" = "";

  // Element should open href in new tab/window
  @property({ type: Boolean, reflect: true })
  "new-tab" = false;

  /**
   * Styles
   */
  static styles = [base, style];

  /**
   * Template
   */
  render(): TemplateResult {
    return html`
      ${this.href && !this.disabled
        ? html`
            <a href=${this.href} target=${this.getTarget()}>
              ${this.renderButton()}
            </a>
          `
        : html`
            ${this.renderButton()}
          `}
    `;
  }

  renderButton(): TemplateResult {
    return html`
      <button
        class="${classMap({ [this.theme]: true })}"
        ?disabled="${this.disabled}"
      >
        <slot name="icon-left"></slot>
        <slot></slot>
        <slot name="icon-right"></slot>
        <slot name="icon-only"></slot>
      </button>
    `;
  }

  getTarget(): string {
    return this["new-tab"] ? `_blank` : `_top`;
  }
}
