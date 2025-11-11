/// <reference types="vite/client" />

declare module "*.mdx" {
  import {ReactNode} from "react"

  let MDXComponent: (props: any) => ReactNode
  export const frontmatter: {
    category?: string
    id: string
    title: string
  }
  export default MDXComponent
}

declare module "@qualcomm-ui/mdx-vite-plugin" {
  import type {SiteData} from "@qualcomm-ui/mdx-docs-common"

  export const siteData: SiteData
}

declare module "virtual:qui-demo-scope/auto" {
  import type {ReactDemoWithScope} from "@qualcomm-ui/mdx-docs-common"

  export function getDemo(demoName: string): ReactDemoWithScope

  export const availablePages: string[]
  export const availableDemos: string[]
}
