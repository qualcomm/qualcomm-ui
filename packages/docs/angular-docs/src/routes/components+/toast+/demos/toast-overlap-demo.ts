import {Component, inject} from "@angular/core"

import {ButtonModule} from "@qualcomm-ui/angular/button"
import {
  provideToaster,
  ToasterService,
  ToastModule,
} from "@qualcomm-ui/angular/toast"

@Component({
  imports: [ToastModule, ButtonModule],
  providers: [
    provideToaster({
      overlap: true,
      placement: "bottom-end",
    }),
  ],
  selector: "toast-overlap-demo",
  template: `
    <div q-toaster [toaster]="toaster"></div>

    <button q-button variant="outline" (click)="createToast()">
      Show Toast
    </button>
  `,
})
export class ToastOverlapDemo {
  toaster = inject(ToasterService).toaster

  createToast() {
    this.toaster.create({
      description: "Toast Description",
      label: "Toast Label",
    })
  }
}
