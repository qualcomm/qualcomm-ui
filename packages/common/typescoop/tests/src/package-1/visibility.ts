/**
 * Excluded.
 *
 * @internal
 */
export interface InternalEntity {
  value: string
}

/**
 * @public
 */
export const publicOnlyFunction = (): number => 1

export const undocumentedFunction = (): number => 1

/**
 * @public
 */
export interface VisibilityHost {
  /**
   * @internal
   */
  internal: string
  shown: string
}
