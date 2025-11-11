import {Component} from "@angular/core"

import {ButtonModule} from "@qualcomm-ui/angular/button"
import {createToaster, ToastModule} from "@qualcomm-ui/angular/toast"

@Component({
  imports: [ToastModule, ButtonModule],
  selector: "toast-placement-demo",
  template: `
    <div q-toaster [toaster]="topToaster"></div>
    <div q-toaster [toaster]="bottomToaster"></div>

    <div class="flex gap-4">
      <button q-button variant="outline" (click)="showTop()">
        Show Top Toast
      </button>

      <button q-button variant="outline" (click)="showBottom()">
        Show Bottom Toast
      </button>
    </div>
  `,
})
export class ToastPlacementDemo {
  topToaster = createToaster({
    placement: "top-end",
  })

  bottomToaster = createToaster({
    placement: "bottom-start",
  })

  showTop() {
    this.topToaster.create({
      description: "Toast Description",
      label: "Toast Label",
    })
  }

  showBottom() {
    this.bottomToaster.create({
      description: "Toast Description",
      label: "Toast Label",
    })
  }
}
