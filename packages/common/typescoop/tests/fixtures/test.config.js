/** @type {import("../../src").BuildOptions} */
const config = {
  entryPoints: [
    "./src/package1/index.ts",
    "./src/package2/index.ts",
    "./src/package3/index.ts",
  ],
  outputFile: "./temp/doc-props.json",
  tsconfig: "tsconfig.typescoop.json",
}

export default config
