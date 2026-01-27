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
        <h3 class="mb-4 text-sm font-semibold">Small</h3>
        <q-file-upload
          dropzoneHint="Supported file types: .jpg, .jpeg, .png, .pdf"
          label="Upload files (Small)"
          size="sm"
          [accept]="['image/png', 'image/jpg', 'image/jpeg', 'application/pdf']"
          [maxFiles]="5"
        />
      </div>

      <div class="w-full max-w-md">
        <h3 class="mb-4 text-sm font-semibold">Medium (Default)</h3>
        <q-file-upload
          dropzoneHint="Supported file types: .jpg, .jpeg, .png, .pdf"
          label="Upload files (Medium)"
          size="md"
          [accept]="['image/png', 'image/jpg', 'image/jpeg', 'application/pdf']"
          [maxFiles]="5"
        />
      </div>

      <div class="w-full max-w-md">
        <h3 class="mb-4 text-sm font-semibold">Large</h3>
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
