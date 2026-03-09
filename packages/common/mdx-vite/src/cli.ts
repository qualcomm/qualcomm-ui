// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {program} from "@commander-js/extra-typings"

import {addGeneratePageMapCommand} from "./docs-plugin/generate-page-map"
import {addDownloadKnowledgeCommand} from "./open-web-ui/download-knowledge"
import {addUploadKnowledgeCommand} from "./open-web-ui/upload-knowledge"

function setupCli() {
  // global options
  program.option("--env <envFile>", "relative path to the env file to use")

  addUploadKnowledgeCommand()
  addDownloadKnowledgeCommand()
  addGeneratePageMapCommand()

  program.parse()
}

setupCli()
