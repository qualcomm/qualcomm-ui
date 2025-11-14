// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {Check, Copy} from "lucide-react"

import {IconButton, type IconButtonProps} from "@qualcomm-ui/react/button"
import {booleanDataAttr} from "@qualcomm-ui/utils/attributes"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useCopyToClipboard} from "./use-copy-to-clipboard"

export interface CopyToClipboardProps extends Omit<IconButtonProps, "icon"> {
  valueOrFn: string | (() => string)
}

export function CopyToClipboardIconButton({
  valueOrFn,
  ...props
}: CopyToClipboardProps): ReactElement {
  const {copyToClipboard, isCopied} = useCopyToClipboard({
    valueOrFn,
  })

  const mergedProps = mergeProps(
    {"data-copied": booleanDataAttr(isCopied), onClick: copyToClipboard},
    props,
  )

  return (
    <IconButton
      className="qui-code-copy-button"
      density="compact"
      emphasis="primary"
      icon={isCopied ? Check : Copy}
      size="md"
      tabIndex={0}
      title="Copy code"
      variant="ghost"
      {...mergedProps}
    />
  )
}
