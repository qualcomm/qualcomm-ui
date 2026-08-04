import {Component} from "@angular/core"
import {Upload} from "lucide-angular"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {FileInputModule} from "@qualcomm-ui/angular/file-input"

@Component({
  imports: [FileInputModule],
  providers: [provideIcons({Upload})],
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
