/**
 * Referred to from elsewhere.
 */
export interface ReferenceType1 {
  /**
   * A test parameter.
   */
  test: string
}

/**
 * @public
 */
export interface SomeNestedType {
  /**
   * Child item.
   *
   * @inheritDoc
   */
  item: SomeNestedType

  /**
   * Child items.
   *
   * @inheritDoc
   */
  items: SomeNestedType[]

  /**
   * @see ReferenceType1
   */
  stringType: string
}

/**
 * @public
 */
export interface GenericReferenceType<T> {
  /**
   * test
   */
  test: T
}

/**
 * @public
 */
export interface ConstrainedTypeParameter<Key extends string = "id"> {
  /**
   * test
   */
  fields: Record<string, ReferenceType1>

  /**
   * test
   */
  idKey?: Key

  /**
   * test
   */
  keyLabel: "Key" | "other"

  /**
   * test
   */
  keys: Key[]
}

export type KeyKind = "a" | "b"

/**
 * @public
 */
export interface AliasConstrainedTypeParameter<Kind extends KeyKind = KeyKind> {
  /**
   * test
   */
  kind: Kind
}

export type InheritDocSignature = () => SomeNestedType

/**
 * @public
 *
 * @template T the generic type
 */
export interface GenericNestedType<
  T extends Record<string, any> = Record<string, string>,
> {
  /**
   * @inheritDoc
   */
  itemFn: (
    /**
     * @inheritDoc
     */
    param: GenericReferenceType<T>,
  ) => InheritDocSignature
}
