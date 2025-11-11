import {Component, computed, inject, type OnInit} from "@angular/core"

import {normalizeProps} from "@qualcomm-ui/angular-core/machine"
import {CoreToastRootDirective} from "@qualcomm-ui/angular-core/toast"
import {createQdsToastApi} from "@qualcomm-ui/qds-core/toast"

import {
  provideQdsToastContext,
  QdsToastContextService,
} from "./qds-toast-context.service"

@Component({
  providers: [provideQdsToastContext()],
  selector: "[q-toast-root]",
  standalone: false,
  template: `
    <div [q-bind]="toastContext().getGhostBeforeBindings()"></div>

    <ng-content />

    <div [q-bind]="toastContext().getGhostAfterBindings()"></div>
  `,
})
export class ToastRootDirective
  extends CoreToastRootDirective
  implements OnInit
{
  protected readonly qdsToastService = inject(QdsToastContextService)

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsToastService.context().getRootBindings()),
    )
  }

  override ngOnInit() {
    this.qdsToastService.init(
      computed(() =>
        createQdsToastApi(
          {
            emphasis: this.toastContext().type,
          },
          normalizeProps,
        ),
      ),
    )

    super.ngOnInit()
  }
}
