// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, type Signal} from "@angular/core"

import {normalizeProps} from "@qualcomm-ui/angular-core/machine"
import {
  accessSignal,
  type MaybeSignalInput,
} from "@qualcomm-ui/angular-core/signals"
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
        density: accessSignal(density),
        disabled: accessSignal(disabled),
        emphasis: accessSignal(emphasis),
        shape: accessSignal(shape),
        size: accessSignal(size),
        variant: accessSignal(variant),
      } satisfies Explicit<QdsIconButtonApiProps>,
      normalizeProps,
    ),
  )
}
