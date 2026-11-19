import {readFileSync, writeFileSync} from "node:fs"
import {resolve} from "node:path"
import {describe, expect, test} from "vitest"

import type {QuiPropTypes, SerializedType} from "@qualcomm-ui/typedoc-common"

import type {BuildOptions} from "../src"
import {build, type ParseResult} from "../src/internal"

type TestCase = [
  string,
  {
    actual: string | null | undefined | object
    expected: string | null | undefined | object
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
        actual: interfaces.TestUnionA.resolvedType.type,
        expected: `'a' | 'b' | 'c'`,
      },
    ],
    [
      "TestGeneric1",
      {
        actual: interfaces.TestGeneric1.resolvedType.prettyType,
        expected:
          "(\n  options: Array<T>,\n  inputValue: string,\n) => Array<T>",
      },
    ],
    [
      "TestTemplateLiteral1",
      {
        actual: interfaces.TestTemplateLiteral1.resolvedType.type,
        expected: "`${string}.${number}`",
      },
    ],
    [
      "DashCasedBindingProps",
      {
        actual: interfaces.DashCasedBindingProps.resolvedType.type,
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
        actual: interfaces.TestTuple1.resolvedType.type,
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
        actual: interfaces.IntersectionSignature1.resolvedType.type,
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
      "union aliases expand in expandedType",
      {
        actual: ["min", "value"].map((name) => {
          const {expandedType, type} = findResolvedType(props.DateHost, name)
          return {expandedType, type}
        }),
        expected: [
          {expandedType: "CalendarA | CalendarB", type: "AnyCalendar"},
          {
            expandedType: undefined,
            type: "Array<CalendarA | CalendarB | null>",
          },
        ],
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
