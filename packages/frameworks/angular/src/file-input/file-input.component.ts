// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {booleanAttribute, Component, input} from "@angular/core"

import {provideFileUploadContext} from "@qualcomm-ui/angular-core/file-upload"
import {provideQdsFileUploadContext} from "@qualcomm-ui/angular/file-upload"
import {provideQdsInputContext} from "@qualcomm-ui/angular/input"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"

import {FileInputRootDirective} from "./file-input-root.directive"

/**
 * @since 2.8.0
 */
@Component({
  providers: [
    provideFileUploadContext(),
    provideQdsInputContext(),
    provideQdsFileUploadContext(),
  ],
  selector: "q-file-input",
  standalone: false,
  template: `
    <ng-content select="[q-file-input-label]">
      @if (label()) {
        <label q-file-input-label>{{ label() }}</label>
      }
    </ng-content>

    <ng-content select="[q-file-input-control]">
      <div q-file-input-control>
        <ng-content select="[q-file-input-display]">
          <span q-file-input-display [placeholder]="placeholder()"></span>
        </ng-content>

        <ng-content select="[q-file-input-clear-trigger]">
          @if (clearable()) {
            <button q-file-input-clear-trigger></button>
          }
        </ng-content>
      </div>
    </ng-content>

    <ng-content select="[q-file-input-hidden-input]">
      <input q-file-input-hidden-input />
    </ng-content>

    <ng-content select="[q-file-input-error-text]">
      @if (errorText()) {
        <div q-file-input-error-text>
          {{ errorText() }}
        </div>
      }
    </ng-content>
  `,
})
export class FileInputComponent extends FileInputRootDirective {
  /**
   * When `true`, renders a clear button that resets the selected file on click.
   * The button only appears when a file has been selected.
   *
   * @default true
   */
  readonly clearable = input<boolean | undefined, Booleanish>(true, {
    transform: booleanAttribute,
  })

  /**
   * Optional error message that describes the element when {@link invalid} is true.
   *
   * @remarks
   * To customize the element, provide it using the directive instead:
   *
   * ```angular-html
   * <div q-file-input-error-text>...</div>
   * ```
   */
  readonly errorText = input<string | undefined>()

  /**
   * Optional label describing the file input. This element is automatically
   * associated with the hidden file input for accessibility.
   *
   * @remarks
   * To customize the element, provide it using the directive instead:
   *
   * ```angular-html
   * <label q-file-input-label>...</label>
   * ```
   */
  readonly label = input<string | undefined>()

  /**
   * Text shown when no file has been selected.
   */
  readonly placeholder = input<string | undefined>()
}
