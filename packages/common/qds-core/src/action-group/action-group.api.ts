import type {PropNormalizer} from "@qualcomm-ui/utils/machine"

import {actionGroupClasses} from "./action-group.classes"
import type {QdsActionGroupRootBindings} from "./action-group.types"

export function getActionGroupRootBindings(
  normalizeProps: PropNormalizer,
): QdsActionGroupRootBindings {
  return normalizeProps.element({
    className: actionGroupClasses.root,
    "data-part": "root",
    "data-scope": "action-group",
  })
}
