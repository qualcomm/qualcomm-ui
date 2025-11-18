import {Component, type OnInit} from "@angular/core"

import {
  normalizeProps,
  useTrackBindings,
} from "@qualcomm-ui/angular-core/machine"
import {
  actionGroupClasses,
  getActionGroupRootBindings,
} from "@qualcomm-ui/qds-core/action-group"

@Component({
  selector: "[q-pagination-page-buttons]",
  standalone: false,
  template: `
    <button q-pagination-prev-trigger></button>
    <q-pagination-page-items />
    <button q-pagination-next-trigger></button>
  `,
})
export class PaginationPageButtonsDirective implements OnInit {
  protected readonly actionGroupClasses = actionGroupClasses

  protected readonly trackBindings = useTrackBindings(() =>
    getActionGroupRootBindings(normalizeProps),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
