import {Component, computed, input} from "@angular/core"
import {Eye, EyeOff} from "lucide-angular"

import {useInlineIconButtonApi} from "@qualcomm-ui/angular/inline-icon-button"
import {useQdsInputContext} from "@qualcomm-ui/angular/input"
import {
  type LucideIconOrString,
  provideIcons,
} from "@qualcomm-ui/angular-core/lucide"
import {CorePasswordInputVisibilityTriggerDirective} from "@qualcomm-ui/angular-core/password-input"
import {passwordInputClasses} from "@qualcomm-ui/qds-core/password-input"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

@Component({
  providers: [provideIcons({Eye, EyeOff})],
  selector: "[q-password-input-visibility-trigger]",
  standalone: false,
  template: `
    <svg [q-bind]="buttonApi().getIconBindings()" [qIcon]="icon()"></svg>
  `,
})
export class PasswordInputVisibilityTriggerDirective extends CorePasswordInputVisibilityTriggerDirective {
  /**
   * The icon shown when the input text is visible.
   *
   * @default EyeOff
   */
  readonly iconOff = input<LucideIconOrString>("EyeOff")

  /**
   * The icon shown when the input text is hidden.
   *
   * @default Eye
   */
  readonly iconOn = input<LucideIconOrString>("Eye")

  readonly icon = computed(() =>
    this.passwordInputContext().visible ? this.iconOff() : this.iconOn(),
  )

  protected readonly qdsContext = useQdsInputContext()

  protected readonly buttonApi = useInlineIconButtonApi({
    emphasis: "neutral",
    size: computed(() => this.qdsContext().size),
    variant: "scale",
  })

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() =>
        mergeProps(this.buttonApi().getRootBindings(), {
          class: passwordInputClasses.visibilityTrigger,
        }),
      ),
    )
  }
}
