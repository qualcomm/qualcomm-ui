// Modified from https://github.com/swagger-api/swagger-ui
// Apache-2.0
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactNode} from "react"

import {Button, type ButtonProps} from "@qualcomm-ui/react/button"
import {clsx} from "@qualcomm-ui/utils/clsx"

OperationSummaryMethod.displayName = "OperationSummaryMethod"

export interface OperationSummaryMethodProps {
  method: string
}

const propsMap: Record<string, Partial<ButtonProps>> = {
  delete: {
    emphasis: "danger",
  },
  get: {
    className: "q-method-get",
    emphasis: "primary",
  },
  head: {
    className: "q-purple",
    emphasis: "primary",
  },
  options: {
    className: "q-lime",
    emphasis: "primary",
  },
  patch: {
    className: "q-orange",
    emphasis: "neutral",
  },
  post: {
    emphasis: "primary",
  },
  put: {
    className: "q-method-put",
    emphasis: "neutral",
  },
  trace: {
    className: "q-teal",
    emphasis: "primary",
  },
}

export function OperationSummaryMethod({
  method,
}: OperationSummaryMethodProps): ReactNode {
  const buttonProps = propsMap[method]

  return (
    <Button
      {...buttonProps}
      className={clsx(buttonProps?.className, "qui-method-button", method)}
      render={<div />}
      size="sm"
      tabIndex={-1}
      variant="fill"
    >
      {method.toUpperCase()}
    </Button>
  )
}
