import type {Plugin} from "vite"

import {buildSemanticSearchArtifact} from "./semantic-search-builder.server.js"

export const semanticSearchServerDependencies = [
  "@huggingface/transformers",
  "@orama/orama",
] as const

const semanticSearchServerPackage = "@qualcomm-ui/react-router-utils"

export interface SemanticSearchDevPluginOptions {
  outputDirectory: string
  sectionsPath: string
}

export function semanticSearchDevPlugin({
  outputDirectory,
  sectionsPath,
}: SemanticSearchDevPluginOptions): Plugin {
  let timeout: ReturnType<typeof setTimeout> | undefined
  let rebuildInProgress = false
  let rebuildQueued = false

  const scheduleRebuild = (onError: (error: unknown) => void): void => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      void rebuild(onError)
    }, 100)
  }

  const rebuild = async (onError: (error: unknown) => void): Promise<void> => {
    if (rebuildInProgress) {
      rebuildQueued = true
      return
    }

    rebuildInProgress = true
    try {
      await buildSemanticSearchArtifact({outputDirectory, sectionsPath})
    } catch (error) {
      onError(error)
    } finally {
      rebuildInProgress = false
      if (rebuildQueued) {
        rebuildQueued = false
        scheduleRebuild(onError)
      }
    }
  }

  return {
    config() {
      return {
        ssr: {
          external: [
            semanticSearchServerPackage,
            ...semanticSearchServerDependencies,
          ],
        },
      }
    },
    configureServer(server) {
      const onError = (error: unknown) => {
        const message = error instanceof Error ? error.message : String(error)
        server.config.logger.error(
          `Unable to rebuild semantic search: ${message}`,
        )
      }
      const onSectionsChanged = (path: string) => {
        if (path === sectionsPath) {
          scheduleRebuild(onError)
        }
      }

      server.watcher.add(sectionsPath)
      server.watcher.on("add", onSectionsChanged)
      server.watcher.on("change", onSectionsChanged)
      scheduleRebuild(onError)

      server.httpServer?.once("close", () => {
        clearTimeout(timeout)
        server.watcher.off("add", onSectionsChanged)
        server.watcher.off("change", onSectionsChanged)
      })
    },
    name: "semantic-search-dev",
  }
}
