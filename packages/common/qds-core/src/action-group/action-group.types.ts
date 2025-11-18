import type {actionGroupClasses} from "./action-group.classes"

export interface QdsActionGroupRootBindings {
  className: (typeof actionGroupClasses)["root"]
  "data-part": "root"
  "data-scope": "action-group"
}
