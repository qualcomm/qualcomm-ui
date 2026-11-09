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
  angularInlineIconButton,
  transformAngularSource,
  transformAngularTemplate,
} from "../inline-icon-button.js"

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

describe("angular inline-icon-button", () => {
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
    expect(twice.status).toBe("skipped")
    expect(twice.content).toBe(once.content)
  })

  test("reports whether a template relies on the default icon", () => {
    expect(
      transformAngularTemplate(
        `<button q-inline-icon-button icon="Search"></button>\n`,
      ),
    ).toEqual({
      content: `<button q-icon-button density="compact" variant="ghost" icon="Search"></button>\n`,
      failed: false,
      manual: [],
      replaced: 1,
      status: "updated",
      usesDefaultIcon: false,
    })
    expect(
      transformAngularTemplate(`<button q-inline-icon-button></button>\n`)
        .usesDefaultIcon,
    ).toBe(true)
  })

  test("reports templates that can't be parsed", () => {
    const content = `<button q-inline-icon-button></div>\n`
    const result = transformAngularTemplate(content)
    expect(result.content).toBe(content)
    expect(result.failed).toBe(true)
    expect(result.status).toBe("conflict")
    expect(result.manual[0]).toMatch(
      /^the template on line 1 couldn't be parsed/,
    )
  })

  test("provides the default icon to components with an external template", () => {
    const content = `import {Component} from "@angular/core"

import {InlineIconButtonComponent} from "@qualcomm-ui/angular/inline-icon-button"

@Component({
  imports: [InlineIconButtonComponent],
  selector: "app-close",
  templateUrl: "./close.html",
})
export class Close {}
`
    const result = transformAngularSource(content, "/app/close.ts", (url) =>
      url === "./close.html"
        ? {failed: false, usesDefaultIcon: true}
        : undefined,
    )
    expect(result).toEqual({
      content: `import {Component} from "@angular/core"
import {LucideX} from "@lucide/angular"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {ButtonModule} from "@qualcomm-ui/angular/button"

@Component({
  imports: [ButtonModule],
  providers: [provideIcons({LucideX})],
  selector: "app-close",
  templateUrl: "./close.html",
})
export class Close {}
`,
      manual: [],
      replaced: 1,
      status: "updated",
    })
  })

  test("provides the default icon without importing InlineIconButtonComponent", () => {
    const content = `import {Component} from "@angular/core"

@Component({
  selector: "app-close",
  templateUrl: "./close.html",
})
export class Close {}
`
    expect(
      transformAngularSource(content, "/app/close.ts", () => ({
        failed: false,
        usesDefaultIcon: true,
      })).content,
    ).toContain(
      `  providers: [provideIcons({LucideX})],\n  selector: "app-close",`,
    )
    expect(
      transformAngularSource(content, "/app/close.ts", () => ({
        failed: false,
        usesDefaultIcon: false,
      })).status,
    ).toBe("skipped")
  })

  test("keeps an existing X icon provider", () => {
    const content = `import {Component} from "@angular/core"
import {LucideX as CloseIcon} from "@lucide/angular"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"

@Component({
  providers: [provideIcons({X: CloseIcon})],
  selector: "app-close",
  template: \`<button q-inline-icon-button></button>\`,
})
export class Close {}
`
    expect(transformAngularSource(content).content).toBe(
      content.replace(
        "q-inline-icon-button",
        `q-icon-button density="compact" variant="ghost" icon="X"`,
      ),
    )
  })

  test("uses the local name of an aliased LucideX import", () => {
    const content = `import {Component} from "@angular/core"
import {LucideX as CloseIcon} from "@lucide/angular"

@Component({
  selector: "app-close",
  template: \`<button q-inline-icon-button></button>\`,
})
export class Close {}
`
    expect(transformAngularSource(content).content).toContain(
      `providers: [provideIcons({LucideX: CloseIcon})],`,
    )
  })

  test("reports providers that aren't an array", () => {
    const content = `import {Component} from "@angular/core"

import {PROVIDERS} from "./providers"

@Component({
  providers: PROVIDERS,
  selector: "app-close",
  template: \`<button q-inline-icon-button></button>\`,
})
export class Close {}
`
    const result = transformAngularSource(content)
    expect(result.status).toBe("conflict")
    expect(result.manual).toEqual([
      "add provideIcons({LucideX}) to the providers of the component on line 5",
    ])
    expect(result.content).not.toContain("import {LucideX}")
  })

  test("keeps the component import for unreadable templates", () => {
    const content = `import {Component} from "@angular/core"

import {InlineIconButtonComponent} from "@qualcomm-ui/angular/inline-icon-button"

@Component({
  imports: [InlineIconButtonComponent],
  selector: "app-close",
  templateUrl: "./close.html",
})
export class Close {}
`
    expect(transformAngularSource(content, "/app/close.ts")).toEqual({
      content,
      manual: [
        "couldn't read the template of the component on line 5, replace InlineIconButtonComponent in its imports manually",
      ],
      replaced: 0,
      status: "conflict",
    })
  })

  test("keeps the component import when the inline template fails", () => {
    const content = `import {Component} from "@angular/core"

import {InlineIconButtonComponent} from "@qualcomm-ui/angular/inline-icon-button"

@Component({
  imports: [InlineIconButtonComponent],
  selector: "app-close",
  template: \`<button q-inline-icon-button>\${"x"}</button>\`,
})
export class Close {}
`
    expect(transformAngularSource(content)).toEqual({
      content,
      manual: [
        "the template on line 8 isn't a plain string, update it manually",
      ],
      replaced: 0,
      status: "conflict",
    })
  })

  test("reports other references to InlineIconButtonComponent", () => {
    const content = `import {Component, viewChild} from "@angular/core"

import {InlineIconButtonComponent} from "@qualcomm-ui/angular/inline-icon-button"

@Component({
  imports: [InlineIconButtonComponent],
  selector: "app-close",
  template: \`<button q-inline-icon-button icon="X"></button>\`,
})
export class Close {
  readonly button = viewChild(InlineIconButtonComponent)
}
`
    const result = transformAngularSource(content)
    expect(result.manual).toEqual([
      `replace InlineIconButtonComponent on line 11 with IconButtonDirective from "@qualcomm-ui/angular/button"`,
    ])
    expect(result.content).toContain(
      `import {ButtonModule} from "@qualcomm-ui/angular/button"
import {InlineIconButtonComponent} from "@qualcomm-ui/angular/inline-icon-button"`,
    )
    expect(result.content).toContain(`imports: [ButtonModule],`)
  })

  test("replaces the component in TestBed imports", () => {
    const content = `import {TestBed} from "@angular/core/testing"

import {InlineIconButtonComponent} from "@qualcomm-ui/angular/inline-icon-button"

TestBed.configureTestingModule({imports: [InlineIconButtonComponent]})
`
    expect(transformAngularSource(content).content).toBe(
      `import {TestBed} from "@angular/core/testing"

import {ButtonModule} from "@qualcomm-ui/angular/button"

TestBed.configureTestingModule({imports: [ButtonModule]})
`,
    )
  })

  test("reports useInlineIconButtonApi, namespace imports, and re-exports", () => {
    const content = `import * as Inline from "@qualcomm-ui/angular/inline-icon-button"
import {useInlineIconButtonApi} from "@qualcomm-ui/angular/inline-icon-button"

export {InlineIconButtonComponent} from "@qualcomm-ui/angular/inline-icon-button"
`
    expect(transformAngularSource(content)).toEqual({
      content,
      manual: [
        `replace the re-export of "@qualcomm-ui/angular/inline-icon-button" on line 4 with ButtonModule from "@qualcomm-ui/angular/button"`,
        `replace the namespace import of "@qualcomm-ui/angular/inline-icon-button" on line 1 with ButtonModule from "@qualcomm-ui/angular/button"`,
        `replace useInlineIconButtonApi on line 2 with useIconButtonApi from "@qualcomm-ui/angular/button", and pass density "compact" and variant "ghost"`,
      ],
      replaced: 0,
      status: "conflict",
    })
  })

  test("leaves files that declare ButtonModule from another library unchanged", () => {
    const content = `import {Component} from "@angular/core"
import {ButtonModule} from "primeng/button"

import {InlineIconButtonComponent} from "@qualcomm-ui/angular/inline-icon-button"

@Component({
  imports: [ButtonModule, InlineIconButtonComponent],
  selector: "app-close",
  template: \`<button q-inline-icon-button icon="X"></button>\`,
})
export class Close {}
`
    expect(transformAngularSource(content)).toEqual({
      content,
      manual: [
        `the file already declares ButtonModule from "@qualcomm-ui/angular/button", import it under another name or update the file manually`,
      ],
      replaced: 0,
      status: "conflict",
    })
  })

  test("ignores selectors outside of component templates", () => {
    const content = `export const selector = "q-inline-icon-button"\n`
    expect(transformAngularSource(content).status).toBe("skipped")
  })
})

