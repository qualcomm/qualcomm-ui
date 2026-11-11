// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  BindingType,
  parseTemplate,
  type TmplAstElement,
  TmplAstRecursiveVisitor,
  tmplAstVisitAll,
} from "@angular/compiler"
import {glob} from "glob"
import {readFile, writeFile} from "node:fs/promises"
import {dirname, resolve} from "node:path"
import {
  type Decorator,
  type Expression,
  Node,
  type ObjectLiteralExpression,
  type SourceFile,
  SyntaxKind,
} from "ts-morph"

import {
  COMPACT_DENSITY,
  describeInlineIconButtonResult,
  getAttributeSeparator,
  getInlineIconButtonStatus,
  GHOST_VARIANT,
  type InlineIconButtonResult,
} from "../../shared/inline-icon-button.js"
import {
  addSpecifiers,
  applyEdits,
  type Edit,
  getLineNumber,
  getTopLevelBindings,
  moveNamedImports,
  parseSource,
} from "../../shared/source-edits.js"
import type {Codemod, CodemodFileResult} from "../../types.js"

const INLINE_ICON_BUTTON_MODULE = "@qualcomm-ui/angular/inline-icon-button"
const BUTTON_MODULE = "@qualcomm-ui/angular/button"
const LUCIDE_MODULE = "@lucide/angular"
const PROVIDE_ICONS_MODULE = "@qualcomm-ui/angular-core/lucide"

const SELECTOR = "q-inline-icon-button"
const COMPONENT = "InlineIconButtonComponent"
const BUTTON_NG_MODULE = "ButtonModule"

/**
 * InlineIconButton renders an X icon by default, but IconButton has no default.
 * String icons must be registered with `provideIcons`, or IconDirective throws.
 */
const DEFAULT_ICON = `icon="X"`

/** The keys that resolve the `X` string icon. */
const X_ICON_KEYS = new Set(["LucideX", "X", "XIcon"])

export interface TemplateMigration {
  /**
   * Whether the template couldn't be migrated, so it still uses InlineIconButton.
   */
  failed: boolean
  replaced: number
  /**
   * Whether a replaced element relied on InlineIconButton's default icon, so
   * the component must provide `LucideX`.
   */
  usesDefaultIcon: boolean
}

export interface InlineIconButtonTemplateResult
  extends InlineIconButtonResult, Omit<TemplateMigration, "replaced"> {}

/**
 * Returns the migration of the external template at `templateUrl`, or
 * `undefined` if the template can't be found.
 */
export type TemplateResolver = (
  templateUrl: string,
) => Omit<TemplateMigration, "replaced"> | undefined

class InlineIconButtonVisitor extends TmplAstRecursiveVisitor {
  readonly elements: TmplAstElement[] = []

  // Structural directives (`*ngIf`) wrap their element in a template node that
  // copies the element's attributes, so only element nodes are inspected.
  override visitElement(element: TmplAstElement): void {
    if (element.attributes.some(({name}) => name === SELECTOR)) {
      this.elements.push(element)
    }
    super.visitElement(element)
  }
}

/**
 * Returns the static attribute or property binding (`[name]`, `bind-name`,
 * `name="{{ value }}"`) for the directive input `name`. `[attr.name]` doesn't
 * bind to the input.
 */
function findInput(element: TmplAstElement, name: string) {
  return (
    element.attributes.find((attribute) => attribute.name === name) ??
    element.inputs.find(
      (input) => input.type === BindingType.Property && input.name === name,
    )
  )
}

/**
 * Collects the edits for a template, offset by its position in the file.
 */
