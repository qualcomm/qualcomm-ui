import {Component} from "@angular/core"
import {LucideUpload} from "@lucide/angular"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {FileInputModule} from "@qualcomm-ui/angular/file-input"

@Component({
  imports: [FileInputModule],
  providers: [provideIcons({LucideUpload})],
  selector: "file-input-sizes-demo",
  standalone: true,
  template: `
    <!-- preview -->
    <div class="flex w-full flex-col items-center gap-6">
      <q-file-input
        class="w-full max-w-sm"
        label="Upload file (Small)"
        placeholder="Select a file"
        size="sm"
        startIcon="Upload"
      />

      <q-file-input
        class="w-full max-w-sm"
        label="Upload file (Medium)"
        placeholder="Select a file"
        size="md"
        startIcon="Upload"
      />

      <q-file-input
        class="w-full max-w-sm"
        label="Upload file (Large)"
        placeholder="Select a file"
        size="lg"
        startIcon="Upload"
      />
    </div>
    <!-- preview -->
  `,
})
export class FileInputSizesDemo {}
