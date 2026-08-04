import {Component} from "@angular/core"

import {CardModule} from "@qualcomm-ui/angular/card"

@Component({
  imports: [CardModule],
  selector: "card-interactive-demo",
  template: `
    <div class="flex flex-wrap gap-6">
      <!-- preview -->
      <button class="w-64" interactive q-card variant="elevated">
        <div q-card-content>
          <div q-card-heading>
            <div q-card-heading-text>Interactive Card</div>
          </div>
          <p q-card-paragraph-text>
            Hover or press this card to see the interactive states.
          </p>
        </div>
      </button>
      <!-- preview -->
    </div>
  `,
})
export class CardInteractiveDemo {}
