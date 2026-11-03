import type {ReactNode} from "react"

import {
  type DocsRuntimeContextValue,
  DocsRuntimeProvider,
  DocsManifestProvider,
  type DocsManifestContextValue,
  useDocsManifestContext,
} from "@qualcomm-ui/react-mdx/context"

interface Props {
  children: ReactNode
  runtime: DocsRuntimeContextValue
  siteData: DocsManifestContextValue
}

export function DocsProviders({children, runtime, siteData}: Props) {
  return (
    <DocsManifestProvider value={siteData}>
      <DocsRuntimeProvider value={runtime}>{children}</DocsRuntimeProvider>
    </DocsManifestProvider>
  )
}

export const hooks = {useSiteContext: useDocsManifestContext}
