// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {Check, Copy} from "lucide-react"

import {
  InlineIconButton,
  type InlineIconButtonProps,
} from "@qualcomm-ui/react/inline-icon-button"
import {booleanDataAttr} from "@qualcomm-ui/utils/attributes"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useCopyToClipboard} from "./use-copy-to-clipboard"

export interface CopyToClipboardInlineIconButtonProps
  extends Omit<InlineIconButtonProps, "icon"> {
  valueOrFn: string | (() => string)
}

export function CopyToClipboardInlineIconButton({
  valueOrFn,
  ...props
}: CopyToClipboardInlineIconButtonProps): ReactElement {
  const {copyToClipboard, isCopied} = useCopyToClipboard({
    valueOrFn,
  })

  const mergedProps = mergeProps(
    {"data-copied": booleanDataAttr(isCopied), onClick: copyToClipboard},
    props,
  )

  return (
    <InlineIconButton
      icon={isCopied ? Check : Copy}
      size="md"
      tabIndex={0}
      title="Copy code"
      variant="fixed"
      {...mergedProps}
    />
  )
}
