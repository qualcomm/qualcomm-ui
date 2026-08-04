// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, type ReactNode, useMemo} from "react"

import {createQdsCheckmarkApi} from "@qualcomm-ui/qds-core/checkmark"
import {normalizeProps} from "@qualcomm-ui/react-core/machine"
import {
  CoreTree,
  type CoreTreeNodeCheckboxProps,
  useTreeNodeStateContext,
} from "@qualcomm-ui/react-core/tree"
import {
  CheckmarkCheckedIcon,
  CheckmarkIndeterminateIcon,
} from "@qualcomm-ui/react/checkmark"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface TreeNodeCheckboxProps extends CoreTreeNodeCheckboxProps {
  /**
   * React Node rendered when the node is checked.
   *
   * @default CheckmarkCheckedIcon
   */
  checked?: ReactNode

  /**
   * React Node rendered when the node is indeterminate.
   *
   * @default CheckmarkIndeterminateIcon
   */
  indeterminate?: ReactNode
}

/**
 * A checkbox control within a tree item. Renders a `<span>` element by default.
 */
export function TreeNodeCheckbox(props: TreeNodeCheckboxProps): ReactElement {
  const nodeState = useTreeNodeStateContext()

  const api = useMemo(
    () =>
      createQdsCheckmarkApi(
        {
          checked: nodeState.checked === true,
          disabled: nodeState.disabled,
          indeterminate: nodeState.checked === "indeterminate",
          size: "md",
        },
        normalizeProps,
      ),
    [nodeState.checked, nodeState.disabled],
  )
  const mergedProps = mergeProps(api.getRootBindings(), props)

  return (
    <CoreTree.NodeCheckbox
      {...mergedProps}
      checked={props.checked || <CheckmarkCheckedIcon />}
      indeterminate={props.indeterminate || <CheckmarkIndeterminateIcon />}
    />
  )
}
