import {Component, input} from "@angular/core"

import {provideQdsInputContext} from "@qualcomm-ui/angular/input"
import {provideNumberInputContext} from "@qualcomm-ui/angular-core/number-input"

import {NumberInputRootDirective} from "./number-input-root.directive"
import {provideQdsNumberInputContext} from "./qds-number-input-context.service"

@Component({
  providers: [
    provideNumberInputContext(),
    provideQdsInputContext(),
    provideQdsNumberInputContext(),
  ],
  selector: "q-number-input",
  standalone: false,
  template: `
    <ng-content select="[q-number-input-label]">
      @if (label()) {
        <label q-number-input-label>{{ label() }}</label>
      }
    </ng-content>
    <div q-number-input-input-group>
      <input q-number-input-input [placeholder]="placeholder()" />

      <ng-content select="[q-number-input-control]">
        <div q-number-input-control></div>
      </ng-content>

      <ng-content select="[q-number-input-error-indicator]">
        <span q-number-input-error-indicator></span>
      </ng-content>
    </div>
    <ng-content select="[q-number-input-hint]">
      @if (hint()) {
        <span q-number-input-hint>
          {{ hint() }}
        </span>
      }
    </ng-content>

    <ng-content select="[q-number-input-error-text]">
      @if (errorText()) {
        <div q-number-input-error-text>
          {{ errorText() }}
        </div>
      }
    </ng-content>
  `,
})
export class NumberInputComponent extends NumberInputRootDirective {
  /**
   * Optional error that describes the element when {@link invalid} is true.
   *
   * @remarks
   * To customize the element, provide it using the directive instead:
   * ```angular-html
   * <q-number-input>
   *   <div q-number-input-error-text>...</div>
   * </q-number-input>
   * ```
   */
  readonly errorText = input<string | undefined>()

  /**
   * Optional hint describing the element. This element is automatically
   * associated with the component's input element for accessibility.
   *
   * @remarks
   * To customize the element, provide it using the directive instead:
   * ```angular-html
   * <q-number-input>
   *   <div q-number-input-hint>...</div>
   * </q-number-input>
   * ```
   */
  readonly hint = input<string | undefined>()

  /**
   * Optional label describing the element. Recommended. This element is
   * automatically associated with the component's input element for
   * accessibility.
   *
   * @remarks
   * To customize the element, provide it using the directive instead:
   * ```angular-html
   * <q-number-input>
   *   <div q-number-input-label>...</div>
   * </q-number-input>
   * ```
   */
  readonly label = input<string | undefined>()

  /**
   * HTML {@link https://www.w3schools.com/tags/att_input_placeholder.asp placeholder} attribute,
   * passed to the internal input element.
   */
  readonly placeholder = input<string>("")
}
