import type {BooleanDataAttr} from "@qualcomm-ui/utils/attributes"

export interface FieldsetApiProps {
  /**
   * Indicates whether the fieldset is disabled.
   */
  disabled?: boolean

  /**
   * Indicates whether the fieldset is invalid.
   */
  invalid?: boolean
}

export interface FieldsetElementIds {
  errorText: string | undefined
  hint: string | undefined
}

interface CommonBindings {
  "data-scope": "fieldset"
}

export interface FieldsetRootBindings extends CommonBindings {
  "aria-describedby": string | undefined
  "data-disabled": BooleanDataAttr
  "data-invalid": BooleanDataAttr
  disabled: boolean | undefined
}

export interface FieldsetLegendBindings extends CommonBindings {
  "data-disabled": BooleanDataAttr
  "data-invalid": BooleanDataAttr
  "data-part": "legend"
}

export interface FieldsetHintBindings extends CommonBindings {
  "data-disabled": BooleanDataAttr
  "data-part": "hint"
  id: string
}

export interface FieldsetErrorTextBindings extends CommonBindings {
  "aria-live": "polite"
  "data-disabled": BooleanDataAttr
  "data-part": "error-text"
}

export interface FieldsetApi {
  disabled: boolean
  getErrorTextBindings(): FieldsetErrorTextBindings
  getHintBindings(): FieldsetHintBindings
  getLegendBindings(): FieldsetLegendBindings
  getRootBindings(): FieldsetRootBindings
  invalid: boolean
}
