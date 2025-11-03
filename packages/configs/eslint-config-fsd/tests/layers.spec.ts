import {describe, test} from "vitest"

import {
  assertBoundariesError,
  assertInternalError,
  assertNoErrors,
} from "./assertions"
import {dedent, getLinter, pathPrefix} from "./shared"

const linter = getLinter()

describe("FSD layers", () => {
  test("aliased same-layer imports", async () => {
    const result = await linter.lintText(
      dedent`
        import {Job} from "~entities/job"
      `,
      {filePath: `${pathPrefix}/entities/tool/ui/tool.ts`},
    )
    assertBoundariesError(result[0])
  })

  test("restricted same-layer internal imports", async () => {
    const result = await linter.lintText(
      dedent`
        import {getJob} from "../../job/api/get-job"
      `,
      {filePath: `${pathPrefix}/entities/tool/ui/tool.ts`},
    )
    assertBoundariesError(result[0])
    assertInternalError(result[0])
  })

  test("restricted same-layer internal imports", async () => {
    const result = await linter.lintText(
      dedent`
        import {getJobInternal} from "../../job/api/internal/get-job-internal"
      `,
      {filePath: `${pathPrefix}/entities/tool/ui/tool.ts`},
    )
    assertBoundariesError(result[0])
    assertInternalError(result[0])
  })

  test("relative internal imports should not throw errors", async () => {
    const result = await linter.lintText(
      dedent`
        import {ToolModel} from "../model"
        import {internalToolUi} from "./internal"
        import {sideUi} from "./side-ui"
      `,
      {filePath: `${pathPrefix}/entities/tool/ui/tool.ts`},
    )
    assertNoErrors(result[0])
  })

  test("importing from unrestricted layers should not throw errors", async () => {
    const result = await linter.lintText(
      dedent`
        import {ToolConfig} from "~shared/tool-config"
      `,
      {filePath: `${pathPrefix}/entities/tool/ui/tool.ts`},
    )
    assertNoErrors(result[0])
  })

  test("deep imports from unrestricted layers should throw errors", async () => {
    const result = await linter.lintText(
      dedent`
        import {ToolConfig} from "~shared/tool-config/ui"
      `,
      {filePath: `${pathPrefix}/entities/tool/ui/tool.ts`},
    )
    assertInternalError(result[0])
  })
})

describe("Unrestricted layers", () => {
  test("data layer", async () => {
    const result = await linter.lintText(
      dedent`
        import {slice1Model} from "../../slice-1"
      `,
      {filePath: `${pathPrefix}/data/slice-2/model/slice-2.model.ts`},
    )
    assertNoErrors(result[0])
  })

  test("shared layer", async () => {
    const result = await linter.lintText(
      dedent`
        import {slice1Model} from "../../slice-1"
      `,
      {filePath: `${pathPrefix}/shared/slice-2/model/slice-2.model.ts`},
    )
    assertNoErrors(result[0])
  })

  test("shared layer restrictions 1", async () => {
    const result = await linter.lintText(
      dedent`
        import {slice1Model} from "../../../entities/tool"
      `,
      {filePath: `${pathPrefix}/shared/slice-2/model/slice-2.model.ts`},
    )
    assertBoundariesError(result[0])
  })

  test("shared layer restrictions 2", async () => {
    const result = await linter.lintText(
      dedent`
        import {slice1Model} from "~entities/tool"
      `,
      {filePath: `${pathPrefix}/shared/slice-2/model/slice-2.model.ts`},
    )
    console.debug(result)
    assertBoundariesError(result[0])
  })
})
