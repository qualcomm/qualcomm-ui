import {
  createContext,
  type Dispatch,
  type Provider,
  type SetStateAction,
  useContext,
} from "react"

import type {PropsContextValue} from "@qualcomm-ui/mdx-docs/typedoc"
import type {NavItem, PageHeading, PageMap} from "@qualcomm-ui/mdx-docs-common"

export interface MdxDocsLayoutContextState {
  hidePageLinks: boolean
  hideSideNav: boolean
  mainContentElement: HTMLElement | null
  navItems: NavItem[]
  pageMap: PageMap
  pageProps: PropsContextValue | null
  pathname: string
  setMainContentElement: Dispatch<SetStateAction<HTMLElement | null>>
  showToc: boolean
  toc: PageHeading[]
}

const MdxDocsLayoutContext = createContext<MdxDocsLayoutContextState>(
  null as any,
)

export const MdxDocsLayoutContextProvider: Provider<MdxDocsLayoutContextState> =
  MdxDocsLayoutContext.Provider

export function useMdxDocsLayoutContext(): MdxDocsLayoutContextState {
  const context = useContext(MdxDocsLayoutContext)

  if (!context) {
    throw new Error(
      "useMdxDocsLayoutContext can only be used as children of a <Layout.Root> instance.",
    )
  }

  return context
}
