# Vue to React Migration Plan: Scalar API Reference Renderer

## Overview

**Goal**: Native React implementation of API Reference documentation renderer using QUI components.

**Source**: `@scalar/api-reference` from `/home/rbower/code/scalar/packages/api-reference` (114 Vue components)
**Target**: `/home/rbower/code/qualcomm-ui/packages/frameworks/react-open-api`
**Scope**: Documentation display/renderer only (NO API client/editor)

---

## External Dependencies (Scalar Packages)

These Scalar packages are framework-agnostic and will be used as npm dependencies:

```json
{
  "@scalar/code-highlight": "workspace:*",
  "@scalar/helpers": "workspace:*",
  "@scalar/oas-utils": "workspace:*",
  "@scalar/object-utils": "workspace:*",
  "@scalar/openapi-parser": "workspace:*",
  "@scalar/openapi-types": "workspace:*",
  "@scalar/openapi-upgrader": "workspace:*",
  "@scalar/snippetz": "workspace:*",
  "@scalar/themes": "workspace:*",
  "@scalar/types": "workspace:*"
}
```

**Note**: The `@scalar/sidebar` package provides sidebar navigation in Vue. We will need to implement our own sidebar using QUI SideNav or Tree components.

---

## Design System

**QDS Tokens**: `/home/rbower/code/qualcomm-ui/packages/common/qds-core/src/styles/qualcomm-dark.css`
**QUI React Docs**: `/home/rbower/code/qualcomm-ui/packages/docs/react-docs/temp/qui-ai/`
**QUI Table Docs**: `/home/rbower/code/qualcomm-ui/packages/docs/react-table-docs/temp/qui-ai/`

---

## File Naming Convention

**All files use kebab-case:**

- `api-reference.tsx` (not `ApiReference.tsx`)
- `schema-property.tsx` (not `SchemaProperty.tsx`)
- `operation-responses.tsx` (not `OperationResponses.tsx`)

## Props Interface Convention

Every component has a dedicated props interface named `[ComponentName]Props`. Use `interface` (not `type`):

```tsx
// http-method.tsx
export interface HttpMethodProps {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS" | "HEAD"
}

export function HttpMethod({method}: HttpMethodProps) {
  return (
    <span className="openapi-method" data-method={method.toLowerCase()}>
      {method}
    </span>
  )
}
```

```tsx
// schema-property.tsx
export interface SchemaPropertyProps {
  name: string
  type: string
  description?: string
  required?: boolean
  example?: unknown
}

export function SchemaProperty({
  name,
  type,
  description,
  required,
}: SchemaPropertyProps) {
  // ...
}
```

**Naming pattern:**

- Component: `HttpMethod` → Props: `HttpMethodProps`
- Component: `SchemaProperty` → Props: `SchemaPropertyProps`
- Component: `OperationResponses` → Props: `OperationResponsesProps`

### Other TypeScript conventions

- Prefer the `interface` keyword over `type` unless `type` is strictly necessary
- do not add useless comments. Comments should be used to explain the "why" of confusing code, or for JSDoc documentation
- Always use `function` for components instead of `const`.
- barrel exports should use `export * from "./file-name"` without file extensions. Do not use file extensions in imports either
- Don't bother adding `'use client'` to components, this will be added automatically by the esbuild bundler.

---

## Phase 0: Package Setup

### 0.1 Package Location

```
/home/rbower/code/qualcomm-ui/packages/frameworks/react-open-api/
├── src/
│   ├── components/
│   ├── features/
│   ├── blocks/
│   ├── hooks/
│   ├── helpers/
│   └── index.ts
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.ts
```

### 0.2 Dependencies

```json
{
  "dependencies": {
    "@qualcomm-ui/react": "workspace:*",
    "@qualcomm-ui/react-core": "workspace:*",
    "@scalar/code-highlight": "^x.x.x",
    "@scalar/helpers": "^x.x.x",
    "@scalar/oas-utils": "^x.x.x",
    "@scalar/openapi-parser": "^x.x.x",
    "@scalar/openapi-types": "^x.x.x",
    "@scalar/snippetz": "^x.x.x",
    "fuse.js": "^7.x",
    "react": "^18.x",
    "react-dom": "^18.x"
  }
}
```

---

## Phase 1: Core Components

### 1.1 Main Entry Point

