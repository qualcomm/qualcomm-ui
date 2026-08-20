import {mkdir} from "node:fs/promises"
import {join} from "node:path"

import {env, pipeline} from "@huggingface/transformers"

import {
  semanticSearchModel,
  type SemanticSearchModelMetadata,
} from "./semantic-search-artifact.js"

export interface SemanticSearchEncoder {
  embed(text: string[]): Promise<number[][]>
  model: SemanticSearchModelMetadata
}

export interface TransformerSemanticSearchEncoderOptions {
  cacheDirectory: string
  localFilesOnly: boolean
}

export async function createTransformerSemanticSearchEncoder({
  cacheDirectory,
  localFilesOnly,
}: TransformerSemanticSearchEncoderOptions): Promise<SemanticSearchEncoder> {
  await mkdir(cacheDirectory, {recursive: true})

  env.allowLocalModels = true
  env.allowRemoteModels = !localFilesOnly
  env.cacheDir = cacheDirectory
  env.useFS = true
  env.useFSCache = true

  // Transformers 4.2 cannot resolve a revision-pinned tokenizer from its cache
  // by model ID, so the offline server uses the cache's revision directory.
  const model = localFilesOnly
    ? join(
        cacheDirectory,
        semanticSearchModel.id,
        semanticSearchModel.revision,
      )
    : semanticSearchModel.id
  const extractor = await pipeline("feature-extraction", model, {
    cache_dir: cacheDirectory,
    dtype: semanticSearchModel.dtype,
    local_files_only: localFilesOnly,
    revision: semanticSearchModel.revision,
  })

  return {
    async embed(text: string[]): Promise<number[][]> {
      if (text.length === 0) {
        return []
      }

      const output = await extractor(text, {
        normalize: semanticSearchModel.normalized,
        pooling: semanticSearchModel.pooling,
      })
      const {data, dims} = output

      if (
        dims.length !== 2 ||
        dims[0] !== text.length ||
        dims[1] !== semanticSearchModel.dimensions
      ) {
        throw new Error("Semantic search encoder returned an unexpected shape.")
      }

      return Array.from({length: text.length}, (_, index) => {
        const start = index * semanticSearchModel.dimensions
        const vector = Array.from(
          data.slice(start, start + semanticSearchModel.dimensions),
        )

        if (
          vector.length !== semanticSearchModel.dimensions ||
          vector.some((value) => !Number.isFinite(value))
        ) {
          throw new Error("Semantic search encoder returned an invalid vector.")
        }

        return vector
      })
    },
    model: semanticSearchModel,
  }
}
