import {booleanAttribute, Component, input} from "@angular/core"

import type {QdsCheckboxSize} from "@qualcomm-ui/qds-core/checkbox"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"

@Component({
  selector: "q-checkmark-icon",
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
  template: `
    @if (indeterminate()) {
      @if (size() === "sm") {
        <svg
          data-part="indicator-icon"
          height="2"
          viewBox="0 0 8 2"
          width="8"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M8 2H0V0H8V2Z" fill="currentColor" />
        </svg>
      } @else if (size() === "lg") {
        <svg
          data-part="indicator-icon"
          height="4"
          viewBox="0 0 10 4"
          width="10"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M10 3.5H0V0.5H10V3.5Z" fill="currentColor" />
        </svg>
      } @else {
        <svg
          data-part="indicator-icon"
          height="2"
          viewBox="0 0 10 2"
          width="10"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.5 2H0.5V0H9.5V2Z" fill="currentColor" />
        </svg>
      }
    } @else {
      @if (size() === "sm") {
        <svg
          data-part="indicator-icon"
          height="8"
          viewBox="0 0 10 8"
          width="10"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3.74988 7.28125L0.624878 4.18294L1.61913 3.21875L3.74988 5.30975L8.38032 0.71875L9.37519 1.7045L3.74988 7.28125Z"
            fill="currentColor"
          />
        </svg>
      } @else if (size() === "lg") {
        <svg
          data-part="indicator-icon"
          height="10"
          viewBox="0 0 12 10"
          width="12"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.46414 9.0312L0.624878 5.22472L1.84638 4.04016L4.46414 6.60908L10.1529 0.96875L11.3752 2.17981L4.46414 9.0312Z"
            fill="currentColor"
          />
        </svg>
      } @else {
        <svg
          data-part="indicator-icon"
          height="8"
          viewBox="0 0 10 8"
          width="10"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3.60701 7.65622L0.124878 4.20383L1.23275 3.12945L3.60701 5.45942L8.76662 0.34375L9.87519 1.44215L3.60701 7.65622Z"
            fill="currentColor"
          />
        </svg>
      }
    }
  `,
})
export class CheckmarkIconComponent {
  readonly indeterminate = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  readonly size = input<QdsCheckboxSize | undefined>()
}
