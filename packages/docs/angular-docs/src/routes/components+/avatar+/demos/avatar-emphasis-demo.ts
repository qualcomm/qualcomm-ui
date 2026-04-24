import {Component} from "@angular/core"

import {AvatarModule} from "@qualcomm-ui/angular/avatar"

@Component({
  imports: [AvatarModule],
  selector: "avatar-emphasis",
  template: `
    <div class="flex items-center gap-4">
      <!-- preview -->
      Neutral
      <div emphasis="neutral" q-avatar>
        <div q-avatar-content>O</div>
      </div>
      High Contrast
      <div emphasis="contrast" q-avatar>
        <div q-avatar-content>O</div>
      </div>
      Brand
      <div emphasis="brand" q-avatar>
        <div q-avatar-content>O</div>
      </div>
      <!-- preview -->
    </div>
  `,
})
export class AvatarEmphasisDemo {}
