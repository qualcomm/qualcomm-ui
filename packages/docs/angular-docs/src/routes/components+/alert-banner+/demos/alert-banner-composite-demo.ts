import {Component} from "@angular/core"

import {AlertBannerModule} from "@qualcomm-ui/angular/alert-banner"
import {ButtonModule} from "@qualcomm-ui/angular/button"

@Component({
  imports: [AlertBannerModule, ButtonModule],
  selector: "alert-banner-composite-demo",
  template: `
    <!-- preview -->
    <div q-alert-banner-root (closed)="onClose()">
      <span q-alert-banner-icon></span>
      <div q-alert-banner-heading>Heading</div>
      <div q-alert-banner-description>Description</div>
      <button q-alert-banner-button>Action</button>
      <button q-alert-banner-close-button></button>
    </div>
    <!-- preview -->
  `,
})
export class AlertBannerCompositeDemo {
  onClose() {
    console.log("close")
  }
}
