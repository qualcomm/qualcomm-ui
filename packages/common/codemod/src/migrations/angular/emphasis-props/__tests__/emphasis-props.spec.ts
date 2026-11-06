import {
  mkdirSync,
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
  angularEmphasisProps,
  transformAngularSource,
  transformAngularTemplate,
} from "../emphasis-props.js"

const __dirname = dirname(fileURLToPath(import.meta.url))

const mockTestDir = resolve(__dirname, "./mocks")

const dirs = {
  expected: resolve(mockTestDir, "expected"),
  original: resolve(mockTestDir, "original"),
}

const files = readdirSync(dirs.original)

function transform(file: string, content: string) {
  return file.endsWith(".html")
    ? transformAngularTemplate(content, file)
    : transformAngularSource(content, file)
}

describe("angular emphasis-props", () => {
  for (const file of files) {
    test(file, () => {
      const original = readFileSync(resolve(dirs.original, file), "utf-8")
      const expected = readFileSync(resolve(dirs.expected, file), "utf-8")
      expect(transform(file, original).content).toBe(expected)
    })
  }

  test.each(files)("is idempotent: %s", (file) => {
    const original = readFileSync(resolve(dirs.original, file), "utf-8")
    const once = transform(file, original)
    const twice = transform(file, once.content)
    expect(twice.status).toBe("unchanged")
    expect(twice.content).toBe(once.content)
  })

  test("counts each replaced prop once", () => {
    expect(
      transformAngularTemplate(`<q-slider variant="primary"></q-slider>\n`),
    ).toEqual({
      content: `<q-slider emphasis="brand"></q-slider>\n`,
      manual: [],
      replaced: 1,
      status: "updated",
    })
  })

  test("reports elements that set both variant and emphasis", () => {
    const content = `<p>Volume</p>
<div q-slider-root emphasis="neutral" [variant]="variant"></div>
`
    expect(transformAngularTemplate(content)).toEqual({
      content,
      manual: [
        "remove variant from <div q-slider-root> on line 2, emphasis takes precedence",
      ],
      replaced: 0,
      status: "conflict",
    })
  })

  test("reports conflicts on the line of the file, not the template", () => {
    const content = `import {Component} from "@angular/core"

@Component({
  selector: "app-volume",
  template: \`
    <q-slider emphasis="neutral" variant="primary" />
  \`,
})
export class Volume {}
`
    expect(transformAngularSource(content).manual).toEqual([
      "remove variant from <q-slider> on line 6, emphasis takes precedence",
    ])
  })

  test("reports templates that can't be parsed", () => {
    const content = `<q-slider variant="primary">\n@if (a) {\n`
    const result = transformAngularTemplate(content)
    expect(result.status).toBe("conflict")
    expect(result.content).toBe(content)
    expect(result.manual[0]).toMatch(
      /^the template on line \d+ couldn't be parsed/,
    )
  })

  test("reports inline templates with substitutions", () => {
    const content = `import {Component} from "@angular/core"

const size = "sm"

@Component({
  selector: "app-volume",
  template: \`<q-slider size="\${size}" variant="primary" />\`,
})
export class Volume {}
`
    expect(transformAngularSource(content)).toEqual({
      content,
      manual: [
        "the template on line 7 isn't a plain string, update it manually",
      ],
      replaced: 0,
      status: "conflict",
    })
  })

  test("reports inline templates with escape sequences", () => {
    const content = `import {Component} from "@angular/core"

@Component({
  selector: "app-volume",
  template: \`<q-slider label="\\\`a\\\`" variant="primary" />\`,
})
export class Volume {}
`
    expect(transformAngularSource(content)).toEqual({
      content,
      manual: [
        "the template on line 5 contains escape sequences, update it manually",
      ],
      replaced: 0,
      status: "conflict",
    })
  })

  test("skips files that don't use an affected component or type", () => {
    const content = `import {Component} from "@angular/core"

@Component({
  selector: "app-button",
  template: \`<button q-button variant="primary"></button>\`,
})
export class AppButton {}
`
    expect(transformAngularSource(content)).toEqual({
      content,
      manual: [],
      replaced: 0,
      status: "skipped",
    })
    expect(
      transformAngularTemplate(`<button variant="primary"></button>\n`).status,
    ).toBe("skipped")
  })

  test("keeps the primary emphasis of buttons", () => {
    const content = `<div emphasis="primary" q-button-group>
  <button emphasis="primary" q-button variant="fill">
    <div emphasis="primary" q-progress></div>
  </button>
  <button emphasis="primary" icon="X" q-icon-button></button>
  <button [emphasis]="'primary'" q-inline-icon-button></button>
</div>
`
    expect(transformAngularTemplate(content).content).toBe(
      content.replace(
        `<div emphasis="primary" q-progress>`,
        `<div emphasis="brand" q-progress>`,
      ),
    )
  })

  test("ignores selectors outside of component templates", () => {
    const content = `export const selector = "[q-slider-root]"\n`
    expect(transformAngularSource(content).status).toBe("skipped")
  })
})

describe("angular emphasis-props codemod", () => {
  let cwd: string
  let componentFile: string
  let templateFile: string

  beforeEach(() => {
    cwd = mkdtempSync(join(tmpdir(), "angular-emphasis-props-"))
    mkdirSync(join(cwd, "src"), {recursive: true})
    componentFile = join(cwd, "src/volume.ts")
    templateFile = join(cwd, "src/volume.html")
    writeFileSync(
      componentFile,
      `import {Component} from "@angular/core"

@Component({
  selector: "app-volume",
  templateUrl: "./volume.html",
})
export class Volume {}
`,
    )
    writeFileSync(templateFile, `<q-slider variant="primary" />\n`)
    writeFileSync(join(cwd, "src/index.html"), `<app-root></app-root>\n`)
  })

  afterEach(() => {
    rmSync(cwd, {force: true, recursive: true})
  })

  test("rewrites templates that use the affected components", async () => {
    const results = await angularEmphasisProps.run({cwd, dryRun: false})

    expect(results).toEqual([
      {
        file: templateFile,
        message: "replaced 1 deprecated prop, value, or type name",
        status: "updated",
      },
    ])
    expect(readFileSync(templateFile, "utf-8")).toBe(
      `<q-slider emphasis="brand" />\n`,
    )
  })

  test("doesn't write files in a dry run", async () => {
    const results = await angularEmphasisProps.run({cwd, dryRun: true})

    expect(results.map(({message}) => message)).toEqual([
      "would replace 1 deprecated prop, value, or type name",
    ])
    expect(readFileSync(templateFile, "utf-8")).toBe(
      `<q-slider variant="primary" />\n`,
    )
  })
})
