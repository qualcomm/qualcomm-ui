// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useInlineNotificationContext} from "./inline-notification-context.service"

@Directive()
export class CoreInlineNotificationIconDirective implements OnInit {
  protected readonly inlineNotificationContext = useInlineNotificationContext()

  protected readonly trackBindings = useTrackBindings(() => {
    return this.inlineNotificationContext().getIconBindings()
  })

  ngOnInit() {
    this.trackBindings()
  }
}
