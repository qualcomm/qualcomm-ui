// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {PropNormalizer} from "@qualcomm-ui/utils/machine"

import {collapsibleClasses} from "./collapsible.classes.js"
import type {QdsCollapsibleContentBindings} from "./collapsible.types.js"

export function getQdsCollapsibleContentBindings(
  normalize: PropNormalizer,
): QdsCollapsibleContentBindings {
  return normalize.element({
    className: collapsibleClasses.content,
  })
}
