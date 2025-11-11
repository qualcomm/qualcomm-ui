export type ExtendableGeneric<
  ExtendedProps = NonNullable<unknown>,
  OverrideProps = NonNullable<unknown>,
> = OverrideProps & Omit<ExtendedProps, keyof OverrideProps>

/**
 * A more sophisticated version of `InheritableElementProps` where
 * the passed in `as` prop will determine which props can be included
 */
export type GenericBase<
  C extends string,
  Props = NonNullable<unknown>,
> = ExtendableGeneric<C, Props> & {
  /**
   * The className property.
   */
  className?: string
}

export type GenericWithDefaults<
  T extends string,
  K = NonNullable<unknown>,
> = GenericBase<T, K>

/**
 * @custom Option
 */
export type GenericOverride = {
  class?: string
  disabled?: boolean
} & Record<string | number | symbol, any>

export interface Base<
  A,
  B extends boolean | undefined,
  C extends boolean | undefined,
> {
  /**
   * If true, the component will render a clear icon that resets the input field and
   * values on click.
   *
   * @default true
   */
  clearable?: C

  /**
   * If true, multiple values can be selected at once.
   *
   * @default false
   */
  multiple?: B

  /**
   * Array of values. Note that `A` refers to a generic type.
   */
  values: A[]
}

export type ChangeReason = "input" | "reset" | "clear"

/**
 * @public
 * @interface
 */
export type ComplexGeneric<
  A extends string = "div",
  B extends GenericOverride = GenericOverride,
  C extends boolean = true,
  D extends boolean = false,
> = GenericWithDefaults<
  A,
  Base<B, C, D> & {
    /**
     * The initial value.
     */
    defaultValue?: B | B[]

    /**
     * Input value change function.
     */
    onChange?: (value: string, event: Event, reason: ChangeReason) => void
  }
>
