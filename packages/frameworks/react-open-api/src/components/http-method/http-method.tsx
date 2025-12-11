import type {
  QdsBadgeCategoryEmphasis,
  QdsBadgeSemanticEmphasis,
} from "@qualcomm-ui/qds-core/badge"
import {Badge} from "@qualcomm-ui/react/badge"

export interface HttpMethodProps {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS" | "HEAD"
}

const methodMap: Record<
  HttpMethodProps["method"],
  QdsBadgeSemanticEmphasis | QdsBadgeCategoryEmphasis
> = {
  DELETE: "danger",
  GET: "success",
  HEAD: "cyan",
  OPTIONS: "neutral",
  PATCH: "orange",
  POST: "brand",
  PUT: "warning",
}

export function HttpMethod({method}: HttpMethodProps) {
  return (
    <Badge emphasis={methodMap[method]} variant="default">
      {method}
    </Badge>
  )
}