function collectTemplateEdits(
  template: string,
  offset: number,
  fileContent: string,
  filePath: string,
  edits: Edit[],
  manual: string[],
): TemplateMigration {
  const parsed = parseTemplate(template, filePath, {preserveWhitespaces: true})
  if (parsed.errors?.length) {
    const [error] = parsed.errors
    manual.push(
      `the template on line ${getLineNumber(fileContent, offset + error.span.start.offset)} couldn't be parsed (${error.msg}), update it manually`,
    )
    return {failed: true, replaced: 0, usesDefaultIcon: false}
  }

  const visitor = new InlineIconButtonVisitor()
  tmplAstVisitAll(visitor, parsed.nodes)

  const templateEdits: Edit[] = []
  let usesDefaultIcon = false
  for (const element of visitor.elements) {
    const selector = element.attributes.find(({name}) => name === SELECTOR)!
    const key = selector.keySpan ?? selector.sourceSpan
    templateEdits.push({
      end: key.end.offset,
      start: key.start.offset,
      text: "q-icon-button",
    })

    const variant = findInput(element, "variant")
    if (variant) {
      templateEdits.push({
        end: variant.sourceSpan.end.offset,
        start: variant.sourceSpan.start.offset,
        text: GHOST_VARIANT,
      })
    }
    const hasIcon = !!findInput(element, "icon")
    usesDefaultIcon ||= !hasIcon

    const added = [
      COMPACT_DENSITY,
      ...(variant ? [] : [GHOST_VARIANT]),
      ...(hasIcon ? [] : [DEFAULT_ICON]),
    ]
    const separator = getAttributeSeparator(
      template,
      selector.sourceSpan.start.offset,
    )
    const end = selector.sourceSpan.end.offset
    templateEdits.push({
      end,
      start: end,
      text: added.map((attribute) => `${separator}${attribute}`).join(""),
    })
  }

  for (const edit of templateEdits) {
    edits.push({
      end: edit.end + offset,
      start: edit.start + offset,
      text: edit.text,
    })
  }
  return {failed: false, replaced: visitor.elements.length, usesDefaultIcon}
}

/**
 * Replaces the InlineIconButtons in an external template (`.html`) with compact
 * ghost IconButtons. The component that uses the template must provide
 * `LucideX` if `usesDefaultIcon` is set.
 */
export function transformAngularTemplate(
  content: string,
  filePath = "template.html",
): InlineIconButtonTemplateResult {
  if (!content.includes(SELECTOR)) {
    return {
      content,
      failed: false,
      manual: [],
      replaced: 0,
      status: "skipped",
      usesDefaultIcon: false,
    }
  }
  const edits: Edit[] = []
  const manual: string[] = []
  const migration = collectTemplateEdits(
    content,
    0,
    content,
    filePath,
    edits,
    manual,
  )
  const result = applyEdits(content, edits)
  return {
    content: result,
    failed: migration.failed,
    manual,
    replaced: migration.replaced,
    status: getInlineIconButtonStatus(content, result, manual),
    usesDefaultIcon: migration.usesDefaultIcon,
  }
}

function getPropertyInitializer(
  options: ObjectLiteralExpression,
  name: string,
): Expression | undefined {
  const property = options.getProperty(name)
  return Node.isPropertyAssignment(property)
    ? property.getInitializer()
    : undefined
}

/**
 * Returns the indentation of a node that starts its own line, or `undefined`
 * if it shares its line with a previous token.
 */
function getOwnLineIndent(node: Node, content: string): string | undefined {
  const indent = content.slice(node.getStartLinePos(), node.getStart())
  return /^\s*$/.test(indent) ? indent : undefined
}

/**
 * Appends `text` after the last element of a comma-separated list, on its own
 * line if the last element is on its own line.
 */
function appendToList(last: Node, text: string, content: string): Edit {
  const indent = getOwnLineIndent(last, content)
  return {
    end: last.getEnd(),
    start: last.getEnd(),
    text: indent === undefined ? `, ${text}` : `,\n${indent}${text}`,
  }
}

/**
 * Inserts a property into a decorator's options, before the first property
 * that sorts after it.
 */
