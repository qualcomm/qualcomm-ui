// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {useRef} from "react"

import {
  createPresenceApi,
  type PresenceApiProps,
  type PresenceBindings,
  presenceMachine,
  type RenderStrategyApiProps,
} from "@qualcomm-ui/core/presence"
import {useEvent} from "@qualcomm-ui/react-core/events"
import {normalizeProps, useMachine} from "@qualcomm-ui/react-core/machine"
import type {Optional} from "@qualcomm-ui/utils/guard"

export interface UsePresenceProps
  extends Optional<PresenceApiProps, "present">, RenderStrategyApiProps {
  /**
   * Whether to allow the initial presence animation.
   *
   * @default false
   */
  skipAnimationOnMount?: boolean
}

export interface UsePresenceReturn {
  getPresenceBindings: () => PresenceBindings
  present: boolean
  ref: (node: HTMLElement | null) => void
  unmounted: boolean | undefined
}

export function usePresence(props: UsePresenceProps = {}): UsePresenceReturn {
  const {
    lazyMount,
    present,
    skipAnimationOnMount = false,
    unmountOnExit,
    ...rest
  } = props
  const wasEverPresent = useRef(false)
  const machineProps: Partial<PresenceApiProps> = {
    ...rest,
    onExitComplete: useEvent(props.onExitComplete),
    present,
  }

  const machine = useMachine(presenceMachine, machineProps)
  const api = createPresenceApi(machine, normalizeProps)

  /**
   * The node mounts in the render that requests it, before the presence
   * machine catches up. Effects of the owning machine that look the node up
   * when it opens, such as dismissable tracking, would otherwise miss a lazily
   * mounted node.
   */
  const mounted = api.present || !!present
  if (mounted) {
    wasEverPresent.current = true
  }

  const unmounted =
    (!mounted && !wasEverPresent.current && lazyMount) ||
    (unmountOnExit && !mounted && wasEverPresent.current)

  const getPresenceBindings = (): PresenceBindings => ({
    "data-state":
      api.skip && skipAnimationOnMount
        ? undefined
        : present
          ? "open"
          : "closed",
    hidden: !api.present,
  })

  return {
    getPresenceBindings,
    present: api.present,
    ref: api.setNode,
    unmounted,
  }
}
