// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {mkdir, readFile, rename, writeFile} from "node:fs/promises"
import {dirname} from "node:path"

import {
  parseSemanticSearchArtifact,
  type SemanticSearchArtifact,
} from "./semantic-search-artifact.js"

export async function readSemanticSearchArtifact(
  artifactPath: string,
): Promise<SemanticSearchArtifact> {
  const contents = await readFile(artifactPath, "utf8")
  return parseSemanticSearchArtifact(JSON.parse(contents))
}

export async function writeSemanticSearchArtifactAtomically(
  artifactPath: string,
  artifact: SemanticSearchArtifact,
): Promise<void> {
  await mkdir(dirname(artifactPath), {recursive: true})

  const temporaryPath = `${artifactPath}.${process.pid}.${Date.now()}.tmp`
  await writeFile(temporaryPath, JSON.stringify(artifact), "utf8")
  await rename(temporaryPath, artifactPath)
}
