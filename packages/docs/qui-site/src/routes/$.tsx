import {isRouteErrorResponse, LoaderFunction, useRouteError} from "react-router"

import {NotFound} from "@qualcomm-ui/mdx-docs/not-found"

export const loader: LoaderFunction = () => {
  throw new Response("Not Found", {status: 404}) as any
}

export function ErrorBoundary() {
  const error = useRouteError()
  return (
    <h1>
      {isRouteErrorResponse(error) ? (
        <NotFound />
      ) : error instanceof Error ? (
        error.message
      ) : (
        "Unknown Error"
      )}
    </h1>
  )
}

export default () => null
