import {
  booleanAttribute,
  Component,
  computed,
  inject,
  input,
  type OnInit,
} from "@angular/core"

import {
  END_ICON_CONTEXT_TOKEN,
  EndIconDirective,
  type IconTokenContext,
  START_ICON_CONTEXT_TOKEN,
  StartIconDirective,
} from "@qualcomm-ui/angular/icon"
import type {LucideIconOrString} from "@qualcomm-ui/angular-core/lucide"
import {normalizeProps, useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import {
  createQdsLinkApi,
  type QdsLinkApiProps,
  type QdsLinkEmphasis,
  type QdsLinkSize,
} from "@qualcomm-ui/qds-core/link"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"
import type {Direction} from "@qualcomm-ui/utils/direction"
import type {Explicit} from "@qualcomm-ui/utils/guard"

@Component({
  imports: [EndIconDirective, StartIconDirective],
  providers: [
    {
      provide: START_ICON_CONTEXT_TOKEN,
      useFactory: (): IconTokenContext => {
        const linkDirective = inject(LinkDirective)
        return {
          getBindings: computed(() =>
            linkDirective.qdsLinkApi().getStartIconBindings(),
          ),
        }
      },
    },
    {
      provide: END_ICON_CONTEXT_TOKEN,
      useFactory: (): IconTokenContext => {
        const linkDirective = inject(LinkDirective)
        return {
          getBindings: computed(() =>
            linkDirective.qdsLinkApi().getEndIconBindings(),
          ),
        }
      },
    },
  ],
  selector: "[q-link]",
  template: `
    <ng-content select="[q-start-icon]">
      @if (startIcon()) {
        <svg q-start-icon [icon]="startIcon()!"></svg>
      }
    </ng-content>

    <ng-content />

    <ng-content select="[q-end-icon]">
      @if (endIcon()) {
        <svg q-end-icon [icon]="endIcon()!"></svg>
      }
    </ng-content>
  `,
})
export class LinkDirective implements SignalifyInput<QdsLinkApiProps>, OnInit {
  /**
   * The document's text/writing direction.
   *
   * @default "ltr"
   */
  readonly dir = input<Direction | undefined>(undefined)

  /**
   * Controls whether the link is interactive. When `true`, pointer/focus
   * events are blocked, and the link is visually dimmed.
   */
  readonly disabled = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * The color of the link.
   *
   * @default 'default'
   */
  readonly emphasis = input<QdsLinkEmphasis>()

  /**
   * {@link https://lucide.dev/icons lucide-angular} icon, positioned after the label.
   *
   * @remarks
   * To customize the element, provide it using the directive instead:
   * ```angular-html
   * <svg q-end-icon icon="..."></svg>
   * ```
   */
  readonly endIcon = input<LucideIconOrString>()

  /**
   * The size of the link and its elements. Governs properties like font size,
   * item padding, and icon sizes.
   *
   * @default 'md'
   */
  readonly size = input<QdsLinkSize>()

  /**
   * {@link https://lucide.dev/icons lucide-angular} icon, positioned before the label.
   *
   * @remarks
   * To customize the element, provide it using the directive instead:
   * ```angular-html
   * <svg q-start-icon icon="..."></svg>
   * ```
   */
  readonly startIcon = input<LucideIconOrString>()

  readonly qdsLinkApi = computed(() =>
    createQdsLinkApi(
      {
        dir: this.dir(),
        disabled: this.disabled(),
        emphasis: this.emphasis(),
        size: this.size(),
      } satisfies Explicit<QdsLinkApiProps>,
      normalizeProps,
    ),
  )

  protected readonly trackBindings = useTrackBindings(() =>
    this.qdsLinkApi().getRootBindings(),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