| Vue Component                    | React Component                      | Description      | Priority |
| -------------------------------- | ------------------------------------ | ---------------- | -------- |
| `components/ApiReference.vue`    | `src/components/api-reference.tsx`   | Main entry point | P0       |
| `components/Content/Content.vue` | `src/components/content/content.tsx` | Content wrapper  | P0       |
| `components/GettingStarted.vue`  | `src/components/getting-started.tsx` | Empty state      | P2       |

### 1.2 Section Components

| Vue Component                                      | React Component                                          | QUI Mapping       | Priority |
| -------------------------------------------------- | -------------------------------------------------------- | ----------------- | -------- |
| `components/Section/Section.vue`                   | `src/components/section/section.tsx`                     | Custom layout     | P0       |
| `components/Section/SectionColumn.vue`             | `src/components/section/section-column.tsx`              | Column layout     | P0       |
| `components/Section/SectionColumns.vue`            | `src/components/section/section-columns.tsx`             | Columns wrapper   | P0       |
| `components/Section/SectionContainer.vue`          | `src/components/section/section-container.tsx`           | Container         | P0       |
| `components/Section/SectionContent.vue`            | `src/components/section/section-content.tsx`             | Content area      | P0       |
| `components/Section/SectionHeader.vue`             | `src/components/section/section-header.tsx`              | Header            | P0       |
| `components/Section/SectionHeaderTag.vue`          | `src/components/section/section-header-tag.tsx`          | Tag display       | P1       |
| `components/Section/SectionAccordion.vue`          | `src/components/section/section-accordion.tsx`           | QUI Accordion     | P1       |
| `components/Section/SectionContainerAccordion.vue` | `src/components/section/section-container-accordion.tsx` | QUI Accordion     | P1       |
| `components/Section/CompactSection.vue`            | `src/components/section/compact-section.tsx`             | Compact variant   | P2       |
| `components/SectionFlare/SectionFlare.vue`         | `src/components/section-flare/section-flare.tsx`         | Visual decoration | P3       |

---

## Phase 2: Schema Components

| Vue Component                                          | React Component                                       | QUI Mapping          | Priority |
| ------------------------------------------------------ | ----------------------------------------------------- | -------------------- | -------- |
| `components/Content/Schema/Schema.vue`                 | `src/components/schema/schema.tsx`                    | Main schema renderer | P0       |
| `components/Content/Schema/SchemaProperty.vue`         | `src/components/schema/schema-property.tsx`           | Property display     | P0       |
| `components/Content/Schema/SchemaPropertyHeading.vue`  | `src/components/schema/schema-property-heading.tsx`   | Property name/type   | P0       |
| `components/Content/Schema/SchemaPropertyDetail.vue`   | `src/components/schema/schema-property-detail.tsx`    | Property details     | P0       |
| `components/Content/Schema/SchemaPropertyExamples.vue` | `src/components/schema/schema-property-examples.tsx`  | Example values       | P1       |
| `components/Content/Schema/SchemaObjectProperties.vue` | `src/components/schema/schema-object-properties.tsx`  | Object properties    | P0       |
| `components/Content/Schema/SchemaComposition.vue`      | `src/components/schema/schema-composition.tsx`        | allOf/oneOf/anyOf    | P0       |
| `components/Content/Schema/SchemaHeading.vue`          | `src/components/schema/schema-heading.tsx`            | Schema heading       | P0       |
| `components/Content/Schema/SchemaEnumValues.vue`       | `src/components/schema/schema-enum-values.tsx`        | Enum display         | P1       |
| `components/Content/Schema/SchemaEnumPropertyItem.vue` | `src/components/schema/schema-enum-property-item.tsx` | Enum item            | P1       |
| `components/Content/Schema/RenderString.vue`           | `src/components/schema/render-string.tsx`             | String renderer      | P1       |

---

## Phase 3: Operation Components

### 3.1 Main Operation

| Vue Component                                  | React Component                                     | QUI Mapping    | Priority |
| ---------------------------------------------- | --------------------------------------------------- | -------------- | -------- |
| `features/Operation/Operation.vue`             | `src/features/operation/operation.tsx`              | Main operation | P0       |
| `features/Operation/layouts/ClassicLayout.vue` | `src/features/operation/layouts/classic-layout.tsx` | Classic layout | P0       |
| `features/Operation/layouts/ModernLayout.vue`  | `src/features/operation/layouts/modern-layout.tsx`  | Modern layout  | P0       |

### 3.2 Operation Sub-components

