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

export type TestBooleanAttr = "" | undefined

export interface RedundantUndefinedHost {
  /**
   * `undefined` is already a member of the alias.
   */
  absorbed: TestBooleanAttr | undefined
  nested: {label?: string | undefined}
  required: string | undefined
}

/**
 * Display options of a ref card.
 */
export interface RefCardOptions {
  /** Where the card lines up against its trigger, at the start or at the end. */
  align?: "start" | "end"
  density?: "compact" | "default"
  /**
   * The emphasis of the card. Brand cards draw more attention, so use them
   * sparingly, as the {@link https://example.com/design/guidelines/emphasis emphasis guidelines} describe.
   */
  emphasis?: "neutral" | "brand"
  /** The text of the card. */
  label: string
  placement?: "top" | "bottom"
  /**
   * @internal
   */
  secret?: boolean
  /**
   * The size of the card.
   *
   * Details past the first paragraph stay out of the card.
   */
  size?: "sm" | "md"
  width?: number
}

/**
 * A collection shown in a ref card.
 */
export class RefCardCollection<T = string> {
  items: T[] = []
}

/**
 * A tree shown in a ref card.
 */
export interface RefCardTree {
  /** The root node of the tree. */
  root: {children?: RefCardTree["root"][]; label: string}
}

export interface RefCardHost {
  collection: RefCardCollection
  options: RefCardOptions
  tree: RefCardTree
}
