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

/**
 * Record alias
 */
export type TestRecordAlias = Record<string, number>

/**
 * Generic record alias
 */
export type TestGenericRecordAlias<T extends string> = Record<T, () => void>

/**
 * Pick alias
 */
export type TestPickAlias = Pick<DashCasedBindingProps, "dir" | "disabled">

/**
 * Partial alias
 */
export type TestPartialAlias = Partial<Record<"x" | "y", number>>

/**
 * Omit alias
 */
export type TestOmitAlias = Omit<DashCasedBindingProps, "dir">

/**
 * Record alias longer than the inline limit
 */
export type TestLongRecordAlias = Record<
  | "alpha"
  | "bravo"
  | "charlie"
  | "delta"
  | "echo"
  | "foxtrot"
  | "golf"
  | "hotel",
  DashCasedBindingProps
>

/**
 * Alias of a documented mapped type alias
 */
export type TestDocumentedReferenceAlias = TestGenericRecordAlias<"open">

export interface MappedAliasHost {
  documented: TestDocumentedReferenceAlias
  generic: TestGenericRecordAlias<"a">
  long: TestLongRecordAlias
  omit: TestOmitAlias
  pick: TestPickAlias
  record?: TestRecordAlias
}

export interface ArrayHost {
  functions: (() => void)[]
  generics: Map<string, () => void>[]
  names: Date[]
  nestedNames: Date[][]
  nestedUnions: ("a" | "b")[][]
  readonlyNames: readonly Date[]
  readonlyStrings: readonly string[]
  readonlyUnions: readonly ("a" | "b")[]
  unions: ("a" | "b")[]
}

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
