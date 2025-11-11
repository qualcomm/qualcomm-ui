import {Component, inject} from "@angular/core"

import {ButtonModule} from "@qualcomm-ui/angular/button"
import {
  provideToaster,
  ToasterService,
  ToastModule,
} from "@qualcomm-ui/angular/toast"
import {WINDOW} from "@qualcomm-ui/angular-core/dom"

@Component({
  imports: [ToastModule, ButtonModule],
  providers: [provideToaster({placement: "bottom-end"})],
  selector: "toast-action-demo",
  template: `
    <div q-toaster [toaster]="toaster"></div>

    <button q-button variant="outline" (click)="createToast()">
      Create Toast
    </button>
  `,
})
export class ToastActionDemo {
  toaster = inject(ToasterService).toaster

  protected readonly window = inject(WINDOW)

  createToast() {
    this.toaster.create({
      action: {
        label: "Action",
        onClick: () => {
          this.window.alert("You clicked an action")
        },
      },
      description: "Toast Description",
      label: "Toast Label",
    })
  }
}
