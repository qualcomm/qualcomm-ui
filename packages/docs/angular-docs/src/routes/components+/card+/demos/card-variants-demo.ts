import {Component} from "@angular/core"

import {CardModule} from "@qualcomm-ui/angular/card"

@Component({
  imports: [CardModule],
  selector: "card-variants-demo",
  template: `
    <div class="flex flex-wrap justify-center gap-6">
      <!-- preview -->
      <div class="w-64" q-card variant="outline">
        <div q-card-content>
          <div q-card-heading>
            <div q-card-heading-text>Outline</div>
          </div>
          <p q-card-paragraph-text>
            A card with a border and background color.
          </p>
        </div>
      </div>

      <div class="w-64" q-card variant="outline-elevated">
        <div q-card-content>
          <div q-card-heading>
            <div q-card-heading-text>Outline Elevated</div>
          </div>
          <p q-card-paragraph-text>
            A card with a border and subtle elevation.
          </p>
        </div>
      </div>

      <div class="w-64" q-card variant="elevated">
        <div q-card-content>
          <div q-card-heading>
            <div q-card-heading-text>Elevated</div>
          </div>
          <p q-card-paragraph-text>
            A card with a subtle elevation and no border.
          </p>
        </div>
      </div>
      <!-- preview -->
    </div>
  `,
})
export class CardVariantsDemo {}
