import {Component} from "@angular/core"

import {AvatarModule} from "@qualcomm-ui/angular/avatar"

@Component({
  imports: [AvatarModule],
  selector: "avatar-status",
  template: `
    <div class="flex items-center gap-4">
      <!-- preview -->
      Active
      <div q-avatar status="active">
        <img alt="Jane Doe" q-avatar-image src="/images/avatar-woman.png" />
        <div q-avatar-content>J</div>
        <div q-avatar-status></div>
      </div>
      Offline
      <div q-avatar status="offline">
        <img alt="Jane Doe" q-avatar-image src="/images/avatar-woman.png" />
        <div q-avatar-content>J</div>
        <div q-avatar-status></div>
      </div>
      Away
      <div q-avatar status="away">
        <img alt="Jane Doe" q-avatar-image src="/images/avatar-woman.png" />
        <div q-avatar-content>J</div>
        <div q-avatar-status></div>
      </div>
      Busy
      <div q-avatar status="busy">
        <img alt="Jane Doe" q-avatar-image src="/images/avatar-woman.png" />
        <div q-avatar-content>J</div>
        <div q-avatar-status></div>
      </div>
      <!-- preview -->
    </div>
  `,
})
export class AvatarStatusDemo {}