| Vue Component                                           | React Component                                              | QUI Mapping        | Priority |
| ------------------------------------------------------- | ------------------------------------------------------------ | ------------------ | -------- |
| `features/Operation/components/OperationParameters.vue` | `src/features/operation/components/operation-parameters.tsx` | Parameters section | P0       |
| `features/Operation/components/ParameterList.vue`       | `src/features/operation/components/parameter-list.tsx`       | QUI Table          | P0       |
| `features/Operation/components/ParameterListItem.vue`   | `src/features/operation/components/parameter-list-item.tsx`  | QUI Table.Row      | P0       |
| `features/Operation/components/OperationResponses.vue`  | `src/features/operation/components/operation-responses.tsx`  | Responses section  | P0       |
| `features/Operation/components/RequestBody.vue`         | `src/features/operation/components/request-body.tsx`         | Request body       | P0       |
| `features/Operation/components/Headers.vue`             | `src/features/operation/components/headers.tsx`              | Headers section    | P1       |
| `features/Operation/components/Header.vue`              | `src/features/operation/components/header.tsx`               | Single header      | P1       |
| `features/Operation/components/ContentTypeSelect.vue`   | `src/features/operation/components/content-type-select.tsx`  | QUI Select         | P1       |
| `features/Operation/components/callbacks/Callbacks.vue` | `src/features/operation/components/callbacks/callbacks.tsx`  | Callbacks section  | P2       |
| `features/Operation/components/callbacks/Callback.vue`  | `src/features/operation/components/callbacks/callback.tsx`   | Single callback    | P2       |

---

## Phase 4: Example Responses

| Vue Component                                           | React Component                                                | QUI Mapping         | Priority |
| ------------------------------------------------------- | -------------------------------------------------------------- | ------------------- | -------- |
| `features/example-responses/ExampleResponses.vue`       | `src/features/example-responses/example-responses.tsx`         | Responses container | P0       |
| `features/example-responses/ExampleResponse.vue`        | `src/features/example-responses/example-response.tsx`          | Single response     | P0       |
| `features/example-responses/ExampleResponseTab.vue`     | `src/features/example-responses/example-response-tab.tsx`      | QUI Tabs.Tab        | P0       |
| `features/example-responses/ExampleResponseTabList.vue` | `src/features/example-responses/example-response-tab-list.tsx` | QUI Tabs.List       | P0       |

---

## Phase 5: Info Block Components

| Vue Component                                                  | React Component                                    | QUI Mapping      | Priority |
| -------------------------------------------------------------- | -------------------------------------------------- | ---------------- | -------- |
| `blocks/scalar-info-block/components/InfoBlock.vue`            | `src/blocks/info-block/info-block.tsx`             | Info container   | P0       |
| `blocks/scalar-info-block/components/InfoDescription.vue`      | `src/blocks/info-block/info-description.tsx`       | API description  | P0       |
| `blocks/scalar-info-block/components/InfoVersion.vue`          | `src/blocks/info-block/info-version.tsx`           | Version badge    | P1       |
| `blocks/scalar-info-block/components/InfoLinks.vue`            | `src/blocks/info-block/info-links.tsx`             | External links   | P1       |
| `blocks/scalar-info-block/components/InfoMarkdownSection.vue`  | `src/blocks/info-block/info-markdown-section.tsx`  | Markdown content | P1       |
| `blocks/scalar-info-block/components/IntroductionLayout.vue`   | `src/blocks/info-block/introduction-layout.tsx`    | Intro layout     | P1       |
| `blocks/scalar-info-block/components/IntroductionCard.vue`     | `src/blocks/info-block/introduction-card.tsx`      | QUI Card         | P1       |
| `blocks/scalar-info-block/components/IntroductionCardItem.vue` | `src/blocks/info-block/introduction-card-item.tsx` | Card item        | P1       |
| `blocks/scalar-info-block/components/OpenApiVersion.vue`       | `src/blocks/info-block/openapi-version.tsx`        | OAS version      | P2       |
| `blocks/scalar-info-block/components/DownloadLink.vue`         | `src/blocks/info-block/download-link.tsx`          | Download button  | P2       |

---

## Phase 6: Tag & Model Components

### 6.1 Tags

