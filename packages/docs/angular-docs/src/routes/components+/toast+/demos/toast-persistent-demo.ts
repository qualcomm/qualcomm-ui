import {Component, inject} from "@angular/core"

import {ButtonModule} from "@qualcomm-ui/angular/button"
import {provideToaster, ToasterService, ToastModule} from "@qualcomm-ui/angular/toast"

@Component({
  imports: [ToastModule, ButtonModule],
  providers: [
    provideToaster({
      overlap: true,
      placement: "bottom-end",
    }),
  ],
  selector: "toast-persistent-demo",
  template: `
    <div q-toaster [toaster]="toaster"></div>

    <button q-button variant="outline" (click)="createToast()">
      Show Toast
    </button>
  `,
})
export class ToastPersistentDemo {
  toaster = inject(ToasterService).toaster

  createToast() {
    this.toaster.create({
      label: "Persistent Toast",
      type: "loading",
    })
  }
}
