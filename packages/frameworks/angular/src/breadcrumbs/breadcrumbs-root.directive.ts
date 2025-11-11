// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive, inject, input, type OnInit} from "@angular/core"

import {
  normalizeProps,
  useTrackBindings,
} from "@qualcomm-ui/angular-core/machine"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import {
  createQdsBreadcrumbsApi,
  type QdsBreadcrumbsApiProps,
  type QdsBreadcrumbsEmphasis,
  type QdsBreadcrumbsSize,
} from "@qualcomm-ui/qds-core/breadcrumbs"

import {
  provideQdsBreadcrumbsContext,
  QdsBreadcrumbsContextService,
} from "./qds-breadcrumbs-context.service"

@Directive({
  providers: [provideQdsBreadcrumbsContext()],
  selector: "[q-breadcrumbs-root]",
  standalone: false,
})
export class BreadcrumbsRootDirective
  implements OnInit, SignalifyInput<QdsBreadcrumbsApiProps>
{
  /**
   * Governs the color of the breadcrumb item text and icon.
   * @default 'primary'
   */
  readonly emphasis = input<QdsBreadcrumbsEmphasis>()

  /**
   * Governs the size of the breadcrumb item text and icon.
   * @default 'md'
   */
  readonly size = input<QdsBreadcrumbsSize>()

  protected readonly breadcrumbsApi = inject(QdsBreadcrumbsContextService)

  protected readonly trackBindings = useTrackBindings(() => {
    return this.breadcrumbsApi.context().getRootBindings()
  })

  ngOnInit() {
    this.breadcrumbsApi.init(
      computed(() =>
        createQdsBreadcrumbsApi(
          {
            emphasis: this.emphasis(),
            size: this.size(),
          },
          normalizeProps,
        ),
      ),
    )

    this.trackBindings()
  }
}
