# @qualcomm-ui/mdx-vite Changelog

## 2.17.1 (2026/02/26)

### Bug Fixes

- [search-index]: remove knowledge metadata from contents

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/mdx-common]

## 2.17.0 (2026/02/14)

### Features

- [docs-plugin]: add remark-steps plugin

### Bug Fixes

- [knowledge]: remove mdx spoiler directives from knowledge output

## 2.16.2 (2026/02/08)

### Tests

- [knowledge]: update expectations for intro content and H1-only pages

### Bug Fixes

- [knowledge]: capture content before first target-depth heading

## 2.16.1 (2026/02/07)

### Bug Fixes

- [mdx-vite]: handle headings containing only inline code
- [mdx-vite]: use mdast-util-to-string for heading text extraction

## 2.16.0 (2026/02/06)

### Features

- [sections-extractor]: move props and terms to top-level fields
- [ai-knowledge]: reworked props, terms, and frontmatter extraction
- [ai-knowledge]: refactor metadata to terms array

### Code Refactoring

- [ai-knowledge]: adjusted internal extraction data types

## 2.15.1 (2026/02/03)

### Bug Fixes

- [section-extractor]: use md5 for hash

## 2.15.0 (2026/02/03)

### Features

- [ai-knowledge]: inline imported modules as sibling code blocks after demos
- [mdx-plugins]: add remarkExtractMeta to standard remark plugin pipeline
- [ai-knowledge]: replace experimental frontmatterFields with glob-based frontmatter config, now stable
- [ai-knowledge]: add markdown section extractor
- [ai-knowledge]: add plugin system for modular MDX transformations

### Tests

- knowledge generator regression tests

### Bug Fixes

- [ai-knowledge]: handle legacy single-config mode when CLI provides output path
- [ai-knowledge]: support array values in frontmatter output

### Code Refactoring

- [ai-knowledge]: split generator into submodules
- [ai-knowledge]: rename methods to use 'format' prefix for consistency
- [ai-knowledge]: restructure generator and improve frontmatter config
- [ai-knowledge]: parse imports using TypeScript compiler for accuracy
- [ai-knowledge]: extract CLI command to separate module for cleaner separation
- [ai-knowledge]: improve demo imports and section extraction

## 2.14.3 (2026/01/29)

### Bug Fixes

- [docs-plugin-mdx]: add fallback language for syntax highlighting

## 2.14.2 (2026/01/23)

### Bug Fixes

- [nav-builder]: pass empty object for non-page frontmatter

## 2.14.1 (2026/01/23)

### Code Refactoring

- improve logging and error handling
- remove async from sync functions

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/mdx-common, @qualcomm-ui/typedoc-common, @qualcomm-ui/utils]

## 2.14.0 (2026/01/22)

### Features

- add support for tailwind spacing documentation in knowledge generation

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/mdx-common]

## 2.13.0 (2026/01/21)

### Features

- add support for tailwind spacing documentation in knowledge generation

## 2.12.0 (2026/01/18)

### Features

- [exports]: generate bulk.zip archive of all exported markdown files
- [exports]: generate export manifest with MD5 hashes for change detection

### Documentation

- [qui-docs]: document manifest schema and MCP client usage

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/mdx-common]

## 2.11.2 (2026/01/11)

### Documentation

- [qui-docs-config]: update jsdoc comments

## 2.11.1 (2025/12/29)

### Bug Fixes

- [knowledge-downloader]: update targeted env variables

## 2.11.0 (2025/12/28)

### Features

- [knowledge]: load openwebui credentials from per-environment env files with legacy env var fallback
- [knowledge]: add environment/integration filters to generate/upload commands and improve output logging
- [knowledge]: add page frontmatter field inclusion support
- [knowledge]: add multi-environment generation and Open WebUI upload integrations
- [knowledge]: add pageIdPrefix field
- [knowledge]: extend config schema/types to support named generation environments and platform integrations

### Bug Fixes

- [owui-knowledge-upload]: add fallback knowledge file getter

