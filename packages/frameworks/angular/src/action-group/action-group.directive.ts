import {computed, Directive, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import {getActionGroupRootBindings} from "@qualcomm-ui/core/action-group"
import {actionGroupClasses} from "@qualcomm-ui/qds-core/action-group"

@Directive({
  host: {
    "[class]": "actionGroupClasses.root",
  },
  selector: "[q-action-group]",
})
export class ActionGroupDirective implements OnInit {
  protected readonly actionGroupClasses = actionGroupClasses

  private trackBindings = useTrackBindings(
    computed(() => getActionGroupRootBindings()),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
