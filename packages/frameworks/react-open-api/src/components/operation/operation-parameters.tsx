import {useMemo} from "react"

import type {ParameterObject, RequestBodyObject} from "../../types"

import {ParameterList} from "./parameter-list"
import {RequestBody} from "./request-body"

export interface OperationParametersProps {
  breadcrumb?: string[]
  parameters?: ParameterObject[]
  requestBody?: RequestBodyObject
}

export function OperationParameters({
  breadcrumb,
  parameters = [],
  requestBody,
}: OperationParametersProps) {
  const filterParameters = useMemo(
    () => (where: "path" | "query" | "header" | "cookie") =>
      parameters.filter((p) => p.in === where),
    [parameters],
  )

  return (
    <>
      <ParameterList
        parameters={filterParameters("path")}
        title="Path Parameters"
        breadcrumb={breadcrumb ? [...breadcrumb, "path"] : undefined}
      />

      <ParameterList
        parameters={filterParameters("query")}
        title="Query Parameters"
        breadcrumb={breadcrumb ? [...breadcrumb, "query"] : undefined}
      />

      <ParameterList
        parameters={filterParameters("header")}
        title="Headers"
        breadcrumb={breadcrumb ? [...breadcrumb, "headers"] : undefined}
      />

      <ParameterList
        parameters={filterParameters("cookie")}
        title="Cookies"
        breadcrumb={breadcrumb ? [...breadcrumb, "cookies"] : undefined}
      />

      {requestBody && (
        <RequestBody
          requestBody={requestBody}
          title="Body"
          breadcrumb={breadcrumb ? [...breadcrumb, "body"] : undefined}
        />
      )}
    </>
  )
}