| Vue Component                                          | React Component                          | QUI Mapping    | Priority |
| ------------------------------------------------------ | ---------------------------------------- | -------------- | -------- |
| `components/Content/Tags/Tag.vue`                      | `src/components/tags/tag.tsx`            | Tag section    | P0       |
| `components/Content/Tags/components/TagSection.vue`    | `src/components/tags/tag-section.tsx`    | Tag container  | P0       |
| `components/Content/Tags/components/ClassicLayout.vue` | `src/components/tags/classic-layout.tsx` | Classic layout | P0       |
| `components/Content/Tags/components/ModernLayout.vue`  | `src/components/tags/modern-layout.tsx`  | Modern layout  | P0       |

### 6.2 Models

| Vue Component                                            | React Component                            | QUI Mapping    | Priority |
| -------------------------------------------------------- | ------------------------------------------ | -------------- | -------- |
| `components/Content/Models/Model.vue`                    | `src/components/models/model.tsx`          | Model display  | P1       |
| `components/Content/Models/ModelTag.vue`                 | `src/components/models/model-tag.tsx`      | Model tag      | P1       |
| `components/Content/Models/components/ClassicLayout.vue` | `src/components/models/classic-layout.tsx` | Classic layout | P1       |
| `components/Content/Models/components/ModernLayout.vue`  | `src/components/models/modern-layout.tsx`  | Modern layout  | P1       |

---

## Phase 7: Search Feature

| Vue Component                                 | React Component                         | QUI Mapping           | Priority |
| --------------------------------------------- | --------------------------------------- | --------------------- | -------- |
| `features/Search/components/SearchModal.vue`  | `src/features/search/search-modal.tsx`  | QUI Dialog + Combobox | P0       |
| `features/Search/components/SearchButton.vue` | `src/features/search/search-button.tsx` | QUI Button            | P0       |
| `features/Search/components/SearchResult.vue` | `src/features/search/search-result.tsx` | Result item           | P0       |

**Implementation**: Use QUI Combobox in Dialog for fuzzy search (Fuse.js)

---

## Phase 8: Server & Client Selectors

### 8.1 Server Selector

| Vue Component                                                       | React Component                                  | QUI Mapping | Priority |
| ------------------------------------------------------------------- | ------------------------------------------------ | ----------- | -------- |
| `blocks/scalar-server-selector-block/components/ServerSelector.vue` | `src/blocks/server-selector/server-selector.tsx` | QUI Select  | P1       |
| `blocks/scalar-server-selector-block/components/Selector.vue`       | `src/blocks/server-selector/selector.tsx`        | Select base | P1       |

### 8.2 Client Selector

| Vue Component                                                       | React Component                                  | QUI Mapping | Priority |
| ------------------------------------------------------------------- | ------------------------------------------------ | ----------- | -------- |
| `blocks/scalar-client-selector-block/components/ClientSelector.vue` | `src/blocks/client-selector/client-selector.tsx` | QUI Select  | P1       |
| `blocks/scalar-client-selector-block/components/ClientDropdown.vue` | `src/blocks/client-selector/client-dropdown.tsx` | QUI Menu    | P1       |

---

## Phase 9: Info Object Features

| Vue Component                                                 | React Component                                                    | QUI Mapping     | Priority |
| ------------------------------------------------------------- | ------------------------------------------------------------------ | --------------- | -------- |
| `features/info-object/Contact.vue`                            | `src/features/info-object/contact.tsx`                             | Contact info    | P1       |
| `features/info-object/License.vue`                            | `src/features/info-object/license.tsx`                             | License info    | P1       |
| `features/info-object/TermsOfService.vue`                     | `src/features/info-object/terms-of-service.tsx`                    | ToS link        | P2       |
| `features/external-docs/ExternalDocs.vue`                     | `src/features/external-docs/external-docs.tsx`                     | External links  | P1       |
| `features/specification-extension/SpecificationExtension.vue` | `src/features/specification-extension/specification-extension.tsx` | x-\* extensions | P2       |
| `features/x-badges/XBadges.vue`                               | `src/features/x-badges/x-badges.tsx`                               | Custom badges   | P2       |

---

## Phase 10: UI Components

### 10.1 Display Components

| Vue Component                          | React Component                              | QUI Mapping   | Priority |
| -------------------------------------- | -------------------------------------------- | ------------- | -------- |
| `components/HttpMethod/HttpMethod.vue` | `src/components/http-method/http-method.tsx` | Custom badge  | P0       |
| `components/Badge/Badge.vue`           | `src/components/badge/badge.tsx`             | QUI Badge     | P0       |
| `components/OperationPath.vue`         | `src/components/operation-path.tsx`          | Path display  | P0       |
| `components/ShowMoreButton.vue`        | `src/components/show-more-button.tsx`        | QUI Button    | P1       |
| `components/LoadingSkeleton.vue`       | `src/components/loading-skeleton.tsx`        | Loading state | P1       |
| `components/ScreenReader.vue`          | `src/components/screen-reader.tsx`           | Accessibility | P2       |

