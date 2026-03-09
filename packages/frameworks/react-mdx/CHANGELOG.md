# @qualcomm-ui/react-mdx Changelog

## 2.0.0 (2026/03/06)

### BREAKING CHANGES

- [react-mdx]: rework page fetcher to support new virtual module ([4d4c33d](https://github.com/qualcomm/qualcomm-ui/commit/4d4c33d))

### Features

- add url prop to 404 page ([d9cda5e](https://github.com/qualcomm/qualcomm-ui/commit/d9cda5e))

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/mdx-common]

## 1.13.2 (2026/03/02)

### Styles

- [react-mdx]: update updated-on typography to use heading font with italic ([d534f3c](https://github.com/qualcomm/qualcomm-ui/commit/d534f3c))

### Code Refactoring

- [react-mdx]: extract UpdatedOnDate into its own component ([7d4f5e4](https://github.com/qualcomm/qualcomm-ui/commit/7d4f5e4))

## 1.13.1 (2026/02/27)

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/react-core, @qualcomm-ui/react]

## 1.13.0 (2026/02/26)

### Features

- [tokens]: add persistent disabled state tokens for black/white variants
- [tokens]: add track-default and disabled-handle/track-fill tokens
- [tokens]: update design tokens to latest version

### Styles

- [tokens]: simplify neutral color scale from 10 to 5 levels

### Code Refactoring

- [slider]: simplify disabled state styling with new tokens

### Bug Fixes

- [switch]: use interactive icon tokens for thumb states

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/mdx-common, @qualcomm-ui/react]

## 1.12.1 (2026/02/24)

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/core, @qualcomm-ui/react, @qualcomm-ui/react-core]

## 1.12.0 (2026/02/14)

### Features

- [mdx-provider]: add `HeadingSteps` component to support new remark-steps plugin

### Bug Fixes

- [mdx-provider]: spread props onto header elements

## 1.11.9 (2026/02/13)

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/react]

## 1.11.8 (2026/02/11)

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/react]

## 1.11.7 (2026/02/07)

### Bug Fixes

- [docs-layout]: always render TableOfContents component, conditionally render toc links inside it
- [app-content]: account for pageExport when determining hide-toc data attribute

### Code Refactoring

- [page-header]: reuse pageExport from context instead of recomputing export availability
- [docs-layout]: move pageExport computation to root and add to layout context
- [docs-layout]: decouple toc visibility from export display

## 1.11.6 (2026/01/30)

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/core, @qualcomm-ui/react, @qualcomm-ui/react-core]

## 1.11.5 (2026/01/29)

### Bug Fixes

- [docs-layout]: adjust sidebar height for proper scrolling on mobile

## 1.11.4 (2026/01/29)

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/react]

## 1.11.3 (2026/01/28)

### Code Refactoring

- [react-mdx]: remove h1 from page header and inline in mdx provider
- [react-mdx]: remove unused activeTocClassName prop
- [react-mdx]: move page header to table of contents

### Styles

- [react-mdx]: use data-active attribute instead of class for toc links

## 1.11.2 (2026/01/27)

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/react]

## 1.11.1 (2026/01/23)

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/core, @qualcomm-ui/react-core, @qualcomm-ui/react, @qualcomm-ui/mdx-common, @qualcomm-ui/utils]

## 1.11.0 (2026/01/22)

### Features

- [demos]: redesign code demo UI with new controls

### Styles

- [demos]: update border colors and add custom scrollbar styles

### Code Refactoring

- [demos]: convert style toggle from icon button to dropdown menu
- [demos]: replace CopyToClipboardIconButton with CopyToClipboardButton in demo
- [demos]: move brand selector into action bar as menu
- [demos]: replace expand button with collapse toggle at bottom

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/mdx-common]

## 1.10.5 (2026/01/19)

### Styles

- [h2]: increase top margin
- [docs-layout]: make toc column width flexible at large breakpoint
- darken code background color

### Bug Fixes

- [docs-layout]: use surface-primary color for backgrounds

## 1.10.4 (2026/01/19)

### Bug Fixes

- [dependencies]: bump peer of lucide-react to fix filter/funnel import

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/react, @qualcomm-ui/react-core]

