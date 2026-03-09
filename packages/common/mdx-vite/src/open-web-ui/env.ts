// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {program} from "@commander-js/extra-typings"
import {config} from "dotenv"

interface GlobalCliOpts {
  env?: string
}

export function loadEnv() {
  const options: GlobalCliOpts = program.optsWithGlobals()
  if (options.env) {
    config({path: options.env, quiet: true})
  } else {
    config({quiet: true})
  }
}

export interface SharedConfig {
  knowledgeId: string
  webUiKey: string
  webUiUrl: string
}

/**
 * Gets OpenWebUI credentials from environment variables.
 */
export function getConfigFromEnv(): SharedConfig {
  const openWebUiUrl = process.env.WEB_UI_URL || process.env.OPEN_WEB_UI_URL
  const openWebUiKey = process.env.WEB_UI_KEY || process.env.OPEN_WEB_UI_API_KEY
  const knowledgeId =
    process.env.KNOWLEDGE_ID || process.env.OPEN_WEB_UI_KNOWLEDGE_ID

  if (!openWebUiUrl || !openWebUiKey || !knowledgeId) {
    throw new Error("WEB_UI_URL, WEB_UI_KEY, and KNOWLEDGE_ID must be set")
  }
  return {
    knowledgeId,
    webUiKey: openWebUiKey,
    webUiUrl: openWebUiUrl,
  }
}
