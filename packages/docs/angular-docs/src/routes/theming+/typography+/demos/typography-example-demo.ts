import {Component} from "@angular/core"

@Component({
  selector: "typography-example-demo",
  template: `
    <div class="flex flex-col gap-4">
      <!-- preview -->
      <div class="font-body-lg text-neutral-secondary">
        Body large, primary color
      </div>
      <div
        [style]="{
          color: 'var(--color-text-neutral-secondary)',
          font: 'var(--font-static-body-lg-default)',
        }"
      >
        Body large, secondary color (css variables)
      </div>
      <!-- preview -->
    </div>
  `,
})
export class TypographyExampleDemo {}
