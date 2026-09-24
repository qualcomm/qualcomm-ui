import {Component, computed, signal} from "@angular/core"
import {LucideUser} from "@lucide/angular"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {AvatarModule} from "@qualcomm-ui/angular/avatar"
import {CardModule} from "@qualcomm-ui/angular/card"
import {IconDirective} from "@qualcomm-ui/angular/icon"
import {RadioModule} from "@qualcomm-ui/angular/radio"
import type {QdsCardSize} from "@qualcomm-ui/qds-core/card"

@Component({
  imports: [CardModule, AvatarModule, RadioModule, IconDirective],
  providers: [provideIcons({LucideUser})],
  selector: "card-sizes-demo",
  template: `
    <div class="flex flex-col items-center gap-8">
      <!-- preview -->
      <div q-card variant="outline" [size]="size()" [style.width.px]="width()">
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
            Resize this card using the controls below to see how spacing and
            typography scale across sizes.
          </p>
        </div>
        <div q-card-footer>
          <button q-card-button variant="secondary">Cancel</button>
          <button q-card-button variant="primary">Confirm</button>
        </div>
      </div>
      <!-- preview -->
      <fieldset
        defaultValue="sm"
        name="card-size"
        orientation="horizontal"
        q-radio-group
        (valueChanged)="onSizeChanged($event!)"
      >
        <div q-radio-group-items>
          <label label="sm" q-radio value="sm"></label>
          <label label="md" q-radio value="md"></label>
          <label label="lg" q-radio value="lg"></label>
        </div>
      </fieldset>
    </div>
  `,
})
export class CardSizesDemo {
  readonly size = signal<QdsCardSize>("sm")
  readonly width = computed(() => {
    const s = this.size()
    return s === "sm" ? 256 : s === "md" ? 288 : 324
  })
  onSizeChanged(value: string) {
    this.size.set(value as QdsCardSize)
  }
}
