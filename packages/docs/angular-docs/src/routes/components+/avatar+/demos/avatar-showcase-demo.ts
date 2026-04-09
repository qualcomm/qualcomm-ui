import {Component} from "@angular/core"

import {AvatarModule} from "@qualcomm-ui/angular/avatar"

@Component({
  imports: [AvatarModule],
  selector: "avatar-showcase",
  template: `
    <!-- preview -->
    <div q-avatar status="active">
      <img alt="John Doe" q-avatar-image src="/images/avatar-man.png" />
      <div q-avatar-content>J</div>
      <div q-avatar-status></div>
    </div>
    <!-- preview -->
  `,
})
export class AvatarShowcaseDemo {}
