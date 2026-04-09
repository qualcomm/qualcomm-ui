// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, isSignal, type Signal} from "@angular/core"

import {normalizeProps} from "@qualcomm-ui/angular-core/machine"
import type {MaybeSignalInput} from "@qualcomm-ui/angular-core/signals"
import {
  createQdsIconButtonApi,
  type QdsIconButtonApi,
  type QdsIconButtonApiProps,
} from "@qualcomm-ui/qds-core/button"
import type {Explicit} from "@qualcomm-ui/utils/guard"

export function useIconButtonApi({
  density,
  disabled,
  emphasis,
  shape,
  size,
  variant,
}: Partial<MaybeSignalInput<QdsIconButtonApiProps>>): Signal<QdsIconButtonApi> {
  return computed(() =>
    createQdsIconButtonApi(
      {
        density: isSignal(density) ? density() : density,
        disabled: isSignal(disabled) ? disabled() : disabled,
        emphasis: isSignal(emphasis) ? emphasis() : emphasis,
        shape: isSignal(shape) ? shape() : shape,
        size: isSignal(size) ? size() : size,
        variant: isSignal(variant) ? variant() : variant,
      } satisfies Explicit<QdsIconButtonApiProps>,
      normalizeProps,
    ),
  )
}
