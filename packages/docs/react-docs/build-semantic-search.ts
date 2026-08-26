import {resolve} from "node:path"

import {
  buildSemanticSearchArtifact,
  resolveSemanticSearchPaths,
} from "@qualcomm-ui/react-router-utils/node"

import quiDocsConfig from "./qui-docs.config.js"

const {sectionsPath} = resolveSemanticSearchPaths(quiDocsConfig.knowledge)
const result = await buildSemanticSearchArtifact({
  outputDirectory: resolve("build/server/semantic-search"),
  sectionsPath,
})

console.log(
  `Built semantic search artifact with ${result.embeddedSectionCount} embedded and ${result.reusedSectionCount} reused sections.`,
)
