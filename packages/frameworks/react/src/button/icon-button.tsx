// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {useButtonGroupContext} from "./button-group-context"
import type {IconButtonProps} from "./icon-button.types"
import {ContextIconButton, InternalIconButton} from "./internal"

/**
 * A styled icon button. Renders a `<button>` element by default.
 */
export function IconButton(props: IconButtonProps) {
  const context = useButtonGroupContext()
  if (context) {
    return <ContextIconButton {...props} />
  }

  return <InternalIconButton {...props} />
}
