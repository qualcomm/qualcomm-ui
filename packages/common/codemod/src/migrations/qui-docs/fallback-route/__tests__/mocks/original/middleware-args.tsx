import {getPages, getSections} from "@qualcomm-ui/docs-plugin/markdown-content"
import {siteData} from "@qualcomm-ui/mdx-vite-plugin"
import {NotFound} from "@qualcomm-ui/react-mdx/not-found"
import {
  createFallbackRouteMiddleware,
  type FallbackRouteArgs,
  type FallbackRouteLoaderData,
} from "@qualcomm-ui/react-router-utils/node"

const fallbackRouteArgs: FallbackRouteArgs = {
  exports: siteData.exports,
  getPages,
  getSections,
}

export const middleware = [createFallbackRouteMiddleware(fallbackRouteArgs)]

export default function NotFoundRoute({
  loaderData,
}: {
  loaderData: FallbackRouteLoaderData
}) {
  return <NotFound url={loaderData.pathname} />
}
