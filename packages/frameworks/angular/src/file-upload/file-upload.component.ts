// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  DestroyRef,
  inject,
  input,
  signal,
} from "@angular/core"
import {AlertCircle, File, FilePlus, Trash2, Upload} from "lucide-angular"

import {provideFileUploadContext} from "@qualcomm-ui/angular-core/file-upload"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import type {FileDetails} from "@qualcomm-ui/core/file-upload"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"
import type {FileError} from "@qualcomm-ui/utils/files"

import {FileUploadDropzoneDirective} from "./file-upload-dropzone.directive"
import {FileUploadItemGroupDirective} from "./file-upload-item-group.directive"
import {FileUploadRootDirective} from "./file-upload-root.directive"
import {provideQdsFileUploadContext} from "./qds-file-upload-context.service"

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideIcons({AlertCircle, File, FilePlus, Trash2, Upload}),
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

    @if (fileCount() === 0) {
      <ng-content select="[q-file-upload-dropzone]">
        @if (shouldRenderDefaultDropzone()) {
          <div q-file-upload-dropzone>
            <svg qIcon="Upload" style="width: 24px; height: 24px;"></svg>
            <div class="qui-file-upload__dropzone-text-group">
              <div class="qui-file-upload__dropzone-text-line">
                <span class="qui-file-upload__dropzone-text">
                  {{ dropzoneText() }}
                </span>
                <button
                  class="cursor-pointer"
                  q-file-upload-trigger
                  type="button"
                >
                  {{ triggerText() }}
                </button>
              </div>
              @if (dropzoneHint()) {
                <span class="qui-file-upload__dropzone-hint">
                  {{ dropzoneHint() }}
                </span>
              }
            </div>
          </div>
        }
      </ng-content>
    }

    <input q-file-upload-hidden-input />

    <ng-container *fileUploadContext="let ctx">
      @if (ctx.acceptedFiles.length > 0 || ctx.rejectedFiles.length > 0) {
        <ng-content select="[q-file-upload-item-group]">
          @if (shouldRenderDefaultItemGroup()) {
            <div q-file-upload-item-group>
              @for (file of ctx.acceptedFiles; track file) {
                <div q-file-upload-item [file]="file">
                  @if (showPreviews() && isImageFile(file)) {
                    <div q-file-upload-item-preview>
                      @if (fileUrls()[file.name]) {
                        <img
                          q-file-upload-item-preview-image
                          [url]="fileUrls()[file.name]"
                        />
                      }
                    </div>
                  } @else {
                    <div q-file-upload-item-preview>
                      <svg
                        qIcon="File"
                        [style.height]="fileIconSize()"
                        [style.width]="fileIconSize()"
                      ></svg>
                    </div>
                  }
                  <div class="qui-file-upload__item-content">
                    <span q-file-upload-item-name></span>
                    <span q-file-upload-item-size-text></span>
                  </div>
                  <button
                    aria-label="Remove file"
                    q-button
                    q-file-upload-item-delete-trigger
                    startIcon="Trash2"
                    type="button"
                    variant="ghost"
                  ></button>
                </div>
              }
              @for (rejection of ctx.rejectedFiles; track rejection.file) {
                <div q-file-upload-item type="rejected" [file]="rejection.file">
                  <div q-file-upload-item-preview>
                    <svg
                      qIcon="File"
                      [style.height]="fileIconSize()"
                      [style.width]="fileIconSize()"
                    ></svg>
                  </div>
                  <div class="qui-file-upload__item-content">
                    <span q-file-upload-item-name></span>
                    <span
                      class="qui-file-upload__item-size-text flex items-center gap-1"
                      data-invalid
                    >
                      <svg
                        qIcon="AlertCircle"
                        [style.height]="12"
                        [style.min-height]="12"
                        [style.min-width]="12"
                        [style.width]="12"
                      ></svg>
                      {{ getErrorMessage(rejection.errors) }}
                    </span>
                  </div>
                  <button
                    aria-label="Remove file"
                    q-button
                    q-file-upload-item-delete-trigger
                    startIcon="Trash2"
                    type="button"
                    variant="ghost"
                  ></button>
                </div>
              }
            </div>
          }
        </ng-content>

        <div class="flex justify-start">
          @if (showAddMoreButton()) {
            <button
              q-button
              q-file-upload-trigger
              startIcon="FilePlus"
              type="button"
              variant="outline"
            >
              {{ addMoreButtonText() }}
            </button>
          }

          @if (showClearButton()) {
            <button
              q-button
              q-file-upload-clear-trigger
              startIcon="Trash2"
              type="button"
              variant="ghost"
            >
              {{ clearButtonText() }}
            </button>
          }
        </div>
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
  private readonly destroyRef = inject(DestroyRef)

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
   * The main text displayed in the dropzone.
   *
   * @default "Drag & drop files, or"
   */
  readonly dropzoneText = input<string>("Drag & drop files, or")

  /**
   * The text displayed on the browse trigger button within the dropzone.
   *
   * @default "browse"
   */
  readonly triggerText = input<string>("browse")

  /**
   * Optional error message that describes the element when {@link invalid} is true.
   */
  readonly errorText = input<string | undefined>()

  /**
   * When `true`, shows image previews for uploaded image files.
   *
   * @default true
   */
  readonly showPreviews = input<boolean | undefined, Booleanish>(true, {
    transform: booleanAttribute,
  })

  /**
   * When `true`, renders an "Add more files" button when files are present.
   *
   * @default true
   */
  readonly showAddMoreButton = input<boolean | undefined, Booleanish>(true, {
    transform: booleanAttribute,
  })

  /**
   * Text to display on the "Add more files" button.
   *
   * @default "Add more files"
   */
  readonly addMoreButtonText = input<string>("Add more files")

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
   * @default "Clear all"
   */
  readonly clearButtonText = input<string>("Clear all")

  protected readonly fileUrls = signal<Record<string, string>>({})
  protected readonly fileCount = signal(0)

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

  protected readonly fileIconSize = computed(() => {
    const size = this.size() ?? "md"
    return size === "sm" ? "32px" : "64px"
  })

  constructor() {
    super()
    this.destroyRef.onDestroy(() => {
      Object.values(this.fileUrls()).forEach((url) => {
        URL.revokeObjectURL(url)
      })
    })

    this.fileChanged.subscribe((details) => {
      this.handleFileChanged(details)
    })
  }

  protected handleFileChanged(details: FileDetails): void {
    const currentUrls = this.fileUrls()
    const newUrls: Record<string, string> = {}
    const currentFileNames = new Set(details.acceptedFiles.map((f) => f.name))

    details.acceptedFiles.forEach((file) => {
      if (currentUrls[file.name]) {
        newUrls[file.name] = currentUrls[file.name]
      } else if (this.isImageFile(file)) {
        newUrls[file.name] = URL.createObjectURL(file)
      }
    })

    Object.keys(currentUrls).forEach((fileName) => {
      if (!currentFileNames.has(fileName)) {
        URL.revokeObjectURL(currentUrls[fileName])
      }
    })

    this.fileUrls.set(newUrls)
    this.fileCount.set(
      details.acceptedFiles.length + details.rejectedFiles.length,
    )
  }

  protected isImageFile(file: File): boolean {
    return file.type.startsWith("image/")
  }

  protected getErrorMessage(errors: FileError[]): string {
    const errorMessages: Record<string, string> = {
      FILE_EXISTS: "File already exists",
      FILE_INVALID: "Invalid file",
      FILE_INVALID_TYPE: "Invalid file type",
      FILE_TOO_LARGE: "File is too large",
      FILE_TOO_SMALL: "File is too small",
      TOO_MANY_FILES: "Too many files",
    }

    const firstError = errors[0]
    return errorMessages[firstError] || firstError
  }
}
