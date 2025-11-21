// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  createSliderApi,
  type SliderApi,
  type SliderApiProps,
  type SliderControlBindings,
  type SliderErrorTextBindings,
  type SliderHiddenInputBindings,
  type SliderHintBindings,
  type SliderLabelBindings,
  sliderMachine,
  type SliderMarkerBindings,
  type SliderMarkerGroupBindings,
  type SliderMaxMarkerBindings,
  type SliderMinMarkerBindings,
  type SliderRangeBindings,
  type SliderThumbBindings,
  type SliderThumbIndicatorBindings,
  type SliderTrackBindings,
  type SliderValueTextBindings,
  type ThumbProps,
} from "@qualcomm-ui/core/slider"
import {useOnDestroy} from "@qualcomm-ui/react-core/effects"
import {normalizeProps, useMachine} from "@qualcomm-ui/react-core/machine"
import {useControlledId} from "@qualcomm-ui/react-core/state"
import type {IdProp} from "@qualcomm-ui/react-core/system"

import {useSliderContext, useSliderThumbContext} from "./slider-context"

export function useSlider(props: SliderApiProps): SliderApi {
  const config = useMachine(sliderMachine, props)
  return createSliderApi(config, normalizeProps)
}

export function useSliderLabel({id}: IdProp): SliderLabelBindings {
  const context = useSliderContext()
  return context.getLabelBindings({
    id: useControlledId(id),
    onDestroy: useOnDestroy(),
  })
}

export function useSliderHint({id}: IdProp): SliderHintBindings {
  const context = useSliderContext()
  return context.getHintBindings({
    id: useControlledId(id),
    onDestroy: useOnDestroy(),
  })
}

export function useSliderErrorText({id}: IdProp): SliderErrorTextBindings {
  const context = useSliderContext()
  return context.getErrorTextBindings({
    id: useControlledId(id),
    onDestroy: useOnDestroy(),
  })
}

export function useSliderValueText({id}: IdProp): SliderValueTextBindings {
  const context = useSliderContext()
  return context.getValueTextBindings({
    id: useControlledId(id),
    onDestroy: useOnDestroy(),
  })
}

export function useSliderControl({id}: IdProp): SliderControlBindings {
  const context = useSliderContext()
  return context.getControlBindings({
    id: useControlledId(id),
    onDestroy: useOnDestroy(),
  })
}

export function useSliderTrack({id}: IdProp): SliderTrackBindings {
  const context = useSliderContext()
  return context.getTrackBindings({
    id: useControlledId(id),
    onDestroy: useOnDestroy(),
  })
}

export function useSliderRange({id}: IdProp): SliderRangeBindings {
  const context = useSliderContext()
  return context.getRangeBindings({
    id: useControlledId(id),
    onDestroy: useOnDestroy(),
  })
}

export function useSliderThumb({
  id,
  ...thumbProps
}: IdProp & ThumbProps): SliderThumbBindings {
  const context = useSliderContext()
  return context.getThumbBindings({
    id: useControlledId(id),
    ...thumbProps,
    onDestroy: useOnDestroy(),
  })
}

export function useSliderHiddenInput({id}: IdProp): SliderHiddenInputBindings {
  const context = useSliderContext()
  const thumbContext = useSliderThumbContext()
  return context.getHiddenInputBindings({
    id: useControlledId(id),
    ...thumbContext,
    onDestroy: useOnDestroy(),
  })
}

export function useSliderMarker({
  id,
  value,
}: IdProp & {value: number}): SliderMarkerBindings {
  const context = useSliderContext()
  return context.getMarkerBindings({
    id: useControlledId(id),
    onDestroy: useOnDestroy(),
    value,
  })
}

export function useSliderMarkerGroup({id}: IdProp): SliderMarkerGroupBindings {
  const context = useSliderContext()
  return context.getMarkerGroupBindings({
    id: useControlledId(id),
    onDestroy: useOnDestroy(),
  })
}

export function useSliderMinMarker({id}: IdProp): SliderMinMarkerBindings {
  const context = useSliderContext()
  return context.getMinMarkerBindings({
    id: useControlledId(id),
    onDestroy: useOnDestroy(),
  })
}

export function useSliderMaxMarker({id}: IdProp): SliderMaxMarkerBindings {
  const context = useSliderContext()
  return context.getMaxMarkerBindings({
    id: useControlledId(id),
    onDestroy: useOnDestroy(),
  })
}

export function useSliderThumbIndicator({id}: IdProp): {
  bindings: SliderThumbIndicatorBindings
  value: number
} {
  const context = useSliderContext()
  const {index} = useSliderThumbContext()
  return {
    bindings: context.getThumbIndicatorBindings({
      id: useControlledId(id),
      index,
      onDestroy: useOnDestroy(),
    }),
    value: context.getThumbValue(index),
  }
}
