/** @type {import("../../src").BuildOptions} */
const config = {
  apiFile: "./temp/api.json",
  outputFile: "./temp/doc-props.json",
  typedocOptions: {
    entryPoints: [
      "./src/package1/index.ts",
      "./src/package2/index.ts",
      "./src/package3/index.ts",
    ],
    tsconfig: "tsconfig.typedoc.json",
  },
}

export default config
