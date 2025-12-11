# Vue to React Migration Checklist

## Overview

- **Source**: `@scalar/api-reference` (Scalar)
- **Target**: `@qualcomm-ui/react-open-api`
- **Total Components**: ~111 (preview view only)

---

## Phase 0: Package Setup

- [x] Create package directory structure
- [x] Configure `package.json`
- [x] Configure `tsconfig.json`
- [x] Configure `vite.config.ts`
- [x] Set up CSS bundling

---

## Phase 1: Core Components

### Main Entry

- [ ] `api-reference.tsx` (from `ApiReference.vue`)
- [ ] `content.tsx` (from `Content/Content.vue`)
- [ ] `getting-started.tsx` (from `GettingStarted.vue`)

### Section Components

- [x] `section/section.tsx` (from `Section/Section.vue`)
- [x] `section/section-column.tsx` (from `Section/SectionColumn.vue`)
- [x] `section/section-columns.tsx` (from `Section/SectionColumns.vue`)
- [x] `section/section-container.tsx` (from `Section/SectionContainer.vue`)
- [x] `section/section-content.tsx` (from `Section/SectionContent.vue`)
- [x] `section/section-header.tsx` (from `Section/SectionHeader.vue`)
- [ ] `section/section-header-tag.tsx` (from `Section/SectionHeaderTag.vue`)
- [ ] `section/section-accordion.tsx` (from `Section/SectionAccordion.vue`)
- [ ] `section/section-container-accordion.tsx` (from `Section/SectionContainerAccordion.vue`)
- [ ] `section/compact-section.tsx` (from `Section/CompactSection.vue`)
- [ ] `section-flare/section-flare.tsx` (from `SectionFlare/SectionFlare.vue`)

---

## Phase 2: Schema Components

- [x] `schema/schema.tsx` (from `Schema/Schema.vue`)
- [x] `schema/schema-property.tsx` (from `Schema/SchemaProperty.vue`)
- [x] `schema/schema-property-heading.tsx` (from `Schema/SchemaPropertyHeading.vue`)
- [x] `schema/schema-property-detail.tsx` (from `Schema/SchemaPropertyDetail.vue`)
- [x] removed (from `Schema/SchemaPropertyExamples.vue`)
- [x] `schema/schema-object-properties.tsx` (from `Schema/SchemaObjectProperties.vue`)
- [x] `schema/schema-composition.tsx` (from `Schema/SchemaComposition.vue`)
- [x] `schema/schema-heading.tsx` (from `Schema/SchemaHeading.vue`)
- [x] `schema/schema-enum-values.tsx` (from `Schema/SchemaEnumValues.vue`)
- [x] `schema/schema-enum-property-item.tsx` (from `Schema/SchemaEnumPropertyItem.vue`)
- [x] `schema/render-string.tsx` (from `Schema/RenderString.vue`)

---

## Phase 3: Operation Components

### Main Operation

- [x] `components/operation/operation.tsx` (from `Operation/Operation.vue`)
- [ ] `components/operation/layouts/classic-layout.tsx` (from `Operation/layouts/ClassicLayout.vue`)
- [ ] `components/operation/layouts/modern-layout.tsx` (from `Operation/layouts/ModernLayout.vue`)

### Operation Sub-components

- [x] `components/operation/operation-parameters.tsx` (from `OperationParameters.vue`)
- [x] `components/operation/parameter-list.tsx` (from `ParameterList.vue`)
- [x] `components/operation/parameter-list-item.tsx` (from `ParameterListItem.vue`)
- [x] `components/operation/operation-responses.tsx` (from `OperationResponses.vue`)
- [x] `components/operation/response-item.tsx` (new)
- [x] `components/operation/request-body.tsx` (from `RequestBody.vue`)
- [ ] `components/operation/headers.tsx` (from `Headers.vue`)
- [ ] `components/operation/header.tsx` (from `Header.vue`)
- [ ] `components/operation/content-type-select.tsx` (from `ContentTypeSelect.vue`)
- [ ] `components/operation/callbacks/callbacks.tsx` (from `Callbacks.vue`)
- [ ] `components/operation/callbacks/callback.tsx` (from `Callback.vue`)

