// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  booleanAttribute,
  Component,
  computed,
  inject,
  Injector,
  input,
  type OnInit,
  output,
} from "@angular/core"
import {X} from "lucide-angular"

import {
  END_ICON_CONTEXT_TOKEN,
  EndIconDirective,
  IconDirective,
  type IconTokenContext,
  START_ICON_CONTEXT_TOKEN,
  StartIconDirective,
} from "@qualcomm-ui/angular/icon"
import {
  type LucideIconOrString,
  provideIcons,
} from "@qualcomm-ui/angular-core/lucide"
import {
  normalizeProps,
  QBindDirective,
  useMachine,
  useTrackBindings,
} from "@qualcomm-ui/angular-core/machine"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import {
  createTagApi,
  type TagApiProps,
  tagMachine,
  type TagVariant,
} from "@qualcomm-ui/core/tag"
import {
  createQdsTagApi,
  type QdsTagApiProps,
  type QdsTagEmphasis,
  type QdsTagRadius,
  type QdsTagSize,
} from "@qualcomm-ui/qds-core/tag"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"
import type {Direction} from "@qualcomm-ui/utils/direction"
import type {Explicit} from "@qualcomm-ui/utils/guard"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {
  provideQdsTagContext,
  QdsTagContextService,
} from "./qds-tag-context.service"
import {provideTagContext, TagContextService} from "./tag-context.service"

@Component({
  imports: [
    EndIconDirective,
    StartIconDirective,
    QBindDirective,
    IconDirective,
  ],
  providers: [
    provideTagContext(),
    provideQdsTagContext(),
    provideIcons({X}),
    {
      provide: START_ICON_CONTEXT_TOKEN,
      useFactory: (): IconTokenContext => {
        const tag = inject(TagDirective)
        return {
          getBindings: computed(() =>
            tag.qdsTagApi.context().getStartIconBindings(),
          ),
        }
      },
    },
    {
      provide: END_ICON_CONTEXT_TOKEN,
      useFactory: (): IconTokenContext => {
        const tag = inject(TagDirective)
        return {
          getBindings: computed(() =>
            tag.qdsTagApi.context().getEndIconBindings(),
          ),
        }
      },
    },
  ],
  selector: "span[q-tag], button[q-tag]",
  template: `
    <ng-content select="[q-start-icon]">
      @if (startIcon()) {
        <svg data-test-id="qui-icon" q-start-icon [icon]="startIcon()!"></svg>
      }
    </ng-content>

    <ng-content />

    @if (variant() === "dismissable") {
      <button type="button" [q-bind]="dismissButtonBindings()">
        <svg
          data-test-id="qui-icon"
          qIcon="X"
          [q-bind]="qdsTagApi.context().getEndIconBindings()"
        />
      </button>
    } @else {
      <ng-content select="[q-end-icon]">
        @if (endIcon()) {
          <svg data-test-id="qui-icon" q-end-icon [icon]="endIcon()!"></svg>
        }
      </ng-content>
    }
  `,
})
export class TagDirective
  implements SignalifyInput<TagApiProps & QdsTagApiProps>, OnInit
{
  /**
   * The document's text/writing direction.
   *
   * @default "ltr"
   */
  readonly dir = input<Direction | undefined>(undefined)

  /**
   * Emits when the dismiss button is clicked. Only applicable when
   * {@link variant} is `dismissable`.
   */
  readonly dismiss = output<void>()

  /**
   * The default selected state of the tag. Only applicable when {@link variant} is
   * `selectable`.
   */
  readonly defaultSelected = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * Controls the component's interactivity. If `true`, the component becomes
   * unresponsive to input and is visually dimmed to indicate its disabled state.
   */
  readonly disabled = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * {@link https://lucide.dev/icons lucide-angular} icon, positioned after the label.
   * Note that this property is ignored if {@link variant} is `dismissable`, as it
   * is reserved for the dismiss icon.
   *
   * @remarks
   * To customize the element, provide it using the directive instead:
   * ```angular-html
   * <svg q-end-icon icon="..."></svg>
   * ```
   */
  readonly endIcon = input<LucideIconOrString>()

  /**
   * Governs the color of the tag.
   * @default 'brand'
   */
  readonly emphasis = input<QdsTagEmphasis>()

  /**
   * Governs the shape of the tag.
   *
   * @default 'square'
   */
  readonly radius = input<QdsTagRadius>()

  /**
   * Governs the size of the text, icons, spacing, and padding.
   * @default 'md'
   */
  readonly size = input<QdsTagSize>()

  /**
   * The selected state of the tag. Only applicable when {@link variant} is
   * `selectable`.
   */
  readonly selected = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

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

  /**
   * Governs the interactive features of the tag.
   *
   * @default 'link'
   */
  readonly variant = input<TagVariant>()

  /**
   * Event handler called when the selected state of the tag changes.
   */
  readonly selectedChanged = output<boolean | undefined>()

  protected readonly trackBindings = useTrackBindings(() =>
    mergeProps(
      this.tagApi.context().getRootBindings(),
      this.qdsTagApi.context().getRootBindings(),
    ),
  )

  protected readonly dismissButtonBindings = computed(() =>
    mergeProps(
      this.tagApi.context().getDismissButtonBindings(),
      this.qdsTagApi.context().getDismissButtonBindings(),
    ),
  )

  protected readonly injector = inject(Injector)

  protected readonly tagApi = inject(TagContextService)
  protected readonly qdsTagApi = inject(QdsTagContextService)

  ngOnInit() {
    const machine = useMachine(
      tagMachine,
      computed<Explicit<TagApiProps>>(() => ({
        defaultSelected: this.defaultSelected(),
        dir: this.dir(),
        disabled: this.disabled(),
        onDismiss: () => {
          this.dismiss.emit()
        },
        onSelectedChange: (selected) => {
          this.selectedChanged.emit(selected)
        },
        selected: this.selected(),
        variant: this.variant(),
      })),
      this.injector,
    )

    this.tagApi.init(computed(() => createTagApi(machine, normalizeProps)))

    this.qdsTagApi.init(
      computed(() =>
        createQdsTagApi(
          {
            emphasis: this.emphasis(),
            radius: this.radius(),
            size: this.size(),
            variant: this.variant(),
          } satisfies Explicit<QdsTagApiProps> & {
            selected?: boolean | undefined
          },
          normalizeProps,
        ),
      ),
    )

    this.trackBindings()
  }
}
