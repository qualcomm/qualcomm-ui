// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type HTMLAttributes, type ReactElement, useRef} from "react"

import {CopyToClipboardIconButton} from "@qualcomm-ui/react-mdx/copy-to-clipboard"
import {clsx} from "@qualcomm-ui/utils/clsx"

export interface ShikiPreProps extends HTMLAttributes<HTMLPreElement> {}

export function ShikiPre({
  children,
  className,
  ...props
}: ShikiPreProps): ReactElement {
  const preRef = useRef<HTMLPreElement>(null)

  return (
    <div className="shiki-wrapper mdx">
      <pre
        ref={preRef}
        className={clsx("mdx", className)}
        {...props}
        tabIndex={-1}
      >
        {children}
      </pre>
      <CopyToClipboardIconButton valueOrFn={() => preRef.current!.innerText} />
    </div>
  )
}
