import {Component} from "@angular/core"

import {FileUploadModule} from "@qualcomm-ui/angular/file-upload"

@Component({
  imports: [FileUploadModule],
  selector: "file-upload-simple-demo",
  standalone: true,
  template: `
    <!-- preview -->
    <q-file-upload
      class="w-full max-w-md"
      dropzoneHint="Supported file types: .jpg, .png, .pdf"
      label="Upload files"
      [maxFiles]="5"
    />
    <!-- preview -->
  `,
})
export class FileUploadSimpleDemo {}