### Miscellaneous Chores

- [knowledge]: ignore generated knowledge outputs in tooling and streamline docs scripts

## 2.10.1 (2025/12/25)

### Miscellaneous Chores

- remove config debug log

## 2.10.0 (2025/12/24)

### Features

- [knowledge-files]: optionally process extra files as mdx
- [knowledge]: consolidate generated markdown
- [knowledge]: add relative link transformer

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/mdx-common]

## 2.9.0 (2025/12/22)

### Features

- [docs-plugin]: add knowledge build to docs-plugin
- [mdx]: add AST-based frontmatter interpolation
- [knowledge]: add live knowledge exports configuration

### Code Refactoring

- [mdx]: tag frontmatter.description paragraphs with qui-docs\_\_page-description class

### Tests

- [mdx]: add coverage for frontmatter interpolation behavior

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/mdx-common]

## 2.8.0 (2025/12/18)

### Features

- [remark-plugins]: add support for frontmatter descriptions

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/mdx-common]

## 2.7.0 (2025/12/15)

### Features

- [knowledge]: add configuration to qui-docs.config.ts
- [knowledge]: add extraFiles config option
- [knowledge]: improve exclude processing with minimatch

### Miscellaneous Chores

- [deps]: update zod to v4

## 2.6.4 (2025/12/12)

### Tests

- [docs-plugin]: add coverage for code annotation stripping
- [docs-plugin]: add unit tests for code annotation removal
- [docs-plugin]: move vitest specs to **tests** structure

### Documentation

- [markdown]: reorder markdown guide sections for clarity

### Bug Fixes

- [docs-plugin]: annotations do not hide lines from copy data

## 2.6.3 (2025/12/11)

### Bug Fixes

- [docs-plugin]: skip git metadata for cached files
- [docs-plugin]: skip cache update for unchanged files

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/tailwind-plugin]

## 2.6.2 (2025/12/10)

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/utils]

## 2.6.1 (2025/12/08)

### Bug Fixes

- [mdx-vite]: resolve git metadata repo root

## 2.6.0 (2025/12/08)

### Features

- [docs]: add git-derived updated metadata to pages
- [docs]: populate page updatedOn/updatedBy from git history

### Tests

- [docs]: mock git child_process calls in docs indexer specs

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/mdx-common]

## 2.5.4 (2025/12/05)

### Bug Fixes

- [knowledge]: ensure updated files are re-indexed

## 2.5.3 (2025/12/04)

### Bug Fixes

- [knowledge]: improve duplicate detection and retry handling
- [knowledge]: avoid reuploading unchanged knowledge files
- [knowledge]: stop persisting debug file dump
- [knowledge]: resolve optional theme data and emit json blocks
- [knowledge]: return failure when file update fails
- [knowledge]: clean orphaned files before upload
- [knowledge]: prevent duplicate file uploads
- [knowledge]: refactor api client to avoid duplicates

### Code Refactoring

- [open-web-ui]: introduce typed files/knowledge api client
- [knowledge]: migrate upload/download to new api layer

### Miscellaneous Chores

- [knowledge]: add cleaner for orphaned and failed files

## 2.5.2 (2025/12/04)

### Code Refactoring

- [knowledge-config]: remove knowledgeId requirement from generation command
- [generate-knowledge]: reorganize functions into class for shared state/config

### Bug Fixes

- [knowledge-upload]: more resilient duplication handling
- [generate-knowledge]: remove links in aggregate output mode
- [knowledge-upload]: do not retry upload after specific errors

## 2.5.1 (2025/12/03)

### Bug Fixes

- [llms-txt-generator]: use correct urls for intro page overview

## 2.5.0 (2025/12/03)

### Features

- [docs-plugin]: add toc change tracking to file metadata

### Bug Fixes

- [docs-plugin]: add back site data invalidation on mdx file change

## 2.4.0 (2025/12/03)

### Features

- [mdx-vite]: add transformation from tailwind to inline styles in demos
- [shiki]: add data-code and data-preview attributes to highlighted demo html
- [preview-blocks]: strip code annotations from preview content

