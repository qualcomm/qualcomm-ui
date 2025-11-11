import {Directive, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import {inputClasses} from "@qualcomm-ui/qds-core/input"

import {useQdsInputContext} from "./qds-input-context.service"

/**
 * Simple hint directive that applies hint styles. Not bound to any form or component context.
 * @remarks if using a specific input component, use that component's hint directive instead of
 * this one.
 */
@Directive({
  host: {
    "[class]": "inputClasses.hint",
  },
  selector: "[q-hint]",
})
export class HintDirective implements OnInit {
  protected inputClasses = inputClasses

  protected qdsInputContext = useQdsInputContext({optional: true})

  protected trackBindings = useTrackBindings(() => {
    const context = this.qdsInputContext?.()
    return context?.getHintBindings?.() || {}
  })

  ngOnInit() {
    this.trackBindings()
  }
}
