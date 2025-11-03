import {constants} from "node:fs"
import {access, chmod, mkdir, writeFile} from "node:fs/promises"
import {dirname, join, resolve} from "node:path"
import {fileURLToPath} from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))

const packages = ["packages/common/typedoc", "packages/common/codemod"].map(
  (pkg) => resolve(__dirname, "../", pkg),
)

async function createStub(filePath) {
  await mkdir(join(filePath, "dist"), {recursive: true})

  const cliPath = join(filePath, "dist", "cli.cjs")

  try {
    await access(cliPath, constants.F_OK)
  } catch {
    await writeFile(
      cliPath,
      `#!/usr/bin/env node
console.error('Run pnpm build in @qui/codemod first');
process.exit(1);
`,
      "utf-8",
    )
    await chmod(cliPath, 0o755)
  }
}

await Promise.all(packages.map(createStub))
