import {
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs"
import {tmpdir} from "node:os"
import {dirname, join, resolve} from "node:path"
import {fileURLToPath} from "node:url"
import {afterEach, beforeEach, describe, expect, test} from "vitest"

import {
  reactEmphasisProps,
  transformReactEmphasisProps,
} from "../emphasis-props.js"

const __dirname = dirname(fileURLToPath(import.meta.url))

const mockTestDir = resolve(__dirname, "./mocks")

const dirs = {
  expected: resolve(mockTestDir, "expected"),
  original: resolve(mockTestDir, "original"),
}

const files = readdirSync(dirs.original).filter((file) => file.endsWith(".tsx"))

describe("react emphasis-props", () => {
  for (const file of files) {
    test(file, () => {
      const original = readFileSync(resolve(dirs.original, file), "utf-8")
      const expected = readFileSync(resolve(dirs.expected, file), "utf-8")
      expect(transformReactEmphasisProps(original).content).toBe(expected)
    })
  }

  test.each(files)("is idempotent: %s", (file) => {
    const original = readFileSync(resolve(dirs.original, file), "utf-8")
    const once = transformReactEmphasisProps(original)
    const twice = transformReactEmphasisProps(once.content)
    expect(twice.status).toBe("unchanged")
    expect(twice.content).toBe(once.content)
  })

  test("counts each replaced prop once", () => {
    const content = `import {Slider} from "@qualcomm-ui/react/slider"

export const slider = <Slider variant="primary" />
`
    expect(transformReactEmphasisProps(content)).toEqual({
      content: `import {Slider} from "@qualcomm-ui/react/slider"

export const slider = <Slider emphasis="brand" />
`,
      manual: [],
      replaced: 1,
      status: "updated",
    })
  })

  test("reports elements that set both variant and emphasis", () => {
    const content = `import {Slider} from "@qualcomm-ui/react/slider"

export const slider = (
  <Slider.Root emphasis="neutral" variant="primary" />
)
`
    expect(transformReactEmphasisProps(content)).toEqual({
      content,
      manual: [
        "remove variant from <Slider.Root> on line 4, emphasis takes precedence",
      ],
      replaced: 0,
      status: "conflict",
    })
  })

  test("still updates other elements in a file with a conflict", () => {
    const content = `import {Slider} from "@qualcomm-ui/react/slider"

export const sliders = [
  <Slider key="a" emphasis="neutral" variant="primary" />,
  <Slider key="b" variant="primary" />,
]
`
    const result = transformReactEmphasisProps(content)
    expect(result.status).toBe("conflict")
    expect(result.replaced).toBe(1)
    expect(result.content).toContain(`<Slider key="b" emphasis="brand" />`)
    expect(result.content).toContain(
      `<Slider key="a" emphasis="neutral" variant="primary" />`,
    )
  })

  test("skips files that don't import an affected module", () => {
    const content = `import {Button} from "@qualcomm-ui/react/button"

export const button = <Button variant="primary" />
`
    expect(transformReactEmphasisProps(content)).toEqual({
      content,
      manual: [],
      replaced: 0,
      status: "skipped",
    })
  })

  test("keeps the primary emphasis of buttons", () => {
    const content = `import {Button, ButtonGroup, IconButton} from "@qualcomm-ui/react/button"
import {Progress} from "@qualcomm-ui/react/progress"

export const demo = (
  <ButtonGroup emphasis="primary">
    <Button emphasis="primary" variant="fill">
      <Progress emphasis="primary" value={50} />
    </Button>
    <IconButton emphasis="primary" icon="X" variant="ghost" />
  </ButtonGroup>
)
`
    expect(transformReactEmphasisProps(content).content).toBe(
      content.replace(
        `<Progress emphasis="primary"`,
        `<Progress emphasis="brand"`,
      ),
    )
  })

  test("ignores components with the same name from other libraries", () => {
    const content = `import {Slider} from "some-library"
import {Tag} from "@qualcomm-ui/react/tag"

export const slider = <Slider variant="primary" />
`
    expect(transformReactEmphasisProps(content)).toEqual({
      content,
      manual: [],
      replaced: 0,
      status: "unchanged",
    })
  })

  test("ignores type-only component imports", () => {
    const content = `import type {Slider} from "@qualcomm-ui/react/slider"

export type SliderComponent = typeof Slider
`
    expect(transformReactEmphasisProps(content).status).toBe("unchanged")
  })
})

describe("react emphasis-props codemod", () => {
  let cwd: string
  let sourceFile: string
  const original = `import {Slider} from "@qualcomm-ui/react/slider"

export const slider = <Slider variant="primary" />
`

  beforeEach(() => {
    cwd = mkdtempSync(join(tmpdir(), "react-emphasis-props-"))
    sourceFile = join(cwd, "app.tsx")
    writeFileSync(sourceFile, original)
    writeFileSync(
      join(cwd, "unrelated.tsx"),
      `export const label = "primary"\n`,
    )
  })

  afterEach(() => {
    rmSync(cwd, {force: true, recursive: true})
  })

  test("rewrites files that use the affected components", async () => {
    const results = await reactEmphasisProps.run({cwd, dryRun: false})

    expect(results).toEqual([
      {
        file: sourceFile,
        message: "replaced 1 deprecated prop, value, or type name",
        status: "updated",
      },
    ])
    expect(readFileSync(sourceFile, "utf-8")).toContain(
      `<Slider emphasis="brand" />`,
    )
  })

  test("doesn't write files in a dry run", async () => {
    const results = await reactEmphasisProps.run({cwd, dryRun: true})

    expect(results).toEqual([
      {
        file: sourceFile,
        message: "would replace 1 deprecated prop, value, or type name",
        status: "updated",
      },
    ])
    expect(readFileSync(sourceFile, "utf-8")).toBe(original)
  })
})
