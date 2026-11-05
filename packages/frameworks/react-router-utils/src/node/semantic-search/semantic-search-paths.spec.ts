import {resolve} from "node:path"
import {describe, expect, test} from "vitest"

import {
  resolveSemanticSearchArtifactDirectory,
  resolveSemanticSearchPaths,
} from "./semantic-search-paths.js"

describe("resolveSemanticSearchPaths", () => {
  test("uses configured knowledge and section export paths", () => {
    const paths = resolveSemanticSearchPaths(
      {
        outputPath: "knowledge-output",
        sections: {outputPath: "semantic/sections-data.json"},
      },
      {publicDirectory: "site-public"},
    )

    expect(paths.sectionsPath).toBe(
      resolve("site-public", "knowledge-output", "semantic/sections-data.json"),
    )
  })

  test("uses default knowledge export paths", () => {
    expect(resolveSemanticSearchPaths({}).sectionsPath).toBe(
      resolve("public", "exports", "sections.json"),
    )
  })

  test("uses a server-only artifact directory for each environment", () => {
    expect(
      resolveSemanticSearchArtifactDirectory("docs-site", {
        environment: "development",
      }),
    ).toBe(resolve("docs-site", "generated/semantic-search"))
    expect(
      resolveSemanticSearchArtifactDirectory("docs-site", {
        environment: "production",
      }),
    ).toBe(resolve("docs-site", "build/server/semantic-search"))
  })
})
