# @qualcomm-ui/qds-core Changelog

## 1.20.0 (2026/02/26)

### Features

- [tokens]: add persistent disabled state tokens for black/white variants
- [tokens]: add track-default and disabled-handle/track-fill tokens
- [tokens]: update design tokens to latest version

### Styles

- [tokens]: simplify neutral color scale from 10 to 5 levels

### Code Refactoring

- [slider]: simplify disabled state styling with new tokens

### Bug Fixes

- use grid layout for hint and error text column spanning
- [switch]: use interactive icon tokens for thumb states

## 1.19.0 (2026/02/24)

### Features

- progress[-bar] disabled
- checkbox/switch group

### Styles

- slider update

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/core]

## 1.18.0 (2026/02/13)

### Features

- feat(link): add `brand` and `white-persistent` emphasis

## 1.17.0 (2026/02/11)

### Features

- alert banner
- [select]: add checkbox option

### Bug Fixes

- [avatar]: `variant` should be `emphasis`

## 1.16.0 (2026/01/30)

### Features

- [number-input]: add unit selector
- [radio]: hint at item level

### Bug Fixes

- [radio]: group hint + CSS fixes
- [switch]: hint text
- [checkbox]: hint text

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/core]

## 1.15.1 (2026/01/29)

### Miscellaneous Chores

- consistent hint/errortext display across form components

## 1.15.0 (2026/01/27)

### Features

- [popover]: add brand emphasis
- [tag]: add color emphasis and update CSS

## 1.14.0 (2026/01/23)

### Features

- [header-bar]: add padding prop

### Code Refactoring

- remove async from sync functions

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/core, @qualcomm-ui/utils]

## 1.13.0 (2026/01/19)

### Features

- update design tokens to latest revision

## 1.12.0 (2026/01/17)

### Features

- add lg switch size

## 1.11.0 (2026/01/15)

### Features

- add indented radio group variant

## 1.10.4 (2025/12/24)

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/core]

## 1.10.3 (2025/12/22)

### Bug Fixes

- [menu-icon-button]: rotate icon when open

## 1.10.2 (2025/12/18)

### Bug Fixes

- missing invalid checked checkbox style

## 1.10.1 (2025/12/15)

### Bug Fixes

- [design-tokens]: use variables for snapdragon font families

## 1.10.0 (2025/12/11)

### Features

- [text-area]: add component

### Bug Fixes

- [input]: adjust outline color when invalid

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/core]

## 1.9.4 (2025/12/10)

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/core, @qualcomm-ui/utils]

## 1.9.3 (2025/12/08)

### Bug Fixes

- [theme]: correct theme types export

## 1.9.2 (2025/12/05)

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/core]

## 1.9.1 (2025/12/03)

### Bug Fixes

- [side-nav]: adjust node primary and selected text colors
- [divider]: add className to api root getter

## 1.9.0 (2025/12/03)

### Features

- [design-tokens]: add individual static text variables for line-height and font-size

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/core, @qualcomm-ui/utils]

## 1.8.0 (2025/12/01)

### Features

- [collapsible]: add getter function for content bindings

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/utils, @qualcomm-ui/core]

## 1.7.1 (2025/12/01)

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/core]

## 1.7.0 (2025/11/30)

### Features

- [theme]: export theme and brand constants

## 1.6.1 (2025/11/30)

### Bug Fixes

- icon-button bindings normalization

## 1.6.0 (2025/11/25)

### Features

- [table-column-filter-action]: add styles for selected filters
- [table-column-filter]: loosen type guards, add inputs for filter state

### Bug Fixes

- [popover]: remove default width of 260px. Width is now determined based on content.

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/core]

## 1.5.0 (2025/11/24)

### Features

- add badge component

### Bug Fixes

- [badge]: categories > colors

## 1.4.2 (2025/11/21)

### Miscellaneous Chores

- migrate change-case to @qualcomm-ui/utils/change-case
- **deps:** update dependencies [@qualcomm-ui/core, @qualcomm-ui/utils]

## 1.4.1 (2025/11/19)

### Bug Fixes

- [tabs]: adjust font-size for sm and md sizes
- [menu-item]: remove underline on link items

## 1.4.0 (2025/11/18)

### Features

- add action group api

### Bug Fixes

- [icon]: set size css variable when using custom size
- [button]: text-decoration defaults to inherit

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/core]

## 1.3.0 (2025/11/17)

### Features

- add new category colors

## 1.2.0 (2025/11/17)

### Features

- [TableRowExpandButton]: add manual override for expanded state

### Bug Fixes

- [number-input]: use correct placeholder colors when disabled
- [input]: use correct placeholder colors when disabled
- [input-icon]: use display: inline-flex for element flex alignment
- [transitions]: disable element transition styles until after view init

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/core]

## 1.1.0 (2025/11/14)

### Features

- add kbd shortcut component

### Bug Fixes

- [tree]: show pointer cursor for clickable node
- [tree]: remove default browser style for link nodes
- checkmark vertical alignment
- header nav item background color
- [progress-ring]: fix circle vertical alignment
- [avatar]: apply hidden style when hidden attribute is present

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/core, @qualcomm-ui/utils]

## 1.0.5 (2025/11/14)

### Bug Fixes

- input required indicator styles
- element preflight styles

## 1.0.4 (2025/11/13)

### Bug Fixes

- add stub ts files for npm ts badge

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/core, @qualcomm-ui/utils]

## 1.0.3 (2025/11/13)

### Bug Fixes

- add reset styles for elements
- button styles, overlay styles
- toast and link styles

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/core]

## 1.0.2 (2025/11/12)

### Bug Fixes

- react readme url

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/core, @qualcomm-ui/utils]

## 1.0.1 (2025/11/12)

### Miscellaneous Chores

- add missing package licenses
- add per-package readmes
- **deps:** update dependencies [@qualcomm-ui/core, @qualcomm-ui/utils]
