import {Component, signal} from "@angular/core"
import {FormsModule} from "@angular/forms"
import {LucideUpload} from "@lucide/angular"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {CheckboxModule} from "@qualcomm-ui/angular/checkbox"
import {FileInputModule} from "@qualcomm-ui/angular/file-input"

@Component({
  imports: [CheckboxModule, FileInputModule, FormsModule],
  providers: [provideIcons({LucideUpload})],
  selector: "file-input-disabled-demo",
  standalone: true,
  template: `
    <!-- preview -->
    <div class="flex w-full max-w-sm flex-col gap-4">
      <label
        label="I agree to the terms and conditions"
        q-checkbox
        [(ngModel)]="agreed"
      ></label>
      <q-file-input
        label="Upload approval"
        placeholder="Select a file"
        startIcon="Upload"
        [disabled]="!agreed()"
      />
    </div>
    <!-- preview -->
  `,
})
export class FileInputDisabledDemo {
  readonly agreed = signal(false)
}
