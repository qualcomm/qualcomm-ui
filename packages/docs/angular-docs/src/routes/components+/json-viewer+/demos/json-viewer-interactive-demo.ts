import {Component, signal} from "@angular/core"

import {FileInputModule} from "@qualcomm-ui/angular/file-input"
import {JsonViewerModule} from "@qualcomm-ui/angular/json-viewer"
import type {FileDetails} from "@qualcomm-ui/core/file-upload"

@Component({
  imports: [FileInputModule, JsonViewerModule],
  selector: "json-viewer-interactive-demo",
  template: `
    <!-- preview -->
    <div class="flex w-full min-w-0 flex-col gap-4">
      <q-file-input
        accept=".json"
        class="w-full max-w-sm"
        label="JSON File"
        placeholder="Select a JSON file"
        [disabled]="reading()"
        [errorText]="error()"
        [invalid]="!!error()"
        (fileChanged)="onFileChanged($event)"
      />

      @if (result(); as result) {
        <div class="max-h-96 overflow-auto">
          <div
            lazyMount
            q-json-viewer
            unmountOnExit
            [data]="result.data"
            [defaultExpandedDepth]="1"
          ></div>
        </div>
      } @else if (reading()) {
        <p aria-live="polite" class="text-neutral-secondary font-body-sm">
          Reading JSON file…
        </p>
      }
    </div>
    <!-- preview -->
  `,
})
export class JsonViewerInteractiveDemo {
  protected readonly reading = signal(false)
  protected readonly result = signal<{data: unknown} | null>(null)
  protected readonly error = signal<string | undefined>(undefined)

  protected onFileChanged({acceptedFiles, rejectedFiles}: FileDetails): void {
    this.result.set(null)
    this.error.set(rejectedFiles.length ? "Select a .json file." : undefined)
    const file = rejectedFiles.length ? undefined : acceptedFiles[0]
    this.reading.set(!!file)
    if (!file) {
      return
    }

    void file
      .text()
      .then((text) => {
        const data: unknown = JSON.parse(text)
        this.result.set({data})
        return
      })
      .catch((error: unknown) => {
        this.error.set(
          error instanceof SyntaxError
            ? "The selected file contains invalid JSON."
            : "The selected file could not be read.",
        )
      })
      .finally(() => {
        this.reading.set(false)
      })
  }
}