function insertProperty(
  options: ObjectLiteralExpression,
  name: string,
  text: string,
  content: string,
): Edit {
  const properties = options.getProperties()
  const next = properties.find(
    (property) => Node.hasName(property) && property.getName() > name,
  )
  if (next) {
    const indent = getOwnLineIndent(next, content)
    const start = next.getStart()
    return {
      end: start,
      start,
      text: indent === undefined ? `${text}, ` : `${text},\n${indent}`,
    }
  }
  if (properties.length) {
    return appendToList(properties[properties.length - 1], text, content)
  }
  const start = options.getStart() + 1
  return {end: start, start, text}
}

type ProviderResult = "added" | "present" | "unsupported"

/**
 * Adds `LucideX` to the component's `provideIcons` provider, or adds the
 * provider.
 */
function addIconProvider(
  options: ObjectLiteralExpression,
  locals: {lucideX: string; provideIcons: string},
  content: string,
  edits: Edit[],
): ProviderResult {
  const entry =
    locals.lucideX === "LucideX" ? "LucideX" : `LucideX: ${locals.lucideX}`
  const call = `${locals.provideIcons}({${entry}})`

  const property = options.getProperty("providers")
  if (!property) {
    edits.push(
      insertProperty(options, "providers", `providers: [${call}]`, content),
    )
    return "added"
  }
  const providers = getPropertyInitializer(options, "providers")
  if (!Node.isArrayLiteralExpression(providers)) {
    return "unsupported"
  }

  const elements = providers.getElements()
  for (const element of elements) {
    if (
      !Node.isCallExpression(element) ||
      element.getExpression().getText() !== locals.provideIcons
    ) {
      continue
    }
    const [icons] = element.getArguments()
    if (!Node.isObjectLiteralExpression(icons)) {
      continue
    }
    const properties = icons.getProperties()
    if (
      properties.some(
        (icon) => Node.hasName(icon) && X_ICON_KEYS.has(icon.getName()),
      )
    ) {
      return "present"
    }
    edits.push(
      properties.length
        ? appendToList(properties[properties.length - 1], entry, content)
        : {end: icons.getEnd(), start: icons.getStart(), text: `{${entry}}`},
    )
    return "added"
  }

  edits.push(
    elements.length
      ? appendToList(elements[elements.length - 1], call, content)
      : {
          end: providers.getEnd(),
          start: providers.getStart(),
          text: `[${call}]`,
        },
  )
  return "added"
}

/**
 * Removes an element from an array literal, along with its separator.
 */
function removeArrayElement(elements: Node[], index: number): Edit {
  return index > 0
    ? {
        end: elements[index].getEnd(),
        start: elements[index - 1].getEnd(),
        text: "",
      }
    : {end: elements[1].getStart(), start: elements[0].getStart(), text: ""}
}

function getCommonPrefixLength(a: string, b: string): number {
  let length = 0
  while (length < a.length && a[length] === b[length]) {
    length++
  }
  return length
}

/**
 * Adds a named import of `module`, unless it's already imported. A new import
 * goes next to the import whose module shares the longest prefix with
 * `module`, which keeps it within its import group.
 */
function ensureNamedImport(
  content: string,
  module: string,
  name: string,
): string {
  const sourceFile = parseSource(content, "file.ts")
  const imports = sourceFile.getImportDeclarations()
  const decls = imports.filter(
    (decl) => decl.getModuleSpecifierValue() === module && !decl.isTypeOnly(),
  )
  if (
    decls.some((decl) =>
      decl.getNamedImports().some((specifier) => specifier.getName() === name),
    )
  ) {
    return content
  }

  const target = decls.find((decl) => decl.getNamedImports().length > 0)
  const edit = target ? addSpecifiers(target, [{name}]) : undefined
  if (edit) {
    return applyEdits(content, [edit])
  }

  const text = `import {${name}} from "${module}"`
  if (!imports.length) {
    return `${text}

${content}`
  }
  let nearest = imports[0]
  let longest = -1
  for (const decl of imports) {
    const specifier = decl.getModuleSpecifierValue()
    const length = getCommonPrefixLength(specifier, module)
    // Ties go to the last import that sorts before `module`.
    if (length > longest || (length === longest && specifier < module)) {
      nearest = decl
      longest = length
    }
  }
  const before = module < nearest.getModuleSpecifierValue()
  const offset = before ? nearest.getStart() : nearest.getEnd()
  return applyEdits(content, [
    {end: offset, start: offset, text: before ? `${text}\n` : `\n${text}`},
  ])
}