---

## Phase 4: Example Responses

- [x] `components/example-responses/example-responses.tsx` (from `ExampleResponses.vue`)
- [x] `components/example-responses/example-response.tsx` (from `ExampleResponse.vue`)
- [ ] `components/example-responses/example-response-tab.tsx` (from `ExampleResponseTab.vue`)
- [ ] `components/example-responses/example-response-tab-list.tsx` (from `ExampleResponseTabList.vue`)

---

## Phase 5: Info Block Components

- [x] `components/info-block/info-block.tsx` (from `InfoBlock.vue`)
- [x] `components/info-block/info-description.tsx` (from `InfoDescription.vue`)
- [x] `components/info-block/info-version.tsx` (from `InfoVersion.vue`)
- [x] `components/info-block/info-links.tsx` (from `InfoLinks.vue`)
- [ ] `components/info-block/info-markdown-section.tsx` (from `InfoMarkdownSection.vue`)
- [ ] `components/info-block/introduction-layout.tsx` (from `IntroductionLayout.vue`)
- [ ] `components/info-block/introduction-card.tsx` (from `IntroductionCard.vue`)
- [ ] `components/info-block/introduction-card-item.tsx` (from `IntroductionCardItem.vue`)
- [ ] `components/info-block/openapi-version.tsx` (from `OpenApiVersion.vue`)
- [ ] `components/info-block/download-link.tsx` (from `DownloadLink.vue`)

---

## Phase 6: Tag & Model Components

### Tags

- [x] `components/tag/tag.tsx` (from `Tags/Tag.vue`)
- [ ] `components/tag/tag-section.tsx` (from `Tags/TagSection.vue`)
- [ ] `components/tag/classic-layout.tsx` (from `Tags/ClassicLayout.vue`)
- [ ] `components/tag/modern-layout.tsx` (from `Tags/ModernLayout.vue`)

### Models

- [x] `components/model/model.tsx` (from `Models/Model.vue`)
- [ ] `components/model/model-tag.tsx` (from `Models/ModelTag.vue`)
- [ ] `components/model/classic-layout.tsx` (from `Models/ClassicLayout.vue`)
- [ ] `components/model/modern-layout.tsx` (from `Models/ModernLayout.vue`)

### Types Consolidation

- [x] Added `@scalar/openapi-types` as dependency
- [x] Created `src/types.ts` re-exporting OpenAPI types (SchemaObject, ParameterObject, etc.)
- [x] Refactored all components to use shared types instead of local definitions

---

## Phase 7: Search Feature

- [x] `features/search/search-modal.tsx` (from `SearchModal.vue`)
- [x] `features/search/search-button.tsx` (from `SearchButton.vue`)
- [x] `features/search/search-result.tsx` (from `SearchResult.vue`)
- [x] `features/search/index.ts`
- [x] CSS files for search components

---

## Phase 8: Server & Client Selectors

### Server Selector

- [x] `blocks/server-selector/server-selector.tsx` (from `ServerSelector.vue`)
- [x] `blocks/server-selector/server-selector.css`
- [x] `blocks/server-selector/index.ts`

### Client Selector

- [x] `blocks/client-selector/client-selector.tsx` (from `ClientSelector.vue`)
- [x] `blocks/client-selector/client-selector.css`
- [x] `blocks/client-selector/index.ts`

---

## Phase 9: Info Object Features

