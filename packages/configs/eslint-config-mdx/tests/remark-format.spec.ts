import {ESLint} from "eslint"
import {join} from "node:path"
import {describe, expect, test} from "vitest"

const mdxConfig = await import("@qualcomm-ui/eslint-config-mdx")
const [recommended] = mdxConfig.default.configs.recommended

async function fixMdx(input: string) {
  const eslint = new ESLint({
    cwd: join(import.meta.dirname, ".."),
    fix: true,
    overrideConfig: [
      {
        ...recommended,
        languageOptions: {
          ...recommended.languageOptions,
          parserOptions: {
            remarkConfigPath: join(import.meta.dirname, "../.remarkrc"),
          },
        },
      },
    ],
    overrideConfigFile: true,
  })

  const [result] = await eslint.lintText(input, {
    filePath: join(import.meta.dirname, "../repro.mdx"),
  })

  return {
    ...result,
    fixedText: result.output ?? input,
  }
}

describe("package exports", () => {
  test("exports the main config", () => {
    expect(Array.isArray(mdxConfig.default.configs.recommended)).toBe(true)
  })

  test("exports remarkrc", async () => {
    // @ts-expect-error types
    const remarkrc = await import("@qualcomm-ui/eslint-config-mdx/remarkrc")

    expect(remarkrc.default.settings).toEqual({
      bullet: "-",
      rule: "-",
    })
  })

  test.each([
    "@qualcomm-ui/eslint-config-mdx/remark-lint-code-format",
    "@qualcomm-ui/eslint-config-mdx/remark-lint-mdx-jsx-format",
    "@qualcomm-ui/eslint-config-mdx/remark-preserve-alert-markers",
  ])("exports %s", async (specifier) => {
    const plugin = await import(specifier)

    expect(plugin.default).toBeTypeOf("function")
  })
})

