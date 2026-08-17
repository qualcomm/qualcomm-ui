import {Component} from "@angular/core"
import {LucideChevronDown, LucideChevronRight} from "@lucide/angular"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {
  HeaderComponentContextDirective,
  TableModule,
} from "@qualcomm-ui/angular/table"

@Component({
  imports: [TableModule],
  providers: [provideIcons({LucideChevronDown, LucideChevronRight})],
  selector: "app-username-header",
  template: `
    <div class="flex items-center gap-2">
      <button
        aria-label="Expand all table rows"
        q-table-column-header-action
        [icon]="
          context().table.getIsAllRowsExpanded()
            ? 'ChevronDown'
            : 'ChevronRight'
        "
        (click)="context().table.toggleAllRowsExpanded()"
      ></button>
      <span>Username</span>
    </div>
  `,
})
export class UsernameHeader extends HeaderComponentContextDirective<any> {}
