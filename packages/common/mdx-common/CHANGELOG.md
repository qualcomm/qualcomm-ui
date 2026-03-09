# @qualcomm-ui/mdx-common Changelog

## 2.0.0 (2026/03/06)

### BREAKING CHANGES

- [mdx-common]: restructure shared types for knowledge exports ([20bee30](https://github.com/qualcomm/qualcomm-ui/commit/20bee30))

### Code Refactoring

- [docs-plugin]: clean up type imports ([25e49d1](https://github.com/qualcomm/qualcomm-ui/commit/25e49d1))

## 1.10.0 (2026/02/26)

### Features

- [tokens]: add persistent disabled state tokens for black/white variants
- [tokens]: add track-default and disabled-handle/track-fill tokens
- [tokens]: update design tokens to latest version

### Styles

- [theme]: adjust shiki dark theme background color
- [tokens]: simplify neutral color scale from 10 to 5 levels

### Code Refactoring

- [slider]: simplify disabled state styling with new tokens

### Bug Fixes

- [switch]: use interactive icon tokens for thumb states

## 1.9.1 (2026/01/22)

### Styles

- [shiki]: darken shiki theme background colors

## 1.9.0 (2026/01/18)

### Features

- [mdx-knowledge]: add ManifestEntry and ExportManifest type definitions

### Documentation

- [qui-docs]: document manifest schema and MCP client usage

## 1.8.0 (2025/12/24)

### Features

- [types]: add KnowledgePageData type

## 1.7.0 (2025/12/22)

### Features

- [docs-plugin]: add knowledge build to docs-plugin
- [knowledge]: add live knowledge exports configuration

## 1.6.0 (2025/12/18)

### Features

- [remark-plugins]: add support for frontmatter descriptions

## 1.5.0 (2025/12/08)

### Features

- [docs]: add frontmatter fields for update metadata

## 1.4.0 (2025/12/03)

### Features

- [preview-blocks]: strip code annotations from preview content
- [mdx-vite]: add transformation from tailwind to inline styles in demos

### Code Refactoring

- [demo-plugin]: deprecated raw source code type

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/typedoc-common]

## 1.3.0 (2025/11/25)

### Features

- [mdx-common]: relax SourceCodeData shape and deprecate withoutImports field

## 1.2.0 (2025/11/19)

### Features

- add filePath field to ReactDemoData

### Code Refactoring

- deprecated ReactDemoWithScope

## 1.1.0 (2025/11/17)

### Features

- [search]: add rich text metadata to search index

### Bug Fixes

- [site-search]: use word boundary for result truncation, increase character limit

## 1.0.3 (2025/11/13)

### Bug Fixes

- add stub ts files for npm ts badge

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/typedoc-common]

## 1.0.2 (2025/11/12)

### Bug Fixes

- react readme url

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/typedoc-common]

## 1.0.1 (2025/11/12)

### Miscellaneous Chores

- add missing package licenses
- add per-package readmes
- **deps:** update dependencies [@qualcomm-ui/typedoc-common]
