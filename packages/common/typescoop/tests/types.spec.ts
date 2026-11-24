import {readFileSync, writeFileSync} from "node:fs"
import {resolve} from "node:path"
import {describe, expect, test} from "vitest"

import type {QuiPropTypes, SerializedType} from "@qualcomm-ui/typedoc-common"

import type {BuildOptions} from "../src"
import {build, type ParseResult} from "../src/internal"

type TestCase = [
  string,
  {
    actual: string | boolean | null | undefined | object
    expected: string | boolean | null | undefined | object
  },
]

function findProp(propTypes: QuiPropTypes, propName: string) {
  return (
    propTypes.props?.find((child) => child.name === propName) ||
    propTypes.input?.find((child) => child.name === propName) ||
    propTypes.output?.find((child) => child.name === propName) ||
    propTypes.publicMethods?.find((child) => child.name === propName)
  )
}

function findResolvedType(
  propTypes: QuiPropTypes,
  propName: string,
): SerializedType {
  const resolvedType = findProp(propTypes, propName)?.resolvedType
  if (!resolvedType) {
    throw new Error(`Could not find prop ${propName}`)
  }
  return resolvedType
}

function getTestCases(parseResult: ParseResult): TestCase[] {
  const interfaces = parseResult.knownInterfaces
  const props = parseResult.types

  return [
    [
      "TestUnionA",
      {
        actual: interfaces.TestUnionA.resolvedType?.type,
        expected: `'a' | 'b' | 'c'`,
      },
    ],
    [
      "TestGeneric1",
      {
        actual: interfaces.TestGeneric1.resolvedType?.prettyType,
        expected: "(\n  options: T[],\n  inputValue: string,\n) => T[]",
      },
    ],
    [
      "TestTemplateLiteral1",
      {
        actual: interfaces.TestTemplateLiteral1.resolvedType?.type,
        expected: "`${string}.${number}`",
      },
    ],
    [
      "alias of a mapped type prints the reference as written",
      {
        actual: {
          baseType: interfaces.TestRecordAlias.resolvedType?.baseType,
          type: interfaces.TestRecordAlias.resolvedType?.type,
        },
        expected: {baseType: "reference", type: "Record<string, number>"},
      },
    ],
    [
      "generic alias of a mapped type prints the reference as written",
      {
        actual: interfaces.TestGenericRecordAlias.resolvedType?.type,
        expected: "Record<T, () => void>",
      },
    ],
    [
      "alias of Pick prints the reference as written",
      {
        actual: interfaces.TestPickAlias.resolvedType?.type,
        expected: "Pick<DashCasedBindingProps, 'dir' | 'disabled'>",
      },
    ],
    [
      "alias of a homomorphic mapped type prints the reference as written",
      {
        actual: interfaces.TestPartialAlias.resolvedType?.type,
        expected: "Partial<Record<'x' | 'y', number>>",
      },
    ],
    [
      "references to mapped type aliases inline as written",
      {
        actual: {
          documented: findResolvedType(props.MappedAliasHost, "documented")
            .type,
          generic: findResolvedType(props.MappedAliasHost, "generic").type,
          long: findResolvedType(props.MappedAliasHost, "long").type,
          omit: findResolvedType(props.MappedAliasHost, "omit").type,
          pick: findResolvedType(props.MappedAliasHost, "pick").type,
          record: findResolvedType(props.MappedAliasHost, "record").type,
        },
        expected: {
          documented: "{open: () => void;}",
          generic: "{a: () => void;}",
          long: "TestLongRecordAlias",
          omit: "{disabled: boolean; \"data-disabled\": ''; \"data-stepper-part\": 'prev-trigger';}",
          pick: "{dir: 'ltr' | 'rtl'; disabled: boolean;}",
          record: "Record<string, number>",
        },
      },
    ],
    [
      "inline decisions cover mapped type aliases",
      {
        actual: (() => {
          const {inlineRefs, prettyType} = findResolvedType(
            props.MappedAliasHost,
            "record",
          )
          return inlineRefs?.map(({end, inlined, name, start}) => ({
            inlined,
            name,
            text: prettyType?.slice(start, end),
          }))
        })(),
        expected: [
          {
            inlined: true,
            name: "TestRecordAlias",
            text: "Record<\n  string,\n  number\n>",
          },
        ],
      },
    ],
    [
      "arrays of simple and named elements use the suffix",
      {
        actual: Object.fromEntries(
          (props.ArrayHost.props ?? []).map((prop) => [
            prop.name,
            prop.resolvedType.type,
          ]),
        ),
        expected: {
          functions: "Array<() => void>",
          generics: "Map<string, () => void>[]",
          names: "Date[]",
          nestedNames: "Date[][]",
          nestedUnions: "Array<Array<'a' | 'b'>>",
          readonlyNames: "readonly Date[]",
          readonlyStrings: "readonly string[]",
          readonlyUnions: "ReadonlyArray<'a' | 'b'>",
          unions: "Array<'a' | 'b'>",
        },
      },
    ],
    [
      "DashCasedBindingProps",
      {
        actual: interfaces.DashCasedBindingProps.resolvedType?.type,
        expected:
          "{\"data-disabled\": ''; \"data-stepper-part\": 'prev-trigger'; dir: 'ltr' | 'rtl'; disabled: boolean;}",
      },
    ],
    [
      "DashCasedRenderPropHost.children",
      {
        actual: findResolvedType(props.DashCasedRenderPropHost, "children")
          .type,
        expected:
          "string | ((props: {\"data-disabled\": ''; \"data-stepper-part\": 'prev-trigger'; dir: 'ltr' | 'rtl'; disabled: boolean;}) => string)",
      },
    ],
    [
      "TestTuple1",
      {
        actual: interfaces.TestTuple1.resolvedType?.type,
        expected: `[string, boolean, string, number]`,
      },
    ],
    [
      "InterfaceA.genericFunc1",
      {
        actual: findResolvedType(props.InterfaceA, "genericFunc1").type,
        expected: "(options: string[], inputValue: string) => string[]",
      },
    ],
    [
      "InterfaceA.unionA",
      {
        actual: findResolvedType(props.InterfaceA, "unionA").type,
        expected: `'a' | 'b' | 'c'`,
      },
    ],
    [
      "RedundantUndefinedHost",
      {
        actual: {
          absorbed: findResolvedType(props.RedundantUndefinedHost, "absorbed")
            .type,
          nested: findResolvedType(props.RedundantUndefinedHost, "nested").type,
          required: findResolvedType(props.RedundantUndefinedHost, "required")
            .type,
        },
        expected: {
          absorbed: "'' | undefined",
          nested: "{label?: string;}",
          required: "string | undefined",
        },
      },
    ],
    [
      "InterfaceB.reason",
      {
        actual: findResolvedType(props.InterfaceB, "reason").type,
        expected: `'1' | '2' | '3'`,
      },
    ],
    [
      "ComplexGeneric.className",
      {
        actual: findResolvedType(props.ComplexGeneric, "className").type,
        expected: "string",
      },
    ],
    [
      "IntersectionSignature1",
      {
        actual: interfaces.IntersectionSignature1.resolvedType?.type,
        expected: "{signatureParam?: (unionParam: 'a' | 'b' | 'c') => void;}",
      },
    ],
    [
      "SomeClass",
      {
        actual: findResolvedType(props.SomeClass, "hello").type,
        expected: "string",
      },
    ],
    [
      "Angular setSignature",
      {
        actual: findResolvedType(props.TestDirective, "expanded").type,
        expected: "boolean",
      },
    ],
    [
      "Angular input signal",
      {
        actual: findResolvedType(props.TestDirective, "someOutput").type,
        expected: "number",
      },
    ],
    [
      "Angular input signal",
      {
        actual: findResolvedType(props.TestDirective, "inputSignal").prettyType,
        expected: "string",
      },
    ],
    [
      "Angular output signal",
      {
        actual: findResolvedType(props.TestDirective, "outputSignal")
          .prettyType,
        expected: "string",
      },
    ],
    [
      "Class public method",
      {
        actual: findResolvedType(props.SomeClass, "testMethod").prettyType,
        expected: "(\n  param: string,\n) => void",
      },
    ],
    [
      "Class public method with parameter comment.",
      {
        actual: findResolvedType(props.SomeClass, "testMethod")
          .functionParameters?.[0]?.comment?.summary,
        expected: [
          {
            kind: "text",
            text: "parameter comment",
          },
        ],
      },
    ],
    [
      "inheritDoc",
      {
        actual: findResolvedType(props.SomeNestedType, "item").prettyType,
        expected: "SomeNestedType",
      },
    ],
    [
      "inheritDoc array",
      {
        actual: findResolvedType(props.SomeNestedType, "items").prettyType,
        expected: "SomeNestedType[]",
      },
    ],
    [
      "inheritDoc 2",
      {
        actual: findResolvedType(props.SomeNestedType, "items").name,
        expected: "items",
      },
    ],
    [
      "GenericNestedType",
      {
        actual: findResolvedType(props.GenericNestedType, "itemFn").type,
        expected: "(param: GenericReferenceType<T>) => InheritDocSignature",
      },
    ],
    [
      "GenericNestedType parameters with parameter comment",
      {
        actual: findResolvedType(props.GenericNestedType, "itemFn").parameters,
        expected: [
          {
            constraint: "Record<string, any>",
            defaultValue: "Record<string, string>",
            name: "T",
            summary: [
              {
                kind: "text",
                text: "the generic type",
              },
            ],
            type: "Record<string, any>",
          },
        ],
      },
    ],
    [
      "interface lists an unconstrained type parameter",
      {
        actual: props.GenericReferenceType.typeParameters,
        expected: [{name: "T", required: true, type: "any"}],
      },
    ],
    [
      "interface lists a constrained type parameter with a default",
      {
        actual: props.ConstrainedTypeParameter.typeParameters,
        expected: [
          {
            constraint: "string",
            defaultValue: "'id'",
            name: "Key",
            type: "string",
          },
        ],
      },
    ],
    [
      "type parameter constraint and default keep alias names",
      {
        actual: props.AliasConstrainedTypeParameter.typeParameters,
        expected: [
          {
            constraint: "KeyKind",
            defaultValue: "KeyKind",
            name: "Kind",
            type: "KeyKind",
          },
        ],
      },
    ],
    [
      "interface without type parameters omits them",
      {
        actual: "typeParameters" in props.SomeNestedType,
        expected: false,
      },
    ],
    [
      "members and function parameters omit the root type",
      {
        actual: {
          member: "type" in findProp(props.ConstrainedTypeParameter, "idKey")!,
          parameter:
            "type" in
            findResolvedType(props.SomeClass, "testMethod")
              .functionParameters![0],
        },
        expected: {member: false, parameter: false},
      },
    ],
    [
      "member lists the owner type parameters its type mentions",
      {
        actual: findResolvedType(
          props.ConstrainedTypeParameter,
          "keys",
        ).parameters?.map((parameter) => parameter.name),
        expected: ["Key"],
      },
    ],
    [
      "member omits owner type parameters its type does not mention",
      {
        actual: findResolvedType(props.ConstrainedTypeParameter, "fields")
          .parameters,
        expected: undefined,
      },
    ],
    [
      "string literal matching an owner type parameter is not a mention",
      {
        actual: findResolvedType(props.ConstrainedTypeParameter, "keyLabel")
          .parameters,
        expected: undefined,
      },
    ],
    [
      "Angular input groups",
      {
        actual: {
          input: props.SignalHostComponent.input?.map((p) => p.name).sort(),
          output: props.SignalHostComponent.output?.map((p) => p.name),
          publicMethods: props.SignalHostComponent.publicMethods?.map(
            (p) => p.name,
          ),
        },
        expected: {
          input: [
            "checked",
            "disabled",
            "label",
            "publicName",
            "requiredInput",
            "value",
          ],
          output: ["valueChanged"],
          publicMethods: ["reset"],
        },
      },
    ],
    [
      "Angular required inputs",
      {
        actual: Object.fromEntries(
          (props.SignalHostComponent.input ?? []).map((p) => [
            p.name,
            !!p.resolvedType.required,
          ]),
        ),
        expected: {
          checked: true,
          disabled: false,
          label: true,
          publicName: false,
          requiredInput: true,
          value: false,
        },
      },
    ],
    [
      "Angular input transform",
      {
        actual: {
          pretty: findResolvedType(props.SignalHostComponent, "disabled")
            .prettyType,
          type: findResolvedType(props.SignalHostComponent, "disabled").type,
        },
        expected: {pretty: "boolean", type: "InputSignal<boolean>"},
      },
    ],
    [
      "Angular input default value",
      {
        actual: findProp(
          props.SignalHostComponent,
          "disabled",
        )?.defaultValue?.trim(),
        expected: "false",
      },
    ],
    [
      "Angular model and output signals",
      {
        actual: [
          findResolvedType(props.SignalHostComponent, "value").prettyType,
          findResolvedType(props.SignalHostComponent, "checked").prettyType,
          findResolvedType(props.SignalHostComponent, "valueChanged")
            .prettyType,
        ],
        expected: ["string", "boolean", "string"],
      },
    ],
    [
      "Angular deprecated method",
      {
        actual: findResolvedType(props.SignalHostComponent, "reset").deprecated,
        expected: true,
      },
    ],
    [
      "Angular structural directive inputs",
      {
        actual: props.RenderItemDirective.input?.map((p) => p.name).sort(),
        expected: ["componentInput", "item"],
      },
    ],
    [
      "Angular inputs inherit comments from implemented types",
      {
        actual: (props.ItemDirective.input ?? []).map((p) => [
          p.name,
          p.comment?.summary.map((part) => part.text).join(""),
        ]),
        expected: [
          ["dir", "The reading direction of the item."],
          ["disabled", "Whether the item is disabled."],
        ],
      },
    ],
    [
      "Angular signal input imports the written type argument",
      {
        actual: {
          importStatement: findResolvedType(props.ItemDirective, "dir")
            .importStatement,
          reference: findResolvedType(props.ItemDirective, "dir").reference,
        },
        expected: {
          importStatement:
            "import {ItemDirection} from '@qualcomm-ui/typescoop/tests/src/package-3/angular-signals.ts'",
          reference: "ItemDirection",
        },
      },
    ],
    [
      "collapsedPrettyType keeps inlined refs by name",
      {
        actual: {
          children: findResolvedType(props.DashCasedRenderPropHost, "children")
            .collapsedPrettyType,
          documented: findResolvedType(props.MappedAliasHost, "documented")
            .collapsedPrettyType,
          functionAlias:
            props.InheritDocSignature.resolvedType?.collapsedPrettyType,
          generic: findResolvedType(props.MappedAliasHost, "generic")
            .collapsedPrettyType,
          long: findResolvedType(props.MappedAliasHost, "long")
            .collapsedPrettyType,
        },
        expected: {
          children:
            "| string\n| ((\n    props: DashCasedBindingProps,\n  ) => string)",
          documented: "TestDocumentedReferenceAlias",
          functionAlias: "() => SomeNestedType",
          generic: "TestGenericRecordAlias<'a'>",
          long: undefined,
        },
      },
    ],
    [
      "collapsedType is the one-line form of collapsedPrettyType",
      {
        actual: {
          children: findResolvedType(props.DashCasedRenderPropHost, "children")
            .collapsedType,
          functionAlias: props.InheritDocSignature.resolvedType?.collapsedType,
          long: findResolvedType(props.MappedAliasHost, "long").collapsedType,
        },
        expected: {
          children: "string | ((props: DashCasedBindingProps) => string)",
          functionAlias: "() => SomeNestedType",
          long: undefined,
        },
      },
    ],
    [
      "refs declare the named types printed by name",
      {
        actual: {
          collection: parseResult.refs.RefCardCollection,
          options: parseResult.refs.RefCardOptions,
          tree: parseResult.refs.RefCardTree?.prettyType,
        },
        expected: {
          collection: {
            prettyType: "class RefCardCollection<T = string>",
            summary: [
              {kind: "text", text: "A collection shown in a ref card."},
            ],
          },
          options: {
            prettyType: [
              "interface RefCardOptions {",
              "  /**",
              "   * Where the card lines up against its trigger, at the start or at the end.",
              "   */",
              "  align?: 'start' | 'end'",
              "  density?: 'compact' | 'default'",
              "  /**",
              "   * The emphasis of the card. Brand cards draw more attention, so use them",
              "   * sparingly, as the emphasis guidelines describe.",
              "   */",
              "  emphasis?: 'neutral' | 'brand'",
              "  /** The text of the card. */",
              "  label: string",
              "  placement?: 'top' | 'bottom'",
              "  /** The size of the card. */",
              "  size?: 'sm' | 'md'",
              "  width?: number",
              "}",
            ].join("\n"),
            summary: [{kind: "text", text: "Display options of a ref card."}],
          },
          tree: [
            "interface RefCardTree {",
            "  /** The root node of the tree. */",
            "  root: {children?: RefCardTree['root'][]; label: string}",
            "}",
          ].join("\n"),
        },
      },
    ],
    [
      "docLink from referenced type",
      {
        actual: findResolvedType(props.LinkHost, "linked").docLink,
        expected: "/components/linked#api",
      },
    ],
    [
      "inheritDoc reference keeps name and docLink",
      {
        actual: {
          docLink: findResolvedType(props.LinkHost, "named").docLink,
          inheritDoc: findResolvedType(props.LinkHost, "named").inheritDoc,
          type: findResolvedType(props.LinkHost, "named").type,
        },
        expected: {
          docLink: "/components/linked#api",
          inheritDoc: true,
          type: "LinkedType",
        },
      },
    ],
    [
      "deprecated prop",
      {
        actual: findResolvedType(props.LinkHost, "old").deprecated,
        expected: true,
      },
    ],
    [
      "importResolver receives package info",
      {
        actual: findResolvedType(props.LinkHost, "linked").importStatement,
        expected:
          "import {LinkedType} from '@qualcomm-ui/typescoop/tests/src/package-1/links.ts'",
      },
    ],
    [
      "@internal excludes entities",
      {
        actual: "InternalEntity" in interfaces,
        expected: false,
      },
    ],
    [
      "@internal excludes members",
      {
        actual: props.VisibilityHost.props?.map((prop) => prop.name),
        expected: ["shown"],
      },
    ],
    [
      "function with only @public is documented",
      {
        actual: {
          publicOnly: "publicOnlyFunction" in interfaces,
          undocumented: "undocumentedFunction" in interfaces,
        },
        expected: {publicOnly: true, undocumented: false},
      },
    ],
  ]
}

describe("@qualcomm-ui/typescoop", async () => {
  const config: BuildOptions = {
    entryPoints: [
      resolve(__dirname, "./src/package-1/index.ts"),
      resolve(__dirname, "./src/package-2/index.ts"),
      resolve(__dirname, "./src/package-3/index.ts"),
    ],
    importResolver: ({name, packageName, packagePath}) =>
      `import {${name}} from '${packageName}/${packagePath}'`,
    outputFile: resolve(__dirname, "./temp/doc-props.json"),
    prettyJson: true,
    tsconfig: resolve(__dirname, "../tsconfig.typescoop.json"),
  }

  const result = await build(config)

  if (!result) {
    throw new Error("Project JSON not found.")
  }

  writeFileSync(
    resolve(__dirname, "./temp/interfaces.json"),
    JSON.stringify(result.knownInterfaces, null, 2),
  )

  test("export exists", () => {
    expect(readFileSync(config.outputFile!), "utf-8").length.gt(0)
  })

  for (const [title, {actual, expected}] of getTestCases(result)) {
    const testFn = () => expect(actual).deep.eq(expected)

    test(title, testFn)
  }
})
