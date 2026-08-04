import {Component} from "@angular/core"

import {AlertBannerModule} from "@qualcomm-ui/angular/alert-banner"
import {ButtonModule} from "@qualcomm-ui/angular/button"

@Component({
  imports: [AlertBannerModule, ButtonModule],
  selector: "alert-banner-simple-demo",
  template: `
    <!-- preview -->
    <div
      description="Description"
      dismissable
      heading="Heading"
      q-alert-banner
      (closed)="onClose()"
    >
      <button q-alert-banner-button>Action</button>
    </div>
    <!-- preview -->
  `,
})
export class AlertBannerSimpleDemo {
  onClose() {
    console.log("close")
  }
}
