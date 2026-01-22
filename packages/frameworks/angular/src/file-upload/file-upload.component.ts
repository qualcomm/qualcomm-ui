// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  input,
} from "@angular/core"
import {File, FilePlus, Trash2, Upload} from "lucide-angular"

import {provideFileUploadContext} from "@qualcomm-ui/angular-core/file-upload"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"

import {FileUploadDropzoneDirective} from "./file-upload-dropzone.directive"
import {FileUploadItemGroupDirective} from "./file-upload-item-group.directive"
import {FileUploadRootDirective} from "./file-upload-root.directive"
import {provideQdsFileUploadContext} from "./qds-file-upload-context.service"

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideIcons({File, FilePlus, Trash2, Upload}),
    provideFileUploadContext(),
    provideQdsFileUploadContext(),
  ],
  selector: "q-file-upload",
  standalone: false,
  template: `
    <ng-content select="[q-file-upload-label]">
      @if (label()) {
        <label q-file-upload-label>{{ label() }}</label>
      }
    </ng-content>

    <ng-content select="[q-file-upload-dropzone]">
      @if (shouldRenderDefaultDropzone()) {
        <div q-file-upload-dropzone>
          <div class="flex flex-col items-center gap-3">
            <svg qIcon="Upload" style="width: 24px; height: 24px;"></svg>
            <div class="flex flex-col items-center gap-2">
              <div class="flex items-center gap-1">
                <span class="text-sm">Drag & drop files, or</span>
                <button
                  class="cursor-pointer text-sm font-medium text-[var(--color-interactive-text-link-default-idle)] hover:underline"
                  q-file-upload-trigger
                  type="button"
                >
                  browse
                </button>
              </div>
              @if (dropzoneHint()) {
                <span
                  class="text-xs text-[var(--color-text-neutral-secondary)]"
                >
                  {{ dropzoneHint() }}
                </span>
              }
            </div>
          </div>
        </div>
      }
    </ng-content>

    <input q-file-upload-hidden-input />

    <ng-container *fileUploadContext="let ctx">
      @if (ctx.acceptedFiles.length > 0) {
        <ng-content select="[q-file-upload-item-group]">
          @if (shouldRenderDefaultItemGroup()) {
            <div q-file-upload-item-group>
              @for (file of ctx.acceptedFiles; track file) {
                <div
                  class="flex items-center gap-2"
                  q-file-upload-item
                  [file]="file"
                >
                  <svg qIcon="File" style="width: 16px; height: 16px;"></svg>
                  <div class="flex min-w-0 flex-1 flex-col gap-0">
                    <span class="truncate" q-file-upload-item-name></span>
                    <span q-file-upload-item-size-text></span>
                  </div>
                  <button
                    aria-label="Remove file"
                    class="cursor-pointer"
                    q-file-upload-item-delete-trigger
                    type="button"
                  >
                    <svg
                      qIcon="Trash2"
                      style="width: 16px; height: 16px;"
                    ></svg>
                  </button>
                </div>
              }
            </div>
          }
        </ng-content>

        @if (showClearButton() && ctx.acceptedFiles.length > 0) {
          <button q-file-upload-clear-trigger type="button">
            <svg qIcon="FilePlus" style="width: 12px; height: 12px;"></svg>
            {{ clearButtonText() }}
          </button>
        }
      }
    </ng-container>

    @if (errorText() && invalid()) {
      <div class="mt-1 text-xs text-[var(--color-text-support-danger)]">
        {{ errorText() }}
      </div>
    }
  `,
})
export class FileUploadComponent extends FileUploadRootDirective {
  /**
   * Optional label describing the file upload. This element is automatically
   * associated with the hidden input element for accessibility.
   *
   * @remarks
   * To customize the element, provide it using the directive instead:
   *
   * ```angular-html
   * <label q-file-upload-label>...</label>
   * ```
   */
  readonly label = input<string | undefined>()

  /**
   * Optional hint text to display in the dropzone below the main instruction.
   * Typically used to show supported file types or size limits.
   *
   * @example "Supported file types: .jpg, .png, .pdf"
   */
  readonly dropzoneHint = input<string | undefined>()

  /**
   * Optional error message that describes the element when {@link invalid} is true.
   */
  readonly errorText = input<string | undefined>()

  /**
   * When `true`, renders a button to clear all accepted files.
   *
   * @default true
   */
  readonly showClearButton = input<boolean | undefined, Booleanish>(true, {
    transform: booleanAttribute,
  })

  /**
   * Text to display on the clear button.
   *
   * @default "Add more files"
   */
  readonly clearButtonText = input<string>("Add more files")

  protected readonly customDropzone = contentChild(FileUploadDropzoneDirective)
  protected readonly customItemGroup = contentChild(
    FileUploadItemGroupDirective,
  )

  protected readonly shouldRenderDefaultDropzone = computed(
    () => !this.customDropzone(),
  )
  protected readonly shouldRenderDefaultItemGroup = computed(
    () => !this.customItemGroup(),
  )
}
