// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {booleanAttribute, Component, input} from "@angular/core"
import {AlertCircle} from "lucide-angular"

import {provideQdsInputContext} from "@qualcomm-ui/angular/input"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {provideTextInputContext} from "@qualcomm-ui/angular-core/text-input"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"

import {TextInputRootDirective} from "./text-input-root.directive"

@Component({
  providers: [
    provideTextInputContext(),
    provideQdsInputContext(),
    provideIcons({AlertCircle}),
  ],
  selector: "q-text-input:not([q-text-input-root])",
  standalone: false,
  template: `
    <ng-content select="[q-text-input-label]">
      @if (label()) {
        <label q-text-input-label>{{ label() }}</label>
      }
    </ng-content>
    <div q-text-input-input-group>
      <input q-text-input-input [placeholder]="placeholder()" />

      <ng-content select="[q-text-input-clear-trigger]">
        @if (clearable()) {
          <button q-text-input-clear-trigger></button>
        }
      </ng-content>

      <ng-content select="[q-text-input-error-indicator]">
        <span q-text-input-error-indicator></span>
      </ng-content>
    </div>
    <ng-content select="[q-text-input-hint]">
      @if (hint()) {
        <span q-text-input-hint>
          {{ hint() }}
        </span>
      }
    </ng-content>

    <ng-content select="[q-text-input-error-text]">
      @if (errorText()) {
        <div q-text-input-error-text>
          {{ errorText() }}
        </div>
      }
    </ng-content>
  `,
})
export class TextInputComponent extends TextInputRootDirective {
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
   * Optional error that describes the element when {@link invalid} is true.
   *
   * @remarks
   * To customize the element, provide it using the directive instead:
   *
   * ```angular-html
   * <div q-text-input-error-text>...</div>
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
   * <div q-text-input-hint>...</div>
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
   * <div q-text-input-label>...</div>
   * ```
   */
  readonly label = input<string | undefined>()

  /**
   * HTML {@link https://www.w3schools.com/tags/att_input_placeholder.asp placeholder} attribute,
   * passed to the internal input element.
   */
  readonly placeholder = input<string>("")
}
