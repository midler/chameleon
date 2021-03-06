import { LitElement, html, property } from "lit-element";
import { nothing } from "lit-html";
import { ChameleonCheckboxStyle } from "./ChameleonCheckboxStyle.js";

export class ChameleonCheckbox extends LitElement {
  /**
   * Properties
   */

  // The checkbox's label
  @property({ type: String })
  label = "";

  // The checkbox's form name
  @property({ type: String })
  name = "cha-checkbox";

  // A Boolean which, if true, indicates that the checkbox is selected
  @property({ type: Boolean, reflect: true })
  checked = false;

  // The checkbox's current value
  @property({ type: String })
  value = "";

  // A Boolean attribute which, if true, indicates that the checkbox cannot be edited
  @property({ type: Boolean, reflect: true })
  readonly = false;

  // The checkbox's enabled/disabled status
  @property({ type: Boolean, reflect: true })
  disabled = false;

  // Invalid boolean to allow validity access from higher level form errors
  @property({ type: Boolean, reflect: true })
  invalid = false;

  // A Boolean to indicate the input is required
  @property({ type: Boolean, reflect: true })
  required = false;

  /**
   * Styles
   */
  static styles = [ChameleonCheckboxStyle];

  /**
   * Template
   */
  render() {
    return html`
      <input
        type="checkbox"
        ?checked="${this.checked}"
        .name="${this.name}"
        value="${this.value}"
        ?disabled="${this.disabled}"
        ?readonly="${this.readonly}"
        ?required="${this.required}"
        ?aria-invalid="${this.invalid}"
        aria-describedby="${this.name}-error"
      />
      <span class="checkmark"></span>
      ${this.labelText}
    `;
  }

  get labelText() {
    if (this.label !== "") return this.label;
    else return nothing;
  }
}
