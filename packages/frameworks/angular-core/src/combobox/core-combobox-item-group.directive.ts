import {computed, Directive, inject, input, type OnInit} from "@angular/core"

import {useId} from "@qualcomm-ui/angular-core/common"
import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import type {ComboboxApiItemGroupProps} from "@qualcomm-ui/core/combobox"

import {useComboboxContext} from "./combobox-context.service"
import {ComboboxItemGroupContextService} from "./combobox-item-group-context.service"

@Directive()
export class CoreComboboxItemGroupDirective implements OnInit {
  /**
   * Unique identifier for the combobox item group. Not the final HTML `id`
   * attribute.
   */
  readonly id = input<string>()

  protected readonly comboboxContext = useComboboxContext()
  protected readonly comboboxItemGroupService = inject(
    ComboboxItemGroupContextService,
  )
  protected readonly hostId = computed(() => useId(this, this.id()))

  protected readonly trackBindings = useTrackBindings(() =>
    this.comboboxContext().getItemGroupBindings(
      this.comboboxItemGroupService.context(),
    ),
  )

  ngOnInit() {
    this.comboboxItemGroupService.init(
      computed(
        () =>
          ({
            id: this.hostId(),
          }) satisfies ComboboxApiItemGroupProps,
      ),
    )

    this.trackBindings()
  }
}
