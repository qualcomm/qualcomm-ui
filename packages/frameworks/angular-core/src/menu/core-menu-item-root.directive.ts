// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  computed,
  Directive,
  ElementRef,
  inject,
  type OnInit,
} from "@angular/core"

import {useOnDestroy} from "@qualcomm-ui/angular-core/common"
import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {BaseMenuItemDirective} from "./base-menu-item.directive"

@Directive()
export class CoreMenuItemRootDirective
  extends BaseMenuItemDirective
  implements OnInit
{
  readonly itemState = computed(() => {
    return this.menuContext().getItemState(this.itemProps())
  })

  protected readonly trackBindings = useTrackBindings(() => {
    return this.menuContext().getItemBindings({
      ...this.itemProps(),
    })
  })

  protected readonly onDestroy = useOnDestroy()

  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef)

  ngOnInit() {
    const cleanup = this.menuContext().addItemListener({
      element: this.elementRef.nativeElement,
      onSelect: () => this.selected.emit(),
    })
    this.onDestroy(() => cleanup?.())

    this.menuItemService.init(
      computed(() => {
        return {
          ...this.itemProps(),
          ...this.itemState(),
        }
      }),
    )

    this.trackBindings()
  }
}
