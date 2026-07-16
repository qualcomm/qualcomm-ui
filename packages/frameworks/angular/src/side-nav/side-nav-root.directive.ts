// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive, inject, input, type OnInit} from "@angular/core"

import {normalizeProps} from "@qualcomm-ui/angular-core/machine"
import {provideRenderStrategyContext} from "@qualcomm-ui/angular-core/presence"
import {
  CoreSideNavRootDirective,
  provideSideNavContext,
} from "@qualcomm-ui/angular-core/side-nav"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import {provideTreeContext} from "@qualcomm-ui/angular-core/tree"
import {
  createQdsSideNavApi,
  type QdsSideNavRootProps,
  type QdsSideNavSize,
  type QdsSideNavSurface,
} from "@qualcomm-ui/qds-core/side-nav"

import {
  provideQdsSideNavContext,
  QdsSideNavContextService,
} from "./qds-side-nav-context.service"

@Directive({
  exportAs: "sideNavRoot",
  providers: [
    provideTreeContext(),
    provideRenderStrategyContext(),
    provideSideNavContext(),
    provideQdsSideNavContext(),
  ],
  selector: "[q-side-nav-root]",
  standalone: false,
})
export class SideNavRootDirective
  extends CoreSideNavRootDirective
  implements SignalifyInput<QdsSideNavRootProps>, OnInit
{
  /**
   * Governs item padding, height, spacing, font size, and icon size.
   *
   * @since next-release
   *
   * @default 'md'
   */
  readonly size = input<QdsSideNavSize>()

  /**
   * The background color of the side navigation.
   *
   * @default 'primary'
   */
  readonly surface = input<QdsSideNavSurface>()

  protected readonly qdsSideNavService = inject(QdsSideNavContextService)

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() =>
        this.qdsSideNavService.context().getRootBindings({
          surface: this.surface(),
        }),
      ),
    )
  }

  override ngOnInit() {
    this.qdsSideNavService.init(
      computed(() => createQdsSideNavApi(normalizeProps)),
    )

    super.ngOnInit()
  }
}
