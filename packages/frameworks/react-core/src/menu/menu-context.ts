// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactNode} from "react"

import type {MenuApi} from "@qualcomm-ui/core/menu"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"
import {renderProp, type RenderProp} from "@qualcomm-ui/react-core/system"

export const [MenuContextProvider, useMenuContext] =
  createGuardedContext<MenuApi>({
    hookName: "useMenuContext",
    providerName: "<MenuContextProvider>",
    strict: true,
  })

export interface MenuContextProps {
  /**
   * React children {@link
   * https://react-next.qui.qualcomm.com/render-props#render-prop
   * Render Prop}
   *
   * @inheritDoc
   */
  children: RenderProp<MenuApi>
}

export function MenuContext(props: MenuContextProps): ReactNode {
  const context = useMenuContext()
  return renderProp(props.children, context)
}
