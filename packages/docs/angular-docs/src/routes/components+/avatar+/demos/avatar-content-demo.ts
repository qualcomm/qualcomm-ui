import {Component} from "@angular/core"
import {User} from "lucide-angular"

import {AvatarModule} from "@qualcomm-ui/angular/avatar"
import {IconDirective} from "@qualcomm-ui/angular/icon"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"

@Component({
  imports: [AvatarModule, IconDirective],
  providers: [provideIcons({User})],
  selector: "avatar-content",
  template: `
    <div class="flex items-center gap-4">
      <!-- preview -->
      Initials
      <div q-avatar>
        <div q-avatar-content>OK</div>
      </div>
      Icon
      <div q-avatar>
        <div q-avatar-content>
          <svg aria-label="User" qIcon="User"></svg>
        </div>
      </div>
      Fallback
      <div q-avatar>
        <img alt="John Doe" q-avatar-image src="https://example.invalid" />
        <div q-avatar-content>JD</div>
      </div>
      <!-- preview -->
    </div>
  `,
})
export class AvatarContentDemo {}
