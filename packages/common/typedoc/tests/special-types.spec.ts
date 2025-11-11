import {readFileSync} from "node:fs"
import {resolve} from "path"
import {describe, expect, test} from "vitest"

import type {ResolvedBuildOptions} from "../src"
import {build} from "../src/internal"

// TODO: fix union issue with specific functions
describe("Special Types", async () => {
  const config: ResolvedBuildOptions = {
    apiFile: resolve(__dirname, "./temp/special-api.json"),
    outputFile: resolve(__dirname, "./temp/special-props.json"),
    prettyJson: true,
    typedocOptions: {
      excludeNotDocumented: true,
      excludeNotDocumentedKinds: [
        "Module",
        "Namespace",
        "Variable",
        "Function",
        "Class",
        "Constructor",
        "Method",
        "CallSignature",
        "IndexSignature",
        "ConstructorSignature",
        "Accessor",
        "GetSignature",
        "SetSignature",
        "Reference",
      ],
      tsconfig: resolve(__dirname, "../tsconfig.typedoc.json"),
    },
  }

  const result = await build(config)

  if (!result) {
    expect.fail("No build found")
  }

  test("export exists", async () => {
    expect(readFileSync(config.outputFile), "utf-8").length.gt(0)
  })

  test("known interfaces", async () => {
    expect(result.knownInterfaces.CloudDocsSdk).toBeTruthy()
  })

  test("class method parameters", () => {
    const cloudDocsSdk = result.types.CloudDocsSdk
    if (!cloudDocsSdk?.props) {
      expect.fail("No types found")
    }
    expect(cloudDocsSdk.props[1].name).toEqual("uploadFiles")
    expect(cloudDocsSdk.props[1].resolvedType.prettyType).toEqual(
      "(\n  {\n    archivePath: string\n    environment:\n      | 'test'\n      | 'stage'\n      | 'prod'\n    service: string\n  },\n  {\n    environment:\n      | 'test'\n      | 'stage'\n      | 'prod'\n    service: string\n  },\n) => Promise<boolean>",
    )
  })

  test("special union", async () => {
    if (!result?.types?.SpecialTypes?.props) {
      expect.fail("No types found")
    }
    expect(result.types.SpecialTypes.props[0].resolvedType.prettyType).toEqual(
      "| 'vite-generouted'\n| ((\n    filePath: string,\n    pageDirectory: string,\n  ) => string[])",
    )
  })

  test("const enum", async () => {
    if (!result?.types?.SpecialTypes?.props) {
      expect.fail("No types found")
    }
    expect(result.types.EnumInterface).toBeTruthy()
    expect(
      result.types.EnumInterface.props?.[0].resolvedType.prettyType,
    ).toEqual(
      "{\n  CONFLICTS: 'conflicts'\n  FILE_MISSING: 'file-missing'\n  INCOMPLETE: 'incomplete'\n  VALID: 'valid'\n}",
    )
  })
})
