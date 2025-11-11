import {readFileSync, writeFileSync} from "node:fs"
import {resolve} from "path"
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
        expected:
          "(options: Array<string>, inputValue: string) => Array<string>",
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
        actual: findResolvedType(props.SomeClass, "testMethod").parameters?.[0]
          ?.summary,
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
  ]
}

describe("@qualcomm-ui/typedoc", async () => {
  const config: BuildOptions = {
    apiFile: resolve(__dirname, "./temp/api.json"),
    outputFile: resolve(__dirname, "./temp/doc-props.json"),
    prettyJson: true,
    typedocOptions: {
      entryPoints: [
        resolve(__dirname, "./src/package-1/index.ts"),
        resolve(__dirname, "./src/package-2/index.ts"),
        resolve(__dirname, "./src/package-3/index.ts"),
      ],
      tsconfig: resolve(__dirname, "../tsconfig.typedoc.json"),
    },
  }

  const result = await build(config)

  if (!result) {
    throw new Error("Project JSON not found.")
  }

  writeFileSync(
    resolve(__dirname, "./temp/interfaces.json"),
    JSON.stringify(result.knownInterfaces, null, 2),
  )

  test("export exists", async () => {
    expect(readFileSync(config.outputFile!), "utf-8").length.gt(0)
  })

  for (const [title, {actual, expected}] of getTestCases(result)) {
    const testFn = () => expect(actual).deep.eq(expected)

    test(title, testFn)
  }
})
