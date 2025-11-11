export type WeightUnit = "kg" | "lb"

/**
 * Represents a dog with its properties.
 *
 * @public
 */
export interface Dog {
  /**
   * The age of the dog in human years.
   */
  age: number

  /**
   * The breed of the dog.
   */
  breed?: string

  /**
   * The name of the dog.
   */
  name: string

  /**
   * The weight of the dog. Refer to {@link weightUnit} for unit type information.
   */
  weight?: number

  /**
   * The unit type of the {@link weight} field.
   *
   * @option `'kg'`: kilograms.
   * @option `'lb'`: pounds.
   */
  weightUnit?: WeightUnit
}

/**
 * @public
 */
export interface OptionTagExample {
  /**
   * The unit type of the weight field.
   *
   * @option `'kg'`: kilograms.
   * @option `'lb'`: pounds.
   */
  weightUnit: WeightUnit
}

/**
 * @public
 */
export interface Option {
  /**
   * Unique identifier for the option.
   */
  id: string

  /**
   * Nested options.
   *
   * @inheritDoc
   */
  options?: Option[]

  /**
   * Option value.
   */
  value: string
}

/**
 * @public
 */
export interface DefaultTagExample {
  /**
   * Example property.
   *
   * @default 0
   */
  age?: number
}

/**
 * @public
 */
export interface LinkExample {
  /**
   * Visit {@link https://google.com this external link} to learn more.
   */
  externalLink?: string

  /**
   * Refer to the {@link externalLink} property.
   */
  internalLink?: string
}

/**
 * @public
 */
export interface SeeTagExample {
  /**
   * @see {@link someOtherPropExample}
   */
  otherPropExample?: string

  /**
   * Another prop.
   */
  someOtherPropExample?: string
}

/**
 * @public
 */
export interface SinceExample {
  /**
   * Foo.
   *
   * @since 3.10.0
   */
  foo: string
}
