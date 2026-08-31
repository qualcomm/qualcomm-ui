import {dirname, resolve} from "node:path"
import {fileURLToPath} from "node:url"

import {
  createSemanticSearchAction,
  createSemanticSearchServiceResolver,
  resolveSemanticSearchArtifactDirectory,
} from "@qualcomm-ui/react-router-utils/node"

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..")

export const action = createSemanticSearchAction(
  createSemanticSearchServiceResolver({
    artifactDirectory: resolveSemanticSearchArtifactDirectory(projectRoot),
  }),
)
