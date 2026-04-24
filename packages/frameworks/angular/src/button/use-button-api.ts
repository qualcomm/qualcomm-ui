// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, type Signal} from "@angular/core"

import {normalizeProps} from "@qualcomm-ui/angular-core/machine"
import {
  accessSignal,
  type MaybeSignalInput,
} from "@qualcomm-ui/angular-core/signals"
import {
  createQdsButtonApi,
  type QdsButtonApi,
  type QdsButtonApiProps,
} from "@qualcomm-ui/qds-core/button"
import type {Explicit} from "@qualcomm-ui/utils/guard"

export function useButtonApi({
  density,
  disabled,
  emphasis,
  size,
  variant,
}: Partial<MaybeSignalInput<QdsButtonApiProps>>): Signal<QdsButtonApi> {
  return computed(() =>
    createQdsButtonApi(
      {
        density: accessSignal(density),
        disabled: accessSignal(disabled),
        emphasis: accessSignal(emphasis),
        size: accessSignal(size),
        variant: accessSignal(variant),
      } satisfies Explicit<QdsButtonApiProps>,
      normalizeProps,
    ),
  )
}
