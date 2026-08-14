// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  booleanAttribute,
  Component,
  computed,
  inject,
  input,
  type OnInit,
  output,
} from "@angular/core"
import {LucideX} from "@lucide/angular"

import {
  type LucideIconOrString,
  provideIcons,
} from "@qualcomm-ui/angular-core/lucide"
import {
  normalizeProps,
  QBindDirective,
  useTrackBindings,
} from "@qualcomm-ui/angular-core/machine"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import {useControlledState} from "@qualcomm-ui/angular-core/state"
import {
  END_ICON_CONTEXT_TOKEN,
  EndIconDirective,
  IconDirective,
  type IconTokenContext,
  START_ICON_CONTEXT_TOKEN,
  StartIconDirective,
} from "@qualcomm-ui/angular/icon"
import {
  createQdsTagApi,
  type QdsTagApiProps,
  type QdsTagEmphasis,
  type QdsTagRadius,
  type QdsTagShape,
  type QdsTagSize,
  type QdsTagVariant,
} from "@qualcomm-ui/qds-core/tag"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"
import type {Explicit} from "@qualcomm-ui/utils/guard"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {QdsTagContextService} from "./qds-tag-context.service"

@Component({
  imports: [
    EndIconDirective,
    StartIconDirective,
    QBindDirective,
    IconDirective,
  ],
  providers: [
    QdsTagContextService,
    provideIcons({LucideX}),
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
  selector: "span[q-tag], button[q-tag], a[q-tag], div[q-tag]",
  template: `
    <ng-content select="[q-start-icon]">
      @if (startIcon()) {
        <svg q-start-icon [icon]="startIcon()!"></svg>
      }
    </ng-content>

    <span><ng-content /></span>

    @if (variant() === "dismissable") {
      <button
        type="button"
        [q-bind]="qdsTagApi.context().getDismissButtonBindings()"
        (click)="dismiss.emit()"
      >
        <svg qIcon="X" [q-bind]="qdsTagApi.context().getEndIconBindings()" />
      </button>
    } @else {
      <ng-content select="[q-end-icon]">
        @if (endIcon()) {
          <svg q-end-icon [icon]="endIcon()!"></svg>
        }
      </ng-content>
    }
  `,
})
export class TagDirective implements SignalifyInput<QdsTagApiProps>, OnInit {
  /**
   * Emits when the dismiss button is clicked.
   * Only applicable when {@link variant} is `dismissable`.
   */
  readonly dismiss = output<void>()

  /**
   * Emits when the selected state changes. Fires in both controlled and
   * uncontrolled modes.
   * Only applicable when {@link variant} is `selectable`.
   *
   * @since 2.11.0
   *
   * @remarks
   * Pair with {@link selected} to enable two-way binding via `[(selected)]`.
   */
  readonly selectedChange = output<boolean>()

  /**
   * Applies the active style to a link tag. Honored only on an `<a q-tag>` host.
   * This is purely visual; set {@link https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-current aria-current}
   * on the anchor for accessibility.
   *
   * @since 2.12.0
   *
   * @default false
   */
  readonly active = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * Initial selected state when the component is uncontrolled.
   * Only applicable when {@link variant} is `selectable`.
   * Ignored when {@link selected} is provided.
   *
   * @since 2.11.0
   *
   * @default false
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
   * Ignored when {@link variant} is `dismissable`, as it is reserved for the
   * dismiss icon.
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
   * @deprecated in {@link https://github.com/qualcomm/qualcomm-ui/blob/main/packages/frameworks/react/CHANGELOG.md#1160 v1.16.0}, migrate to {@link shape}
   *
   * Governs the shape of the tag.
   *
   * @default 'square'
   */
  readonly radius = input<QdsTagRadius>()

  /**
   * Governs the shape of the tag.
   *
   * @since 1.16.0
   *
   * @default 'square'
   */
  readonly shape = input<QdsTagShape>()

  /**
   * Controls the selected state. Pair with {@link selectedChange} (or use
   * `[(selected)]` for two-way binding) for a fully controlled component.
   * When omitted, the tag manages its own selected state internally.
   * Only applicable when {@link variant} is `selectable`.
   */
  readonly selected = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * Governs the size of the text, icons, spacing, and padding.
   * @default 'md'
   */
  readonly size = input<QdsTagSize>()

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
   * Governs the interactive style of the tag.
   */
  readonly variant = input<QdsTagVariant>()

  private readonly selectedState = useControlledState<boolean>({
    defaultValue: this.defaultSelected,
    onChange: (value) => this.selectedChange.emit(value),
    value: this.selected,
  })

  protected readonly trackBindings = useTrackBindings(() =>
    mergeProps(this.qdsTagApi.context().getRootBindings(), {
      // remove `disabled` from the host to avoid invalid HTML
      disabled: undefined,
      onclick: () => {
        if (this.variant() === "selectable" && !this.disabled()) {
          const state = this.selectedState()
          state.setValue(!state.value())
        }
      },
    }),
  )

  protected readonly qdsTagApi = inject(QdsTagContextService)

  ngOnInit() {
    this.qdsTagApi.init(
      computed(() =>
        createQdsTagApi(
          {
            active: this.active(),
            disabled: this.disabled(),
            emphasis: this.emphasis(),
            radius: this.radius(),
            selected: this.selectedState().value(),
            shape: this.shape(),
            size: this.size(),
            variant: this.variant(),
          } satisfies Explicit<QdsTagApiProps> & {
            active?: boolean | undefined
            selected?: boolean | undefined
          },
          normalizeProps,
        ),
      ),
    )

    this.trackBindings()
  }
}
