import {execa} from "execa"
import {access, mkdir, readdir, writeFile} from "node:fs/promises"
import {dirname, resolve} from "node:path"
import process from "node:process"
import {fileURLToPath} from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))

const cwd = resolve(__dirname, "../")

/**
 * Turbo runs package build scripts through pnpm. During postinstall, those
 * nested pnpm calls can re-enter the root postinstall script before running the
 * package build. This guard lets the nested invocation complete lightweight
 * setup while preventing it from launching another Turbo build recursively.
 */
const postinstallRunningEnvVar = "QUI_POSTINSTALL_RUNNING"
const isNestedPostinstall = process.env[postinstallRunningEnvVar] === "1"

/**
 * async version of the fs.exists module.
 */
async function exists(path, mode) {
  return access(path, mode)
    .then(() => true)
    .catch(() => false)
}

async function initTypeDocFiles() {
  const pkgPath = resolve(cwd, "packages/docs")
  const docsPackages = (await readdir(pkgPath, {withFileTypes: true})).filter(
    (dirent) => dirent.isDirectory(),
  )
  await Promise.all(
    docsPackages.map(async (dirent) => {
      const path = resolve(cwd, pkgPath, dirent.name)
      const typedocPath = resolve(path, ".typedoc")
      const docPropsPath = resolve(path, ".typedoc/doc-props.json")

      if (
        !(await exists(docPropsPath)) &&
        (await exists(resolve(pkgPath, "package.json")))
      ) {
        await mkdir(typedocPath, {recursive: true})
        await writeFile(docPropsPath, JSON.stringify({props: {}}), "utf-8")
      }
    }),
  )
}

async function runNodeScript(scriptPath, args, options = {}) {
  await execa(process.execPath, [scriptPath, ...args], {
    cwd,
    env: {
      [postinstallRunningEnvVar]: "1",
    },
    stdio: "inherit",
    ...options,
  })
}

/**
 * Build the config packages through Turbo so postinstall benefits from Turbo's
 * cache and dependency graph instead of rebuilding these packages every
 * install.
 */
async function buildConfigsIfNeeded() {
  const packageFolders = [
    "eslint-config-mdx",
    "eslint-plugin-angular",
    "eslint-plugin-react",
  ]

  await runNodeScript("node_modules/turbo/bin/turbo", [
    "build",
    "--env-mode=loose",
    ...packageFolders.map((pkg) => `--filter=@qualcomm-ui/${pkg}`),
  ])
}

async function runPostInstall() {
  await initTypeDocFiles()

  if (isNestedPostinstall) {
    return
  }

  await buildConfigsIfNeeded()
}

await runPostInstall()
