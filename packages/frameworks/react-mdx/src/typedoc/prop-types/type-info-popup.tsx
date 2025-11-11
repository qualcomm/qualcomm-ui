// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactNode, useMemo, useRef, useState} from "react"

import {CodeHighlight} from "@qualcomm-ui/react-mdx/code-highlight"
import {
  CopyToClipboardContextProvider,
  type CopyToClipboardContextValue,
  useCopyToClipboard,
} from "@qualcomm-ui/react-mdx/copy-to-clipboard"
import {Popover} from "@qualcomm-ui/react/popover"

import {TsIcon} from "./ts-icon"

interface Props {
  importStatement: string
}

export function TypeInfoPopup({importStatement}: Props): ReactNode {
  const {copyToClipboard, isCopied} = useCopyToClipboard({
    valueOrFn: importStatement,
  })

  const context: CopyToClipboardContextValue = useMemo(
    () => ({
      copyToClipboard,
      isCopied,
    }),
    [copyToClipboard, isCopied],
  )
  const [open, setOpen] = useState<boolean>(false)
  const leaveTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  return (
    <CopyToClipboardContextProvider value={context}>
      <Popover.Root
        onOpenChange={setOpen}
        open={open}
        positioning={{
          offset: {
            mainAxis: 12,
          },
        }}
      >
        <Popover.Anchor>
          <Popover.Trigger>
            <button
              aria-label="Show full type import"
              className="doc-props-type-info-popup-trigger"
              onClick={(event) => {
                event.stopPropagation()
                event.preventDefault()
              }}
              onMouseEnter={() => {
                setOpen(true)
                clearTimeout(leaveTimeoutRef.current)
              }}
              onMouseLeave={() => {
                leaveTimeoutRef.current = setTimeout(() => {
                  setOpen(false)
                }, 100)
              }}
            >
              <TsIcon
                className="doc-props__type-info-icon"
                height={22}
                onClick={() => {
                  copyToClipboard()
                }}
                width={22}
              />
            </button>
          </Popover.Trigger>
        </Popover.Anchor>

        <Popover.Positioner>
          <Popover.Content
            className="doc-props__type-info-popup-content"
            onMouseEnter={() => clearTimeout(leaveTimeoutRef.current)}
            onMouseLeave={() => setOpen(false)}
          >
            <CodeHighlight
              className="code-highlight-popup"
              code={importStatement}
              forceShowCopyButton
              language="tsx"
            />
          </Popover.Content>
        </Popover.Positioner>
      </Popover.Root>
    </CopyToClipboardContextProvider>
  )
}
