import {Component} from "@angular/core"
import {LucideUser} from "@lucide/angular"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {AvatarModule} from "@qualcomm-ui/angular/avatar"
import {CardModule} from "@qualcomm-ui/angular/card"
import {IconDirective} from "@qualcomm-ui/angular/icon"

@Component({
  imports: [CardModule, AvatarModule, IconDirective],
  providers: [provideIcons({LucideUser})],
  selector: "card-showcase-demo",
  template: `
    <div class="flex flex-wrap gap-6">
      <!-- preview -->
      <div class="w-72" q-card variant="outline">
        <div q-card-media>
          <div q-card-avatar>
            <div q-avatar-content>
              <svg aria-label="User" qIcon="User"></svg>
            </div>
          </div>
        </div>
        <div q-card-content>
          <div q-card-heading>
            <div q-card-heading-text>Card Title</div>
            <div q-card-subheading-text>Subheading</div>
          </div>

          <div q-card-subheading-text>Paragraph Subheading</div>
          <p q-card-paragraph-text>
            This is a small card with media, header, body text, and a footer
            with actions.
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
export class CardShowcaseDemo {}
