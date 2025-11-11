// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, type ReactNode, useState} from "react"

import {CodeHighlight} from "@qualcomm-ui/mdx-docs/code-highlight"
import {Popover} from "@qualcomm-ui/react/popover"

interface Props {
  children: ReactElement
  prettyType: string
}

export function ReflectionReferencePopup({
  children,
  prettyType,
}: Props): ReactNode {
  const [open, setOpen] = useState<boolean>(false)

  return (
    <Popover.Root
      onOpenChange={setOpen}
      open={open}
      positioning={{
        offset: {
          mainAxis: 12,
        },
      }}
    >
      <Popover.Anchor render={<div />}>
        <Popover.Trigger>
          <span
            onMouseEnter={() => {
              setOpen(true)
            }}
            onMouseLeave={() => {
              setOpen(false)
            }}
          >
            {children}
          </span>
        </Popover.Trigger>
      </Popover.Anchor>

      <Popover.Positioner>
        <Popover.Content
          className="doc-props__type-info-popup-content"
          onMouseLeave={() => setOpen(false)}
        >
          <Popover.Arrow />
          <CodeHighlight
            className="code-highlight-popup"
            code={prettyType}
            disableCopy
            language="tsx"
          />
        </Popover.Content>
      </Popover.Positioner>
    </Popover.Root>
  )
}
