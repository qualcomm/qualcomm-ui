// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactNode} from "react"

export interface MultiComponentTestCase<P = any> {
  composite?: (props?: P) => ReactNode
  simple?: (props?: P) => ReactNode
  testCase: (getComponent: (props?: P) => ReactNode) => void
}

export type MultiComponentTest<P = any> =
  | MultiComponentTestCase<P>
  | (() => MultiComponentTestCase<P>)

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
