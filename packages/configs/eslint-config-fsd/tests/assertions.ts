import {ESLint} from "eslint"
import {expect} from "vitest"

type LintResult = ESLint.LintResult

/**
 * Asserts that a `boundaries/element-types` error was generated.
 */
export function assertBoundariesError(result: LintResult) {
  expect(
    result.messages.find((rule) => rule.ruleId === "boundaries/element-types"),
  ).toBeTruthy()
}

export function assertInternalError(result: LintResult) {
  expect(
    result.messages.find(
      (rule) => rule.ruleId === "import/no-internal-modules",
    ),
  ).toBeTruthy()
}

export function assertRestrictedPathsError(result: LintResult) {
  expect(
    result.messages.find(
      (rule) => rule.ruleId === "import/no-restricted-paths",
    ),
  ).toBeTruthy()
}

export function assertNoBoundariesError(result: LintResult) {
  expect(
    result.messages.find((rule) => rule.ruleId === "boundaries/element-types"),
  ).toBeFalsy()
}

export function assertNoInternalError(result: LintResult) {
  expect(
    result.messages.find(
      (rule) => rule.ruleId === "import/no-internal-modules",
    ),
  ).toBeFalsy()
}

export function assertNoRestrictedPathsError(result: LintResult) {
  expect(
    result.messages.find(
      (rule) => rule.ruleId === "import/no-restricted-paths",
    ),
  ).toBeFalsy()
}

export function assertNoErrors(result: LintResult) {
  assertNoBoundariesError(result)
  assertNoInternalError(result)
  assertNoRestrictedPathsError(result)
}
