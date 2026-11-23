// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive, input, type OnInit} from "@angular/core"

import {useId, useOnDestroy} from "@qualcomm-ui/angular-core/common"
import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"

import {useTreeContext} from "./tree-context.service"
import {useTreeNodePropsContext} from "./tree-node-props-context.service"

@Directive()
export class CoreTreeNodeCheckboxDirective
  implements OnInit, SignalifyInput<{id?: string}>
{
  /**
   * {@link https://www.w3schools.com/html/html_id.asp id attribute}. If
   * omitted, a unique identifier will be generated for accessibility.
   */
  readonly id = input<string>()

  protected readonly treeContext = useTreeContext()

  protected readonly treeNodePropsContext = useTreeNodePropsContext()

  protected readonly trackBindings = useTrackBindings(() => {
    return this.treeContext().getNodeCheckboxBindings({
      ...this.treeNodePropsContext(),
      id: this.hostId(),
      onDestroy: this.onDestroy,
    })
  })

  protected readonly onDestroy = useOnDestroy()
  private readonly hostId = computed(() => useId(this, this.id()))

  ngOnInit() {
    this.trackBindings()
  }
}
