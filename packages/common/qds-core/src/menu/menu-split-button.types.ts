// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {
  QdsButtonGroupCommonBindings,
  QdsButtonGroupCommonProps,
} from "@qualcomm-ui/qds-core/button"
import type {AnatomyPart, AnatomyPartName} from "@qualcomm-ui/utils/anatomy"

import type {splitButtonAnatomy} from "./menu-split-button.anatomy.js"
import type {menuClasses} from "./menu.classes.js"

/**
 * @since 1.29.0
 */
export interface QdsSplitButtonApiProps extends QdsButtonGroupCommonProps {}

type PartName = AnatomyPartName<typeof splitButtonAnatomy>
interface Part<P extends PartName> extends AnatomyPart<"splitButton", P> {}

/**
 * @since 1.29.0
 */
export interface QdsSplitButtonBindings
  extends Part<"root">, QdsButtonGroupCommonBindings {
  className: (typeof menuClasses)["splitButton"]
}