### 10.2 Navigation Components

| Vue Component                                      | React Component                                           | QUI Mapping     | Priority |
| -------------------------------------------------- | --------------------------------------------------------- | --------------- | -------- |
| `components/Anchor/Anchor.vue`                     | `src/components/anchor/anchor.tsx`                        | Anchor link     | P0       |
| `components/Anchor/WithBreadcrumb.vue`             | `src/components/anchor/with-breadcrumb.tsx`               | QUI Breadcrumbs | P1       |
| `components/OperationsList/OperationsList.vue`     | `src/components/operations-list/operations-list.tsx`      | Operations nav  | P1       |
| `components/OperationsList/OperationsListItem.vue` | `src/components/operations-list/operations-list-item.tsx` | Nav item        | P1       |
| `components/LinkList/LinkList.vue`                 | `src/components/link-list/link-list.tsx`                  | Links list      | P2       |

### 10.3 Header Components

| Vue Component                  | React Component                     | QUI Mapping    | Priority |
| ------------------------------ | ----------------------------------- | -------------- | -------- |
| `components/ClassicHeader.vue` | `src/components/classic-header.tsx` | Classic header | P1       |
| `components/MobileHeader.vue`  | `src/components/mobile-header.tsx`  | Mobile header  | P1       |

### 10.4 Utility Components

| Vue Component                                | React Component                                    | QUI Mapping      | Priority |
| -------------------------------------------- | -------------------------------------------------- | ---------------- | -------- |
| `components/Lazy/Lazy.vue`                   | `src/components/lazy/lazy.tsx`                     | Lazy loading     | P1       |
| `components/IntersectionObserver.vue`        | `src/components/intersection-observer.tsx`         | Scroll detection | P1       |
| `components/RenderPlugins/RenderPlugins.vue` | `src/components/render-plugins/render-plugins.tsx` | Plugin renderer  | P2       |

---

## Phase 11: Toolbar (Optional)

| Vue Component                                                 | React Component                                          | QUI Mapping       | Priority |
| ------------------------------------------------------------- | -------------------------------------------------------- | ----------------- | -------- |
| `features/toolbar/ApiReferenceToolbar.vue`                    | `src/features/toolbar/api-reference-toolbar.tsx`         | Toolbar container | P2       |
| `features/toolbar/ApiReferenceToolbarTitle.vue`               | `src/features/toolbar/toolbar-title.tsx`                 | Title display     | P2       |
| `features/toolbar/ApiReferenceToolbarPopover.vue`             | `src/features/toolbar/toolbar-popover.tsx`               | QUI Popover       | P2       |
| `features/toolbar/ApiReferenceToolbarConfig.vue`              | `src/features/toolbar/toolbar-config.tsx`                | Config panel      | P3       |
| `features/toolbar/ApiReferenceToolbarConfigLayout.vue`        | `src/features/toolbar/toolbar-config-layout.tsx`         | Layout options    | P3       |
| `features/toolbar/ApiReferenceToolbarConfigLayoutOptions.vue` | `src/features/toolbar/toolbar-config-layout-options.tsx` | Layout selector   | P3       |
| `features/toolbar/ApiReferenceToolbarConfigTheme.vue`         | `src/features/toolbar/toolbar-config-theme.tsx`          | Theme selector    | P3       |
| `features/toolbar/ApiReferenceToolbarSdks.vue`                | `src/features/toolbar/toolbar-sdks.tsx`                  | SDK links         | P3       |
| `features/toolbar/ApiReferenceToolbarBlurb.vue`               | `src/features/toolbar/toolbar-blurb.tsx`                 | Promotional text  | P3       |
| `features/toolbar/ApiReferenceToolbarShare.vue`               | `src/features/toolbar/toolbar-share.tsx`                 | Share feature     | P3       |
| `features/toolbar/ApiReferenceToolbarShareTemporary.vue`      | `src/features/toolbar/toolbar-share-temporary.tsx`       | Temp share        | P3       |
| `features/toolbar/ApiReferenceToolbarShareRegister.vue`       | `src/features/toolbar/toolbar-share-register.tsx`        | Register CTA      | P3       |
| `features/toolbar/ApiReferenceToolbarRegisterButton.vue`      | `src/features/toolbar/toolbar-register-button.tsx`       | Register button   | P3       |

