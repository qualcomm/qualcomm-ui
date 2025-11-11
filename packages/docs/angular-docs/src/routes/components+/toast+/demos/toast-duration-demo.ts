import {Component, inject} from "@angular/core"

import {ButtonModule} from "@qualcomm-ui/angular/button"
import {
  provideToaster,
  ToasterService,
  ToastModule,
} from "@qualcomm-ui/angular/toast"

@Component({
  imports: [ToastModule, ButtonModule],
  providers: [provideToaster({overlap: true, placement: "bottom-end"})],
  selector: "toast-duration-demo",
  template: `
    <div q-toaster [toaster]="toaster"></div>

    <button q-button variant="outline" (click)="createToast()">
      Show Toast
    </button>
  `,
})
export class ToastDurationDemo {
  protected readonly toaster = inject(ToasterService).toaster

  createToast() {
    this.toaster.create({
      duration: 10000,
      label: "Task failed successfully",
      type: "success",
    })
  }
}