describe("angular inline-icon-button codemod", () => {
  let cwd: string
  let componentFile: string
  let templateFile: string

  beforeEach(() => {
    cwd = mkdtempSync(join(tmpdir(), "angular-inline-icon-button-"))
    mkdirSync(join(cwd, "src"), {recursive: true})
    componentFile = join(cwd, "src/close.ts")
    templateFile = join(cwd, "src/close.html")
    writeFileSync(
      componentFile,
      `import {Component} from "@angular/core"

import {InlineIconButtonComponent} from "@qualcomm-ui/angular/inline-icon-button"

@Component({
  imports: [InlineIconButtonComponent],
  selector: "app-close",
  templateUrl: "./close.html",
})
export class Close {}
`,
    )
    writeFileSync(
      templateFile,
      `<button aria-label="Close" q-inline-icon-button></button>\n`,
    )
    writeFileSync(join(cwd, "src/index.html"), `<app-root></app-root>\n`)
  })

  afterEach(() => {
    rmSync(cwd, {force: true, recursive: true})
  })

  test("rewrites templates and the components that use them", async () => {
    const results = await angularInlineIconButton.run({cwd, dryRun: false})

    expect(results).toEqual([
      {
        file: templateFile,
        message: "replaced 1 InlineIconButton usage",
        status: "updated",
      },
      {
        file: componentFile,
        message: "replaced 1 InlineIconButton usage",
        status: "updated",
      },
    ])
    expect(readFileSync(templateFile, "utf-8")).toBe(
      `<button aria-label="Close" q-icon-button density="compact" variant="ghost" icon="X"></button>\n`,
    )
    expect(readFileSync(componentFile, "utf-8")).toBe(
      `import {Component} from "@angular/core"
import {LucideX} from "@lucide/angular"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {ButtonModule} from "@qualcomm-ui/angular/button"

@Component({
  imports: [ButtonModule],
  providers: [provideIcons({LucideX})],
  selector: "app-close",
  templateUrl: "./close.html",
})
export class Close {}
`,
    )
  })

  test("reports templates that relied on the default icon without a component", async () => {
    rmSync(componentFile)

    const results = await angularInlineIconButton.run({cwd, dryRun: false})

    expect(results).toEqual([
      {
        file: templateFile,
        message: `replaced 1 InlineIconButton usage, update manually: add provideIcons({LucideX}) from "@qualcomm-ui/angular-core/lucide" to the providers of the component that uses this template`,
        status: "conflict",
      },
    ])
  })

  test("doesn't write files in a dry run", async () => {
    const template = readFileSync(templateFile, "utf-8")
    const component = readFileSync(componentFile, "utf-8")

    const results = await angularInlineIconButton.run({cwd, dryRun: true})

    expect(results.map(({message}) => message)).toEqual([
      "would replace 1 InlineIconButton usage",
      "would replace 1 InlineIconButton usage",
    ])
    expect(readFileSync(templateFile, "utf-8")).toBe(template)
    expect(readFileSync(componentFile, "utf-8")).toBe(component)
  })
})