### Code Refactoring

- [code-highlighting]: simplified internal highlighted code data structures

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/mdx-common, @qualcomm-ui/typedoc-common, @qualcomm-ui/utils]

## 2.3.0 (2025/12/01)

### Features

- [knowledge-generator]: formatting enhancements for aggregated output mode

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/utils]

## 2.2.1 (2025/11/25)

### Bug Fixes

- [rag-knowledge-generator]: apply exclude CLI option to filenames

## 2.2.0 (2025/11/25)

### Features

- [angular-demo-plugin]: add common transformers
- [shiki]: add transformer-notation-hidden transformer
- [shiki]: add preview display modes, onComplete hook, and dedent support to preview block transformer
- [shiki]: improve removeCodeAnnotations to handle JSX block markers and cleanup blank lines
- [angular-demo-plugin]: enhance code extraction to account for shiki annotations

### Code Refactoring

- [rag-knowledge-generator]: replace JSX regex with AST traversal
- [react-demo-plugin]: extract highlighted code handling into helper and reuse for imported files
- [angular-demo-plugin]: remove unused page modules
- [react-demo-plugin]: centralize Shiki options and return structured highlight metadata
- [mdx-common]: relax SourceCodeData shape and deprecate withoutImports field
- [react-demo-plugin]: use Shiki transformers for preview extraction instead of manual HTML parsing
- [shiki]: add completion callback to code attribute transformer

### Bug Fixes

- [rag-knowledge-generator]: use entire path in filename to fix collisions
- [docs-plugin]: adjust virtual module invalidation to prevent react-router hmr conflicts
- [angular-demo-plugin]: recovery gracefully on stat failure

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/mdx-common]

## 2.1.3 (2025/11/23)

### Performance Improvements

- [angular-demo-plugin]: remove redundant module invalidation

### Bug Fixes

- [angular-demo-plugin]: relative file changes trigger demo update

## 2.1.2 (2025/11/21)

### Bug Fixes

- [docs-plugin]: add css HMR

## 2.1.1 (2025/11/21)

### Bug Fixes

- [owui-knowledge]: remove unused jsx from parsed mdx

## 2.1.0 (2025/11/21)

### Features

- [docs-plugin]: enable common shiki transformers by default
- [react-demo-plugin]: enable common shiki transformers
- [docs-plugin]: add initial shiki-preview-blocks transformer
- [docs-plugin]: add shiki-transformer-code-attribute

### Bug Fixes

- restrict plugin scope to avoid duplicate init
- [docs-plugin]: trigger full reload on frontmatter/config changes
- force reload module when mdx changes to update toc
- [plugin-hmr]: only invalidate associated modules

### Miscellaneous Chores

- [remark-code-tabs]: update jsdoc comment with example
- migrate change-case to @qualcomm-ui/utils/change-case
- remove legacy object key in test config
- **deps:** update dependencies [@qualcomm-ui/mdx-common, @qualcomm-ui/typedoc-common, @qualcomm-ui/utils]

## 2.0.0 (2025/11/19)

### BREAKING CHANGES

- [react-demo-plugin]: plugin scope reduced to syntax highlighting for demo files

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/mdx-common]

## 1.1.0 (2025/11/17)

### Features

- [search]: add rich text metadata to search index

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/mdx-common]

## 1.0.3 (2025/11/13)

### Bug Fixes

- add stub ts files for npm ts badge

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/mdx-common, @qualcomm-ui/typedoc-common, @qualcomm-ui/utils]

## 1.0.2 (2025/11/12)

### Bug Fixes

- react readme url

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/mdx-common, @qualcomm-ui/typedoc-common, @qualcomm-ui/utils]

## 1.0.1 (2025/11/12)

### Miscellaneous Chores

- add missing package licenses
- add per-package readmes
- **deps:** update dependencies [@qualcomm-ui/mdx-common, @qualcomm-ui/typedoc-common, @qualcomm-ui/utils]
