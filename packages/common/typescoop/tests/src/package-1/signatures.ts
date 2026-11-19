import type {TestUnionA} from "./types"

/**
 * Intersection with function property
 */
export interface IntersectionSignature1 {
  /**
   * Nested signature
   */
  signatureParam?: (unionParam: TestUnionA) => void
}