/**
 * Returns the local name of a value import, or `undefined` if the name isn't
 * imported from `module`.
 */
function getImportedLocal(
  sourceFile: SourceFile,
  module: string,
  name: string,
): string | undefined {
  for (const decl of sourceFile.getImportDeclarations()) {
    if (decl.getModuleSpecifierValue() !== module || decl.isTypeOnly()) {
      continue
    }
    const specifier = decl
      .getNamedImports()
      .find((s) => s.getName() === name && !s.isTypeOnly())
    if (specifier) {
      return specifier.getAliasNode()?.getText() ?? name
    }
  }
  return undefined
}

interface ComponentTemplate {
  /**
   * Why the codemod can't tell whether the template still uses
   * InlineIconButton: it couldn't be migrated, or it couldn't be read.
   */
  blocked?: "failed" | "unreadable"
  options: ObjectLiteralExpression
  usesDefaultIcon: boolean
}

/**
 * Migrates the inline template of each `@Component`, or looks up its external
 * template.
 */
function collectComponentTemplates(
  sourceFile: SourceFile,
  resolveTemplate: TemplateResolver,
  edits: Edit[],
  manual: string[],
): {replaced: number; templates: Map<Decorator, ComponentTemplate>} {
  const content = sourceFile.getFullText()
  const filePath = sourceFile.getFilePath()
  const templates = new Map<Decorator, ComponentTemplate>()
  let replaced = 0

  for (const decorator of sourceFile.getDescendantsOfKind(
    SyntaxKind.Decorator,
  )) {
    const [options] = decorator.getArguments()
    if (
      decorator.getName() !== "Component" ||
      !Node.isObjectLiteralExpression(options)
    ) {
      continue
    }

    const template = getPropertyInitializer(options, "template")
    if (template) {
      const mentionsSelector = template.getText().includes(SELECTOR)
      const line = template.getStartLineNumber()
      if (
        !Node.isStringLiteral(template) &&
        !Node.isNoSubstitutionTemplateLiteral(template)
      ) {
        if (mentionsSelector) {
          manual.push(
            `the template on line ${line} isn't a plain string, update it manually`,
          )
        }
        templates.set(decorator, {
          blocked: mentionsSelector ? "failed" : "unreadable",
          options,
          usesDefaultIcon: false,
        })
        continue
      }
      if (!mentionsSelector) {
        templates.set(decorator, {options, usesDefaultIcon: false})
        continue
      }
      // Template offsets map to the file only if the raw text is the template.
      const raw = template.getText().slice(1, -1)
      if (raw !== template.getLiteralValue()) {
        manual.push(
          `the template on line ${line} contains escape sequences, update it manually`,
        )
        templates.set(decorator, {
          blocked: "failed",
          options,
          usesDefaultIcon: false,
        })
        continue
      }
      const migration = collectTemplateEdits(
        raw,
        template.getStart() + 1,
        content,
        filePath,
        edits,
        manual,
      )
      replaced += migration.replaced
      templates.set(decorator, {
        blocked: migration.failed ? "failed" : undefined,
        options,
        usesDefaultIcon: migration.usesDefaultIcon,
      })
      continue
    }

    const templateUrl = getPropertyInitializer(options, "templateUrl")
    const migration =
      Node.isStringLiteral(templateUrl) ||
      Node.isNoSubstitutionTemplateLiteral(templateUrl)
        ? resolveTemplate(templateUrl.getLiteralValue())
        : undefined
    templates.set(decorator, {
      blocked: !migration
        ? "unreadable"
        : migration.failed
          ? "failed"
          : undefined,
      options,
      usesDefaultIcon: !!migration?.usesDefaultIcon,
    })
  }

  return {replaced, templates}
}