---

## Phase 12: Multiple Documents

| Vue Component                                      | React Component                                         | QUI Mapping | Priority |
| -------------------------------------------------- | ------------------------------------------------------- | ----------- | -------- |
| `features/multiple-documents/DocumentSelector.vue` | `src/features/multiple-documents/document-selector.tsx` | QUI Select  | P2       |

---

## Excluded from Scope (Editing View Components)

These components are for the **editing view** (API client integration), NOT the **preview view**:

| Vue Component                                        | Reason                 | Status   |
| ---------------------------------------------------- | ---------------------- | -------- |
| `features/test-request-button/TestRequestButton.vue` | Sends API requests     | EXCLUDED |
| `blocks/scalar-auth-selector-block/*` (7 components) | Auth credential entry  | EXCLUDED |
| `OpenApiClientButton` (from @scalar/api-client)      | Opens API client modal | EXCLUDED |

**Total excluded: 9 components**

The preview view is read-only documentation display. Auth credentials and request testing are part of the editing/client view.

---

## Phase 14: Sidebar Navigation

The sidebar is critical for the preview view. Scalar uses `@scalar/sidebar` (Vue) which we need to reimplement.

| Feature              | React Implementation                           | QUI Mapping   | Priority |
| -------------------- | ---------------------------------------------- | ------------- | -------- |
| Sidebar container    | `src/components/sidebar/sidebar.tsx`           | QUI SideNav   | P0       |
| Sidebar items (tags) | `src/components/sidebar/sidebar-item.tsx`      | QUI Tree      | P0       |
| Sidebar operations   | `src/components/sidebar/sidebar-operation.tsx` | QUI Tree item | P0       |
| Expand/collapse      | Built into QUI Tree                            | QUI Tree      | P0       |
| Active item tracking | `useScrollSpy` hook                            | Custom        | P0       |
| Mobile drawer        | `src/components/sidebar/sidebar-drawer.tsx`    | QUI Drawer    | P1       |

---

## Phase 15: Operations & Content Navigation

| Vue Component                                            | React Component                                        | QUI Mapping        | Priority |
| -------------------------------------------------------- | ------------------------------------------------------ | ------------------ | -------- |
| `components/Content/Operations/TraversedEntry.vue`       | `src/components/operations/traversed-entry.tsx`        | Recursive renderer | P0       |
| `components/Content/ClientLibraries/ClientLibraries.vue` | `src/components/client-libraries/client-libraries.tsx` | Code samples       | P1       |
| `components/Content/ClientLibraries/ClientSelector.vue`  | `src/components/client-libraries/client-selector.tsx`  | QUI Select         | P1       |

---

## Hooks to Implement

| Vue Hook | React Hook                          | Description          | Priority |
| -------- | ----------------------------------- | -------------------- | -------- |
| -        | `src/hooks/use-openapi-document.ts` | Document state       | P0       |
| -        | `src/hooks/use-search.ts`           | Search functionality | P0       |
| -        | `src/hooks/use-sidebar.ts`          | Sidebar state        | P1       |
| -        | `src/hooks/use-scroll-spy.ts`       | Section tracking     | P1       |
| -        | `src/hooks/use-theme.ts`            | Theme switching      | P1       |
| -        | `src/hooks/use-layout.ts`           | Layout mode          | P1       |

---

## Component Count Summary

| Phase | Category          | Count | Priority |
| ----- | ----------------- | ----- | -------- |
| 1     | Core Components   | 14    | P0-P3    |
| 2     | Schema            | 11    | P0-P1    |
| 3     | Operation         | 13    | P0-P2    |
| 4     | Example Responses | 4     | P0       |
| 5     | Info Block        | 10    | P0-P2    |
| 6     | Tags & Models     | 8     | P0-P1    |
| 7     | Search            | 3     | P0       |
| 8     | Selectors         | 4     | P1       |
| 9     | Info Object       | 6     | P1-P2    |
| 10    | UI Components     | 15    | P0-P2    |
| 11    | Toolbar           | 13    | P2-P3    |
| 12    | Multi-docs        | 1     | P2       |
| 14    | Sidebar           | 6     | P0-P1    |
| 15    | Operations Nav    | 3     | P0-P1    |

**Total: ~111 components** (excluding 9 auth/test request components)

