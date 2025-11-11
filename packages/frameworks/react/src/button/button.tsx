// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {useButtonGroupContext} from "./button-group-context"
import type {ButtonProps} from "./button.types"
import {ContextButton, InternalButton} from "./internal"

/**
 * A styled button. Renders a `<button>` element by default.
 */
export function Button(props: ButtonProps) {
  const context = useButtonGroupContext()
  if (context) {
    return <ContextButton {...props} />
  }

  return <InternalButton {...props} />
}
