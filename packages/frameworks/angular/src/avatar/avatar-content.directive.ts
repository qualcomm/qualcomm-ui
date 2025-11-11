import {computed, Directive, input} from "@angular/core"

import {CoreAvatarContentDirective} from "@qualcomm-ui/angular-core/avatar"
import {type QdsAvatarVariant} from "@qualcomm-ui/qds-core/avatar"

import {useQdsAvatarContext} from "./qds-avatar-context.service"

@Directive({
  selector: "[q-avatar-content]",
  standalone: false,
})
export class AvatarContentDirective extends CoreAvatarContentDirective {
  /**
   * The variant of the avatar.
   */
  readonly variant = input<QdsAvatarVariant | undefined>()

  readonly qdsContext = useQdsAvatarContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsContext().getContentBindings()),
    )
  }
}
