import {
  type DocsRuntimeContextValue,
  useDocsRuntimeContext,
  useDocsPageContext,
} from "@qualcomm-ui/react-mdx/context"
import {
  Layout
} from "@qualcomm-ui/react-mdx/docs-layout"

export function PageTitle() {
  const {pageFrontmatter} = useDocsPageContext()
  const {routingStrategy}: DocsRuntimeContextValue = useDocsRuntimeContext()
  return (
    <Layout.Breadcrumbs>
      {String(pageFrontmatter.title)} {routingStrategy}
    </Layout.Breadcrumbs>
  )
}
