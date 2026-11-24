// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, inject, type Provider, type Signal} from "@angular/core"

import {provideFilterPanelContext} from "@qualcomm-ui/angular-core/filter-panel"
import {provideFilterSetContext} from "@qualcomm-ui/angular-core/filter-set"
import {type Dict, normalizeProps} from "@qualcomm-ui/angular-core/machine"
import {
  provideQdsButtonPropsContext,
  QdsButtonPropsContextService,
} from "@qualcomm-ui/angular/button"
import {
  provideQdsFilterControlContext,
  QdsFilterControlContextService,
} from "@qualcomm-ui/angular/filters"
import {createQdsFilterControlApi} from "@qualcomm-ui/qds-core/filter-control"
import {
  createQdsFilterPanelApi,
  type QdsFilterPanelSize,
} from "@qualcomm-ui/qds-core/filter-panel"

import {
  provideQdsFilterPanelContext,
  QdsFilterPanelContextService,
} from "./qds-filter-panel-context.service"

/**
 * The contexts that a filter panel root provides to its parts and controls.
 */
export function provideQdsFilterPanelRoot(): Provider[] {
  return [
    provideFilterSetContext(),
    provideFilterPanelContext(),
    provideQdsFilterPanelContext(),
    provideQdsFilterControlContext(),
    provideQdsButtonPropsContext(),
  ]
}

export interface QdsFilterPanelRoot {
  /**
   * The QDS bindings of the root element.
   */
  bindings: Signal<Dict>

  /**
   * Initializes the panel's QDS contexts. Call before the core root
   * initializes.
   */
  init: () => void
}

/**
 * Sizes the panel's parts, controls, and buttons. Must be called in an
 * injection context, such as a field initializer.
 */
export function useQdsFilterPanelRoot(
  size: Signal<QdsFilterPanelSize | undefined>,
): QdsFilterPanelRoot {
  const qdsFilterPanelService = inject(QdsFilterPanelContextService)
  const qdsFilterControlService = inject(QdsFilterControlContextService)
  const qdsButtonPropsService = inject(QdsButtonPropsContextService)

  const qdsFilterPanel = computed(() =>
    createQdsFilterPanelApi({size: size()}, normalizeProps),
  )

  return {
    bindings: computed(() => qdsFilterPanel().getRootBindings()),
    init() {
      qdsFilterPanelService.init(qdsFilterPanel)
      qdsFilterControlService.init(
        computed(() =>
          createQdsFilterControlApi(
            {size: qdsFilterPanel().getFilterControlProps().size},
            normalizeProps,
          ),
        ),
      )
      qdsButtonPropsService.init(
        computed(() => qdsFilterPanel().getButtonProps()),
      )
    },
  }
}
