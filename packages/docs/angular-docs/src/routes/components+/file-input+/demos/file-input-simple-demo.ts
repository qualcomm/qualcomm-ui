import {Component} from "@angular/core"
import {LucideUpload} from "@lucide/angular"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {FileInputModule} from "@qualcomm-ui/angular/file-input"

@Component({
  imports: [FileInputModule],
  providers: [provideIcons({LucideUpload})],
  selector: "file-input-simple-demo",
  standalone: true,
  template: `
    <!-- preview -->
    <q-file-input
      class="w-full max-w-sm"
      label="Upload file"
      placeholder="Select a file"
      startIcon="Upload"
    />
    <!-- preview -->
  `,
})
export class FileInputSimpleDemo {}
