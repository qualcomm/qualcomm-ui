import {Component, DestroyRef, inject, signal} from "@angular/core"
import {File, FilePlus, Trash2, Upload} from "lucide-angular"

import type {FileDetails} from "@qualcomm-ui/core/file-upload"
import {FileUploadModule} from "@qualcomm-ui/angular/file-upload"
import {IconDirective} from "@qualcomm-ui/angular/icon"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"

@Component({
  imports: [FileUploadModule, IconDirective],
  providers: [provideIcons({File, FilePlus, Trash2, Upload})],
  selector: "file-upload-composite-demo",
  standalone: true,
  template: `
    <!-- preview -->
    <div
      class="w-full max-w-md"
      q-file-upload-root
      [accept]="['image/*']"
      (fileChanged)="onFileChanged($event)"
    >
      <label q-file-upload-label>Upload images</label>

      <div class="flex flex-col items-center gap-3 p-8" q-file-upload-dropzone>
        <svg qIcon="Upload" style="width: 24px; height: 24px;"></svg>
        <div class="flex flex-col items-center gap-2">
          <div class="flex items-center gap-1">
            <span class="text-sm">Drag & drop images, or</span>
            <button
              class="cursor-pointer text-sm font-medium text-[var(--color-interactive-text-link-default-idle)] hover:underline"
              q-file-upload-trigger
              type="button"
            >
              browse
            </button>
          </div>
          <span class="text-xs text-[var(--color-text-neutral-secondary)]">
            Supported file types: Images only
          </span>
        </div>
      </div>

      <input q-file-upload-hidden-input />

      <ng-container *fileUploadContext="let ctx">
        @if (ctx.acceptedFiles.length > 0) {
          <div class="flex flex-col gap-4" q-file-upload-item-group>
            @for (file of ctx.acceptedFiles; track file) {
              <div
                class="flex items-start gap-3"
                q-file-upload-item
                [file]="file"
              >
                <div
                  class="h-16 w-16 flex-shrink-0 overflow-hidden rounded border border-[var(--color-border-neutral-secondary)]"
                  q-file-upload-item-preview
                >
                  @if (fileUrls()[file.name]) {
                    <img
                      class="h-full w-full object-cover"
                      q-file-upload-item-preview-image
                      [url]="fileUrls()[file.name]"
                    />
                  }
                </div>
                <div class="flex min-w-0 flex-1 flex-col gap-0">
                  <span class="truncate font-medium" q-file-upload-item-name></span>
                  <span
                    class="text-sm text-[var(--color-text-neutral-secondary)]"
                    q-file-upload-item-size-text
                  ></span>
                </div>
                <button
                  aria-label="Remove file"
                  class="cursor-pointer"
                  q-file-upload-item-delete-trigger
                  type="button"
                >
                  <svg qIcon="Trash2" style="width: 16px; height: 16px;"></svg>
                </button>
              </div>
            }
          </div>

          <button q-file-upload-clear-trigger type="button">
            <svg qIcon="FilePlus" style="width: 12px; height: 12px;"></svg>
            Add more files
          </button>
        }
      </ng-container>
    </div>
    <!-- preview -->
  `,
})
export class FileUploadCompositeDemo {
  private readonly destroyRef = inject(DestroyRef)

  fileUrls = signal<Record<string, string>>({})

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
  }
}
