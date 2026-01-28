import {Component} from "@angular/core"

import {FileUploadModule} from "@qualcomm-ui/angular/file-upload"

@Component({
  imports: [FileUploadModule],
  selector: "file-upload-sizes-demo",
  standalone: true,
  template: `
    <!-- preview -->
    <div class="flex w-full flex-col items-center gap-8">
      <div class="w-full max-w-md">
        <q-file-upload
          dropzoneHint="Supported file types: .jpg, .jpeg, .png, .pdf"
          label="Upload files (Small)"
          size="sm"
          [accept]="['image/png', 'image/jpg', 'image/jpeg', 'application/pdf']"
          [maxFiles]="5"
        />
      </div>

      <div class="w-full max-w-md">
        <q-file-upload
          dropzoneHint="Supported file types: .jpg, .jpeg, .png, .pdf"
          label="Upload files (Medium)"
          size="md"
          [accept]="['image/png', 'image/jpg', 'image/jpeg', 'application/pdf']"
          [maxFiles]="5"
        />
      </div>

      <div class="w-full max-w-md">
        <q-file-upload
          dropzoneHint="Supported file types: .jpg, .jpeg, .png, .pdf"
          label="Upload files (Large)"
          size="lg"
          [accept]="['image/png', 'image/jpg', 'image/jpeg', 'application/pdf']"
          [maxFiles]="5"
        />
      </div>
    </div>
    <!-- preview -->
  `,
})
export class FileUploadSizesDemo {}
