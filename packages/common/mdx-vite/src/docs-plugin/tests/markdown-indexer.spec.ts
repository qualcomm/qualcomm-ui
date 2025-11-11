import {dirname, resolve} from "node:path"
import {fileURLToPath} from "node:url"
import {describe, expect, test} from "vitest"

import {MarkdownFileReader, MarkdownIndexer} from "../internal"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const headingLevels = new Set<string>(["h2", "h3", "h4"])

describe("Markdown Indexer", () => {
  const indexer = new MarkdownIndexer(headingLevels)
  const fileReader = new MarkdownFileReader(false)

  test("replaces frontmatter content", async () => {
    const {fileContents, frontmatter} = fileReader.readFile(
      resolve(__dirname, "./fixtures/indexer/markdown.mdx"),
    )
    const contents = indexer.parseMarkdown(fileContents, frontmatter)
    expect(contents.sections[0].heading).toEqual({
      headingLevel: 1,
      id: "",
      tagName: "h1",
      textContent: "Test Title",
    })
  })
})
