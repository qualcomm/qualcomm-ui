import type {QdsSplitButtonApi} from "@qualcomm-ui/qds-core/split-button"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"

export const [QdsSplitButtonContextProvider, useQdsSplitButtonContext] =
  createGuardedContext<QdsSplitButtonApi>({
    hookName: "useQdsSplitButtonContext",
    providerName: "<QdsSplitButtonContextProvider>",
    strict: true,
  })