describe("MDX remark fixes", () => {
  test("formats JSX attribute expressions with oxfmt", async () => {
    const input = `## Install the npm packages.

<NpmInstallTabs
  packages={[
  "@qualcomm-ui/react",
  "@qualcomm-ui/react-core",
  "@qualcomm-ui/core",
  "@qualcomm-ui/qds-core",
  "@qualcomm-ui/dom",
  "@qualcomm-ui/utils",
  "@tanstack/react-virtual",
  "lucide-react",
]}
/>
`
    const result = await fixMdx(input)

    expect(result.fixedText).toContain(`  packages={[
    "@qualcomm-ui/react",
    "@qualcomm-ui/react-core",
    "@qualcomm-ui/core",
    "@qualcomm-ui/qds-core",
    "@qualcomm-ui/dom",
    "@qualcomm-ui/utils",
    "@tanstack/react-virtual",
    "lucide-react",
  ]}`)
  })

  test("formats short JSX while another remark rule reports", async () => {
    const input = `## Install the npm packages.

<NpmInstallTabs
  packages={[
    "@qualcomm-ui/react",
    "@qualcomm-ui/react-core",
  ]}
/>
`

    const result = await fixMdx(input)

    expect(result.messages.some((message) => message.ruleId)).toBe(true)
    expect(result.fixedText).toContain(
      `<NpmInstallTabs
  packages={["@qualcomm-ui/react", "@qualcomm-ui/react-core"]}
/>`,
    )
  })

  test("keeps JSX blocks with markdown children unchanged", async () => {
    const input = `## Install the npm packages.

<Callout>
Some **markdown** content.
</Callout>
`

    const result = await fixMdx(input)

    expect(result.messages.some((message) => message.ruleId)).toBe(true)
    expect(result.fixedText).toContain(`<Callout>
Some **markdown** content.
</Callout>`)
  })

  test("formats multiple JSX flow blocks", async () => {
    const input = `<NpmInstallTabs
  packages={[
  "@qualcomm-ui/react",
]}
/>

<NpmInstallTabs
  packages={[
  "@qualcomm-ui/core",
]}
/>
`

    const result = await fixMdx(input)

    expect(result.fixedText).toContain(
      `<NpmInstallTabs packages={["@qualcomm-ui/react"]} />`,
    )
    expect(result.fixedText).toContain(
      `<NpmInstallTabs packages={["@qualcomm-ui/core"]} />`,
    )
  })

  test("formats normal TypeScript code fences", async () => {
    const input = `## Example

\`\`\`ts
const user={name:"Ada",active:true}
\`\`\`
`

    const result = await fixMdx(input)

    expect(result.fixedText).toContain(`\`\`\`ts
const user = {name: "Ada", active: true}
\`\`\``)
  })

  test("preserves standalone JSX code fences", async () => {
    const input = `## Standard Children

\`\`\`tsx
<SomeContext>
<div>Static content</div>
</SomeContext>
\`\`\`
`

    const result = await fixMdx(input)

    expect(result.fixedText).toContain(`\`\`\`tsx
<SomeContext>
<div>Static content</div>
</SomeContext>
\`\`\``)
    expect(result.fixedText).not.toContain(";<SomeContext>")
  })

  test("preserves commented standalone JSX code fences", async () => {
    const input = `## Default Value

\`\`\`tsx
// Component starts with defaultValue value and manages state internally
<Toggle defaultValue={true} onValueChange={(value) => console.log(value)} />
\`\`\`
`

    const result = await fixMdx(input)

    expect(result.fixedText).toContain(
      `// Component starts with defaultValue value and manages state internally
<Toggle defaultValue={true} onValueChange={(value) => console.log(value)} />`,
    )
    expect(result.fixedText).not.toContain(";<Toggle")
  })

  test("preserves grouped standalone JSX examples", async () => {
    const input = `## Spacing

\`\`\`tsx
// gap: var(--spacing-50);
<div className="gap-qds-50 flex"></div>

// margin-top: var(--spacing-80);
<div className="mt-qds-80"></div>

// padding: var(--spacing-120);
<div className="p-qds-120"></div>
\`\`\`
`

    const result = await fixMdx(input)

    expect(result.fixedText).toContain(
      `// gap: var(--spacing-50);
<div className="gap-qds-50 flex"></div>

// margin-top: var(--spacing-80);
<div className="mt-qds-80"></div>

// padding: var(--spacing-120);
<div className="p-qds-120"></div>`,
    )
    expect(result.fixedText).not.toContain("// gap: var(--spacing-50);\n\n")
  })

  test("preserves block comments in standalone JSX code fences", async () => {
    const input = `## Labels

\`\`\`tsx
/* Invalid */
<IconButton icon={/*...*/} />

/* Valid */
<IconButton icon={/*...*/} aria-label="Close dialog" />
\`\`\`
`

    const result = await fixMdx(input)

    expect(result.fixedText).toContain(`/* Invalid */
<IconButton icon={/*...*/} />

/* Valid */
<IconButton icon={/*...*/} aria-label="Close dialog" />`)
    expect(result.fixedText).not.toContain("/_ Invalid _/")
    expect(result.fixedText).not.toContain("/_ Valid _/")
  })

  test("preserves long line comments in standalone JSX code fences", async () => {
    const input = `## Labels

\`\`\`tsx
// Valid - direct aria-label (these are forwarded to the internal input element)
<TextInput aria-label="Full name" placeholder="Enter name" />
\`\`\`
`

    const result = await fixMdx(input)

    expect(result.fixedText).toContain(
      `// Valid - direct aria-label (these are forwarded to the internal input element)
<TextInput aria-label="Full name" placeholder="Enter name" />`,
    )
    expect(result.fixedText).not.toContain("internal input\nelement")
  })

  test("preserves alert markers when another remark rule fixes the document", async () => {
    const input = `# Title.

> [!note]
> Body.
`

    const result = await fixMdx(input)

    expect(result.fixedText).toContain(`> [!note]
> Body.`)
    expect(result.fixedText).not.toContain("> \\[!note]")
  })

  test("preserves alert markers with custom titles", async () => {
    const input = `# Title.

> [!tip/Custom Title]
> Body.
`

    const result = await fixMdx(input)

    expect(result.fixedText).toContain(`> [!tip/Custom Title]
> Body.`)
    expect(result.fixedText).not.toContain("> \\[!tip/Custom Title]")
  })

  test("normalizes escaped alert markers when another remark rule fixes the document", async () => {
    const input = `# Title.

> \\[!warning]
> Body.
`

    const result = await fixMdx(input)

    expect(result.fixedText).toContain(`> [!warning]
> Body.`)
    expect(result.fixedText).not.toContain("> \\[!warning]")
  })

  test("keeps non-alert bracketed blockquote text escaped", async () => {
    const input = `# Title.

> [readme]
> Body.
`

    const result = await fixMdx(input)

    expect(result.fixedText).toContain(`> \\[readme]
> Body.`)
  })

  test("does not preserve alert markers outside blockquotes", async () => {
    const input = `# Title.

[!note]
Body.
`

    const result = await fixMdx(input)

    expect(result.fixedText).toContain(`\\[!note]
Body.`)
  })
})
