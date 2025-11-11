// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, type Signal} from "@angular/core"

import {useInlineIconButtonApi} from "@qualcomm-ui/angular/inline-icon-button"
import type {LucideIconOrString} from "@qualcomm-ui/angular-core/lucide"
import type {
  QdsInlineIconButtonIconBindings,
  QdsInlineIconButtonRootBindings,
} from "@qualcomm-ui/qds-core/inline-icon-button"
import type {
  QdsInputClearTriggerBindings,
  QdsInputErrorIndicatorBindings,
  QdsInputErrorTextBindings,
  QdsInputGroupBindings,
  QdsInputHintBindings,
  QdsInputInputBindings,
} from "@qualcomm-ui/qds-core/input"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsInputContext} from "./qds-input-context.service"

export interface UseInputInputReturn {
  getBindings: Signal<QdsInputInputBindings>
}

/**
 * A composable function that provides bindings for implementing the input on
 * input components. It assumes that it is used within the context of the
 * useQdsInputContext hook.
 */
export function useInputInput(): UseInputInputReturn {
  const qdsContext = useQdsInputContext()
  return {
    getBindings: computed(() => qdsContext().getInputBindings()),
  }
}

export interface UseInputClearTriggerReturn {
  getIconBindings: Signal<QdsInlineIconButtonIconBindings>
  getRootBindings: Signal<
    QdsInlineIconButtonRootBindings & QdsInputClearTriggerBindings
  >
}

/**
 * A composable function that provides bindings for implementing a clear trigger on
 * input components. It assumes that it is used within the context of the
 * useQdsInputContext hook.
 */
export function useInputClearTrigger(): UseInputClearTriggerReturn {
  const qdsContext = useQdsInputContext()
  const buttonApi = useInlineIconButtonApi({
    emphasis: "neutral",
    size: computed(() => qdsContext().size),
    variant: "scale",
  })

  return {
    getIconBindings: computed(() => buttonApi().getIconBindings()),
    getRootBindings: computed(() =>
      mergeProps(
        buttonApi().getRootBindings(),
        qdsContext().getClearTriggerBindings(),
      ),
    ),
  }
}

export interface UseInputErrorIndicatorReturn {
  getBindings: Signal<QdsInputErrorIndicatorBindings>
}

/**
 * A composable function that provides bindings for implementing error indicators
 * on input components. It assumes that it is used within the context of the
 * useQdsInputContext hook.
 */
export function useInputErrorIndicator(): UseInputErrorIndicatorReturn {
  const qdsContext = useQdsInputContext()
  return {
    getBindings: computed(() => qdsContext().getErrorIndicatorBindings()),
  }
}

export interface UseInputErrorTextReturn {
  getBindings: Signal<QdsInputErrorTextBindings>
}

/**
 * A composable function that provides bindings for implementing error text on
 * input components. It assumes that it is used within the context of the
 * useQdsInputContext hook.
 */
export function useInputErrorText(): UseInputErrorTextReturn {
  const qdsContext = useQdsInputContext()
  return {
    getBindings: computed(() => qdsContext().getErrorTextBindings()),
  }
}

export interface UseInputGroupReturn
  extends Signal<{
    endIcon?: LucideIconOrString
    getBindings: () => QdsInputGroupBindings
    startIcon?: LucideIconOrString
  }> {}

/**
 * A composable function that provides bindings for implementing the input group on
 * input components. It assumes that it is used within the context of the
 * useQdsInputContext hook.
 */
export function useInputGroup(): UseInputGroupReturn {
  const qdsContext = useQdsInputContext()
  return computed(() => ({
    endIcon: qdsContext().endIcon,
    getBindings: () => qdsContext().getGroupBindings(),
    startIcon: qdsContext().startIcon,
  }))
}

export interface UseInputHintReturn {
  getBindings: Signal<QdsInputHintBindings>
}

/**
 * A composable function that provides bindings for implementing a hint on
 * input components. It assumes that it is used within the context of the
 * useQdsInputContext hook.
 */
export function useInputHint(): UseInputHintReturn {
  const qdsContext = useQdsInputContext()
  return {
    getBindings: computed(() => qdsContext().getHintBindings()),
  }
}
