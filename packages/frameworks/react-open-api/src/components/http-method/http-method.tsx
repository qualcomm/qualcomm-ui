export interface HttpMethodProps {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS" | "HEAD"
}

export function HttpMethod({method}: HttpMethodProps) {
  return (
    <span className="openapi-method" data-method={method.toLowerCase()}>
      {method}
    </span>
  )
}
