import {Component} from "@angular/core"
import {User} from "lucide-angular"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {AvatarModule} from "@qualcomm-ui/angular/avatar"
import {CardModule} from "@qualcomm-ui/angular/card"
import {IconDirective} from "@qualcomm-ui/angular/icon"

@Component({
  imports: [CardModule, AvatarModule, IconDirective],
  providers: [provideIcons({User})],
  selector: "card-explorer-demo",
  template: `
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
          <span q-card-eyebrow-text>Eyebrow</span>
          <div q-card-heading-text>Card Title</div>
        </div>
        <div q-card-subheading-text>Subheading</div>
        <p q-card-paragraph-text>
          A brief description that provides additional context about this card.
        </p>
        <a q-card-link>Learn more</a>
      </div>
      <div q-card-footer>
        <button q-card-button variant="primary">Action</button>
      </div>
    </div>
  `,
})
export class CardExplorerDemo {}
