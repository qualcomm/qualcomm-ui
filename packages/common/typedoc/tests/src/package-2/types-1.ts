import type {TestGeneric1, TestUnionA} from "../package-1"

import type {ReasonExampleA} from "./types-2"

/**
 * @public
 * @interface
 */
export type InterfaceA = {
  /**
   * Test generic prop
   */
  genericFunc1: TestGeneric1<string>

  /**
   * Test union prop 1
   *
   * @default 'a'
   */
  unionA: TestUnionA
}

/**
 * @public
 * @interface
 */
export type InterfaceB = {
  /**
   * The reason why the panel was closed.
   */
  reason: ReasonExampleA
}
