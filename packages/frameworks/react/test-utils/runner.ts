import type {
  MultiComponentTest,
  MultiComponentTestCase,
} from "@qualcomm-ui/react-test-utils"

export type {MultiComponentTest, MultiComponentTestCase}

export function runTests<P = any>(tests: MultiComponentTest<P>[]) {
  for (const test of tests) {
    const {composite, simple, testCase} =
      test instanceof Function ? test() : test
    if (composite) {
      testCase(composite)
    }
    if (simple) {
      testCase(simple)
    }
  }
}
