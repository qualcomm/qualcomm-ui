import {Directive, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useQdsBreadcrumbsContext} from "./qds-breadcrumbs-context.service"

@Directive({
  selector: "[q-breadcrumb-item-icon]",
  standalone: false,
})
export class BreadcrumbItemIconDirective implements OnInit {
  protected readonly qdsContext = useQdsBreadcrumbsContext()

  protected readonly trackBindings = useTrackBindings(() =>
    this.qdsContext().getItemIconBindings(),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
