import type {ScopeDomIds} from "@qualcomm-ui/utils/machine"

import type {ProgressElementIds, ProgressScope} from "../progress.types"

export const domIds: ScopeDomIds<ProgressElementIds, ProgressScope> = {
  errorText: (scope) => scope.ids.get("errorText"),
  hint: (scope) => scope.ids.get("hint"),
  label: (scope) => scope.ids.get("label"),
  progress: (scope) => scope.ids.get("progress"),
}
