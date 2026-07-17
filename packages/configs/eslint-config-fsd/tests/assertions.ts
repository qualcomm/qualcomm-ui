import type {ESLint} from "eslint"
import {expect} from "vitest"

type LintResult = ESLint.LintResult

export function assertDependenciesError(result: LintResult) {
  expect(
    result.messages.find((rule) => rule.ruleId === "boundaries/dependencies"),
  ).toBeTruthy()
}

export function assertNoErrors(result: LintResult) {
  expect(result.messages).toHaveLength(0)
}
