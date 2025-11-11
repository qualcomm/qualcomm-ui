import type {Type} from "@angular/core"

export interface MultiComponentTestCase {
  composite?: () => Type<any>
  simple?: () => Type<any>
  testCase: (component: Type<any>) => void
}

export type MultiComponentTest =
  | MultiComponentTestCase
  | (() => MultiComponentTestCase)

export function runTests(tests: MultiComponentTest[]) {
  for (const test of tests) {
    const {composite, simple, testCase} =
      test instanceof Function ? test() : test
    if (composite) {
      testCase(composite())
    }
    if (simple) {
      testCase(simple())
    }
  }
}
