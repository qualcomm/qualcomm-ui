import {Component, signal} from "@angular/core"

import {AvatarModule} from "@qualcomm-ui/angular/avatar"

@Component({
  imports: [AvatarModule],
  selector: "avatar-state-callback",
  template: `
    <div class="flex items-center gap-4">
      <!-- preview -->
      <div q-avatar (stateChanged)="currentStateValid.set($event.state)">
        <img alt="John Doe" q-avatar-image src="/images/avatar-man.png" />
        <div q-avatar-content>JD</div>
      </div>
      <output>current state: {{ currentStateValid() }}</output>
      <div q-avatar (stateChanged)="currentStateInvalid.set($event.state)">
        <img alt="John Doe" q-avatar-image src="https://example.invalid" />
        <div q-avatar-content>JD</div>
      </div>
      <output>current state: {{ currentStateInvalid() }}</output>
      <!-- preview -->
    </div>
  `,
})
export class AvatarStateCallbackDemo {
  readonly currentStateValid = signal<string | null>("")
  readonly currentStateInvalid = signal<string | null>("")
}
