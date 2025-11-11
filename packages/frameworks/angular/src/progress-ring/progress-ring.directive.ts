import {Component, input} from "@angular/core"

import {provideProgressRingContext} from "@qualcomm-ui/angular-core/progress-ring"

import {ProgressRingRootDirective} from "./progress-ring-root.directive"
import {provideQdsProgressRingContext} from "./qds-progress-ring-context.service"

@Component({
  providers: [provideProgressRingContext(), provideQdsProgressRingContext()],
  selector: "[q-progress-ring]",
  standalone: false,
  template: `
    <div q-progress-ring-circle-container>
      <ng-content select="[q-progress-ring-value-text]" />
      <ng-content select="[q-progress-ring-circle]">
        <svg q-progress-ring-circle></svg>
      </ng-content>
    </div>

    <ng-content select="[q-progress-ring-label]">
      @if (label()) {
        <div q-progress-ring-label>{{ label() }}</div>
      }
    </ng-content>

    <ng-content select="[q-progress-ring-error-text]">
      <div q-progress-ring-error-text>{{ errorText() }}</div>
    </ng-content>
  `,
})
export class ProgressRingDirective extends ProgressRingRootDirective {
  /**
   * Error text rendered below the progress ring when {@link invalid} is true.
   *
   * @remarks
   * To customize the element, provide it using the directive instead:
   * ```angular-html
   * <div q-progress-ring-error-text>...</div>
   * ```
   */
  readonly errorText = input<string>()

  /**
   * Accessible label for the progress ring, rendered below the circle.
   *
   * @remarks
   * To customize the element, provide it using the directive instead:
   * ```angular-html
   * <div q-progress-ring-label>...</div>
   * ```
   */
  readonly label = input<string>()
}
