import {Component} from "@angular/core"
import {ChevronRight} from "lucide-angular"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {BadgeDirective} from "@qualcomm-ui/angular/badge"
import {CardModule} from "@qualcomm-ui/angular/card"

@Component({
  imports: [CardModule, BadgeDirective],
  providers: [provideIcons({ChevronRight})],
  selector: "card-badge-demo",
  template: `
    <div class="flex flex-wrap gap-6">
      <!-- preview -->
      <div class="w-72" q-card variant="outline">
        <div q-card-badge>
          <span emphasis="brand" q-badge>NEW</span>
        </div>
        <div q-card-content>
          <div q-card-heading>
            <div q-card-heading-text>Snapdragon X2 Elite</div>
            <div q-card-subheading-text>A legendary leap in performance</div>
          </div>
          <p q-card-paragraph-text>
            Unleash your masterpiece with ultra-premium performance, multi-day
            battery life, and blazing AI processing power.
          </p>
        </div>
        <div q-card-footer>
          <a endIcon="ChevronRight" q-card-link>Learn More</a>
        </div>
      </div>
      <!-- preview -->
    </div>
  `,
})
export class CardBadgeDemo {}
