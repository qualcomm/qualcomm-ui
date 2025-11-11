// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, useMemo} from "react"

import {
  createQdsBreadcrumbsApi,
  type QdsBreadcrumbsApiProps,
} from "@qualcomm-ui/qds-core/breadcrumbs"
import {normalizeProps} from "@qualcomm-ui/react-core/machine"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {QdsBreadcrumbsContextProvider} from "./qds-breadcrumbs-context"

export interface BreadcrumbsRootProps
  extends QdsBreadcrumbsApiProps,
    ElementRenderProp<"nav"> {}

/**
 * The root element of the breadcrumbs component. Renders a `<nav>` element by
 * default.
 */
export function BreadcrumbsRoot({
  emphasis,
  size,
  ...props
}: BreadcrumbsRootProps): ReactElement {
  const qdsContext = useMemo(
    () => createQdsBreadcrumbsApi({emphasis, size}, normalizeProps),
    [emphasis, size],
  )
  const mergedProps = mergeProps(qdsContext.getRootBindings(), props)

  return (
    <QdsBreadcrumbsContextProvider value={qdsContext}>
      <PolymorphicElement as="nav" {...mergedProps} />
    </QdsBreadcrumbsContextProvider>
  )
}
