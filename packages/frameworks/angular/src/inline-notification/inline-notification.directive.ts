// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {booleanAttribute, Component, input} from "@angular/core"

import {provideInlineNotificationContext} from "@qualcomm-ui/angular-core/inline-notification"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"

import {InlineNotificationRootDirective} from "./inline-notification-root.directive"
import {provideQdsInlineNotificationContext} from "./qds-inline-notification-context.service"

@Component({
  providers: [
    provideInlineNotificationContext(),
    provideQdsInlineNotificationContext(),
  ],
  selector: "[q-inline-notification]",
  standalone: false,
  template: `
    <ng-content select="[q-inline-notification-icon]">
      <div q-inline-notification-icon></div>
    </ng-content>

    <ng-content select="[q-inline-notification-label]">
      @if (label()) {
        <div q-inline-notification-label>{{ label() }}</div>
      }
    </ng-content>

    <ng-content select="[q-inline-notification-description]">
      @if (description()) {
        <div q-inline-notification-description>{{ description() }}</div>
      }
    </ng-content>

    <ng-content select="[q-inline-notification-action]" />

    <ng-content select="[q-inline-notification-close-button]">
      @if (dismissable()) {
        <button q-inline-notification-close-button></button>
      }
    </ng-content>
  `,
})
export class InlineNotificationDirective extends InlineNotificationRootDirective {
  /**
   * Optional description text for the notification.
   *
   * @remarks
   * To customize the element, provide it using the directive instead:
   * ```angular-html
   * <div q-inline-notification-description>...</div>
   * ```
   */
  readonly description = input<string>()

  /**
   * When `true`, renders a close button that dismisses the notification on click.
   *
   * @remarks
   * To customize the close button, provide it using the directive instead:
   * ```angular-html
   * <button q-inline-notification-close-button>...</button>
   * ```
   *
   * @default false
   */
  readonly dismissable = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * Optional heading text for the notification.
   *
   * @remarks
   * To customize the element, provide it using the directive instead:
   * ```angular-html
   * <div q-inline-notification-label>...</div>
   * ```
   */
  readonly label = input<string>()
}
