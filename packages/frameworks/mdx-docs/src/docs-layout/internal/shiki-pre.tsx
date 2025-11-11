// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type HTMLAttributes, type ReactElement, useRef, useState} from "react"

import {CopyToClipboardIconButton} from "@qualcomm-ui/mdx-docs/copy-to-clipboard"
import {clsx} from "@qualcomm-ui/utils/clsx"

export interface ShikiPreProps extends HTMLAttributes<HTMLPreElement> {}

export function ShikiPre({
  children,
  className,
  ...props
}: ShikiPreProps): ReactElement {
  const preRef = useRef<HTMLPreElement>(null)

  const [hovered, setHovered] = useState<boolean>(false)

  return (
    <div
      className="shiki-wrapper mdx"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <pre
        ref={preRef}
        className={clsx("mdx", className)}
        {...props}
        tabIndex={-1}
      >
        {children}
      </pre>
      {hovered ? (
        <CopyToClipboardIconButton
          className="qui-code-copy-button"
          valueOrFn={() => preRef.current!.innerText}
        />
      ) : null}
    </div>
  )
}
