import {booleanAttribute, Component, computed, input} from "@angular/core"
import {CircleAlert, CircleCheck, TriangleAlert} from "lucide-angular"

import {CoreDialogBodyDirective} from "@qualcomm-ui/angular-core/dialog"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"

import {useQdsDialogContext} from "./qds-dialog-context.service"

/**
 * The main content of the dialog. Container for the heading, description,
 * indicator, and primary content of the dialog.
 */
@Component({
  selector: "[q-dialog-body]",
  standalone: false,
  template: `
    @if (!hideIndicatorIcon()) {
      <ng-content select="[q-dialog-indicator-icon]">
        <svg q-dialog-indicator-icon [qIcon]="indicatorIcon()"></svg>
      </ng-content>
    }
    <ng-content />
  `,
})
export class DialogBodyComponent extends CoreDialogBodyDirective {
  protected readonly qdsContext = useQdsDialogContext()

  /**
   * Hides the indicator icon.
   */
  readonly hideIndicatorIcon = input<boolean | undefined, Booleanish>(
    undefined,
    {
      transform: booleanAttribute,
    },
  )

  readonly indicatorIcon = computed(() => {
    switch (this.qdsContext().emphasis) {
      case "neutral":
        return CircleAlert
      case "info":
        return CircleAlert
      case "success":
        return CircleCheck
      case "warning":
        return TriangleAlert
      case "danger":
        return CircleAlert
    }
  })

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsContext().getBodyBindings()),
    )
  }
}
