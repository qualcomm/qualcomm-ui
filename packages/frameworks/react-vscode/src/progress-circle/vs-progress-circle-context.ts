import {createGuardedContext} from "@qualcomm-ui/react-core/context"

import type {VsProgressCircleApi} from "./vs-progress-circle.api"

export const [VsProgressCircleContextProvider, useVsProgressCircleContext] =
  createGuardedContext<VsProgressCircleApi>({
    hookName: "useVsProgressCircleContext",
    providerName: "<VsProgressCircleContextProvider>",
    strict: true,
  })
