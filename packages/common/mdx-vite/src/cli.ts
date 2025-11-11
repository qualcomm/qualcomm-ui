// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {program} from "@commander-js/extra-typings"

import {addDownloadKnowledgeCommand} from "./open-web-ui-knowledge/download-knowledge"
import {addGenerateKnowledgeCommand} from "./open-web-ui-knowledge/generate-knowledge"
import {addUploadKnowledgeCommand} from "./open-web-ui-knowledge/upload-knowledge"
import {addGenerateLazyDemoMapCommand} from "./react-demo-plugin/generate-lazy-demo-map"

function setupCli() {
  // global options
  program.option("--env <envFile>", "relative path to the env file to use")

  addGenerateKnowledgeCommand()
  addUploadKnowledgeCommand()
  addDownloadKnowledgeCommand()
  addGenerateLazyDemoMapCommand()

  program.parse()
}

setupCli()
