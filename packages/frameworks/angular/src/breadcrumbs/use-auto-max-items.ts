// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  afterNextRender,
  type ElementRef,
  inject,
  Injector,
  type Signal,
  signal,
} from "@angular/core"

import {useOnDestroy} from "@qualcomm-ui/angular-core/common"
import {
  computeAutoMaxItems,
  measureBreadcrumbsList,
  observeBreadcrumbsResize,
} from "@qualcomm-ui/qds-core/breadcrumbs"

interface UseAutoMaxItemsOptions {
  element: ElementRef<HTMLElement>
  endItems: () => number
  startItems: () => number
  triggerElement: () => ElementRef<HTMLElement> | undefined
}

export interface UseAutoMaxItemsResult {
  computedMaxItems: Signal<number | undefined>
  isMeasuring: Signal<boolean>
  reset(): void
  startMeasurement(): void
}

export function useAutoMaxItems(
  options: UseAutoMaxItemsOptions,
): UseAutoMaxItemsResult {
  const injector = inject(Injector)
  const onDestroy = useOnDestroy()

  const computedMaxItems = signal<number | undefined>(undefined)
  const isMeasuring = signal(false)

  let disconnectObserver: (() => void) | null = null

  function cleanupObserver(): void {
    if (disconnectObserver) {
      disconnectObserver()
      disconnectObserver = null
    }
  }

  onDestroy(() => cleanupObserver())

  return {
    computedMaxItems,
    isMeasuring,

    reset(): void {
      cleanupObserver()
      computedMaxItems.set(undefined)
      isMeasuring.set(false)
    },

    startMeasurement(): void {
      cleanupObserver()
      isMeasuring.set(true)
      computedMaxItems.set(undefined)

      afterNextRender(
        {
          read: () => {
            const el = options.element.nativeElement

            const m = measureBreadcrumbsList(el)
            if (!m) {
              isMeasuring.set(false)
              return
            }

            const triggerEl = options.triggerElement()?.nativeElement
              ?.firstElementChild as HTMLElement | null
            const triggerWidth = triggerEl?.offsetWidth ?? 0

            const result = computeAutoMaxItems(
              m.containerWidth,
              triggerWidth,
              m.itemWidths,
              m.gap,
              options.startItems(),
              options.endItems(),
            )

            computedMaxItems.set(result)
            isMeasuring.set(false)

            disconnectObserver = observeBreadcrumbsResize(
              el,
              m,
              triggerWidth,
              {
                endItems: options.endItems(),
                startItems: options.startItems(),
              },
              (maxItems) => computedMaxItems.set(maxItems),
            )
          },
        },
        {injector},
      )
    },
  }
}
