import {createGuardedContext} from "@qualcomm-ui/react-core/context"

export interface GlobalConfigContextValue {
  hideDemoBrandSwitcher: boolean
  setHideDemoBrandSwitcher: (value: boolean) => void
}

export const [GlobalConfigContextProvider, useGlobalConfigContext] =
  createGuardedContext<GlobalConfigContextValue>({
    hookName: "useGlobalConfigContext",
    providerName: "<GlobalConfigContextProvider>",
    strict: true,
  })
