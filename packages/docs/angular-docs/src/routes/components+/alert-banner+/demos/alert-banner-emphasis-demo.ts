import {Component} from "@angular/core"

import {AlertBannerModule} from "@qualcomm-ui/angular/alert-banner"

@Component({
  imports: [AlertBannerModule],
  selector: "alert-banner-emphasis-demo",
  template: `
    <div class="grid w-full gap-4">
      <!-- preview -->
      <div emphasis="info" heading="info" q-alert-banner>
        <button q-alert-banner-button>Action</button>
      </div>
      <div emphasis="success" heading="success" q-alert-banner>
        <button q-alert-banner-button>Action</button>
      </div>
      <div emphasis="warning" heading="warning" q-alert-banner>
        <button q-alert-banner-button>Action</button>
      </div>
      <div emphasis="danger" heading="danger" q-alert-banner>
        <button q-alert-banner-button>Action</button>
      </div>
      <div emphasis="neutral" heading="neutral" q-alert-banner>
        <button q-alert-banner-button>Action</button>
      </div>
      <!-- preview -->
    </div>
  `,
})
export class AlertBannerEmphasisDemo {}
