import {getPages, getSections} from "@qualcomm-ui/docs-plugin/markdown-content"
import {siteData} from "@qualcomm-ui/mdx-vite-plugin"
import {NotFound} from "@qualcomm-ui/react-mdx/not-found"
import {createFallbackRouteLoader} from "@qualcomm-ui/react-router-utils/node"

const args = {exports: siteData.exports, getPages, getSections}

/**
 * Serves export files and 404 data.
 */
export const loader = createFallbackRouteLoader(args)

export default function NotFoundRoute() {
  return <NotFound />
}
