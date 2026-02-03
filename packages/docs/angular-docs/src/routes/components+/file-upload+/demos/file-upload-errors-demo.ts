import {Component, signal} from "@angular/core"

import {FileUploadModule} from "@qualcomm-ui/angular/file-upload"
import type {FileDetails} from "@qualcomm-ui/core/file-upload"

@Component({
  imports: [FileUploadModule],
  selector: "file-upload-errors-demo",
  standalone: true,
  template: `
    <!-- preview -->
    <q-file-upload
      class="w-full max-w-md"
      dropzoneHint="Supported file types: .jpg, .jpeg, .png, .pdf"
      label="Upload files"
      [accept]="['image/png', 'image/jpg', 'image/jpeg', 'application/pdf']"
      [errorText]="errorText()"
      [invalid]="invalid()"
      [maxFiles]="3"
      (fileChanged)="handleFileChange($event)"
    />
    <!-- preview -->
  `,
})
export class FileUploadErrorsDemo {
  readonly invalid = signal(true)
  readonly errorText = signal("At least one file is required")

  protected handleFileChange = (details: FileDetails) => {
    if (details.acceptedFiles.length > 0 && !details.rejectedFiles.length) {
      this.invalid.set(false)
      this.errorText.set("")
    } else if (details.acceptedFiles.length === 0) {
      this.invalid.set(true)
      this.errorText.set("At least one file is required")
    } else {
      this.invalid.set(true)
      this.errorText.set("Files must be .jpg, .jpeg, .png, or .pdf.")
    }
  }
}