/**
 * Replaces the InlineIconButtons in the inline templates of a TypeScript file
 * with compact ghost IconButtons, and `InlineIconButtonComponent` in `imports`
 * and `exports` arrays with `ButtonModule`. Components whose templates relied on
 * the default icon get `provideIcons({LucideX})`. Edited imports and attributes
 * aren't reformatted.
 *
 * @param resolveTemplate looks up the migration of a component's
 * `templateUrl`, which is relative to this file. Without it, external templates
 * are treated as unreadable.
 */
export function transformAngularSource(
  content: string,
  filePath = "file.ts",
  resolveTemplate: TemplateResolver = () => undefined,
): InlineIconButtonResult {
  const sourceFile = parseSource(content, filePath)
  const edits: Edit[] = []
  const manual: string[] = []

  const inlineImports = sourceFile
    .getImportDeclarations()
    .filter(
      (decl) => decl.getModuleSpecifierValue() === INLINE_ICON_BUTTON_MODULE,
    )
  const reExports = sourceFile
    .getExportDeclarations()
    .filter(
      (decl) => decl.getModuleSpecifierValue() === INLINE_ICON_BUTTON_MODULE,
    )

  const collected = collectComponentTemplates(
    sourceFile,
    resolveTemplate,
    edits,
    manual,
  )
  const {templates} = collected
  let replaced = collected.replaced

  const usesDefaultIcon = [...templates.values()].some(
    (template) => template.usesDefaultIcon,
  )
  const mentionsInlineIconButton =
    inlineImports.length > 0 ||
    reExports.length > 0 ||
    edits.length > 0 ||
    manual.length > 0
  if (!mentionsInlineIconButton && !usesDefaultIcon) {
    return {content, manual: [], replaced: 0, status: "skipped"}
  }

  for (const decl of reExports) {
    manual.push(
      `replace the re-export of "${INLINE_ICON_BUTTON_MODULE}" on line ${decl.getStartLineNumber()} with ${BUTTON_NG_MODULE} from "${BUTTON_MODULE}"`,
    )
  }

  const bindings = getTopLevelBindings(sourceFile)
  const locals = new Map<string, string>()
  const conflicts = new Set<string>()
  const resolveLocal = (module: string, name: string): string => {
    let local = locals.get(name)
    if (!local) {
      const imported = getImportedLocal(sourceFile, module, name)
      if (!imported && bindings.has(name)) {
        conflicts.add(`${name} from "${module}"`)
      }
      local = imported ?? name
      locals.set(name, local)
    }
    return local
  }

  const componentSpecifiers = inlineImports.flatMap((decl) => {
    if (decl.getNamespaceImport()) {
      manual.push(
        `replace the namespace import of "${INLINE_ICON_BUTTON_MODULE}" on line ${decl.getStartLineNumber()} with ${BUTTON_NG_MODULE} from "${BUTTON_MODULE}"`,
      )
    }
    return decl.getNamedImports().filter((specifier) => {
      const name = specifier.getName()
      if (name === "useInlineIconButtonApi") {
        manual.push(
          `replace useInlineIconButtonApi on line ${decl.getStartLineNumber()} with useIconButtonApi from "${BUTTON_MODULE}", and pass density "compact" and variant "ghost"`,
        )
      }
      return name === COMPONENT && !specifier.isTypeOnly() && !decl.isTypeOnly()
    })
  })

  let keepComponentImport = false
  for (const specifier of componentSpecifiers) {
    const localNode = specifier.getAliasNode() ?? specifier.getNameNode()
    const local = localNode.getText()
    const handled = new Set<number>()

    for (const array of sourceFile.getDescendantsOfKind(
      SyntaxKind.ArrayLiteralExpression,
    )) {
      const property = array.getParent()
      if (
        !Node.isPropertyAssignment(property) ||
        !["exports", "imports"].includes(property.getName())
      ) {
        continue
      }
      const elements = array.getElements()
      const matches = elements.flatMap((element, index) =>
        Node.isIdentifier(element) && element.getText() === local
          ? [index]
          : [],
      )
      if (!matches.length) {
        continue
      }
      const owner = array.getFirstAncestorByKind(SyntaxKind.Decorator)
      const blocked = owner && templates.get(owner)?.blocked
      if (blocked) {
        // Failed templates are already reported.
        if (blocked === "unreadable") {
          manual.push(
            `couldn't read the template of the component on line ${owner.getStartLineNumber()}, replace ${local} in its ${property.getName()} manually`,
          )
        }
        continue
      }
      const buttonModule = resolveLocal(BUTTON_MODULE, BUTTON_NG_MODULE)
      let hasButtonModule = elements.some(
        (element) => element.getText() === buttonModule,
      )
      for (const index of matches) {
        handled.add(elements[index].getStart())
        edits.push(
          hasButtonModule
            ? removeArrayElement(elements, index)
            : {
                end: elements[index].getEnd(),
                start: elements[index].getStart(),
                text: buttonModule,
              },
        )
        hasButtonModule = true
        replaced++
      }
    }

    for (const reference of localNode
      .asKindOrThrow(SyntaxKind.Identifier)
      .findReferencesAsNodes()) {
      if (
        reference.getSourceFile() !== sourceFile ||
        reference.getFirstAncestorByKind(SyntaxKind.ImportDeclaration) ||
        handled.has(reference.getStart())
      ) {
        continue
      }
      keepComponentImport = true
      const owner = reference.getFirstAncestorByKind(SyntaxKind.Decorator)
      if (owner && templates.get(owner)?.blocked) {
        continue
      }
      manual.push(
        `replace ${local} on line ${reference.getStartLineNumber()} with IconButtonDirective from "${BUTTON_MODULE}"`,
      )
    }
  }

  if (!keepComponentImport) {
    // The specifier is renamed here, then moved into the button import.
    for (const specifier of componentSpecifiers) {
      const buttonModule = resolveLocal(BUTTON_MODULE, BUTTON_NG_MODULE)
      edits.push({
        end: specifier.getEnd(),
        start: specifier.getNameNode().getStart(),
        text:
          buttonModule === BUTTON_NG_MODULE
            ? BUTTON_NG_MODULE
            : `${BUTTON_NG_MODULE} as ${buttonModule}`,
      })
    }
  }

  let providesIcon = false
  for (const [decorator, template] of templates) {
    if (!template.usesDefaultIcon) {
      continue
    }
    const result = addIconProvider(
      template.options,
      {
        lucideX: resolveLocal(LUCIDE_MODULE, "LucideX"),
        provideIcons: resolveLocal(PROVIDE_ICONS_MODULE, "provideIcons"),
      },
      content,
      edits,
    )
    if (result === "unsupported") {
      manual.push(
        `add provideIcons({LucideX}) to the providers of the component on line ${decorator.getStartLineNumber()}`,
      )
    }
    providesIcon ||= result === "added"
  }

  if (conflicts.size) {
    // The edits refer to the conflicting names, so none are applied.
    return {
      content,
      manual: [
        `the file already declares ${[...conflicts].join(" and ")}, import ${conflicts.size === 1 ? "it" : "them"} under another name or update the file manually`,
      ],
      replaced: 0,
      status: "conflict",
    }
  }

  let result = applyEdits(content, edits)
  result =
    moveNamedImports(
      parseSource(result, filePath),
      INLINE_ICON_BUTTON_MODULE,
      BUTTON_MODULE,
      (name) => name === BUTTON_NG_MODULE,
    ) ?? result
  if (locals.has(BUTTON_NG_MODULE)) {
    result = ensureNamedImport(result, BUTTON_MODULE, BUTTON_NG_MODULE)
  }
  if (providesIcon) {
    result = ensureNamedImport(result, LUCIDE_MODULE, "LucideX")
    result = ensureNamedImport(result, PROVIDE_ICONS_MODULE, "provideIcons")
  }

  return {
    content: result,
    manual,
    replaced,
    status: getInlineIconButtonStatus(content, result, manual),
  }
}

