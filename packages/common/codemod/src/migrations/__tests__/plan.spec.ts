import {describe, expect, test} from "vitest"

import {bumpRange, detectPackageVersions} from "../detect-versions.js"
import {planMigration} from "../plan.js"
import type {Codemod, VersionBump} from "../types.js"

function codemod(name: string, versions: Record<string, VersionBump>): Codemod {
  return {
    name,
    noMatchMessage: "",
    run: () => Promise.resolve([]),
    title: name,
    versions,
  }
}

describe("planMigration", () => {
  const v2ToV3 = codemod("a", {pkg: {from: 2, to: 3}})
  const v3ToV4 = codemod("b", {pkg: {from: 3, to: 4}})

  test("runs codemods at or past their from version", () => {
    const plan = planMigration([v2ToV3, v3ToV4], new Map([["pkg", 3]]))
    expect(plan.steps.map((step) => step.codemod.name)).toEqual(["a", "b"])
    expect(plan.steps[0].packages.get("pkg")?.current).toBe(3)
    expect(plan.majors.get("pkg")).toBe(4)
  })

  test("runs on projects that are already upgraded", () => {
    const plan = planMigration([v2ToV3], new Map([["pkg", 3]]))
    expect(plan.steps.map((step) => step.codemod.name)).toEqual(["a"])
    expect(plan.majors.get("pkg")).toBe(3)
  })

  test("chains consecutive codemods", () => {
    const plan = planMigration([v2ToV3, v3ToV4], new Map([["pkg", 2]]))
    expect(plan.steps.map((step) => step.codemod.name)).toEqual(["a", "b"])
    expect(plan.majors.get("pkg")).toBe(4)
  })

  test("skips codemods for missing or older packages", () => {
    expect(planMigration([v2ToV3], new Map()).steps).toEqual([])
    expect(planMigration([v3ToV4], new Map([["pkg", 2]])).steps).toEqual([])
  })

  test("only includes the packages at or past the from version", () => {
    const multi = codemod("multi", {
      other: {from: 3, to: 4},
      pkg: {from: 2, to: 3},
    })
    const plan = planMigration(
      [multi],
      new Map([
        ["other", 2],
        ["pkg", 2],
      ]),
    )
    expect(Array.from(plan.steps[0].packages.keys())).toEqual(["pkg"])
    expect(plan.majors.get("other")).toBe(2)
    expect(plan.majors.get("pkg")).toBe(3)
  })
})

describe("detectPackageVersions", () => {
  test("reads the major version from package.json ranges", () => {
    const detected = detectPackageVersions(
      "/nonexistent",
      {
        dependencies: {a: "^2.2.3"},
        devDependencies: {b: "~3.11.1"},
        peerDependencies: {c: "workspace:*"},
      },
      ["a", "b", "c", "d"],
    )
    expect(detected.get("a")).toEqual({
      declared: {field: "dependencies", range: "^2.2.3"},
      major: 2,
      name: "a",
    })
    expect(detected.get("b")?.major).toBe(3)
    expect(detected.has("c")).toBe(false)
    expect(detected.has("d")).toBe(false)
  })
})

describe("bumpRange", () => {
  test("keeps the range prefix", () => {
    expect(bumpRange("^2.2.3", 3)).toBe("^3.0.0")
    expect(bumpRange("~2.2.3", 3)).toBe("~3.0.0")
    expect(bumpRange("2.2.3", 3)).toBe("3.0.0")
    expect(bumpRange(">=2 <3", 3)).toBe("^3.0.0")
  })

  test("ignores non-semver ranges", () => {
    expect(bumpRange("workspace:*", 3)).toBeUndefined()
    expect(bumpRange("catalog:", 3)).toBeUndefined()
  })
})