## 1.10.3 (2026/01/18)

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/mdx-common]

## 1.10.2 (2026/01/17)

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/react]

## 1.10.1 (2026/01/15)

### Styles

- [shiki]: full width code line display to fix highlighting

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/react]

## 1.10.0 (2026/01/03)

### Features

- [typedoc]: render @returns tag in prop descriptions

### Bug Fixes

- [typedoc]: resolve jsdoc @link anchors via toc ids

## 1.9.1 (2026/01/02)

### Bug Fixes

- [typedoc]: improve method arg styling

## 1.9.0 (2026/01/01)

### Features

- [shiki]: add markdown language support to CodeHighlight component

## 1.8.1 (2025/12/24)

### Bug Fixes

- [page-titles]: check for duplicate title using text content

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/core, @qualcomm-ui/mdx-common, @qualcomm-ui/react, @qualcomm-ui/react-core]

## 1.8.0 (2025/12/22)

### Features

- [copy-to-clipboard]: allow async copy value provider
- [docs-layout]: add copy and download export actions to eligible pages
- [docs-layout]: add page header with export actions

### Styles

- [typedoc]: improve prop example rendering with collapsible

### Bug Fixes

- [file-tree]: branch trigger placement

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/mdx-common, @qualcomm-ui/react]

## 1.7.4 (2025/12/18)

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/mdx-common, @qualcomm-ui/react]

## 1.7.3 (2025/12/15)

### Bug Fixes

- [layout]: increase main content width when toc or side nav hidden

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/react]

## 1.7.2 (2025/12/11)

### Bug Fixes

- [docs-layout]: fix header light-mode background-color

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/react, @qualcomm-ui/core, @qualcomm-ui/react-core]

## 1.7.1 (2025/12/10)

### Bug Fixes

- [typedoc-descriptions]: Link size matches font size

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/core, @qualcomm-ui/react, @qualcomm-ui/react-core, @qualcomm-ui/utils]

## 1.7.0 (2025/12/08)

### Features

- [docs-layout]: add last updated metadata display

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/mdx-common]

## 1.6.3 (2025/12/08)

### Bug Fixes

- [a11y]: add aria labels to interactive controls

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/mdx-common, @qualcomm-ui/react]

## 1.6.2 (2025/12/05)

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/core, @qualcomm-ui/react, @qualcomm-ui/react-core]

## 1.6.1 (2025/12/03)

### Code Refactoring

- [demo-source-code]: consolidate copyable code functionality

### Bug Fixes

- [copy-to-clipboard-button]: use correct positioning in type popup
- [angular-demo-runner]: fix copy-to-clipboard action

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/react]

## 1.6.0 (2025/12/03)

### Features

- [angular-demo]: add inline style toggle
- [react-demo]: add inline style toggle

### Code Refactoring

- [demos]: consolidate react and angular demo logic
- [demos]: deprecate QdsAngularDemoRunner in favor of new AngularDemoRunner (same interface)

### Miscellaneous

- fix demo code panel: always render so copy function works everywhere

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/mdx-common, @qualcomm-ui/core, @qualcomm-ui/react, @qualcomm-ui/utils, @qualcomm-ui/react-core]

## 1.5.9 (2025/12/01)

### Bug Fixes

- [mdx-tables]: add box-sizing to prevent 2px overflow at full width
- [shiki-notation-styles]: highlighted line indent color clash
- [npm-install-tabs]: corrected language from bash to shell
- [shiki-notation]: reduce opacity of warning and error backgrounds for contrast accessibility compliance

### Styles

- [mdx-tables]: reduced size from `md` to `sm`

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/utils, @qualcomm-ui/react, @qualcomm-ui/react-core, @qualcomm-ui/core]

## 1.5.8 (2025/12/01)

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/core, @qualcomm-ui/react, @qualcomm-ui/react-core]

## 1.5.7 (2025/12/01)

### Bug Fixes

- [docs-layout]: prevent crash when path segment missing

## 1.5.6 (2025/12/01)

### Bug Fixes

- [site-search]: prevent firefox search input hiding on mouseup

## 1.5.5 (2025/11/30)

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/react]

## 1.5.4 (2025/11/30)

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/react]

