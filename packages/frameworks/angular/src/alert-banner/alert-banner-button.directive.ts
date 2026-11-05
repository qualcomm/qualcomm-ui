// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  booleanAttribute,
  Component,
  computed,
  inject,
  input,
  type OnInit,
} from "@angular/core"

import type {LucideIconOrString} from "@qualcomm-ui/angular-core/lucide"
import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import {useButtonApi} from "@qualcomm-ui/angular/button"
import {
  END_ICON_CONTEXT_TOKEN,
  type IconTokenContext,
  START_ICON_CONTEXT_TOKEN,
} from "@qualcomm-ui/angular/icon"
import {resolveAlertBannerButtonProps} from "@qualcomm-ui/qds-core/alert-banner"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsAlertBannerContext} from "./qds-alert-banner-context.service"

/**
 * @since 2.6.0
 *
 * The alert's primary action. Use this instead of `q-alert-banner-action`
 */
@Component({
  providers: [
    {
      provide: START_ICON_CONTEXT_TOKEN,
      useFactory: (): IconTokenContext => {
        const button = inject(AlertBannerButtonDirective)
        return {
          getBindings: computed(() =>
            button.buttonApi()().getStartIconBindings(),
          ),
        }
      },
    },
    {
      provide: END_ICON_CONTEXT_TOKEN,
      useFactory: (): IconTokenContext => {
        const button = inject(AlertBannerButtonDirective)
        return {
          getBindings: computed(() =>
            button.buttonApi()().getEndIconBindings(),
          ),
        }
      },
    },
  ],
  selector: "[q-alert-banner-button]",
  standalone: false,
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
export class AlertBannerButtonDirective implements OnInit {
  /**
   * Controls whether the component is interactive. When `true`, pointer/focus
   * events are blocked, and the component is visually dimmed.
   *
   * @default false
   */
  readonly disabled = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

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
   * {@link https://lucide.dev/icons lucide-angular} icon, positioned before the label.
   *
   * @remarks
   * To customize the element, provide it using the directive instead:
   * ```angular-html
   * <svg q-start-icon icon="..."></svg>
   * ```
   */
  readonly startIcon = input<LucideIconOrString>()

  protected readonly qdsContext = useQdsAlertBannerContext()

  protected readonly buttonApi = computed(() =>
    useButtonApi({
      disabled: this.disabled,
      ...resolveAlertBannerButtonProps({
        emphasis: this.qdsContext().emphasis,
        variant: this.qdsContext().variant,
      }),
    }),
  )

  protected readonly trackBindings = useTrackBindings(() =>
    mergeProps(
      this.qdsContext().getActionBindings(),
      this.buttonApi()().getRootBindings(),
    ),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
