import type {ScopeDomElements, ScopeDomIds} from "@qualcomm-ui/utils/machine"

import type {
  PasswordInputElementIds,
  PasswordInputScope,
} from "../password-input.types"

export const domIds: ScopeDomIds<PasswordInputElementIds, PasswordInputScope> =
  {
    errorText: (scope) => scope.ids.get("errorText"),
    hint: (scope) => scope.ids.get("hint"),
    input: (scope) => scope.ids.get("input"),
    label: (scope) => scope.ids.get("label"),
    visibilityTrigger: (scope) => scope.ids.get("visibilityTrigger"),
  }

export const domEls: ScopeDomElements<
  PasswordInputElementIds,
  PasswordInputScope,
  {input: HTMLInputElement | null}
> = {
  errorText: (scope) => scope.getById(domIds.errorText(scope)),
  hint: (scope) => scope.getById(domIds.hint(scope)),
  input: (scope: PasswordInputScope) => scope.getById(domIds.input(scope)),
  label: (scope) => scope.getById(domIds.label(scope)),
  visibilityTrigger: (scope) => scope.getById(domIds.visibilityTrigger(scope)),
}
