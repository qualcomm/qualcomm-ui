import {Component} from "@angular/core"
import {ChevronRight} from "lucide-angular"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {CardModule} from "@qualcomm-ui/angular/card"

@Component({
  imports: [CardModule],
  providers: [provideIcons({ChevronRight})],
  selector: "card-actions-demo",
  template: `
    <div class="flex flex-wrap gap-6">
      <!-- preview -->
      <div class="w-64 self-start" q-card variant="outline">
        <div q-card-content>
          <div q-card-heading>
            <div q-card-heading-text>Link Action</div>
          </div>
          <p q-card-paragraph-text>
            Cards can use links to navigate users to related content.
          </p>
        </div>
        <div q-card-footer>
          <a endIcon="ChevronRight" q-card-link>Learn More</a>
        </div>
      </div>

      <div class="w-64" q-card variant="outline">
        <div q-card-content>
          <div q-card-heading>
            <div q-card-heading-text>Button Actions</div>
          </div>
          <p q-card-paragraph-text>
            Cards can use buttons for primary and secondary actions.
          </p>
        </div>
        <div q-card-footer>
          <button q-card-button variant="secondary">Cancel</button>
          <button q-card-button variant="primary">Confirm</button>
        </div>
      </div>
      <!-- preview -->
    </div>
  `,
})
export class CardActionsDemo {}
