import {glob} from "glob"
import {readFile} from "node:fs/promises"
import {dirname, relative} from "node:path"
import {cwd, exit} from "node:process"
import ts from "typescript"

const rootDirectory = cwd()

const configPattern = "**/tsconfig*.json"
const ignorePatterns = [
  "**/.turbo/**",
  "**/dist/**",
  "**/generated/**",
  "**/node_modules/**",
]

function formatDiagnostics(
  configPath: string,
  diagnostics: readonly ts.Diagnostic[],
): string {
  const host: ts.FormatDiagnosticsHost = {
    getCanonicalFileName: (fileName) => fileName,
    getCurrentDirectory: () => dirname(configPath),
    getNewLine: () => "\n",
  }

  return ts.formatDiagnosticsWithColorAndContext(diagnostics, host).trimEnd()
}

async function validateConfig(configPath: string): Promise<string | undefined> {
  const configText = await readFile(configPath, "utf-8")
  const configFile = ts.parseConfigFileTextToJson(configPath, configText)

  if (configFile.error) {
    return formatDiagnostics(configPath, [configFile.error])
  }

  const parsedConfig = ts.parseJsonConfigFileContent(
    configFile.config,
    ts.sys,
    dirname(configPath),
    undefined,
    configPath,
  )

  if (!parsedConfig.errors.length) {
    return undefined
  }

  return formatDiagnostics(configPath, parsedConfig.errors)
}

async function main() {
  const configPaths = await glob(configPattern, {
    absolute: true,
    cwd: rootDirectory,
    ignore: ignorePatterns,
    nodir: true,
  })

  const failures: string[] = []

  for (const configPath of configPaths.sort()) {
    const diagnostics = await validateConfig(configPath)

    if (!diagnostics) {
      continue
    }

    failures.push(
      [`Invalid tsconfig: ${relative(rootDirectory, configPath)}`, diagnostics]
        .filter(Boolean)
        .join("\n"),
    )
  }

  if (!failures.length) {
    console.log(`Validated ${configPaths.length} tsconfig files.`)
    return
  }

  console.error(failures.join("\n\n"))
  console.error(`\nFound ${failures.length} invalid tsconfig files.`)
  exit(1)
}

await main()
