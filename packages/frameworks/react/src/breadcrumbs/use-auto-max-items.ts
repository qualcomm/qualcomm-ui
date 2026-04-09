// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type RefObject, useRef, useState} from "react"

import {
  type BreadcrumbsMeasurement,
  computeAutoMaxItems,
  measureBreadcrumbsList,
  observeBreadcrumbsResize,
} from "@qualcomm-ui/qds-core/breadcrumbs"
import {useSafeLayoutEffect} from "@qualcomm-ui/react-core/effects"

import type {BreadcrumbsItemData} from "./breadcrumbs-list"

interface UseAutoMaxItemsOptions {
  enabled: boolean
  endItems: number
  items: BreadcrumbsItemData[] | undefined
  startItems: number
}

interface UseAutoMaxItemsResult {
  computedMaxItems: number | undefined
  isMeasuring: boolean
  listRef: RefObject<HTMLOListElement | null>
  triggerMeasureRef: RefObject<HTMLDivElement | null>
}

export function useAutoMaxItems({
  enabled,
  endItems,
  items,
  startItems,
}: UseAutoMaxItemsOptions): UseAutoMaxItemsResult {
  const listRef = useRef<HTMLOListElement | null>(null)
  const triggerMeasureRef = useRef<HTMLDivElement | null>(null)
  const [computedMaxItems, setComputedMaxItems] = useState<number | undefined>(
    undefined,
  )
  const [isMeasuring, setIsMeasuring] = useState(enabled)

  const measurementRef = useRef<BreadcrumbsMeasurement | null>(null)
  const triggerWidthRef = useRef(0)

  // When enabled + items change, trigger a measurement pass
  useSafeLayoutEffect(() => {
    if (!enabled || !items || items.length === 0) {
      setComputedMaxItems(undefined)
      setIsMeasuring(false)
      return
    }

    setIsMeasuring(true)
    setComputedMaxItems(undefined)
  }, [enabled, items])

  // Measure DOM when isMeasuring flips to true
  useSafeLayoutEffect(() => {
    if (!isMeasuring) {
      return
    }

    const list = listRef.current
    if (!list) {
      return
    }

    const measurement = measureBreadcrumbsList(list)
    if (!measurement) {
      setIsMeasuring(false)
      return
    }

    const triggerEl = triggerMeasureRef.current?.firstElementChild as
      | HTMLElement
      | undefined
    const triggerWidth = triggerEl?.offsetWidth ?? 0

    measurementRef.current = measurement
    triggerWidthRef.current = triggerWidth

    const result = computeAutoMaxItems(
      measurement.containerWidth,
      triggerWidth,
      measurement.itemWidths,
      measurement.gap,
      startItems,
      endItems,
    )

    setComputedMaxItems(result)
    setIsMeasuring(false)
  }, [isMeasuring, startItems, endItems])

  // ResizeObserver — recompute from cached measurement on container resize
  useSafeLayoutEffect(() => {
    if (!enabled || isMeasuring) {
      return
    }

    const list = listRef.current
    const measurement = measurementRef.current
    if (!list || !measurement) {
      return
    }

    return observeBreadcrumbsResize(
      list,
      measurement,
      triggerWidthRef.current,
      {endItems, startItems},
      setComputedMaxItems,
    )
  }, [enabled, isMeasuring, startItems, endItems])

  return {
    computedMaxItems,
    isMeasuring,
    listRef,
    triggerMeasureRef,
  }
}
