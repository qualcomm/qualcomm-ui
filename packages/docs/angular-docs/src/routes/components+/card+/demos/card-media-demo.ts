import {Component} from "@angular/core"
import {LucideChevronRight} from "@lucide/angular"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {CardModule} from "@qualcomm-ui/angular/card"

@Component({
  imports: [CardModule],
  providers: [provideIcons({LucideChevronRight})],
  selector: "card-media-demo",
  template: `
    <div class="flex flex-wrap gap-6">
      <!-- preview -->
      <div class="w-64" q-card variant="outline">
        <div q-card-media>
          <img
            alt="Qualcomm automotive technology"
            class="h-40 w-full"
            src="https://react.qui.qualcomm.com/images/auto-vertical-1.png"
          />
        </div>
        <div q-card-content>
          <div q-card-heading>
            <div q-card-heading-text>Automotive Platform</div>
            <div q-card-subheading-text>Next-gen connectivity</div>
          </div>
        </div>
        <div q-card-footer>
          <a endIcon="ChevronRight" q-card-link>Learn More</a>
        </div>
      </div>
      <!-- preview -->
    </div>
  `,
})
export class CardMediaDemo {}
