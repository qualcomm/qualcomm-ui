import {computed, Directive} from "@angular/core"

import {CoreInlineNotificationDescriptionDirective} from "@qualcomm-ui/angular-core/inline-notification"

import {useQdsInlineNotificationContext} from "./qds-inline-notification-context.service"

@Directive({
  selector: "[q-inline-notification-description]",
  standalone: false,
})
export class InlineNotificationDescriptionDirective extends CoreInlineNotificationDescriptionDirective {
  protected readonly qdsContext = useQdsInlineNotificationContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsContext().getDescriptionBindings()),
    )
  }
}