**Preview View Coverage**: All read-only documentation display components are included.

---

## SSR/SSG Requirements

### Browser API Guards

All hooks and utilities must be SSR-safe:

```typescript
const isBrowser = typeof window !== "undefined"

export function useScrollSpy() {
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    if (!isBrowser) return

    const observer = new IntersectionObserver(/* ... */)
    return () => observer.disconnect()
  }, [])

  return activeId
}
```

### Components Requiring Client-Side Only

- Search modal (keyboard events)
- Intersection observer components
- Scroll spy functionality
- Theme detection (matchMedia)

---

## Implementation Order

1. **Phase 0**: Package setup in qualcomm-ui
2. **Phase 1**: Core components (api-reference, section, content)
3. **Phase 2**: Schema components (critical for any API doc)
4. **Phase 3-4**: Operation + Example Responses
5. **Phase 5-6**: Info Block, Tags, Models
6. **Phase 7**: Search feature
7. **Phase 8-10**: Selectors, Info Object, UI Components
8. **Phase 11-14**: Optional features (toolbar, multi-docs)

---

## Key Architectural Decisions

1. **State Management**: React Context for document state, no global store needed
2. **Code Highlighting**: Use `@scalar/code-highlight` as dependency
3. **OpenAPI Parsing**: Use `@scalar/openapi-parser` as dependency
4. **Code Snippets**: Use `@scalar/snippetz` as dependency
5. **Search**: Fuse.js with QUI Combobox in Dialog
6. **Tables**: QUI React Table for parameter lists

---

## Styling Strategy: BEM CSS with QDS Tokens

**Approach**: BEM naming convention using QDS CSS variables for maximum portability.

### Benefits

1. No framework dependency - works with any React setup
2. No consumer build configuration needed
3. Self-contained styles in single CSS file
4. QDS tokens provide design consistency
5. Easy to override/customize

### Package Exports

```
dist/
├── index.js              # ESM components
├── index.d.ts            # TypeScript types
└── styles.css            # Bundled CSS (auto-collected from co-located files)
```

### Naming Convention: BEM + Data Attributes

```
.openapi-[block]
.openapi-[block]__[element]
.openapi-[block][data-*="value"]     (modifiers via data attributes)
```

### CSS Examples

```css
/* src/components/http-method/http-method.css */

/* === HTTP Method Badge === */
.openapi-method {
  display: inline-flex;
  align-items: center;
  padding: var(--spacing-30) var(--spacing-50);
  border-radius: var(--border-radius-sm);
  font: var(--font-static-code-sm-bold);
  text-transform: uppercase;
}

.openapi-method[data-method="get"] {
  background-color: var(--color-category-green-subtle);
  color: var(--color-category-green-strong);
}

.openapi-method[data-method="post"] {
  background-color: var(--color-category-blue-subtle);
  color: var(--color-category-blue-strong);
}

.openapi-method[data-method="put"] {
  background-color: var(--color-category-orange-subtle);
  color: var(--color-category-orange-strong);
}

.openapi-method[data-method="delete"] {
  background-color: var(--color-category-red-subtle);
  color: var(--color-category-red-strong);
}

.openapi-method[data-method="patch"] {
  background-color: var(--color-category-purple-subtle);
  color: var(--color-category-purple-strong);
}

/* === Schema Property === */
.openapi-schema-property {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-50);
  padding: var(--spacing-70);
  border-left: 2px solid var(--color-border-neutral-02);
}

.openapi-schema-property__name {
  font: var(--font-static-code-md-bold);
  color: var(--color-text-neutral-primary);
}

.openapi-schema-property__type {
  font: var(--font-static-code-sm-default);
  color: var(--color-text-neutral-secondary);
}

.openapi-schema-property__type[data-type="string"] {
  color: var(--color-category-green-strong);
}

.openapi-schema-property__type[data-type="number"],
.openapi-schema-property__type[data-type="integer"] {
  color: var(--color-category-blue-strong);
}

.openapi-schema-property__type[data-type="boolean"] {
  color: var(--color-category-purple-strong);
}

.openapi-schema-property__type[data-type="object"] {
  color: var(--color-category-orange-strong);
}

.openapi-schema-property__type[data-type="array"] {
  color: var(--color-category-cyan-strong);
}

.openapi-schema-property__description {
  font: var(--font-static-body-sm-default);
  color: var(--color-text-neutral-secondary);
}

.openapi-schema-property[data-required]::after {
  content: "*";
  color: var(--color-text-support-danger);
  margin-left: var(--spacing-30);
}

/* === Section === */
.openapi-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-100);
}

.openapi-section__header {
  display: flex;
  align-items: center;
  gap: var(--spacing-70);
  padding-bottom: var(--spacing-70);
  border-bottom: 1px solid var(--color-border-neutral-02);
}

.openapi-section__title {
  font: var(--font-static-heading-md-bold);
  color: var(--color-text-neutral-primary);
}

.openapi-section__content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-70);
}

/* === Operation === */
.openapi-operation {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-100);
  padding: var(--spacing-100);
  background: var(--color-surface-secondary);
  border-radius: var(--border-radius-md);
}

.openapi-operation__header {
  display: flex;
  align-items: center;
  gap: var(--spacing-70);
}

.openapi-operation__path {
  font: var(--font-static-code-md-default);
  color: var(--color-text-neutral-primary);
}

.openapi-operation__summary {
  font: var(--font-static-heading-sm-default);
  color: var(--color-text-neutral-primary);
}

.openapi-operation__description {
  font: var(--font-static-body-md-default);
  color: var(--color-text-neutral-secondary);
}

/* === Parameter List === */
.openapi-parameters {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-50);
}

.openapi-parameters__item {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: var(--spacing-70);
  padding: var(--spacing-70);
  border-bottom: 1px solid var(--color-border-neutral-01);
}

.openapi-parameters__item:last-child {
  border-bottom: none;
}

/* === Response === */
.openapi-response {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-70);
}

.openapi-response__status {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-40);
  font: var(--font-static-code-md-bold);
}

.openapi-response__status[data-status^="2"] {
  color: var(--color-text-support-success);
}

.openapi-response__status[data-status^="4"] {
  color: var(--color-text-support-warning);
}

.openapi-response__status[data-status^="5"] {
  color: var(--color-text-support-danger);
}
```

