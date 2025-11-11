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
