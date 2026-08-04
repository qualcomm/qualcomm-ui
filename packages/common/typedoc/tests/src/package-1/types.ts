/**
 * Test union type
 */
export type TestUnionA = "a" | "b" | "c"

/**
 * Test generic
 */
export type TestGeneric1<T> = (options: T[], inputValue: string) => T[]

/**
 * Test tuple
 */
export type TestTuple1 = [string, boolean, string, number]

/**
 * Template literal
 */
export type TestTemplateLiteral1 = `${string}.${number}`

export interface DashCasedBindingProps {
  "data-disabled": ""
  "data-stepper-part": "prev-trigger"
  dir: "ltr" | "rtl"
  disabled: boolean
}

export type DashCasedRenderProp<Props> = string | ((props: Props) => string)

/**
 * @public
 * @interface
 */
export interface DashCasedRenderPropHost {
  children: DashCasedRenderProp<DashCasedBindingProps>
}
