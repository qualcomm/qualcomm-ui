import {isRouteErrorResponse, LoaderFunction, useRouteError} from "react-router"

export const loader: LoaderFunction = () => {
  throw new Response("Not Found", {status: 404}) as any
}

export function ErrorBoundary() {
  const error = useRouteError()
  return (
    <h1>
      {isRouteErrorResponse(error) ? (
        <div>not found</div>
      ) : error instanceof Error ? (
        error.message
      ) : (
        "Unknown Error"
      )}
    </h1>
  )
}

export default () => null
