/**
 * @public
 */
export type SpecialUnion =
  | "vite-generouted"
  | ((filePath: string, pageDirectory: string) => string[])

/**
 * @public
 *
 * data
 */
export interface SpecialTypes {
  /**
   * hello
   */
  strategy: SpecialUnion
}

/**
 * @public
 */
export interface Two {
  /**
   * Green
   */
  green: true
}

/**
 * Description
 *
 * @param test1 hello
 * @param test2 hello2
 *
 * @public
 */
export type FunctionParams = (test1: string, test2: SpecialTypes) => void
