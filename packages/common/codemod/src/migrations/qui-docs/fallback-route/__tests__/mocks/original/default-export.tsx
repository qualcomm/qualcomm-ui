import {NotFound} from "@qualcomm-ui/react-mdx/not-found"
import type {FallbackRouteLoaderData} from "@qualcomm-ui/react-router-utils/node"

export default function NotFoundRoute({
  loaderData,
}: {
  loaderData: FallbackRouteLoaderData
}) {
  return <NotFound url={loaderData.pathname} />
}
