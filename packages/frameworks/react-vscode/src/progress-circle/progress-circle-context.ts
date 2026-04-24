import type {Provider} from "react"

import {createGuardedContext} from "@qualcomm-ui/react-core/context"

import type {ProgressCircleSize} from "./progress-circle.types"

export interface ProgressCircleContextValue {
  size: ProgressCircleSize
}

const dest = createGuardedContext<ProgressCircleContextValue>({
  hookName: "useProgressCircleContext",
  providerName: "<ProgressCircleContextProvider>",
  strict: true,
})

export const ProgressCircleContextProvider: Provider<ProgressCircleContextValue> =
  dest[0]
export const useProgressCircleContext: (
  requireContext?: boolean,
) => ProgressCircleContextValue = dest[1]
