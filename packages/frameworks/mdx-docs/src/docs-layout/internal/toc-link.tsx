// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, useEffect, useRef} from "react"

import {useMergedRef} from "@qualcomm-ui/react-core/refs"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"

export interface TocLinkProps extends ElementRenderProp<"div"> {
  /**
   * If `true`, the ToC link is active.
   */
  active?: boolean
}

export function TocLink({
  active,
  ref: refProp,
  ...props
}: TocLinkProps): ReactElement {
  const localRef = useRef(null)

  const ref = useMergedRef(refProp, localRef)

  useEffect(() => {
    if (active && localRef.current) {
      const localEl = localRef.current as any
      localEl?.scrollIntoView?.({block: "nearest"})
    }
  }, [active, ref])

  return (
    <PolymorphicElement
      ref={ref}
      as="div"
      className="qui-toc__link"
      {...props}
    />
  )
}
