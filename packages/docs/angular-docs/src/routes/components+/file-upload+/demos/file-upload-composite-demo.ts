import {Component, DestroyRef, inject, signal} from "@angular/core"
import {File, FilePlus, Trash2, Upload} from "lucide-angular"

import {ButtonModule} from "@qualcomm-ui/angular/button"
import {FileUploadModule} from "@qualcomm-ui/angular/file-upload"
import {IconDirective} from "@qualcomm-ui/angular/icon"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import type {FileDetails} from "@qualcomm-ui/core/file-upload"

@Component({
  imports: [ButtonModule, FileUploadModule, IconDirective],
  providers: [provideIcons({File, FilePlus, Trash2, Upload})],
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
        @if (ctx.acceptedFiles.length > 0) {
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
                  q-file-upload-item-delete-trigger
                  type="button"
                >
                  <svg qIcon="Trash2" style="width: 16px; height: 16px;"></svg>
                </button>
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
    this.fileCount.set(details.acceptedFiles.length)
  }
}
