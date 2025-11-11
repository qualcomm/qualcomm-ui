// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {useSliderContext} from "@qualcomm-ui/react-core/slider"
import {useControlledId} from "@qualcomm-ui/react-core/state"
import type {IdProp} from "@qualcomm-ui/react-core/system"

import {SliderMarker, type SliderMarkerProps} from "./slider-marker"
import {
  SliderMarkerGroup,
  type SliderMarkerGroupProps,
} from "./slider-marker-group"

export interface SliderMarkersProps extends IdProp {
  /**
   * Props applied to the marker group element.
   *
   * @inheritDoc
   */
  markerGroupProps?: SliderMarkerGroupProps

  /**
   * Props applied to all marker elements.
   *
   * @inheritDoc
   */
  markerProps?: Omit<SliderMarkerProps, "value">

  /**
   * An array of numbers indicating where to place the markers. If not
   * provided, the component will generate 11 evenly spaced markers based on
   * the `min` and `max` slider values.
   */
  marks?: number[]
}

/**
 * A shortcut element for the marker group and the markers.
 */
export function SliderMarkers({
  id,
  markerGroupProps,
  markerProps,
  marks,
}: SliderMarkersProps): ReactElement {
  const context = useSliderContext()
  const groupId = useControlledId(id)
  const markerValues =
    Array.isArray(marks) && marks.length > 0 ? marks : context.getDefaultMarks()

  return (
    <SliderMarkerGroup id={groupId} {...markerGroupProps}>
      {markerValues.map((mark, idx) => (
        <SliderMarker
          key={idx}
          id={`${groupId}-${idx}`}
          value={mark}
          {...markerProps}
        >
          {mark}
        </SliderMarker>
      ))}
    </SliderMarkerGroup>
  )
}
