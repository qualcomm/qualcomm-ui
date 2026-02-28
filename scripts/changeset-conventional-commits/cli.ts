#! /usr/bin/env node

import {Command} from "@commander-js/extra-typings"
import {execSync} from "node:child_process"
import {stdin, stdout} from "node:process"
import {createInterface} from "node:readline/promises"

import {consolidateChangelogs} from "./consolidate-changelogs"
import {conventionalCommitChangeset} from "./main"

interface Step {
  description: string
  name: string
  run: () => void | Promise<void>
}

function buildSteps(options: {
  fromReleaseTags?: boolean
  includeCommitLinks?: boolean
  packageManager?: string
}): Step[] {
  const pm = options.packageManager ?? "pnpm"

  return [
    {
      description: "Generate changesets from conventional commits",
      name: "changeset-generate",
      run: () =>
        conventionalCommitChangeset({
          fromReleaseTags: options.fromReleaseTags,
          includeCommitLinks: options.includeCommitLinks,
        }),
    },
    {
      description: "Bump versions and generate changelogs",
      name: "bump",
      run: () => {
        execSync(`${pm} changeset version`, {stdio: "inherit"})
      },
    },
    {
      description: "Consolidate changelog formatting",
      name: "consolidate-changelogs",
      run: () => consolidateChangelogs(),
    },
  ]
}

async function waitForConfirmation(stepName: string): Promise<boolean> {
  const rl = createInterface({input: stdin, output: stdout})
  try {
    const answer = await rl.question(
      `\nStep "${stepName}" completed. Continue to next step? [Y/n] `,
    )
    return answer.trim().toLowerCase() !== "n"
  } finally {
    rl.close()
  }
}

async function run(options: {
  fromReleaseTags?: boolean
  includeCommitLinks?: boolean
  inSteps?: boolean
  packageManager?: string
}) {
  const steps = buildSteps(options)

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i]
    const stepLabel = `[${i + 1}/${steps.length}]`
    console.log(`\n${stepLabel} ${step.description}...`)

    try {
      await step.run()
    } catch {
      console.error(`\nStep "${step.name}" failed. Aborting prep-release.`)
      process.exit(1)
    }

    if (options.inSteps && i < steps.length - 1) {
      const shouldContinue = await waitForConfirmation(step.name)
      if (!shouldContinue) {
        console.log("Aborted by user.")
        process.exit(0)
      }
    }
  }

  console.log("\nAll prep-release steps completed.")
}

const program = new Command()
  .name("prep-release")
  .description("Run all prep-release steps sequentially")
  .option(
    "--in-steps",
    "Pause after each step and wait for confirmation before continuing",
    false,
  )
  .option(
    "--from-release-tags",
    "Diff each package from its most recent release tag instead of the base branch",
    false,
  )
  .option(
    "--include-commit-links",
    "Embed commit hashes in changeset summaries for changelog links",
    false,
  )
  .option(
    "--package-manager <command>",
    "Package manager command to use for changeset version",
    "pnpm",
  )
  .action((options) => run(options))

program.parse()
