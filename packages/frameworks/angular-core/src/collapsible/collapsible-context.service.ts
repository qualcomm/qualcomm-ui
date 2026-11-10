// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Injectable, type Signal} from "@angular/core"

import {
  type ApiContext,
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import {useRenderStrategyContext} from "@qualcomm-ui/angular-core/presence"
import type {CollapsibleApi} from "@qualcomm-ui/core/collapsible"
import type {RenderStrategyApiProps} from "@qualcomm-ui/core/presence"

@Injectable()
export class CollapsibleContextService extends BaseApiContextService<CollapsibleApi> {
  private readonly inheritedRenderStrategy = useRenderStrategyContext({
    optional: true,
  })
  private renderStrategy: Signal<RenderStrategyApiProps> | undefined
  private wasVisible = false

  override init(
    computedApi: Signal<CollapsibleApi>,
    renderStrategy?: Signal<RenderStrategyApiProps>,
  ): void {
    super.init(computedApi)
    this.renderStrategy = renderStrategy
  }

  /**
   * Whether content should be unmounted according to the render strategy.
   */
  readonly isUnmounted = computed(() => {
    const {visible} = this.context()
    const {lazyMount, unmountOnExit} =
      this.renderStrategy?.() ?? this.inheritedRenderStrategy?.() ?? {}

    if (visible) {
      this.wasVisible = true
    }

    return (
      !visible &&
      ((!this.wasVisible && !!lazyMount) ||
        (this.wasVisible && !!unmountOnExit))
    )
  })
}

export const [
  COLLAPSIBLE_CONTEXT,
  useCollapsibleContext,
  provideCollapsibleContext,
]: ApiContext<CollapsibleApi> = createApiContext<CollapsibleApi>(
  "CollapsibleContext",
  CollapsibleContextService,
)
