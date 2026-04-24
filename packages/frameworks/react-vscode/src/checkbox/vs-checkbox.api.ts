import type {VsCheckboxApi} from "./vs-checkbox.types"

export function createVsCheckboxApi(): VsCheckboxApi {
  return {
    getControlBindings() {
      return {className: "vs-checkbox__icon"}
    },
    getHiddenInputBindings() {
      return {className: "vs-checkbox__input"}
    },
    getIndicatorBindings() {
      return {className: "vs-checkbox__indicator"}
    },
    getLabelBindings() {
      return {className: "vs-checkbox__label"}
    },
    getRootBindings() {
      return {className: "vs-checkbox__root"}
    },
  }
}
