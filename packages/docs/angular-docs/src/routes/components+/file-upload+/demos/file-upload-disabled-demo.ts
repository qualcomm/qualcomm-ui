import {Component, signal} from "@angular/core"
import {FormsModule} from "@angular/forms"

import {CheckboxModule} from "@qualcomm-ui/angular/checkbox"
import {FileUploadModule} from "@qualcomm-ui/angular/file-upload"

@Component({
  imports: [FileUploadModule, CheckboxModule, FormsModule],
  selector: "file-upload-disabled-demo",
  standalone: true,
  template: `
    <!-- preview -->
    <div class="flex w-full max-w-md flex-col gap-4">
      <label
        label="I agree to the terms and conditions"
        q-checkbox
        [(ngModel)]="agreed"
      ></label>
      <q-file-upload
        label="Upload files"
        [disabled]="!agreed()"
        [maxFiles]="5"
      />
    </div>
    <!-- preview -->
  `,
})
export class FileUploadDisabledDemo {
  readonly agreed = signal(false)
}
