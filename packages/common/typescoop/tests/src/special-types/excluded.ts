export interface InternalDefinition {
  /**
   * Test
   *
   * @param args
   */
  someFn: (args: string) => void
}

/**
 * @public
 */
export interface SomeExternal {
  /**
   * Function property.
   */
  property: InternalDefinition
}
