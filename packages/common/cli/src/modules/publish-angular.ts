// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {program} from "@commander-js/extra-typings"
import chalk from "chalk"
import {execaCommandSync} from "execa"
import {existsSync, readFileSync, writeFileSync} from "node:fs"
import {resolve} from "node:path"

interface PublishAngularOpts {
  flatModuleId: string
}

export async function publishAngular({
  flatModuleId,
}: PublishAngularOpts): Promise<any> {
  let notYetPublished = false
  const outDir = resolve("./dist")
  if (!existsSync(outDir)) {
    console.log(
      "Error, expected a dist dir with output files. Failed to publish.",
    )
    return
  }
  const outPackage = resolve(outDir, "package.json")
  if (!existsSync(outPackage)) {
    console.log(
      "Error, expected a dist dir with package.json. Failed to publish.",
    )
    return
  }
  const pkgJson = JSON.parse(readFileSync(outPackage, "utf-8"))
  let check
  try {
    check = execaCommandSync(`pnpm view ${pkgJson.name}`, {
      stdio: "pipe",
    })
  } catch (e: any) {
    if (e.message && e.message.includes("is not in this registry.")) {
      notYetPublished = true
    }
    check = {stderr: "", stdout: ""}
  }

  // note: this will only check against 'latest', not 'next'.
  const latest = check.stdout
    .split("\n")
    .find((line) => line.startsWith("latest:"))

  if (!latest && !notYetPublished) {
    throw new Error(
      `Couldn't find latest published version for ${pkgJson.name}, exiting.`,
    )
  } else if (latest) {
    const latestVersion = latest?.substring(7).trim()

    if (latestVersion === pkgJson.version) {
      console.log(
        `${pkgJson.name}@${latestVersion} is already published. Exiting publish script.`,
      )
      return
    }
  }

  console.group(`Starting pre-publish for ${pkgJson.name}`)
  pkgJson.private = false
  pkgJson.types = "./index.d.ts"
  pkgJson.main = `./esm2022/${flatModuleId}.mjs`
  const peerDeps = {...pkgJson.peerDependencies}

  // replace workspace dependencies.
  if (Object.keys(peerDeps).length) {
    console.log("Adjusting peerDependencies")
    Object.keys(pkgJson.peerDependencies).forEach((key) => {
      if (peerDeps[key].includes("workspace:")) {
        const updatedPeerDep = peerDeps[key].replace("workspace:", "")
        console.log(
          `${key} changed from "${peerDeps[key]}" to "${updatedPeerDep}"`,
        )
        peerDeps[key] = updatedPeerDep
      }
    })
  }

  pkgJson.peerDependencies = peerDeps
  writeFileSync(outPackage, JSON.stringify(pkgJson, null, 2))

  console.log("Modified dist/package.json")

  try {
    const res = execaCommandSync("npm publish", {
      cwd: outDir,
      stderr: "ignore",
      stdin: "ignore",
    })
    if (res.stdout && res.stdout.includes(`+ ${pkgJson.name}`)) {
      console.debug(`${chalk.green("✔")} Successfully published package.`)
      console.debug(res.stdout)
    } else if (res.stderr) {
      console.debug(`${chalk.red("✖")} Failed to publish ${pkgJson.name}.`)
      console.debug(res.stderr)
    }
  } catch (e) {
    console.debug(`${chalk.red("✖")} Failed to publish ${pkgJson.name}.`)
  }
  console.groupEnd()
}

enum Commands {
  PUBLISH_ANGULAR = "publish-angular",
}

export function addPublishAngularCommands() {
  program
    .command(Commands.PUBLISH_ANGULAR)
    .argument("<flatModuleId>")
    .summary("Prepare a built Angular library for publishing to npm.")
    .action(async (flatModuleId): Promise<any> => {
      if (!flatModuleId) {
        // can't use requiredOption because it applies to every command.
        console.log("flatModuleId is required")
        return
      }
      return publishAngular({flatModuleId})
    })
}
