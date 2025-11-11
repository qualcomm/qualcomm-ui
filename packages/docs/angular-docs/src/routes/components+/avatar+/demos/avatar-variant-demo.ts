import {Component} from "@angular/core"

import {AvatarModule} from "@qualcomm-ui/angular/avatar"

@Component({
  imports: [AvatarModule],
  selector: "avatar-variant",
  template: `
    <div class="flex items-center gap-4">
      <!-- preview -->
      Neutral
      <div q-avatar>
        <div q-avatar-content variant="neutral">OK</div>
      </div>
      High Contrast
      <div q-avatar>
        <div q-avatar-content variant="contrast">OK</div>
      </div>
      Brand
      <div q-avatar>
        <div q-avatar-content variant="brand">OK</div>
      </div>
      <!-- preview -->
    </div>
  `,
})
export class AvatarVariantDemo {}
