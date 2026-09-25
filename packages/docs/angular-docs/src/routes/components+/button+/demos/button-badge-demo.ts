import {Component} from "@angular/core"
import {LucideMail} from "@lucide/angular"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {
  NumberBadgeDirective,
  StatusBadgeDirective,
} from "@qualcomm-ui/angular/badge"
import {ButtonModule} from "@qualcomm-ui/angular/button"

@Component({
  imports: [ButtonModule, NumberBadgeDirective, StatusBadgeDirective],
  providers: [provideIcons({LucideMail})],
  selector: "button-badge-demo",
  template: `
    <div class="flex flex-wrap items-center gap-4">
      <!-- preview -->
      <button emphasis="primary" q-button startIcon="Mail" variant="fill">
        Inbox
        <span q-number-badge [value]="3"></span>
      </button>
      <button emphasis="primary" q-button variant="outline">
        Notifications
        <span q-number-badge [value]="120"></span>
      </button>
      <button q-button variant="outline">
        Online
        <span emphasis="success" q-status-badge></span>
      </button>
      <!-- preview -->
    </div>
  `,
})
export class ButtonBadgeDemo {}
