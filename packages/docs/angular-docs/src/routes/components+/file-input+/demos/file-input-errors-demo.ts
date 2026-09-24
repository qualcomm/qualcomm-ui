import {Component} from "@angular/core"
import {LucideUpload} from "@lucide/angular"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {FileInputModule} from "@qualcomm-ui/angular/file-input"

@Component({
  imports: [FileInputModule],
  providers: [provideIcons({LucideUpload})],
  selector: "file-input-errors-demo",
  standalone: true,
  template: `
    <!-- preview -->
    <q-file-input
      class="w-full max-w-sm"
      errorText="Upload a PDF file under 5 MB"
      invalid
      label="Tax document"
      placeholder="Select a PDF"
      required
      startIcon="Upload"
      [accept]="['.pdf']"
      [maxFileSize]="5 * 1024 * 1024"
    />
    <!-- preview -->
  `,
})
export class FileInputErrorsDemo {}
