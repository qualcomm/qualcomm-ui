// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Option, program} from "@commander-js/extra-typings"
import chalk from "chalk"
import {glob} from "glob"
import {resolve} from "node:path"
import {cwd as processCwd} from "node:process"

import {
  ConfigLoader,
  type LintSeverity,
  type QuiDocsLintOptions,
  resolveLintOptions,
} from "./config/index.js"
import {resolveDocProps} from "./generate-page-map.js"
import {fixPath} from "./path-utils.js"
import {SearchIndexer} from "./search-indexer.js"

export type LintRule = keyof QuiDocsLintOptions

const lintRules = [
  "brokenLinks",
  "fileLinks",
  "pageTitle",
] as const satisfies LintRule[]

export interface DisabledLintRule {
  rule: LintRule
  /**
   * Where the rule was turned off: the rule's default, the config file, or a
   * command option.
   */
  source: "config" | "default" | "option"
}

export interface LintPagesOptions {
  /**
   * Path to the qui-docs config file. This is automatically detected if omitted.
   */
  configFile?: string
  /**
   * Directory that the config's `appDirectory`, `typeDocProps`, and
   * {@link publicDir} resolve against.
   *
   * @default process.cwd()
   */
  cwd?: string
  /**
   * Static asset directory. Links to files in this directory pass link
   * validation.
   *
   * @default "public"
   */
  publicDir?: string
  /**
   * Per-rule severities that take precedence over the config file and
   * {@link warn}.
   */
  rules?: QuiDocsLintOptions
  /**
   * Report issues from enabled rules as warnings instead of errors.
   */
  warn?: boolean
}

export interface LintPagesResult {
  /** Rules that were skipped because they're turned off. */
  disabledRules: DisabledLintRule[]
  /** Number of issues reported as errors. */
  errorCount: number
  /** Number of indexed MDX pages. */
  pageCount: number
  /** Number of issues reported as warnings. */
  warningCount: number
}

/**
 * Resolves the severity of each rule for the `lint` command from the `lint`
 * option as written in the config file. Every rule that isn't turned off in the
 * config or by default reports errors, so rules added in later releases run
 * without changes to existing scripts. Per-rule options take precedence over
 * the config and `warn`.
 */
export function resolveLintCommandRules(
  configured: QuiDocsLintOptions,
  options: Pick<LintPagesOptions, "rules" | "warn"> = {},
): {disabledRules: DisabledLintRule[]; lint: Required<QuiDocsLintOptions>} {
  const enabledSeverity: LintSeverity = options.warn ? "warn" : "error"
  const resolved = resolveLintOptions({lint: configured})
  const disabledRules: DisabledLintRule[] = []
  const lint = {} as Required<QuiDocsLintOptions>

  for (const rule of lintRules) {
    const override = options.rules?.[rule]
    if (override) {
      lint[rule] = override
    } else {
      lint[rule] = resolved[rule] === "off" ? "off" : enabledSeverity
    }
    if (lint[rule] === "off") {
      disabledRules.push({
        rule,
        source: override ? "option" : configured[rule] ? "config" : "default",
      })
    }
  }

  return {disabledRules, lint}
}

/**
 * Runs the rules from the qui-docs config's `lint` option against every MDX
 * page without a Vite build. Issues are logged as they're found.
 */
export async function lintPages(
  options: LintPagesOptions = {},
): Promise<LintPagesResult> {
  const cwd = options.cwd ?? processCwd()
  const resolvedConfig = new ConfigLoader({
    configFile: options.configFile,
  }).loadConfig()
  const {disabledRules, lint} = resolveLintCommandRules(
    resolvedConfig.configuredLint,
    options,
  )
  const routesDir = fixPath(
    resolve(cwd, resolvedConfig.appDirectory, resolvedConfig.pageDirectory),
  )
  const indexer = new SearchIndexer({
    ...resolvedConfig,
    lint,
    publicDir: fixPath(resolve(cwd, options.publicDir ?? "public")),
    srcDir: fixPath(resolve(cwd, resolvedConfig.appDirectory)),
    typeDocProps: await resolveDocProps(resolvedConfig, cwd),
  })
  const files = await glob([`${routesDir}/**/*.mdx`, `${routesDir}/**/*.tsx`], {
    absolute: true,
    cwd,
  })
  indexer.buildIndex(files, false)

  return {
    disabledRules,
    // invalid _nav.json files aren't a lint rule, so --warn doesn't apply to them.
    errorCount: indexer.lintErrorCount + indexer.navConfigErrorCount,
    pageCount: indexer.mdxFileCount,
    warningCount: indexer.lintWarningCount,
  }
}

const severities = ["off", "warn", "error"] as const satisfies LintSeverity[]

const disabledRuleLabels: Record<DisabledLintRule["source"], string> = {
  config: "(disabled from config file)",
  default: "(disabled by default)",
  option: "(disabled from command flag)",
}

function lintRuleOption<Flags extends string>(flags: Flags, rule: LintRule) {
  return new Option(
    flags,
    `Overrides the lint.${rule} severity from the config file`,
  ).choices(severities)
}

function pluralize(count: number, word: string): string {
  return `${count} ${word}${count === 1 ? "" : "s"}`
}

export function addLintCommand(): void {
  program
    .command("lint")
    .description(
      "Runs the rules from the config's lint option against every MDX page. Issues from rules that aren't turned off are errors and exit with code 1",
    )
    .option(
      "-c, --config-file <configFile>",
      "Path to the qui-docs.config.ts config file",
    )
    .option(
      "-p, --public-dir <publicDir>",
      "Static asset directory that links may point to",
      "public",
    )
    .addOption(lintRuleOption("--broken-links <severity>", "brokenLinks"))
    .addOption(lintRuleOption("--file-links <severity>", "fileLinks"))
    .addOption(lintRuleOption("--page-title <severity>", "pageTitle"))
    .option(
      "--warn",
      "Report issues as warnings and exit with code 0, except for rules set by their own option",
    )
    .action(async (options) => {
      try {
        const {disabledRules, errorCount, pageCount, warningCount} =
          await lintPages({
            configFile: options.configFile,
            publicDir: options.publicDir,
            rules: {
              brokenLinks: options.brokenLinks,
              fileLinks: options.fileLinks,
              pageTitle: options.pageTitle,
            },
            warn: options.warn,
          })

        if (disabledRules.length) {
          console.log(
            chalk.yellowBright.bold(
              `Skipped ${pluralize(disabledRules.length, "rule")}:`,
            ),
          )
          for (const {rule, source} of disabledRules) {
            console.log(`  ${rule} ${chalk.dim(disabledRuleLabels[source])}`)
          }
        }

        const summary = `Checked ${pluralize(pageCount, "page")}: ${pluralize(errorCount, "error")}, ${pluralize(warningCount, "warning")}.`
        if (errorCount) {
          console.error(chalk.redBright.bold(summary))
          process.exit(1)
        }
        console.log(
          warningCount
            ? chalk.yellowBright.bold(summary)
            : chalk.greenBright.bold(summary),
        )
      } catch (error) {
        console.error(
          "Lint Error:",
          error instanceof Error ? error.message : String(error),
        )
        process.exit(1)
      }
    })
}
