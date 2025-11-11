// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, isSignal, type Signal} from "@angular/core"

import {normalizeProps} from "@qualcomm-ui/angular-core/machine"
import type {MaybeSignalInput} from "@qualcomm-ui/angular-core/signals"
import {
  createQdsInlineIconButtonApi,
  type QdsInlineIconButtonApi,
  type QdsInlineIconButtonApiProps,
} from "@qualcomm-ui/qds-core/inline-icon-button"
import type {Explicit} from "@qualcomm-ui/utils/guard"

export function useInlineIconButtonApi({
  emphasis,
  size,
  variant,
}: MaybeSignalInput<QdsInlineIconButtonApiProps>): Signal<QdsInlineIconButtonApi> {
  return computed(() =>
    createQdsInlineIconButtonApi(
      {
        emphasis: isSignal(emphasis) ? emphasis() : emphasis,
        size: isSignal(size) ? size() : size,
        variant: isSignal(variant) ? variant() : variant,
      } satisfies Explicit<QdsInlineIconButtonApiProps>,
      normalizeProps,
    ),
  )
}
