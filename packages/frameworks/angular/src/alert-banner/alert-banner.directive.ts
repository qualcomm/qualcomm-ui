// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {booleanAttribute, Component, input} from "@angular/core"

import type {Booleanish} from "@qualcomm-ui/utils/coercion"

import {AlertBannerRootDirective} from "./alert-banner-root.directive"
import {provideQdsAlertBannerContext} from "./qds-alert-banner-context.service"

@Component({
  providers: [provideQdsAlertBannerContext()],
  selector: "[q-alert-banner]",
  standalone: false,
  template: `
    <ng-content select="[q-alert-banner-icon]">
      <span q-alert-banner-icon></span>
    </ng-content>

    <ng-content select="[q-alert-banner-heading]">
      @if (heading()) {
        <div q-alert-banner-heading>{{ heading() }}</div>
      }
    </ng-content>

    <ng-content select="[q-alert-banner-description]">
      @if (description()) {
        <div q-alert-banner-description>{{ description() }}</div>
      }
    </ng-content>

    <ng-content select="[q-alert-banner-action]" />
    <ng-content select="[q-alert-banner-button]" />

    <ng-content select="[q-alert-banner-close-button]">
      @if (dismissable()) {
        <button q-alert-banner-close-button></button>
      }
    </ng-content>
  `,
})
export class AlertBannerDirective extends AlertBannerRootDirective {
  /**
   * Optional description text for the banner.
   *
   * @remarks
   * To customize the element, provide it using the directive instead:
   * ```angular-html
   * <div q-alert-banner-description>...</div>
   * ```
   */
  readonly description = input<string>()

  /**
   * When `true`, renders a close button that calls `closed` when clicked.
   *
   * @remarks
   * To customize the close button, provide it using the directive instead:
   * ```angular-html
   * <button q-alert-banner-close-button>...</button>
   * ```
   *
   * @default false
   */
  readonly dismissable = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * Optional heading text for the banner.
   *
   * @remarks
   * To customize the element, provide it using the directive instead:
   * ```angular-html
   * <div q-alert-banner-heading>...</div>
   * ```
   */
  readonly heading = input<string>()
}
