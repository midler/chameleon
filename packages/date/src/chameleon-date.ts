import {
  LitElement,
  TemplateResult,
  customElement,
  property,
  html,
  svg,
  SVGTemplateResult,
  PropertyValues
} from "lit-element";
import { repeat } from "lit-html/directives/repeat";
import { classMap } from "lit-html/directives/class-map";
import { nothing } from "lit-html/lib/part";
import { DateSelectTarget, MonthSelectionTarget } from "../types";
import style from "./chameleon-date-style";
import "@chameleon-ds/input/src/chameleon-input";
import "@chameleon-ds/button/src/chameleon-button";

@customElement("chameleon-date")
export default class ChameleonDate extends LitElement {
  /**
   * Lifecycle Methods
   */
  firstUpdated(): void {
    if (this.value === "") {
      this.date = new Date();
    } else {
      this.touched = true;
      this.requestUpdate();
    }
    this.renderedDate = this.date!;

    document.addEventListener("click", this.closeOverlay.bind(this));
  }

  updated(changedProperties: PropertyValues): void {
    if (changedProperties.has("value") && this.value !== undefined) {
      this.renderedDate = this.stringToDate(this.value);
    }
  }

  disconnectedCallback(): void {
    document.removeEventListener("click", this.closeOverlay.bind(this));
  }

  /**
   * Properties
   */
  @property({ type: Boolean })
  active = false;

  @property({ type: Object })
  renderedDate: Date | null = null;

  @property({ type: String })
  placeholder = "";

  @property({ type: String })
  label = "";

  @property({ type: String })
  value = "";

  @property({ type: String, reflect: true })
  min = null;

  @property({ type: String, reflect: true })
  max = null;

  @property({ type: String })
  overlayRenderMode = "month";

