import {Component, type OnInit} from "@angular/core"
import {ChevronRight} from "lucide-angular"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useQdsMenuContext} from "./qds-menu-context.service"

@Component({
  providers: [provideIcons({ChevronRight})],
  selector: "[q-menu-trigger-item-indicator]",
  standalone: false,
  template: `
    <ng-content>
      <svg qIcon="ChevronRight" />
    </ng-content>
  `,
})
export class MenuTriggerItemIndicatorComponent implements OnInit {
  readonly qdsMenuContext = useQdsMenuContext()

  protected readonly trackBindings = useTrackBindings(() =>
    this.qdsMenuContext().getTriggerItemIndicatorBindings(),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
