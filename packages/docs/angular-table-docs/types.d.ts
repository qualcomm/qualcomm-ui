/// <reference types="vite/client" />
/// <reference types="@qualcomm-ui/mdx-vite/docs-plugin" />
/// <reference types="@qualcomm-ui/mdx-vite/angular-demo-plugin" />

declare module "*.mdx" {
  import type {ReactNode} from "react"

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
}

declare module "virtual:angular-demo-registry" {
  import type {AngularDemoInfo} from "@qualcomm-ui/mdx-docs-common"

  export function getAngularDemoInfo(demoId: string): AngularDemoInfo | null
}
