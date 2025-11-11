// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  input,
} from "@angular/core"

import {provideQdsInputContext} from "@qualcomm-ui/angular/input"
import {provideSelectContext} from "@qualcomm-ui/angular-core/select"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"

import {provideQdsSelectContext} from "./qds-select-context.service"
import {SelectRootDirective} from "./select-root.directive"

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideSelectContext(),
    provideQdsSelectContext(),
    provideQdsInputContext(),
  ],
  selector: "q-select",
  standalone: false,
  template: `
    <ng-content select="[q-select-label]">
      @if (label()) {
        <div q-select-label>{{ label() }}</div>
      }
    </ng-content>

    <ng-content select="[q-select-control]">
      <div q-select-control [attr.aria-label]="ariaLabel()">
        <ng-content select="[q-select-value-text]">
          <span q-select-value-text></span>
        </ng-content>
        <ng-content select="[q-select-clear-trigger]">
          @if (clearable()) {
            <button q-select-clear-trigger></button>
          }
        </ng-content>
        <ng-content select="[q-select-indicator]">
          <div q-select-indicator></div>
        </ng-content>
        <ng-content select="[q-select-error-indicator]">
          <div q-select-error-indicator></div>
        </ng-content>
      </div>
    </ng-content>

    <ng-content select="[q-select-hint]">
      @if (hint()) {
        <div q-select-hint>{{ hint() }}</div>
      }
    </ng-content>

    <ng-content select="[q-select-error-text]">
      @if (errorText()) {
        <div q-select-error-text>{{ errorText() }}</div>
      }
    </ng-content>

    <ng-content select="q-select-hidden-select">
      <select q-select-hidden-select></select>
    </ng-content>

    <ng-template qPortal [disabled]="disablePortal()">
      <div q-select-positioner>
        <ng-content select="[q-select-content]">
          <div q-select-content>
            @for (
              item of collection().items;
              track collection().getItemValue(item)
            ) {
              <div q-select-item [item]="item">
                <span q-select-item-text>
                  {{ collection().stringifyItem(item) }}
                </span>
                <span q-select-item-indicator></span>
              </div>
            }
          </div>
        </ng-content>
      </div>
    </ng-template>
  `,
})
export class SelectComponent extends SelectRootDirective {
  /**
   * ARIA label applied to the control element. Use this if you omit the {@link
   * label}
   */
  readonly ariaLabel = input<string | undefined>(undefined, {
    alias: "aria-label",
  })

  /**
   * When `true`, renders a clear button that resets the input value on click.
   * The button only appears when the input has a value.
   *
   * @default true
   */
  readonly clearable = input<boolean | undefined, Booleanish>(true, {
    transform: booleanAttribute,
  })

  /**
   * Set to true to disable portalling behavior for the select dropdown content.
   */
  readonly disablePortal = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * Optional error that describes the element when {@link invalid} is true.
   *
   * @remarks
   * To customize the element, provide it using the directive instead:
   *
   * ```angular-html
   * <div q-select-error-text>...</div>
   * ```
   */
  readonly errorText = input<string | undefined | null>()

  /**
   * Optional hint describing the element. This element is automatically
   * associated with the component's input element for accessibility.
   *
   * @remarks
   * To customize the element, provide it using the directive instead:
   *
   * ```angular-html
   * <div q-select-hint>...</div>
   * ```
   */
  readonly hint = input<string | undefined | null>()

  /**
   * Optional label describing the element. Recommended. This element is
   * automatically associated with the component's input element for
   * accessibility.
   *
   * @remarks
   * To customize the element, provide it using the directive instead:
   *
   * ```angular-html
   * <div q-select-label>...</div>
   * ```
   */
  readonly label = input<string | undefined>()
}
