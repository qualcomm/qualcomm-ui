import type {AngularDemoInfo} from "@qualcomm-ui/mdx-docs-common"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"

export interface DemoUpdateContextValue {
  /**
   * The update information for impacted demos, keyed by demo ID.
   * This is cleared before each demo update to prevent stale data from triggering a
   * refresh.
   */
  demoInfo: Record<string, AngularDemoInfo>

  /**
   * IDs for demos that are currently being updated.
   */
  updatingDemoIds: string[]
}

export const [DemoUpdateContextProvider, useDemoUpdateContext] =
  createGuardedContext<DemoUpdateContextValue>({
    hookName: "useDemoUpdateContext",
    providerName: "<DemoUpdateContextProvider>",
    strict: true,
  })