## 1.5.3 (2025/11/25)

### Bug Fixes

- [react-demo]: guard for missing demo data

## 1.5.2 (2025/11/25)

### Bug Fixes

- [shiki-diff-notation]: reduce opacity of removal diff
- [qds-demo-runner]: account for adjusted demo interface

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/react, @qualcomm-ui/mdx-common, @qualcomm-ui/core, @qualcomm-ui/react-core]

## 1.5.1 (2025/11/24)

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/react]

## 1.5.0 (2025/11/21)

### Features

- [qui-ecosystem]: add qui-docs link

### Bug Fixes

- [site-search]: increase text-input right margin

## 1.4.0 (2025/11/21)

### Features

- [shiki]: add error/warning notation styles
- [shiki]: add word highlight styles
- [mdx-docs-context]: expand ssrUserAgent type to include null
- [shiki]: add focus notation styles
- [shiki styles]: add line highlight, diff styles for shiki transformers

### Bug Fixes

- [sidebar, header]: use correct background in light mode
- [mdx-css]: add top margin to qui-tabs\_\_root in mdx
- [code-tabs]: remove margin from child shiki blocks
- [sidebar]: expand parent node when pathname changes to a hidden child node

### Miscellaneous Chores

- migrate change-case to @qualcomm-ui/utils/change-case
- **deps:** update dependencies [@qualcomm-ui/react, @qualcomm-ui/core, @qualcomm-ui/mdx-common, @qualcomm-ui/utils, @qualcomm-ui/react-core]

## 1.3.0 (2025/11/19)

### Features

- [Demos]: add ReactDemo and ReactDemoRunner components

### Code Refactoring

- [Demos]: deprecate QdsReactDemo and QdsDemoRunner

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/mdx-common, @qualcomm-ui/react]

## 1.2.3 (2025/11/18)

### Build System

- do not minify identifiers

### Miscellaneous Chores

- [dependencies]: omit all devDependencies from build
- **deps:** update dependencies [@qualcomm-ui/react, @qualcomm-ui/react-core]

## 1.2.2 (2025/11/18)

### Bug Fixes

- [typedoc-descriptions]: use qui link component

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/core, @qualcomm-ui/react, @qualcomm-ui/react-core]

## 1.2.1 (2025/11/17)

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/react]

## 1.2.0 (2025/11/17)

### Features

- [PageLinks]: show adjacent page path segment prefix when it differs from current page path segment prefix

### Bug Fixes

- [site-search]: open dialog when input is focused
- [site-search]: prevent match highlight when query length is < 2

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/mdx-common, @qualcomm-ui/core, @qualcomm-ui/react-core, @qualcomm-ui/react]

## 1.1.0 (2025/11/14)

### Features

- add text-input to site-search
- add github custom lucide-icon

### Bug Fixes

- sidebar branch node link behavior restored, but deprecated
- mdx table min-width extends to content
- fix search activation keyboard shortcut
- stricter dependency on workspace packages to ensure paired version bumps
- prevent breadcrumbs list key dupe

### Code Refactoring

- remove react-device-detect dependency

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/react-core, @qualcomm-ui/react, @qualcomm-ui/core, @qualcomm-ui/mdx-common, @qualcomm-ui/utils]

## 1.0.4 (2025/11/14)

### Bug Fixes

- element preflight styles
- shiki inner html padding

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/react]

## 1.0.3 (2025/11/13)

### Bug Fixes

- add stub ts files for npm ts badge

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/core, @qualcomm-ui/mdx-common, @qualcomm-ui/utils, @qualcomm-ui/react, @qualcomm-ui/react-core]

## 1.0.2 (2025/11/12)

### Bug Fixes

- react readme url

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/core, @qualcomm-ui/mdx-common, @qualcomm-ui/utils, @qualcomm-ui/react, @qualcomm-ui/react-core]

## 1.0.1 (2025/11/12)

### Miscellaneous Chores

- add missing package licenses
- add per-package readmes
- **deps:** update dependencies [@qualcomm-ui/core, @qualcomm-ui/mdx-common, @qualcomm-ui/utils, @qualcomm-ui/react, @qualcomm-ui/react-core]
