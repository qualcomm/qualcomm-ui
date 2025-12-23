import type {
  QdsButtonApiProps,
  QdsButtonEmphasis,
  QdsButtonSize,
  QdsButtonVariant,
} from "@qualcomm-ui/qds-core/button"
import type {BooleanDataAttr} from "@qualcomm-ui/utils/attributes"

import type {splitButtonClasses} from "./split-button.classes"

export interface QdsSplitButtonApiProps extends QdsButtonApiProps {}

type SplitButtonClasses = typeof splitButtonClasses

export interface QdsSplitButtonDividerBindings {
  className?: SplitButtonClasses["divider"]
  "data-emphasis": QdsButtonEmphasis
  "data-size": QdsButtonSize
  "data-variant": QdsButtonVariant
}

export interface QdsSplitButtonIconButtonBindings {
  className?: SplitButtonClasses["iconButton"]
  "data-disabled": BooleanDataAttr
  "data-emphasis": QdsButtonEmphasis
  "data-size": QdsButtonSize
  "data-variant": QdsButtonVariant
  disabled: boolean | undefined
}

export interface QdsSplitButtonButtonBindings {
  className?: SplitButtonClasses["button"]
  "data-disabled": BooleanDataAttr
  "data-emphasis": QdsButtonEmphasis
  "data-size": QdsButtonSize
  "data-variant": QdsButtonVariant
  disabled: boolean | undefined
}

export interface QdsSplitButtonRootBindings {
  className?: SplitButtonClasses["root"]
}

export interface QdsSplitButtonApi {
  getButtonBindings: () => QdsSplitButtonButtonBindings
  getDividerBindings: () => QdsSplitButtonDividerBindings
  getIconButtonBindings: () => QdsSplitButtonIconButtonBindings
  getRootBindings: () => QdsSplitButtonRootBindings
}
