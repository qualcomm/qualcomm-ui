export interface VsCheckboxApi {
  getControlBindings(): VsCheckboxControlBindings
  getHiddenInputBindings(): VsCheckboxHiddenInputBindings
  getIndicatorBindings(): VsCheckboxIndicatorBindings
  getLabelBindings(): VsCheckboxLabelBindings
  getRootBindings(): VsCheckboxRootBindings
}

export interface VsCheckboxRootBindings {
  className: string
}

export interface VsCheckboxControlBindings {
  className: string
}

export interface VsCheckboxIndicatorBindings {
  className: string
}

export interface VsCheckboxLabelBindings {
  className: string
}

export interface VsCheckboxHiddenInputBindings {
  className: string
}
