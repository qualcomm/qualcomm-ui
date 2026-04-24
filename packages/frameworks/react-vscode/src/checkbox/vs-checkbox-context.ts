import {createGuardedContext} from "@qualcomm-ui/react-core/context"

import type {VsCheckboxApi} from "./vs-checkbox.types"

export const [VsCheckboxContextProvider, useVsCheckboxContext] =
  createGuardedContext<VsCheckboxApi>({
    hookName: "useVsCheckboxContext",
    providerName: "<VsCheckboxContextProvider>",
    strict: true,
  })
