# @qualcomm-ui/mdx-vite Changelog

## 3.2.2

Apr 7th, 2026

### Bug Fixes

- [mdx-vite]: add type check before defining $typeof property ([0cb35b2](https://github.com/qualcomm/qualcomm-ui/commit/0cb35b2))

## 3.2.1

Apr 6th, 2026

### Bug Fixes

- update changelog links ([78aca35](https://github.com/qualcomm/qualcomm-ui/commit/78aca35))

## 3.2.0

Apr 2nd, 2026

### Features

- [docs-plugin]: add frontmatter HMR plugin ([a43f227](https://github.com/qualcomm/qualcomm-ui/commit/a43f227))

### Miscellaneous Chores

- upgrade to vite v8 and bump dependencies ([18596c5](https://github.com/qualcomm/qualcomm-ui/commit/18596c5))
- **deps:** update dependencies [@qualcomm-ui/mdx-common, @qualcomm-ui/utils]

## 3.1.0

Mar 28th, 2026

### Features

- [search-indexer]: populate frontmatter data field ([c6c9417](https://github.com/qualcomm/qualcomm-ui/commit/c6c9417))

### Code Refactoring

- [docs-layout]: separate page header from page actions ([58fc23e](https://github.com/qualcomm/qualcomm-ui/commit/58fc23e))
- [remark-pipeline]: remove unused Processor type import ([4193ed0](https://github.com/qualcomm/qualcomm-ui/commit/4193ed0))
- [knowledge-exporter]: improve type safety ([09f7a0e](https://github.com/qualcomm/qualcomm-ui/commit/09f7a0e))

### Performance Improvements

- [search-indexer]: skip rebuilding git metadata map when already populated ([e90a579](https://github.com/qualcomm/qualcomm-ui/commit/e90a579))
- [knowledge-exporter]: use dirent.isDirectory() instead of separate stat call ([54a92d9](https://github.com/qualcomm/qualcomm-ui/commit/54a92d9))
- [section-extractor]: hoist remark processors to module level ([127cfd7](https://github.com/qualcomm/qualcomm-ui/commit/127cfd7))
- [knowledge-exporter]: add page-level caching ([fddcd20](https://github.com/qualcomm/qualcomm-ui/commit/fddcd20))
- [knowledge-exporter]: hoist formatThemeNodes await outside processor creation ([ad16586](https://github.com/qualcomm/qualcomm-ui/commit/ad16586))

### Tests

- [search-indexer]: update fixture data for frontmatter data field ([05f8751](https://github.com/qualcomm/qualcomm-ui/commit/05f8751))

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/mdx-common]

## 3.0.3

Mar 24th, 2026

- **deps:** update dependencies [@qualcomm-ui/tailwind-plugin]

## 3.0.2

Mar 20th, 2026

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/utils]

## 3.0.1

Mar 12th, 2026

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/utils]

## 3.0.0

Mar 6th, 2026

### BREAKING CHANGES

- [mdx-vite]: remove ai-knowledge generator and lazy demo map CLI ([8aae4c0](https://github.com/qualcomm/qualcomm-ui/commit/8aae4c0))
- [docs-plugin]: refactor SearchIndexer and rename MarkdownFileReader ([18ac56f](https://github.com/qualcomm/qualcomm-ui/commit/18ac56f))
- [open-web-ui]: relocate from ai-knowledge and simplify upload ([cef9bfb](https://github.com/qualcomm/qualcomm-ui/commit/cef9bfb))
- [docs-plugin]: restructure modules and flatten knowledge config ([872a3d9](https://github.com/qualcomm/qualcomm-ui/commit/872a3d9))

### Features

- [docs-plugin]: add KnowledgeExporter and remark pipeline ([1a546a6](https://github.com/qualcomm/qualcomm-ui/commit/1a546a6))

### Code Refactoring

- [docs-plugin]: extract PluginState and add virtual modules ([7820f49](https://github.com/qualcomm/qualcomm-ui/commit/7820f49))
- [docs-plugin]: fix exported types ([2a12df1](https://github.com/qualcomm/qualcomm-ui/commit/2a12df1))
- [docs-plugin]: clean up type imports ([25e49d1](https://github.com/qualcomm/qualcomm-ui/commit/25e49d1))

### Tests

- [docs-plugin]: update knowledge and section tests ([a949f23](https://github.com/qualcomm/qualcomm-ui/commit/a949f23))
- [docs-plugin]: rename remix test fixtures to react-router ([b32584f](https://github.com/qualcomm/qualcomm-ui/commit/b32584f))

### Documentation

- [qui-docs]: update ai-knowledge guide ([137ad67](https://github.com/qualcomm/qualcomm-ui/commit/137ad67))

### Miscellaneous Chores

- [mdx-vite]: update build script to watch virtual module types ([6e66362](https://github.com/qualcomm/qualcomm-ui/commit/6e66362))
- **deps:** update dependencies [@qualcomm-ui/mdx-common]

### Bug Fixes

- forward pageIdPrefix down to knowledge consumers ([9f0b18c](https://github.com/qualcomm/qualcomm-ui/commit/9f0b18c))

## 2.17.2

Mar 2nd, 2026

### Performance Improvements

- [mdx-vite]: batch git metadata lookups into a single command ([dbb2b9b](https://github.com/qualcomm/qualcomm-ui/commit/dbb2b9b))

## 2.17.1

Feb 26th, 2026

### Bug Fixes

- [search-index]: remove knowledge metadata from contents

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/mdx-common]

## 2.17.0

Feb 14th, 2026

### Features

- [docs-plugin]: add remark-steps plugin

### Bug Fixes

- [knowledge]: remove mdx spoiler directives from knowledge output

## 2.16.2

Feb 8th, 2026

### Tests

- [knowledge]: update expectations for intro content and H1-only pages

### Bug Fixes

- [knowledge]: capture content before first target-depth heading

## 2.16.1

Feb 7th, 2026

### Bug Fixes

- [mdx-vite]: handle headings containing only inline code
- [mdx-vite]: use mdast-util-to-string for heading text extraction

## 2.16.0

Feb 6th, 2026

### Features

- [sections-extractor]: move props and terms to top-level fields
- [ai-knowledge]: reworked props, terms, and frontmatter extraction
- [ai-knowledge]: refactor metadata to terms array

### Code Refactoring

- [ai-knowledge]: adjusted internal extraction data types

## 2.15.1

Feb 3rd, 2026

### Bug Fixes

- [section-extractor]: use md5 for hash

## 2.15.0

Feb 3rd, 2026

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

## 2.14.3

Jan 29th, 2026

### Bug Fixes

- [docs-plugin-mdx]: add fallback language for syntax highlighting

## 2.14.2

Jan 23rd, 2026

### Bug Fixes

- [nav-builder]: pass empty object for non-page frontmatter

## 2.14.1

Jan 23rd, 2026

### Code Refactoring

- improve logging and error handling
- remove async from sync functions

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/mdx-common, @qualcomm-ui/typedoc-common, @qualcomm-ui/utils]

## 2.14.0

Jan 22nd, 2026

### Features

- add support for tailwind spacing documentation in knowledge generation

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/mdx-common]

## 2.13.0

Jan 21st, 2026

### Features

- add support for tailwind spacing documentation in knowledge generation

## 2.12.0

Jan 18th, 2026

### Features

- [exports]: generate bulk.zip archive of all exported markdown files
- [exports]: generate export manifest with MD5 hashes for change detection

### Documentation

- [qui-docs]: document manifest schema and MCP client usage

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/mdx-common]

## 2.11.2

Jan 11th, 2026

### Documentation

- [qui-docs-config]: update jsdoc comments

## 2.11.1

Dec 29th, 2025

### Bug Fixes

- [knowledge-downloader]: update targeted env variables

## 2.11.0

Dec 28th, 2025

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

## 2.10.1

Dec 25th, 2025

### Miscellaneous Chores

- remove config debug log

## 2.10.0

Dec 24th, 2025

### Features

- [knowledge-files]: optionally process extra files as mdx
- [knowledge]: consolidate generated markdown
- [knowledge]: add relative link transformer

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/mdx-common]

## 2.9.0

Dec 22nd, 2025

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

## 2.8.0

Dec 18th, 2025

### Features

- [remark-plugins]: add support for frontmatter descriptions

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/mdx-common]

## 2.7.0

Dec 15th, 2025

### Features

- [knowledge]: add configuration to qui-docs.config.ts
- [knowledge]: add extraFiles config option
- [knowledge]: improve exclude processing with minimatch

### Miscellaneous Chores

- [deps]: update zod to v4

## 2.6.4

Dec 12th, 2025

### Tests

- [docs-plugin]: add coverage for code annotation stripping
- [docs-plugin]: add unit tests for code annotation removal
- [docs-plugin]: move vitest specs to **tests** structure

### Documentation

- [markdown]: reorder markdown guide sections for clarity

### Bug Fixes

- [docs-plugin]: annotations do not hide lines from copy data

## 2.6.3

Dec 11th, 2025

### Bug Fixes

- [docs-plugin]: skip git metadata for cached files
- [docs-plugin]: skip cache update for unchanged files

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/tailwind-plugin]

## 2.6.2

Dec 10th, 2025

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/utils]

## 2.6.1

Dec 8th, 2025

### Bug Fixes

- [mdx-vite]: resolve git metadata repo root

## 2.6.0

Dec 8th, 2025

### Features

- [docs]: add git-derived updated metadata to pages
- [docs]: populate page updatedOn/updatedBy from git history

### Tests

- [docs]: mock git child_process calls in docs indexer specs

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/mdx-common]

## 2.5.4

Dec 5th, 2025

### Bug Fixes

- [knowledge]: ensure updated files are re-indexed

## 2.5.3

Dec 4th, 2025

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

## 2.5.2

Dec 4th, 2025

### Code Refactoring

- [knowledge-config]: remove knowledgeId requirement from generation command
- [generate-knowledge]: reorganize functions into class for shared state/config

### Bug Fixes

- [knowledge-upload]: more resilient duplication handling
- [generate-knowledge]: remove links in aggregate output mode
- [knowledge-upload]: do not retry upload after specific errors

## 2.5.1

Dec 3rd, 2025

### Bug Fixes

- [llms-txt-generator]: use correct urls for intro page overview

## 2.5.0

Dec 3rd, 2025

### Features

- [docs-plugin]: add toc change tracking to file metadata

### Bug Fixes

- [docs-plugin]: add back site data invalidation on mdx file change

## 2.4.0

Dec 3rd, 2025

### Features

- [mdx-vite]: add transformation from tailwind to inline styles in demos
- [shiki]: add data-code and data-preview attributes to highlighted demo html
- [preview-blocks]: strip code annotations from preview content

### Code Refactoring

- [code-highlighting]: simplified internal highlighted code data structures

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/mdx-common, @qualcomm-ui/typedoc-common, @qualcomm-ui/utils]

## 2.3.0

Dec 1st, 2025

### Features

- [knowledge-generator]: formatting enhancements for aggregated output mode

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/utils]

## 2.2.1

Nov 25th, 2025

### Bug Fixes

- [rag-knowledge-generator]: apply exclude CLI option to filenames

## 2.2.0

Nov 25th, 2025

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

## 2.1.3

Nov 23rd, 2025

### Performance Improvements

- [angular-demo-plugin]: remove redundant module invalidation

### Bug Fixes

- [angular-demo-plugin]: relative file changes trigger demo update

## 2.1.2

Nov 21st, 2025

### Bug Fixes

- [docs-plugin]: add css HMR

## 2.1.1

Nov 21st, 2025

### Bug Fixes

- [owui-knowledge]: remove unused jsx from parsed mdx

## 2.1.0

Nov 21st, 2025

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

## 2.0.0

Nov 19th, 2025

### BREAKING CHANGES

- [react-demo-plugin]: plugin scope reduced to syntax highlighting for demo files

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/mdx-common]

## 1.1.0

Nov 17th, 2025

### Features

- [search]: add rich text metadata to search index

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/mdx-common]

## 1.0.3

Nov 13th, 2025

### Bug Fixes

- add stub ts files for npm ts badge

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/mdx-common, @qualcomm-ui/typedoc-common, @qualcomm-ui/utils]

## 1.0.2

Nov 12th, 2025

### Bug Fixes

- react readme url

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/mdx-common, @qualcomm-ui/typedoc-common, @qualcomm-ui/utils]

## 1.0.1

Nov 12th, 2025

### Miscellaneous Chores

- add missing package licenses
- add per-package readmes
- **deps:** update dependencies [@qualcomm-ui/mdx-common, @qualcomm-ui/typedoc-common, @qualcomm-ui/utils]
