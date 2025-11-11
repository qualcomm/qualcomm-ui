import type {ScopeDomElements, ScopeDomIds} from "@qualcomm-ui/utils/machine"

import type {TextInputElementIds, TextInputScope} from "../text-input.types"

export const domIds: ScopeDomIds<TextInputElementIds, TextInputScope> = {
  errorText: (scope) => scope.ids.get("errorText"),
  hint: (scope) => scope.ids.get("hint"),
  input: (scope) => scope.ids.get("input"),
  label: (scope) => scope.ids.get("label"),
}

export const domEls: ScopeDomElements<
  TextInputElementIds,
  TextInputScope,
  {input: HTMLInputElement | null}
> = {
  errorText: (scope) => scope.getById(domIds.errorText(scope)),
  hint: (scope) => scope.getById(domIds.hint(scope)),
  input: (scope: TextInputScope) => scope.getById(domIds.input(scope)),
  label: (scope) => scope.getById(domIds.label(scope)),
}
