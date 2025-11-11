import {
  booleanAttribute,
  computed,
  Directive,
  HostAttributeToken,
  inject,
  input,
  type OnInit,
} from "@angular/core"

import {
  normalizeProps,
  useTrackBindings,
} from "@qualcomm-ui/angular-core/machine"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import {
  getQdsButtonGroupBindings,
  type QdsButtonDensity,
  type QdsButtonEmphasis,
  type QdsButtonGroupApiProps,
  type QdsButtonGroupLayout,
  type QdsButtonSize,
  type QdsButtonVariant,
} from "@qualcomm-ui/qds-core/button"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"
import type {Explicit} from "@qualcomm-ui/utils/guard"

import {
  provideQdsButtonGroupContext,
  QdsButtonGroupContextService,
} from "./qds-button-group-context.service"

@Directive({
  providers: [provideQdsButtonGroupContext()],
  selector: "[q-button-group]",
  standalone: false,
})
export class ButtonGroupDirective
  implements
    SignalifyInput<
      Omit<QdsButtonGroupApiProps, "aria-label" | "aria-labelledby">
    >,
    OnInit
{
  /**
   * The density of the buttons in the group. Governs padding and height.
   *
   * @default 'default'
   */
  readonly density = input<QdsButtonDensity>()

  /**
   * Disables all buttons within the group.
   *
   * @default false
   */
  readonly disabled = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * The emphasis of the buttons in the group.
   */
  readonly emphasis = input<QdsButtonEmphasis>()

  /**
   * The layout used to display the button group.
   * - `hug`: Content-sized; width matches the buttons only (default).
   * - `start`: Full width; buttons are aligned to the start edge.
   * - `end`: Full width; buttons are aligned to the end edge.
   * - `fill`: Full width; buttons share space evenly.
   *
   * @default 'hug'
   */
  readonly layout = input<QdsButtonGroupLayout>()

  /**
   * The size of the buttons in the group.
   *
   * @default 'md'
   */
  readonly size = input<QdsButtonSize>()

  /**
   * The variant of the buttons in the group.
   */
  readonly variant = input<QdsButtonVariant>()

  protected readonly qdsButtonGroupService = inject(
    QdsButtonGroupContextService,
  )

  protected readonly ariaLabel = inject(new HostAttributeToken("aria-label"), {
    optional: true,
  })
  protected readonly ariaLabelledBy = inject(
    new HostAttributeToken("aria-labelledby"),
    {optional: true},
  )

  protected readonly trackBindings = useTrackBindings(() =>
    getQdsButtonGroupBindings(
      {
        "aria-label": this.ariaLabel || undefined,
        "aria-labelledby": this.ariaLabelledBy || undefined,
        density: this.density(),
        disabled: this.disabled(),
        emphasis: this.emphasis(),
        layout: this.layout(),
        size: this.size(),
        variant: this.variant(),
      },
      normalizeProps,
    ),
  )

  ngOnInit() {
    this.qdsButtonGroupService.init(
      computed<
        Explicit<Omit<QdsButtonGroupApiProps, "aria-label" | "aria-labelledby">>
      >(() => ({
        density: this.density(),
        disabled: this.disabled(),
        emphasis: this.emphasis(),
        layout: this.layout(),
        size: this.size(),
        variant: this.variant(),
      })),
    )

    this.trackBindings()
  }
}
