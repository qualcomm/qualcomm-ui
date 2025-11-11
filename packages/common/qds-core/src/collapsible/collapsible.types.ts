// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {collapsibleClasses} from "./collapsible.classes"

type CollapsibleClasses = typeof collapsibleClasses

export interface QdsCollapsibleContentBindings {
  className: CollapsibleClasses["content"]
}
