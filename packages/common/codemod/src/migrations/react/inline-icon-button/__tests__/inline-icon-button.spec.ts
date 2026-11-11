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
  reactInlineIconButton,
  transformReactInlineIconButton,
} from "../inline-icon-button.js"

const __dirname = dirname(fileURLToPath(import.meta.url))

const mockTestDir = resolve(__dirname, "./mocks")

const dirs = {
  expected: resolve(mockTestDir, "expected"),
  original: resolve(mockTestDir, "original"),
}

const files = readdirSync(dirs.original).filter((file) => file.endsWith(".tsx"))

describe("react inline-icon-button", () => {
  for (const file of files) {
    test(file, () => {
      const original = readFileSync(resolve(dirs.original, file), "utf-8")
      const expected = readFileSync(resolve(dirs.expected, file), "utf-8")
      expect(transformReactInlineIconButton(original).content).toBe(expected)
    })
  }

  test.each(files)("is idempotent: %s", (file) => {
    const original = readFileSync(resolve(dirs.original, file), "utf-8")
    const once = transformReactInlineIconButton(original)
    const twice = transformReactInlineIconButton(once.content)
    expect(twice.status).toBe("skipped")
    expect(twice.content).toBe(once.content)
  })

  test("counts each replaced element once", () => {
    const content = `import {InlineIconButton} from "@qualcomm-ui/react/inline-icon-button"

export const close = <InlineIconButton icon={X} variant="scale" />
`
    expect(transformReactInlineIconButton(content)).toEqual({
      content: `import {IconButton} from "@qualcomm-ui/react/button"

export const close = <IconButton density="compact" icon={X} variant="ghost" />
`,
      manual: [],
      replaced: 1,
      status: "updated",
    })
  })

  test("keeps the old local name when IconButton is bound by another library", () => {
    const content = `import {IconButton} from "some-library"
import {InlineIconButton} from "@qualcomm-ui/react/inline-icon-button"

export const buttons = [
  <IconButton key="a" />,
  <InlineIconButton key="b" icon={X} />,
]
`
    expect(transformReactInlineIconButton(content).content).toBe(
      `import {IconButton} from "some-library"
import {IconButton as InlineIconButton} from "@qualcomm-ui/react/button"

export const buttons = [
  <IconButton key="a" />,
  <InlineIconButton density="compact" variant="ghost" key="b" icon={X} />,
]
`,
    )
  })

  test("reuses an aliased IconButton import", () => {
    const content = `import {IconButton as QuiIconButton} from "@qualcomm-ui/react/button"
import {InlineIconButton} from "@qualcomm-ui/react/inline-icon-button"

export const close = <InlineIconButton icon={X} />
`
    expect(transformReactInlineIconButton(content).content).toBe(
      `import {IconButton as QuiIconButton} from "@qualcomm-ui/react/button"

export const close = <QuiIconButton density="compact" variant="ghost" icon={X} />
`,
    )
  })

  test("doesn't duplicate names already imported by a type-only import", () => {
    const content = `import type {IconButtonProps} from "@qualcomm-ui/react/button"
import {
  InlineIconButton,
  type InlineIconButtonProps,
} from "@qualcomm-ui/react/inline-icon-button"

export type Props = InlineIconButtonProps | IconButtonProps
export const close = <InlineIconButton icon={X} />
`
    expect(transformReactInlineIconButton(content).content).toBe(
      `import type {IconButtonProps} from "@qualcomm-ui/react/button"
import {IconButton} from "@qualcomm-ui/react/button"

export type Props = IconButtonProps | IconButtonProps
export const close = <IconButton density="compact" variant="ghost" icon={X} />
`,
    )
  })

  test("reports references that aren't rendered as JSX", () => {
    const content = `import {InlineIconButton} from "@qualcomm-ui/react/inline-icon-button"

export const actions = {close: InlineIconButton}
export {InlineIconButton}
`
    expect(transformReactInlineIconButton(content)).toEqual({
      content: `import {IconButton} from "@qualcomm-ui/react/button"

export const actions = {close: IconButton}
export {IconButton as InlineIconButton}
`,
      manual: [
        `IconButton on line 3 isn't rendered as JSX, add density="compact" and variant="ghost" where it's rendered`,
        `IconButton on line 4 isn't rendered as JSX, add density="compact" and variant="ghost" where it's rendered`,
      ],
      replaced: 0,
      status: "conflict",
    })
  })

  test("reports namespace imports and re-exports", () => {
    const content = `import * as Inline from "@qualcomm-ui/react/inline-icon-button"

export {InlineIconButton} from "@qualcomm-ui/react/inline-icon-button"

export const close = <Inline.InlineIconButton icon={X} />
`
    expect(transformReactInlineIconButton(content)).toEqual({
      content,
      manual: [
        `replace the namespace import of "@qualcomm-ui/react/inline-icon-button" on line 1 with IconButton from "@qualcomm-ui/react/button"`,
        `replace the re-export of "@qualcomm-ui/react/inline-icon-button" on line 3 with IconButton from "@qualcomm-ui/react/button"`,
      ],
      replaced: 0,
      status: "conflict",
    })
  })

  test("ignores Menu.InlineIconButton and same-name components from other libraries", () => {
    const content = `import {InlineIconButton} from "some-library"
import {Menu} from "@qualcomm-ui/react/menu"

export const demo = (
  <Menu.Trigger>
    <Menu.InlineIconButton icon={X} />
    <InlineIconButton icon={X} />
  </Menu.Trigger>
)
`
    expect(transformReactInlineIconButton(content)).toEqual({
      content,
      manual: [],
      replaced: 0,
      status: "skipped",
    })
  })
})

describe("react inline-icon-button run", () => {
  let cwd: string

  beforeEach(() => {
    cwd = mkdtempSync(join(tmpdir(), "inline-icon-button-"))
  })

  afterEach(() => {
    rmSync(cwd, {force: true, recursive: true})
  })

  test("rewrites matching files and ignores the rest", async () => {
    const component = join(cwd, "close.tsx")
    const unrelated = join(cwd, "unrelated.tsx")
    writeFileSync(
      component,
      `import {InlineIconButton} from "@qualcomm-ui/react/inline-icon-button"

export const close = <InlineIconButton icon={X} />
`,
    )
    writeFileSync(unrelated, `export const a = 1\n`)

    const results = await reactInlineIconButton.run({cwd, dryRun: false})

    expect(results).toEqual([
      {
        file: component,
        message: "replaced 1 InlineIconButton usage",
        status: "updated",
      },
    ])
    expect(readFileSync(component, "utf-8")).toBe(
      `import {IconButton} from "@qualcomm-ui/react/button"

export const close = <IconButton density="compact" variant="ghost" icon={X} />
`,
    )
  })

  test("doesn't write files in a dry run", async () => {
    const component = join(cwd, "close.tsx")
    const content = `import {InlineIconButton} from "@qualcomm-ui/react/inline-icon-button"

export const close = <InlineIconButton icon={X} />
`
    writeFileSync(component, content)

    const results = await reactInlineIconButton.run({cwd, dryRun: true})

    expect(results[0].message).toBe("would replace 1 InlineIconButton usage")
    expect(readFileSync(component, "utf-8")).toBe(content)
  })
})
