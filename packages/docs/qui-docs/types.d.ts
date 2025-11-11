/// <reference types="vite/client" />
/// <reference types="@qualcomm-ui/mdx-vite/docs-plugin" />
/// <reference types="@qualcomm-ui/mdx-vite/react-demo-plugin" />

declare module "*.mdx" {
  let MDXComponent: (props: any) => React.ReactNode
  export const frontmatter: {
    category?: string
    id: string
    title: string
  }
  export default MDXComponent
}

declare module "@qualcomm-ui/mdx-vite-plugin" {
  import type {SiteData} from "@qualcomm-ui/mdx-common"

  export const siteData: SiteData
}

declare module "virtual:qui-demo-scope/auto" {
  import type {ReactDemoWithScope} from "@qualcomm-ui/mdx-common"

  export function getDemo(demoName: string): ReactDemoWithScope

  export const availablePages: string[]
  export const availableDemos: string[]
}
