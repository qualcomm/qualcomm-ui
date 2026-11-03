import {
  type MdxDocsContextValue,
  useMdxDocsContext,
} from "@qualcomm-ui/react-mdx/context"
import {
  Layout,
  useMdxDocsLayoutContext,
} from "@qualcomm-ui/react-mdx/docs-layout"

export function PageTitle() {
  const {pageFrontmatter} = useMdxDocsLayoutContext()
  const {routingStrategy}: MdxDocsContextValue = useMdxDocsContext()
  return (
    <Layout.Breadcrumbs>
      {String(pageFrontmatter.title)} {routingStrategy}
    </Layout.Breadcrumbs>
  )
}
