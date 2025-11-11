// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  booleanAttribute,
  Component,
  computed,
  inject,
  input,
  type OnInit,
  signal,
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
  useTrackBindings,
} from "@qualcomm-ui/angular-core/machine"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import {
  createQdsTagApi,
  type QdsTagApiProps,
  type QdsTagEmphasis,
  type QdsTagRadius,
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
  selector: "[q-tag]",
  template: `
    <ng-content select="[q-start-icon]">
      @if (startIcon()) {
        <svg q-start-icon [icon]="startIcon()!"></svg>
      }
    </ng-content>

    <ng-content />

    @if (variant() === "dismissable") {
      <svg
        qIcon="X"
        [q-bind]="qdsTagApi.context().getDismissButtonBindings()"
      />
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

  protected readonly selected = signal<boolean>(false)

  protected readonly trackBindings = useTrackBindings(() =>
    mergeProps(this.qdsTagApi.context().getRootBindings(), {
      onclick: () => {
        if (this.variant() === "selectable") {
          this.selected.update((prev) => !prev)
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
            disabled: this.disabled(),
            emphasis: this.emphasis(),
            radius: this.radius(),
            selected: this.selected(),
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
