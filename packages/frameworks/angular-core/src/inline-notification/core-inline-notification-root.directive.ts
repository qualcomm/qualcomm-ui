import {DOCUMENT} from "@angular/common"
import {
  computed,
  Directive,
  inject,
  Injector,
  input,
  type OnInit,
  output,
} from "@angular/core"

import {
  useId,
  useIsMounted,
  useOnDestroy,
} from "@qualcomm-ui/angular-core/common"
import {
  normalizeProps,
  useMachine,
  useTrackBindings,
} from "@qualcomm-ui/angular-core/machine"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import {
  createInlineNotificationApi,
  type InlineNotificationApiProps,
  inlineNotificationMachine,
} from "@qualcomm-ui/core/inline-notification"
import type {Direction} from "@qualcomm-ui/utils/direction"
import type {Explicit} from "@qualcomm-ui/utils/guard"

import {InlineNotificationContextService} from "./inline-notification-context.service"

@Directive()
export class CoreInlineNotificationRootDirective
  implements SignalifyInput<InlineNotificationApiProps>, OnInit
{
  /**
   * The document's text/writing direction.
   *
   * @default "ltr"
   */
  readonly dir = input<Direction | undefined>(undefined)

  /**
   * A root node to correctly resolve the Document in custom environments. i.e.,
   * Iframes, Electron.
   */
  readonly getRootNode = input<
    (() => ShadowRoot | Document | Node) | undefined
  >()

  /**
   * {@link https://www.w3schools.com/html/html_id.asp id attribute}. If
   * omitted, a unique identifier will be generated for accessibility.
   */
  readonly id = input<string>()

  /**
   * The WAI-ARIA {@link https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles role} of the notification.
   * @option `'alert'`: Use this role when the notification is an alert that requires the user's immediate attention, like for errors or urgent information.
   * @option `'status'`: Use this role when the notification is a status message that doesn't require the user's immediate attention, like for success or informational messages.
   *
   * @default 'status'
   */
  readonly role = input<"alert" | "status">()

  /**
   * Function invoked when the notification is dismissed
   */
  readonly dismissed = output<void>()

  protected readonly inlineNotificationService = inject(
    InlineNotificationContextService,
  )

  protected readonly trackBindings = useTrackBindings(() => {
    return this.inlineNotificationService.context().getRootBindings({
      id: this.hostId(),
      onDestroy: this.onDestroy,
    })
  })

  protected readonly onDestroy = useOnDestroy()

  protected readonly injector = inject(Injector)

  protected readonly isMounted = useIsMounted()

  private document = inject(DOCUMENT)

  private readonly hostId = computed(() => useId(this, this.id()))

  ngOnInit() {
    const machine = useMachine(
      inlineNotificationMachine,
      computed<Explicit<InlineNotificationApiProps>>(() => ({
        dir: this.dir(),
        getRootNode: this.getRootNode() || (() => this.document),
        onDismiss: () => {
          if (this.isMounted()) {
            this.dismissed.emit()
          }
        },
        role: this.role(),
      })),
      this.injector,
    )

    this.inlineNotificationService.init(
      computed(() => createInlineNotificationApi(machine, normalizeProps)),
    )

    this.trackBindings()
  }
}
