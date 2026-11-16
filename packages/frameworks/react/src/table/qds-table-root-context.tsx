import type {QdsTableRootApi} from "@qualcomm-ui/qds-core/table"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"

export const [QdsTableRootContextProvider, useQdsTableRootContext] =
  createGuardedContext<QdsTableRootApi>({
    hookName: "useQdsTableRootContext",
    providerName: "<QdsTableRootContextProvider>",
    strict: true,
  })
