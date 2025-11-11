import {Component} from "@angular/core"

import {AvatarModule} from "@qualcomm-ui/angular/avatar"

@Component({
  imports: [AvatarModule],
  selector: "avatar-size",
  template: `
    <div class="flex items-center gap-4">
      <!-- preview -->
      XSmall
      <div q-avatar size="xs">
        <img alt="Jane Doe" q-avatar-image src="/images/avatar-woman.png" />
        <div q-avatar-content>JD</div>
      </div>
      Small
      <div q-avatar size="sm">
        <img alt="Jane Doe" q-avatar-image src="/images/avatar-woman.png" />
        <div q-avatar-content>JD</div>
      </div>
      Medium
      <div q-avatar size="md">
        <img alt="Jane Doe" q-avatar-image src="/images/avatar-woman.png" />
        <div q-avatar-content>JD</div>
      </div>
      Large
      <div q-avatar size="lg">
        <img alt="Jane Doe" q-avatar-image src="/images/avatar-woman.png" />
        <div q-avatar-content>JD</div>
      </div>
      XLarge
      <div q-avatar size="xl">
        <img alt="Jane Doe" q-avatar-image src="/images/avatar-woman.png" />
        <div q-avatar-content>JD</div>
      </div>
      <!-- preview -->
    </div>
  `,
})
export class AvatarSizeDemo {}
