import {computed, Directive, inject, input, type OnInit} from "@angular/core"

import {
  CoreInlineNotificationRootDirective,
  provideInlineNotificationContext,
} from "@qualcomm-ui/angular-core/inline-notification"
import {normalizeProps} from "@qualcomm-ui/angular-core/machine"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import {
  createQdsInlineNotificationApi,
  type QdsNotificationApiProps,
  type QdsNotificationEmphasis,
  type QdsNotificationOrientation,
} from "@qualcomm-ui/qds-core/inline-notification"

import {
  provideQdsInlineNotificationContext,
  QdsInlineNotificationContextService,
} from "./qds-inline-notification-context.service"

@Directive({
  providers: [
    provideInlineNotificationContext(),
    provideQdsInlineNotificationContext(),
  ],
  selector: "[q-inline-notification-root]",
  standalone: false,
})
export class InlineNotificationRootDirective
  extends CoreInlineNotificationRootDirective
  implements SignalifyInput<QdsNotificationApiProps>, OnInit
{
  /**
   * Governs the color of the notification and its icon.
   *
   * @default 'info'
   */
  readonly emphasis = input<QdsNotificationEmphasis>()

  /**
   * The layout of the notification's elements.
   * @option `'horizontal'`: The icon, title, description, link, and close button are displayed inline.
   * @option `'vertical'`: The icon, title, and close button are placed on the first line, while the description, and link are stacked vertically and aligned with the title.
   *
   * @default 'horizontal'
   */
  readonly orientation = input<QdsNotificationOrientation>()

  protected readonly qdsInlineNotificationService = inject(
    QdsInlineNotificationContextService,
  )

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() =>
        this.qdsInlineNotificationService.context().getRootBindings(),
      ),
    )
  }

  override ngOnInit() {
    super.ngOnInit()

    this.qdsInlineNotificationService.init(
      computed(() =>
        createQdsInlineNotificationApi(
          {emphasis: this.emphasis(), orientation: this.orientation()},
          normalizeProps,
        ),
      ),
    )
  }
}
