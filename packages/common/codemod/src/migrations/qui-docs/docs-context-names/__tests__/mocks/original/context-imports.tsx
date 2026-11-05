import type {ReactNode} from "react"

import {
  type MdxDocsContextValue,
  MdxDocsProvider,
  SiteContextProvider,
  type SiteDataContextValue,
  useSiteContext,
} from "@qualcomm-ui/react-mdx/context"

interface Props {
  children: ReactNode
  runtime: MdxDocsContextValue
  siteData: SiteDataContextValue
}

export function DocsProviders({children, runtime, siteData}: Props) {
  return (
    <SiteContextProvider value={siteData}>
      <MdxDocsProvider value={runtime}>{children}</MdxDocsProvider>
    </SiteContextProvider>
  )
}

export const hooks = {useSiteContext}