- [x] `features/info-object/contact.tsx` (from `Contact.vue`)
- [x] `features/info-object/license.tsx` (from `License.vue`)
- [x] `features/info-object/terms-of-service.tsx` (from `TermsOfService.vue`)
- [x] `features/info-object/info-object.css`
- [x] `features/info-object/index.ts`
- [x] `features/external-docs/external-docs.tsx` (from `ExternalDocs.vue`)
- [x] `features/external-docs/external-docs.css`
- [x] `features/external-docs/index.ts`
- [ ] `features/specification-extension/specification-extension.tsx` (from `SpecificationExtension.vue`)
- [ ] `features/x-badges/x-badges.tsx` (from `XBadges.vue`)

---

## Phase 10: UI Components

### RenderLink Context (Client-side Navigation)

Following the pattern from `@qualcomm-ui/react-mdx`, client-side links use the `RenderLink` abstraction:

- [x] `context/open-api-context.tsx` - Context providing `RenderLink`, `pathname`, `basePath`, `onNavigate`
- [x] `context/index.ts` - Barrel export

The `RenderLink` type allows consumers to provide their own client-side router link component:

```typescript
type RenderLink = (
  props: HTMLAttributes<HTMLAnchorElement> & {href: string},
) => ReactNode
```

Usage:

```tsx
import {OpenApiProvider} from "@qualcomm-ui/react-open-api"
import {Link} from "next/link" // or react-router, etc.
;<OpenApiProvider renderLink={(props) => <Link {...props} />}>
  <ApiReference />
</OpenApiProvider>
```

### Display Components

- [x] `components/http-method/http-method.tsx` (from `HttpMethod.vue`)
- [x] `components/badge/badge.tsx` (from `Badge.vue`)
- [x] `components/operation-path/operation-path.tsx` (from `OperationPath.vue`)
- [x] `components/show-more-button/show-more-button.tsx` (from `ShowMoreButton.vue`)
- [x] `components/loading-skeleton/loading-skeleton.tsx` (from `LoadingSkeleton.vue`)
- [ ] `components/screen-reader.tsx` (from `ScreenReader.vue`)

### Navigation Components (use RenderLink from context)

- [x] `components/anchor/anchor.tsx` - Uses `useOpenApiContext().renderLink`
- [x] `components/anchor/anchor.css`
- [x] `components/operations-list/operations-list.tsx` - Uses `useOpenApiContext().renderLink`
- [x] `components/operations-list/operations-list-item.tsx`
- [x] `components/operations-list/operations-list.css`
- [x] `components/link-list/link-list.tsx` - Uses `useOpenApiContext().renderLink`
- [x] `components/link-list/link-list.css`

### Header Components

- [ ] `components/classic-header.tsx` (from `ClassicHeader.vue`)
- [ ] `components/mobile-header.tsx` (from `MobileHeader.vue`)

### Utility Components

- [ ] `components/lazy/lazy.tsx` (from `Lazy.vue`)
- [ ] `components/intersection-observer.tsx` (from `IntersectionObserver.vue`)
- [ ] `components/render-plugins/render-plugins.tsx` (from `RenderPlugins.vue`)

---

## Phase 11: Toolbar (Optional)

- [ ] `features/toolbar/api-reference-toolbar.tsx` (from `ApiReferenceToolbar.vue`)
- [ ] `features/toolbar/toolbar-title.tsx` (from `ApiReferenceToolbarTitle.vue`)
- [ ] `features/toolbar/toolbar-popover.tsx` (from `ApiReferenceToolbarPopover.vue`)
- [ ] `features/toolbar/toolbar-config.tsx` (from `ApiReferenceToolbarConfig.vue`)
- [ ] `features/toolbar/toolbar-config-layout.tsx` (from `ApiReferenceToolbarConfigLayout.vue`)
- [ ] `features/toolbar/toolbar-config-layout-options.tsx` (from `ApiReferenceToolbarConfigLayoutOptions.vue`)
- [ ] `features/toolbar/toolbar-config-theme.tsx` (from `ApiReferenceToolbarConfigTheme.vue`)
- [ ] `features/toolbar/toolbar-sdks.tsx` (from `ApiReferenceToolbarSdks.vue`)
- [ ] `features/toolbar/toolbar-blurb.tsx` (from `ApiReferenceToolbarBlurb.vue`)
- [ ] `features/toolbar/toolbar-share.tsx` (from `ApiReferenceToolbarShare.vue`)
- [ ] `features/toolbar/toolbar-share-temporary.tsx` (from `ApiReferenceToolbarShareTemporary.vue`)
- [ ] `features/toolbar/toolbar-share-register.tsx` (from `ApiReferenceToolbarShareRegister.vue`)
- [ ] `features/toolbar/toolbar-register-button.tsx` (from `ApiReferenceToolbarRegisterButton.vue`)

