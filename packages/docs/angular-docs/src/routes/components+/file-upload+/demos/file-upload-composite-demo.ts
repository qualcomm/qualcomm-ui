import {Component, DestroyRef, inject, signal} from "@angular/core"
import {AlertCircle, FilePlus, Layers, Trash2, Upload} from "lucide-angular"

import {ButtonModule} from "@qualcomm-ui/angular/button"
import {FileUploadModule} from "@qualcomm-ui/angular/file-upload"
import {IconDirective} from "@qualcomm-ui/angular/icon"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import type {FileDetails} from "@qualcomm-ui/core/file-upload"
import type {FileError} from "@qualcomm-ui/utils/files"

@Component({
  imports: [ButtonModule, FileUploadModule, IconDirective],
  providers: [provideIcons({AlertCircle, FilePlus, Layers, Trash2, Upload})],
  selector: "file-upload-composite-demo",
  standalone: true,
  template: `
    <!-- preview -->
    <div
      class="w-full max-w-md"
      q-file-upload-root
      [accept]="['image/*']"
      [maxFiles]="10"
      (fileChanged)="onFileChanged($event)"
    >
      <label q-file-upload-label>Upload images</label>

      @if (fileCount() === 0) {
        <div q-file-upload-dropzone>
          <svg qIcon="Upload" style="width: 24px; height: 24px;"></svg>
          <div class="qui-file-upload__dropzone-text-group">
            <div class="qui-file-upload__dropzone-text-line">
              <span class="qui-file-upload__dropzone-text">
                Drag & drop images, or
              </span>
              <button
                class="cursor-pointer"
                q-file-upload-trigger
                type="button"
              >
                browse
              </button>
            </div>
            <span class="qui-file-upload__dropzone-hint">
              Supported file types: Images only
            </span>
          </div>
        </div>
      }

      <input q-file-upload-hidden-input />

      <ng-container *fileUploadContext="let ctx">
        @if (ctx.acceptedFiles.length > 0 || ctx.rejectedFiles.length > 0) {
          <div q-file-upload-item-group>
            @for (file of ctx.acceptedFiles; track file) {
              <div q-file-upload-item [file]="file">
                <div q-file-upload-item-preview>
                  @if (fileUrls()[file.name]) {
                    <img
                      q-file-upload-item-preview-image
                      [url]="fileUrls()[file.name]"
                    />
                  }
                </div>
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
                  <svg qIcon="Layers" style="width: 36px; height: 36px;"></svg>
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

          <div class="flex justify-start">
            <button
              q-button
              q-file-upload-trigger
              startIcon="FilePlus"
              type="button"
              variant="outline"
            >
              Add more files
            </button>
            <button
              q-button
              q-file-upload-clear-trigger
              startIcon="Trash2"
              type="button"
              variant="ghost"
            >
              Clear all
            </button>
          </div>
        }
      </ng-container>
    </div>
    <!-- preview -->
  `,
})
export class FileUploadCompositeDemo {
  private readonly destroyRef = inject(DestroyRef)

  readonly fileUrls = signal<Record<string, string>>({})
  readonly fileCount = signal(0)

  constructor() {
    this.destroyRef.onDestroy(() => {
      Object.values(this.fileUrls()).forEach((url) => {
        URL.revokeObjectURL(url)
      })
    })
  }

  onFileChanged(details: FileDetails): void {
    const currentUrls = this.fileUrls()
    const newUrls: Record<string, string> = {}
    const currentFileNames = new Set(details.acceptedFiles.map((f) => f.name))

    details.acceptedFiles.forEach((file) => {
      if (currentUrls[file.name]) {
        newUrls[file.name] = currentUrls[file.name]
      } else {
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

  getErrorMessage(errors: FileError[]): string {
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
