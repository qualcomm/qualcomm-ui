import {Component} from "@angular/core"
import {LucideUpload} from "@lucide/angular"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {FileInputModule} from "@qualcomm-ui/angular/file-input"

@Component({
  imports: [FileInputModule],
  providers: [provideIcons({LucideUpload})],
  selector: "file-input-composite-demo",
  standalone: true,
  template: `
    <!-- preview -->
    <div
      class="w-full max-w-sm"
      q-file-input-root
      startIcon="Upload"
      [accept]="['.pdf']"
    >
      <label q-file-input-label>Upload agreement</label>
      <div q-file-input-control>
        <span placeholder="Select a PDF" q-file-input-display></span>
      </div>
      <input q-file-input-hidden-input />
    </div>
    <!-- preview -->
  `,
})
export class FileInputCompositeDemo {}
