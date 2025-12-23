import {booleanDataAttr} from "@qualcomm-ui/utils/attributes"
import type {PropNormalizer} from "@qualcomm-ui/utils/machine"

import {splitButtonClasses} from "./split-button.classes"
import type {
  QdsSplitButtonApi,
  QdsSplitButtonApiProps,
  QdsSplitButtonButtonBindings,
  QdsSplitButtonDividerBindings,
  QdsSplitButtonIconButtonBindings,
  QdsSplitButtonRootBindings,
} from "./split-button.types"

export function createQdsSplitButtonApi(
  props: QdsSplitButtonApiProps,
  normalize: PropNormalizer,
): QdsSplitButtonApi {
  const disabled = props.disabled
  const emphasis = props.emphasis || "neutral"
  const size = props.size || "md"
  const variant = props.variant || "fill"

  return {
    getButtonBindings(): QdsSplitButtonButtonBindings {
      return normalize.button({
        className: splitButtonClasses.button,
        "data-disabled": booleanDataAttr(disabled),
        "data-emphasis": emphasis,
        "data-size": size,
        "data-variant": variant,
        disabled,
      })
    },
    getDividerBindings(): QdsSplitButtonDividerBindings {
      return normalize.element({
        className: splitButtonClasses.divider,
        "data-disabled": booleanDataAttr(disabled),
        "data-emphasis": emphasis,
        "data-size": size,
        "data-variant": variant,
        disabled,
      })
    },
    getIconButtonBindings(): QdsSplitButtonIconButtonBindings {
      return normalize.button({
        className: splitButtonClasses.iconButton,
        "data-disabled": booleanDataAttr(disabled),
        "data-emphasis": emphasis,
        "data-size": size,
        "data-variant": variant,
        disabled,
      })
    },
    getRootBindings(): QdsSplitButtonRootBindings {
      return normalize.element({
        className: splitButtonClasses.root,
      })
    },
  }
}
