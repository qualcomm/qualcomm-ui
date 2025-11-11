import {Component, inject} from "@angular/core"

import {ButtonModule} from "@qualcomm-ui/angular/button"
import {provideToaster, ToasterService, ToastModule} from "@qualcomm-ui/angular/toast"
import type {QdsNotificationEmphasis} from "@qualcomm-ui/qds-core/inline-notification"

@Component({
  imports: [ToastModule, ButtonModule],
  providers: [provideToaster({placement: "bottom-end"})],
  selector: "toast-emphasis-demo",
  template: `
    <div q-toaster [toaster]="toaster"></div>

    <div class="flex flex-wrap gap-4">
      @for (emphasis of types; track emphasis) {
        <button q-button variant="outline" (click)="createToast(emphasis)">
          {{ emphasis }}
        </button>
      }
    </div>
  `,
})
export class ToastEmphasisDemo {
  toaster = inject(ToasterService).toaster

  protected readonly types: QdsNotificationEmphasis[] = [
    "info",
    "success",
    "warning",
    "danger",
    "neutral",
    "loading",
  ]

  createToast(emphasis: QdsNotificationEmphasis) {
    this.toaster.create({
      label: `The status is ${emphasis}`,
      type: emphasis,
    })
  }
}
