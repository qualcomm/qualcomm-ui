import {createProps, createSplitProps} from "@qualcomm-ui/utils/object"

import type {PresenceApiProps, RenderStrategyApiProps} from "./presence.types"

export const presenceProps: (keyof PresenceApiProps)[] =
  createProps<PresenceApiProps>()(
    "immediate",
    "lazyMount",
    "onExitComplete",
    "present",
    "skipAnimationOnMount",
    "unmountOnExit",
  )

export const splitPresenceProps: <Props extends PresenceApiProps>(
  props: Props,
) => [PresenceApiProps, Omit<Props, keyof PresenceApiProps>] =
  createSplitProps<PresenceApiProps>(presenceProps)

export const renderStrategyProps: (keyof RenderStrategyApiProps)[] =
  createProps<RenderStrategyApiProps>()("unmountOnExit", "lazyMount")

export const splitRenderStrategyProps: <Props extends RenderStrategyApiProps>(
  props: Props,
) => [RenderStrategyApiProps, Omit<Props, keyof RenderStrategyApiProps>] =
  createSplitProps<RenderStrategyApiProps>(renderStrategyProps)
