import {Component} from "@angular/core"

import {AvatarModule} from "@qualcomm-ui/angular/avatar"

@Component({
  imports: [AvatarModule],
  selector: "avatar-status",
  template: `
    <div class="flex items-center gap-4">
      <!-- preview -->
      Active
      <div q-avatar>
        <img alt="Jane Doe" q-avatar-image src="/images/avatar-woman.png" />
        <div q-avatar-content>JD</div>
        <div q-avatar-status status="active"></div>
      </div>
      Offline
      <div q-avatar>
        <img alt="Jane Doe" q-avatar-image src="/images/avatar-woman.png" />
        <div q-avatar-content>JD</div>
        <div q-avatar-status status="offline"></div>
      </div>
      Away
      <div q-avatar>
        <img alt="Jane Doe" q-avatar-image src="/images/avatar-woman.png" />
        <div q-avatar-content>JD</div>
        <div q-avatar-status status="away"></div>
      </div>
      Busy
      <div q-avatar>
        <img alt="Jane Doe" q-avatar-image src="/images/avatar-woman.png" />
        <div q-avatar-content>JD</div>
        <div q-avatar-status status="busy"></div>
      </div>
      <!-- preview -->
    </div>
  `,
})
export class AvatarStatusDemo {}