---

## Phase 12: Multiple Documents

- [ ] `features/multiple-documents/document-selector.tsx` (from `DocumentSelector.vue`)

---

## Phase 14: Sidebar Navigation

- [ ] `components/sidebar/sidebar.tsx` (custom implementation)
- [ ] `components/sidebar/sidebar-item.tsx` (custom implementation)
- [ ] `components/sidebar/sidebar-operation.tsx` (custom implementation)
- [ ] `components/sidebar/sidebar-drawer.tsx` (custom implementation)

---

## Phase 15: MVP ApiReference Component

### Main Component

- [x] `api-reference/api-reference.tsx` - Main entry point that renders full OpenAPI docs
- [x] `api-reference/api-reference.css`
- [x] `api-reference/index.ts`

### Features

- Renders Info section with title, description, version
- Groups operations by tags
- Renders each operation with method, path, parameters, responses
- Renders Models section with schemas
- Supports `modern` and `classic` layout variants
- Integrates with `OpenApiProvider` for client-side routing

### Usage

```tsx
import {ApiReference} from "@qualcomm-ui/react-open-api"
import spec from "./openapi.json"
;<ApiReference
  document={spec}
  layout="modern"
  renderLink={(props) => <Link {...props} />}
/>
```

---

## Hooks

- [x] `hooks/use-openapi-document.ts` - Parses OpenAPI document into renderable structure
- [x] `hooks/index.ts`
- [ ] `hooks/use-search.ts`
- [ ] `hooks/use-sidebar.ts`
- [ ] `hooks/use-scroll-spy.ts`
- [ ] `hooks/use-theme.ts`
- [ ] `hooks/use-layout.ts`

---

## CSS Files

### Components CSS

- [x] `components/http-method/http-method.css`
- [x] `components/schema/schema.css`
- [x] `components/schema/schema-property.css`
- [x] `components/schema/schema-property-detail.css`
- [x] `components/schema/schema-property-examples.css`
- [x] `components/schema/schema-property-heading.css`
- [x] `components/schema/schema-enum-property-item.css`
- [x] `components/schema/schema-enum-values.css`
- [x] `components/schema/schema-heading.css`
- [x] `components/schema/schema-composition.css`
- [x] `components/section/section.css`
- [x] `components/section/section-column.css`
- [x] `components/section/section-columns.css`
- [x] `components/section/section-container.css`
- [x] `components/section/section-content.css`
- [x] `components/section/section-header.css`
- [x] `components/badge/badge.css`
- [ ] `components/anchor/anchor.css`
- [ ] `components/sidebar/sidebar.css`

### Features CSS

- [ ] `features/operation/operation.css`
- [ ] `features/operation/layouts/classic-layout.css`
- [ ] `features/operation/layouts/modern-layout.css`
- [ ] `features/example-responses/example-responses.css`
- [ ] `features/search/search-modal.css`

### Blocks CSS

- [ ] `blocks/info-block/info-block.css`
- [ ] `blocks/server-selector/server-selector.css`
- [ ] `blocks/client-selector/client-selector.css`

---

## Testing

- [ ] Unit tests for hooks
- [ ] Component tests for core components
- [ ] Integration tests for main flows
- [ ] SSR compatibility tests

---

## Documentation

- [ ] README.md
- [ ] Consumer usage examples
- [ ] Props documentation (auto-generated)