### CSS File Organization

CSS files are co-located with components and bundled automatically:

```
src/
├── components/
│   ├── http-method/
│   │   ├── http-method.tsx
│   │   └── http-method.css
│   ├── schema/
│   │   ├── schema.tsx
│   │   ├── schema.css
│   │   ├── schema-property.tsx
│   │   ├── schema-property.css
│   │   ├── schema-composition.tsx
│   │   └── schema-composition.css
│   ├── section/
│   │   ├── section.tsx
│   │   ├── section.css
│   │   ├── section-header.tsx
│   │   └── section-header.css
│   ├── badge/
│   │   ├── badge.tsx
│   │   └── badge.css
│   ├── anchor/
│   │   ├── anchor.tsx
│   │   └── anchor.css
│   └── ...
├── features/
│   ├── operation/
│   │   ├── operation.tsx
│   │   ├── operation.css
│   │   ├── components/
│   │   │   ├── operation-parameters.tsx
│   │   │   ├── operation-parameters.css
│   │   │   ├── operation-responses.tsx
│   │   │   └── operation-responses.css
│   │   └── layouts/
│   │       ├── classic-layout.tsx
│   │       ├── classic-layout.css
│   │       ├── modern-layout.tsx
│   │       └── modern-layout.css
│   ├── example-responses/
│   │   ├── example-responses.tsx
│   │   ├── example-responses.css
│   │   ├── example-response.tsx
│   │   └── example-response.css
│   ├── search/
│   │   ├── search-modal.tsx
│   │   ├── search-modal.css
│   │   ├── search-button.tsx
│   │   └── search-button.css
│   └── ...
├── blocks/
│   ├── info-block/
│   │   ├── info-block.tsx
│   │   ├── info-block.css
│   │   └── ...
│   └── server-selector/
│       ├── server-selector.tsx
│       └── server-selector.css
└── index.ts
```

**CSS Workflow:**

1. CSS files are co-located with components
2. Bundler collects all `.css` files automatically
3. CSS is bundled into a single global stylesheet
4. Consumer imports the global stylesheet once
5. Must use qds-core tokens for styling, available at `/home/rbower/code/qualcomm-ui/packages/common/qds-core/src/styles/qualcomm-dark.css`

Components do NOT import CSS:

```tsx
// http-method.tsx
export interface HttpMethodProps {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS" | "HEAD"
}

export function HttpMethod({method}: HttpMethodProps) {
  return (
    <span className="openapi-method" data-method={method.toLowerCase()}>
      {method}
    </span>
  )
}
```