  // TODO: make these configurable properties/i18n
  private startDay = 0;
  private weekDayValues = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  private monthValues = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];
  private touched = false;

  /**
   * Styles
   */
  static styles = [style];

  /**
   * Template
   */
  render(): TemplateResult {
    return html`
      <chameleon-input
        type="text"
        readonly
        .placeholder="${this.placeholder}"
        .label="${this.label}"
        .value="${this.renderedDateValue}"
        @focus="${this.toggleActive}"
        >${this.calendarIcon}</chameleon-input
      >
      ${this.active
        ? html`
            <div class="overlay ${this.overlayRenderMode}">${this.overlay}</div>
          `
        : nothing}
    `;
  }

  get date(): Date | undefined {
    if (this.value && this.value !== "") return this.stringToDate(this.value);
    return undefined;
  }

  set date(value: Date | undefined) {
    if (value) this.value = this.dateToString(value);
  }

  get overlay(): TemplateResult {
    switch (this.overlayRenderMode) {
      case "year":
        return html`
          <header>
            <chameleon-button theme="text" icon-only @click="${this.prevYear}"
              >${this.prevIcon}</chameleon-button
            >
            <h3>
              ${this.renderedDate?.getFullYear()}
            </h3>
            <chameleon-button theme="text" icon-only @click="${this.nextYear}"
              >${this.nextIcon}</chameleon-button
            >
          </header>
          <div class="date-grid">
            ${repeat(
              this.monthValues,
              (month, i) =>
                html`
                  <div
                    class="month"
                    .value="${{
                      month: i,
                      year: this.renderedDate?.getFullYear()
                    }}"
                    @click="${this.setMonth}"
                  >
                    ${month}
                  </div>
                `
            )}
          </div>
        `;
      case "month":
      default:
        return html`
          <header>
            <chameleon-button theme="text" icon-only @click="${this.prevMonth}"
              >${this.prevIcon}</chameleon-button
            >
            <h3 @click="${this.toggleOverlayView}">
              ${this.renderedDate?.toLocaleString("default", {
                month: "long"
              })}
              ${this.renderedDate?.getFullYear()}
            </h3>
            <chameleon-button theme="text" icon-only @click="${this.nextMonth}"
              >${this.nextIcon}</chameleon-button
            >
          </header>
          ${this.dayOfWeek} ${this.dateGrid}
        `;
    }
  }

  get dayOfWeek(): TemplateResult {
    const days = <Array<string>>[];

    for (let i = 0; i < 7; i++) {
      const pointer = (i + this.startDay) % 7;
      days.push(this.weekDayValues[pointer]);
    }

    return html`
      <div class="day-of-week">
        ${repeat(
          days,
          day =>
            html`
              <div>${day}</div>
            `
        )}
      </div>
    `;
  }

  get dateGrid(): TemplateResult | object {
    const currentDate = new Date();
    const minDate = this.min ? this.stringToDate(this.min!).getTime() : -1;
    const maxDate = this.max
      ? this.stringToDate(this.max!).getTime()
      : Infinity;

    return this.days
      ? html`
          <div class="date-grid offset-${this.days[0].getDay()}">
            ${repeat(
              this.days,
              day => html`
                <div
                  class="${classMap({
                    active:
                      day.getDate() == this.date?.getDate() &&
                      day.getMonth() == this.date?.getMonth() &&
                      day.getFullYear() == this.date?.getFullYear(),
                    current:
                      day.getDate() == currentDate.getDate() &&
                      day.getMonth() == currentDate.getMonth() &&
                      day.getFullYear() == currentDate.getFullYear()
                  })}"
                  .value="${day}"
                  ?disabled="${day.getTime() < minDate ||
                    day.getTime() > maxDate}"
                  @click="${this.setDate}"
                >
                  ${day.getDate()}
                </div>
              `
            )}
          </div>
        `
      : nothing;
  }

  get days(): Date[] | undefined {
    const year = this.renderedDate?.getFullYear();
    const month = this.renderedDate?.getMonth();

    if (year !== undefined && month !== undefined)
      return new Array(31)
        .fill(null)
        .map((_v, i) => new Date(year, month, i + 1))
        .filter(v => v.getMonth() === month);

    return undefined;
  }

  get renderedDateValue(): string {
    return this.touched
      ? this.date?.toLocaleDateString(undefined, {
          month: "long",
          day: "numeric",
          year: "numeric"
        }) ?? ""
      : "";
  }

  get calendarIcon(): SVGTemplateResult {
    return svg`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-calendar" slot="icon-right"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`;
  }

  get prevIcon(): SVGTemplateResult | TemplateResult {
    const slots = Array.from(this.querySelectorAll("[slot]"));
    const prevIcon = slots.find(slot => slot.slot === "prev-icon");

    if (prevIcon === undefined)
      return svg`<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-left-circle"><circle cx="12" cy="12" r="10"></circle><polyline points="12 8 8 12 12 16"></polyline><line x1="16" y1="12" x2="8" y2="12"></line></svg>`;
    else
      return html`
        <slot name="prev-icon"></slot>
      `;
  }

  get nextIcon(): SVGTemplateResult {
    const slots = Array.from(this.querySelectorAll("[slot]"));
    const nextIcon = slots.find(slot => slot.slot === "next-icon");

    if (nextIcon === undefined)
      return svg`<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-right-circle"><circle cx="12" cy="12" r="10"></circle><polyline points="12 16 16 12 12 8"></polyline><line x1="8" y1="12" x2="16" y2="12"></line></svg>`;
    else
      return html`
        <slot name="next-icon"></slot>
      `;
  }

  toggleActive(): void {
    this.active = true;
  }

  prevMonth(): void {
    const date = this.renderedDate!;
    date.setMonth(date.getMonth() - 1);

    this.renderedDate = new Date(date);
  }

  nextMonth(): void {
    const date = this.renderedDate!;
    date.setMonth(date.getMonth() + 1);

    this.renderedDate = new Date(date);
  }

  prevYear(): void {
    const date = this.renderedDate!;
    date.setFullYear(date.getFullYear() - 1);

    this.renderedDate = new Date(date);
  }

  nextYear(): void {
    const date = this.renderedDate!;
    date.setFullYear(date.getFullYear() + 1);

    this.renderedDate = new Date(date);
  }

  private async setDate(e: MouseEvent): Promise<void> {
    this.touched = true;
    const date = (<DateSelectTarget>e.target)!.value;
    this.date = date;
    this.active = false;

    this.requestUpdate();
    await this.updateComplete;
    this.dispatchEvent(
      new CustomEvent("chameleon.date.input", {
        bubbles: true,
        composed: true,
        detail: {
          value: this.value
        }
      })
    );
  }

  private setMonth(e: MouseEvent): void {
    this.touched = true;
    const month = (<MonthSelectionTarget>e.target)!.value!.month;
    const year = (<MonthSelectionTarget>e.target)!.value!.year;
    const date = new Date();
    date.setFullYear(year);
    date.setMonth(month);
    this.renderedDate = date;
    this.overlayRenderMode = "month";
  }

  private dateToString(date: Date): string {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return `${year}-${month}-${day}`;
  }

  private stringToDate(date: string): Date {
    const [year, month, day] = date.split("-");

    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  }

  private closeOverlay(e: MouseEvent): void {
    const targets = e
      .composedPath()
      .map(eventTarget => (eventTarget as Element).tagName);

    if (!targets.includes("CHAMELEON-DATE")) {
      this.active = false;
      this.overlayRenderMode = "month";
    }
  }

  private toggleOverlayView(): void {
    switch (this.overlayRenderMode) {
      case "month":
        this.overlayRenderMode = "year";
        break;
      default:
        this.overlayRenderMode = "month";
    }
  }
}