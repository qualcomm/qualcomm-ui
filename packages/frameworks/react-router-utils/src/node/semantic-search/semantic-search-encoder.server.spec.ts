import {mkdtemp, rm} from "node:fs/promises"
import {tmpdir} from "node:os"
import {join} from "node:path"

import {afterEach, describe, expect, test, vi} from "vitest"

const transformers = vi.hoisted(() => ({
  env: {},
  pipeline: vi.fn(),
}))

vi.mock("@huggingface/transformers", () => transformers)

import {
  createTransformerSemanticSearchEncoder,
} from "./semantic-search-encoder.server.js"
import {semanticSearchModel} from "./semantic-search-artifact.js"

let cacheDirectory: string | undefined

afterEach(async () => {
  transformers.pipeline.mockReset()

  if (cacheDirectory) {
    await rm(cacheDirectory, {force: true, recursive: true})
    cacheDirectory = undefined
  }
})

describe("createTransformerSemanticSearchEncoder", () => {
  test("loads an offline model from its pinned cache revision", async () => {
    cacheDirectory = await mkdtemp(join(tmpdir(), "qui-semantic-search-"))
    const extractor = vi.fn().mockResolvedValue({
      data: new Float32Array(semanticSearchModel.dimensions),
      dims: [1, semanticSearchModel.dimensions],
    })
    transformers.pipeline.mockResolvedValue(extractor)

    const encoder = await createTransformerSemanticSearchEncoder({
      cacheDirectory,
      localFilesOnly: true,
    })

    await encoder.embed(["routing"])

    expect(transformers.pipeline).toHaveBeenCalledWith(
      "feature-extraction",
      join(
        cacheDirectory,
        semanticSearchModel.id,
        semanticSearchModel.revision,
      ),
      {
        cache_dir: cacheDirectory,
        dtype: semanticSearchModel.dtype,
        local_files_only: true,
        revision: semanticSearchModel.revision,
      },
    )
  })
})
