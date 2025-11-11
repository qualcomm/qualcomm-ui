// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import type {As, PolymorphicComponentPropsWithRef} from "./system.types"

/**
 * @interface
 */
export type PolymorphicAsElementProps<C extends As> =
  PolymorphicComponentPropsWithRef<C> & {
    /**
     * The component or element used for the root node.
     */
    as: C
  }

/**
 * A simple helper component for polymorphic function components. TypeScript
 * struggles with the As type inference, so we make it "any" internally for ease of
 * use in utility components where the type doesn't matter.
 *
 * @internal
 */
export function PolymorphicAsElement({
  as,
  children,
  ...props
}: PolymorphicAsElementProps<any>): ReactElement {
  const Element: any = as
  return <Element {...props}>{children}</Element>
}
