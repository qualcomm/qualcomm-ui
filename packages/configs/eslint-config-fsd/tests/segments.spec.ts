import {describe, test} from "vitest"

import {assertNoErrors, assertRestrictedPathsError} from "./assertions"
import {dedent, getLinter, pathPrefix} from "./shared"

const segments = ["ui", "services", "api", "model", "config", "assets"]

const getLowerSegments = (segment: string) =>
  segments.slice(segments.indexOf(segment) + 1)

const linter = getLinter()

describe("FSD segment restrictions", () => {
  for (const segment of segments) {
    test(`${segment} segment`, async () => {
      for (const restrictedSegment of getLowerSegments(segment)) {
        const result = await linter.lintText(
          dedent`
            import {construct} from "../${segment}"
          `,
          {
            filePath: `${pathPrefix}/entities/tool/${restrictedSegment}/construct.ts`,
          },
        )
        assertRestrictedPathsError(result[0])
      }
    })
  }
})

describe("FSD segments", () => {
  test("long relative parent imports", async () => {
    const result = await linter.lintText(
      dedent`
        import {construct} from "../../model"
      `,
      {
        filePath: `${pathPrefix}/entities/tool/ui/internal/construct.ts`,
      },
    )
    assertNoErrors(result[0])
  })
})
