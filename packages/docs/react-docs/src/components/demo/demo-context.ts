import type {ReactDemoWithScope} from "@qualcomm-ui/mdx-common"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"

type HotUpdatedDemoState = Record<string, ReactDemoWithScope>

export const [DemoContextProvider, useDemoContext] =
  createGuardedContext<HotUpdatedDemoState>({
    hookName: "useDemoContext",
    providerName: "<DemoContextProvider>",
    strict: true,
  })
