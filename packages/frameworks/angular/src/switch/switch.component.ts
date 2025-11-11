import {Component, input} from "@angular/core"

import {provideSwitchContext} from "@qualcomm-ui/angular-core/switch"

import {provideQdsSwitchContext} from "./qds-switch-context.service"
import {SwitchRootDirective} from "./switch-root.directive"

@Component({
  providers: [provideSwitchContext(), provideQdsSwitchContext()],
  selector: "[q-switch]",
  standalone: false,
  template: `
    <ng-content select="[q-switch-hidden-input]">
      <input q-switch-hidden-input />
    </ng-content>
    <ng-content select="[q-switch-control]">
      <div q-switch-control>
        <div q-switch-thumb></div>
      </div>
    </ng-content>
    <ng-content select="[q-switch-label]">
      @if (label()) {
        <span q-switch-label>
          {{ label() }}
        </span>
      }
    </ng-content>
    <ng-content select="[q-switch-error-text]">
      @if (errorText()) {
        <div q-switch-error-text>
          {{ errorText() }}
        </div>
      }
    </ng-content>
  `,
})
export class SwitchComponent extends SwitchRootDirective {
  /**
   * Optional error that describes the switch when the field is invalid. This
   * element is automatically associated with the switch for accessibility.
   *
   * @remarks
   * To customize the element, provide it using the directive instead:
   *
   * ```angular-html
   * <label q-switch>
   *   <div q-switch-error-text>...</div>
   * </label>
   * ```
   */
  readonly errorText = input<string>()

  /**
   * Optional label describing the element. Recommended. This element is
   * automatically associated with the component's input element for accessibility.
   *
   * @remarks
   * To customize the element, provide it using the directive instead:
   *
   * ```angular-html
   * <label q-switch>
   *   <div q-switch-label>...</div>
   * </label>
   * ```
   */
  readonly label = input<string>()
}
