import {describe, test} from "vitest"

import {assertDependenciesError, assertNoErrors} from "./assertions"
import {dedent, getLinter, pathPrefix} from "./shared"

const segments = [
  "ui",
  "services",
  "api",
  "state",
  "model",
  "config",
  "assets",
]

const getLowerSegments = (segment: string) =>
  segments.slice(segments.indexOf(segment) + 1)

const linter = getLinter()

describe("default policy", () => {
  test("allows dependencies that are not explicitly restricted", async () => {
    const result = await linter.lintText(
      dedent`
        import {ToolConfigView} from "~shared/tool-config/tool-config"
      `,
      {filePath: `${pathPrefix}/other/source.tsx`},
    )
    assertNoErrors(result[0])
  })
})

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
        assertDependenciesError(result[0])
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

  test("data layer segments are unrestricted", async () => {
    const result = await linter.lintText(
      dedent`
        import {slice1Api} from "../api/slice-1-api"
      `,
      {
        filePath: `${pathPrefix}/data/slice-1/model/source.ts`,
      },
    )
    assertNoErrors(result[0])
  })
})

describe("model files", () => {
  const filePath = `${pathPrefix}/entities/tool/tool.model.ts`

  test("cannot import same-slice ui", async () => {
    const result = await linter.lintText(
      dedent`
        import {ToolUi} from "./ui/tool-ui"
      `,
      {filePath},
    )
    assertDependenciesError(result[0])
  })

  test("cannot import tsx files", async () => {
    const result = await linter.lintText(
      dedent`
        import {ToolConfigView} from "~shared/tool-config/tool-config"
      `,
      {filePath},
    )
    assertDependenciesError(result[0])
  })

  test("cannot type-import tsx files", async () => {
    const result = await linter.lintText(
      dedent`
        import type {ToolConfigView} from "~shared/tool-config/tool-config"
      `,
      {filePath},
    )
    assertDependenciesError(result[0])
  })

  test("cannot import state files", async () => {
    const result = await linter.lintText(
      dedent`
        import {ToolConfigState} from "~shared/tool-config/tool-config.state"
      `,
      {filePath},
    )
    assertDependenciesError(result[0])
  })

  test("cannot type-import state files", async () => {
    const result = await linter.lintText(
      dedent`
        import type {ToolConfigState} from "~shared/tool-config/tool-config.state"
      `,
      {filePath},
    )
    assertDependenciesError(result[0])
  })

  test("cannot type-import api files", async () => {
    const result = await linter.lintText(
      dedent`
        import type {ToolConfigApi} from "~shared/tool-config/tool-config.api"
      `,
      {filePath},
    )
    assertDependenciesError(result[0])
  })

  test("can import same-slice non-ui files", async () => {
    const result = await linter.lintText(
      dedent`
        import {someConfig} from "./config/some-config"
      `,
      {filePath},
    )
    assertNoErrors(result[0])
  })

  test("can import lower-layer non-tsx ui files", async () => {
    const result = await linter.lintText(
      dedent`
        import {ToolConfigUi} from "~shared/tool-config/ui/tool-config-ui"
      `,
      {filePath},
    )
    assertNoErrors(result[0])
  })

  test("can import lower-layer segmentless model files", async () => {
    const result = await linter.lintText(
      dedent`
        import {ToolConfigModel} from "~shared/tool-config/tool-config.model"
      `,
      {filePath},
    )
    assertNoErrors(result[0])
  })
})