export const angularInlineIconButton: Codemod<"@qualcomm-ui/angular"> = {
  name: "inline-icon-button",
  noMatchMessage:
    "no templates using q-inline-icon-button or imports of InlineIconButtonComponent found, nothing to change",
  run: async ({cwd, dryRun}) => {
    const files = await glob("**/*.{ts,mts,cts,html}", {
      absolute: true,
      cwd,
      ignore: [
        "**/node_modules/**",
        "**/dist/**",
        "**/build/**",
        "**/coverage/**",
        "**/.angular/**",
      ],
      nodir: true,
    })
    const templateFiles = new Set(
      files.filter((file) => file.endsWith(".html")),
    )

    const results = new Map<string, CodemodFileResult>()
    const write = async (
      file: string,
      original: string,
      result: InlineIconButtonResult,
      skippedMessage: string,
    ) => {
      if (result.content !== original && !dryRun) {
        await writeFile(file, result.content, "utf-8")
      }
      results.set(file, {
        file,
        message: describeInlineIconButtonResult(result, dryRun, skippedMessage),
        status: result.status,
      })
    }

    // External templates go first, so their components know whether to
    // provide the default icon.
    const templates = new Map<string, InlineIconButtonTemplateResult>()
    for (const file of [...templateFiles].sort()) {
      const original = await readFile(file, "utf-8")
      if (!original.includes(SELECTOR)) {
        continue
      }
      const result = transformAngularTemplate(original, file)
      templates.set(file, result)
      await write(
        file,
        original,
        result,
        "doesn't use q-inline-icon-button, ignored",
      )
    }

    const needsProvider = [...templates.values()].some(
      (template) => template.usesDefaultIcon,
    )
    const claimed = new Set<string>()
    for (const file of files
      .filter((file) => !templateFiles.has(file))
      .sort()) {
      const original = await readFile(file, "utf-8")
      if (
        !original.includes("inline-icon-button") &&
        !(needsProvider && original.includes("templateUrl"))
      ) {
        continue
      }
      const result = transformAngularSource(original, file, (templateUrl) => {
        const path = resolve(dirname(file), templateUrl)
        if (!templateFiles.has(path)) {
          return undefined
        }
        claimed.add(path)
        return templates.get(path) ?? {failed: false, usesDefaultIcon: false}
      })
      if (result.status === "skipped") {
        continue
      }
      await write(
        file,
        original,
        result,
        "doesn't use InlineIconButton, ignored",
      )
    }

    for (const [file, template] of templates) {
      if (!template.usesDefaultIcon || claimed.has(file)) {
        continue
      }
      const manual = `add provideIcons({LucideX}) from "${PROVIDE_ICONS_MODULE}" to the providers of the component that uses this template`
      results.set(file, {
        file,
        message: describeInlineIconButtonResult(
          {
            ...template,
            manual: [...template.manual, manual],
            status: "conflict",
          },
          dryRun,
          "",
        ),
        status: "conflict",
      })
    }

    return [...results.keys()].sort().map((file) => results.get(file)!)
  },
  title: "Replace InlineIconButton with the compact IconButton",
  versions: {
    "@qualcomm-ui/angular": {from: 3, to: 4},
  },
}
