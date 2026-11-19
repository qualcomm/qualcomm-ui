import {readFileSync} from "node:fs"
import {resolve} from "node:path"
import {describe, expect, test} from "vitest"

import type {ResolvedBuildOptions} from "../src"
import {build} from "../src/internal"

// TODO: fix union issue with specific functions
describe("Special Types", async () => {
  const config: ResolvedBuildOptions = {
    outputFile: resolve(__dirname, "./temp/special-props.json"),
    prettyJson: true,
    tsconfig: resolve(__dirname, "../tsconfig.typescoop.json"),
  }

  const result = await build(config)

  if (!result) {
    expect.fail("No build found")
  }

  test("export exists", () => {
    expect(readFileSync(config.outputFile), "utf-8").length.gt(0)
  })

  test("known interfaces", () => {
    expect(result.knownInterfaces.CloudDocsSdk).toBeTruthy()
  })

  test("class method parameters", () => {
    const cloudDocsSdk = result.types.CloudDocsSdk
    if (!cloudDocsSdk?.props) {
      expect.fail("No types found")
    }
    expect(cloudDocsSdk.props[1].name).toEqual("uploadFiles")
    expect(cloudDocsSdk.props[1].resolvedType.prettyType).toEqual(
      "(\n  {\n    archivePath: string\n    environment:\n      | 'test'\n      | 'stage'\n      | 'prod'\n    service: string\n  },\n  getFilesOptions: {\n    environment:\n      | 'test'\n      | 'stage'\n      | 'prod'\n    service: string\n  },\n) => boolean",
    )
  })

  test("inline object limits are configurable", async () => {
    const limited = await build({
      ...config,
      inlineObjects: {maxLength: 60, maxMembers: 4},
      outputFile: resolve(__dirname, "./temp/special-props-limited.json"),
    })
    const uploadFiles = limited?.types.CloudDocsSdk?.props?.[1]
    expect(uploadFiles?.resolvedType.prettyType).toEqual(
      "(\n  UploadFileOptions,\n  getFilesOptions: {\n    environment:\n      | 'test'\n      | 'stage'\n      | 'prod'\n    service: string\n  },\n) => boolean",
    )
    const {inlineObjects, prettyType} = uploadFiles!.resolvedType
    expect(
      inlineObjects?.map(({end, inlined, name, start}) => ({
        inlined,
        name,
        text: prettyType?.slice(start, end),
      })),
    ).toEqual([
      {inlined: false, name: "UploadFileOptions", text: "UploadFileOptions"},
      {
        inlined: true,
        name: "GetFilesOptions",
        text: "{\n    environment:\n      | 'test'\n      | 'stage'\n      | 'prod'\n    service: string\n  }",
      },
    ])
  })

  test("invalid inline object limits are rejected", async () => {
    await expect(
      build({...config, inlineObjects: {maxLength: -1}}),
    ).rejects.toThrow("inlineObjects.maxLength must be a non-negative integer")
  })

  test("special union", () => {
    if (!result?.types?.SpecialTypes?.props) {
      expect.fail("No types found")
    }
    expect(result.types.SpecialTypes.props[0].resolvedType.prettyType).toEqual(
      "| 'vite-generouted'\n| ((\n    filePath: string,\n    pageDirectory: string,\n  ) => string[])",
    )
  })

  test("destructured parameters of nested functions", () => {
    const resolvedType =
      result.types.NestedDestructuring?.props?.[0].resolvedType
    expect(resolvedType?.prettyType).toEqual(
      "(\n  listener: ({\n    id: string\n    label: string\n  }) => void,\n) => void",
    )
    expect(resolvedType?.type).toEqual(
      "(listener: ({id: string; label: string;}) => void) => void",
    )
  })

  test("const enum", () => {
    if (!result?.types?.SpecialTypes?.props) {
      expect.fail("No types found")
    }
    expect(result.types.EnumInterface).toBeTruthy()
    expect(
      result.types.EnumInterface.props?.[0].resolvedType.prettyType,
    ).toEqual("| 'conflicts'\n| 'file-missing'\n| 'incomplete'\n| 'valid'")
  })
})
