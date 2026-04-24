import {getPages, getSections} from "@qualcomm-ui/docs-plugin/markdown-content"
import {siteData} from "@qualcomm-ui/mdx-vite-plugin"
import {createFallbackRouteLoader} from "@qualcomm-ui/react-router-utils/node"

export const loader = createFallbackRouteLoader({
  exports: siteData.exports,
  getPages,
  getSections,
})
