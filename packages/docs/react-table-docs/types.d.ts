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
