# @qualcomm-ui/mdx-vite

## NEXTGEN

- added `demoPlugin`. TODO: rename to `reactDemoPlugin` and explain.
- added `angularDemoPlugin`. TODO: explain.
- `rehype-slug` is no longer a peer dependency. We now export a modified version of this.
- breaking: if `allowedHeadings` is supplied in the QUI Docs config, it must also be provided to the `rehype-slug` plugin in the rehypePlugins section of your vite config. Alternatively, you can migrate to the new `getRemarkPlugins()` export which automatically loads the config to read the correct settings.
- fixed a bug that caused heading level id misalignment with the ToC's generated anchor links.

## 8.0.0

March 24th, 2025

```json defaultCollapsed label="Package Versions"
{
  "@qualcomm-ui/mdx-docs-common": "^4.0.0",
  "@qualcomm-ui/mdx-vite": "^8.0.0"
}
```

##### Highlights

- feat (doc-props-indexer): doc props id's are now generated on the backend to fix collisions with heading elements
- refactor (doc-props-indexer): move UniqueIdService reset to `reset()` method call for consistency with page-level reset
- refactor (doc-props-indexer): update `getDocProps` to return `PageDocProps`
- refactor (doc-props-indexer): refactor prop assembly to include an id in the `pageDocProps` entry

## 7.1.1

January 27th, 2025

```json defaultCollapsed label="Package Versions"
{
  "@qualcomm-ui/mdx-docs-common": "^3.0.4",
  "@qualcomm-ui/mdx-vite": "^7.1.1"
}
```

##### Highlights

- fix (NavBuilder): layout routes no longer cause their parent route to become a navigable page.

## 7.1.0

January 1st, 2025

```json defaultCollapsed label="Package Versions"
{
  "@qualcomm-ui/mdx-docs-common": "^3.0.3",
  "@qualcomm-ui/mdx-vite": "^7.1.0"
}
```

##### Highlights

- feat (SearchIndexer): enabled composition. The constructor now accepts an optional third property: `addons`. Each module can now be overridden: `DocPropsIndexer`, `MarkdownFileReader`, `MarkdownIndexer`, and `NavBuilder`.
- dev: restructured and renamed some internal modules for organization.

## 7.0.2

December 22nd, 2024

```json defaultCollapsed label="Package Versions"
{
  "@qualcomm-ui/mdx-docs-common": "^3.0.1",
  "@qualcomm-ui/mdx-vite": "^7.0.2"
}
```

##### Highlights

- (config resolver): corrected the documentation site link in the "Config Not Found" error output.

## 7.0.1

December 17th, 2024

```json defaultCollapsed label="Package Versions"
{
  "@qualcomm-ui/mdx-docs-common": "^3.0.1",
  "@qualcomm-ui/mdx-vite": "^7.0.1"
}
```

##### Highlights

- fix (watch mode): fixed a bug that was preventing HMR from triggering when `typeDocProps` was not provided.

## 7.0.0

December 12th, 2024

```json defaultCollapsed label="Package Versions"
{
  "@qualcomm-ui/mdx-docs-common": "^3.0.1",
  "@qualcomm-ui/mdx-vite": "^7.0.0"
}
```

##### Highlights

React Router and Remix have merged in [react-router v7](https://remix.run/blog/react-router-v7). We've changed the default routing strategy to Hybrid Routes via the [remix-flat-routes](https://github.com/kiliman/remix-flat-routes?tab=readme-ov-file#hybrid-routes) package. This lends to more convenient folder nesting than the old Remix route configuration. Refer to the updated [Page Setup](https://docs.qui.qualcomm.com/guide/page-setup) guide for an overview of the new approach.

This update also features a change to plugin configuration authoring. The plugin is now configured using a separate config file ala `qui-docs.config.ts`. As a result, config file edits in dev mode are significantly faster than before.

- breaking (Plugin): renamed `mdxDocsPlugin` to `quiDocsPlugin`.
- breaking (Config): the plugin configuration has moved from the `vite.config.ts` to `qui-docs.config.ts`. Consult the [documentation](https://docs.qui.qualcomm.com/guide/page-setup#nav-config) for more information.
- breaking (TypeDocProps): the `typeDocProps` option is now a string representing the relative path to the compiled doc props json file.
- breaking (Config): removed the `experimental` property. The `typeDocProps` option is now supplied at the root of the config.
- breaking (Config): renamed `MdxDocsPluginOptions` to `QuiDocsOptions`.
- breaking (Config): renamed `router` to `routingStrategy`. This type is now optional and parses our hybrid routes configuration by default. You may optionally provide a function to tailor the path segment generation to custom routes.
- breaking (Config): the id of the home page navConfig entry has been changed from `root` to `_index`.
- breaking (AppFrontmatter): this property was deprecated in v1.2.0 and has been removed.
- breaking (DocsFrontmatter): renamed to `PageFrontmatter` for clarity.
- feat (Nav): default route titles are now transformed to `Capital Case`.
- dev (tsconfig): optimized tsconfig files with project references.

## 6.0.0

December 4th, 2024

```json defaultCollapsed label="Package Versions"
{
  "@qualcomm-ui/mdx-docs-common": "^3.0.0",
  "@qualcomm-ui/mdx-vite": "^6.0.0"
}
```

##### Highlights

- breaking (DocPropsIndexer): Changed the type definition import from `QuiReactPropTypes` to `QuiPropTypes`.
- breaking (SearchIndexer): Changed the type definition import from `QuiReactPropTypes` to `QuiPropTypes`.
- breaking (Types): Changed the type definition import from `QuiReactPropTypes` to `QuiPropTypes`.
- dev: Updated `@vitest/coverage-v8` and `@vitest/ui` to `^2.1.8`.
- dev: Updated `vitest` to `^2.1.8`.
- fix: Added `--pool=threads` option to `test:unit:ci` script.

## 5.4.2

November 18th, 2024

```json defaultCollapsed label="Package Versions"
{
  "@qualcomm-ui/mdx-docs-common": "^2.4.1",
  "@qualcomm-ui/mdx-vite": "^5.4.2"
}
```

##### Highlights

- fix (remix-flat-routes): added missing .index route detection.

## 5.4.1

November 2nd, 2024

```json defaultCollapsed label="Package Versions"
{
  "@qualcomm-ui/mdx-docs-common": "^2.4.1",
  "@qualcomm-ui/mdx-vite": "^5.4.1"
}
```

##### Highlights

- fix (SearchIndexer): fixed type import.

## 5.4.0

August 15th, 2024

```json defaultCollapsed label="Package Versions"
{
  "@qualcomm-ui/mdx-docs-common": "^2.3.0",
  "@qualcomm-ui/mdx-vite": "^5.4.0"
}
```

##### Highlights

- feat (SearchIndexer): added experimental support for [remix-flat-routes](https://github.com/kiliman/remix-flat-routes).
- fix (MarkdownIndexer): the search index no longer ignores content on pages with a single paragraph element.
- fix (SearchIndexer): the page's ToC is no longer added to each search index entry.
- fix (SearchIndexer): the root page's title now shows up as expected in relevant search queries.
- chore: reorganized path parsing utils for better scalability.
- chore: reorganized mdx file glob filtering for better scalability.

## 5.3.1

August 8th, 2024

```json defaultCollapsed label="Package Versions"
{
  "@qualcomm-ui/mdx-docs-common": "^2.3.0",
  "@qualcomm-ui/mdx-vite": "^5.3.1"
}
```

##### Highlights

- fix (MdxDocsPlugin): Windows paths are now parsed as absolute. Fixes an issue with some configurations where paths were not assembled into the navConfig as expected.

## 5.3.0

August 1st, 2024

```json defaultCollapsed label="Package Versions"
{
  "@qualcomm-ui/mdx-docs-common": "^2.3.0",
  "@qualcomm-ui/mdx-vite": "^5.3.0"
}
```

##### Highlights

- feat (nav): Enhanced the navigation system by adding support for section titles and separators. This allows for better organization of content in the sidebar.
- Deprecated `routeMeta` property in favor of `navConfig` for defining nav item hierarchy and page metadata. Updated documentation accordingly to reflect these changes.

## 5.2.3

July 10th, 2024

```json defaultCollapsed label="Package Versions"
{
  "@qualcomm-ui/mdx-docs-common": "^2.2.3",
  "@qualcomm-ui/mdx-vite": "^5.2.3"
}
```

##### Highlights

- Loosened the peer dependencies for `@qui` packages.

## 5.2.2

July 9th, 2024

```json defaultCollapsed label="Package Versions"
{
  "@qualcomm-ui/mdx-docs-common": "2.2.2",
  "@qualcomm-ui/mdx-vite": "5.2.2"
}
```

##### Highlights

- Update dependencies: `@qualcomm-ui/mdx-docs-common`

## 5.2.1

July 8th, 2024

```json defaultCollapsed label="Package Versions"
{
  "@qualcomm-ui/mdx-docs-common": "2.2.1",
  "@qualcomm-ui/mdx-vite": "5.2.1"
}
```

##### Highlights

- fix (MdxDocsPlugin): Fixed a bug that was preventing the file glob from detecting MDX files on Windows.

## 5.2.0

June 28th, 2024

```json defaultCollapsed label="Package Versions"
{
  "@qualcomm-ui/mdx-docs-common": "2.2.1",
  "@qualcomm-ui/mdx-vite": "5.2.0"
}
```

##### Highlights

- Update dependencies: `@qualcomm-ui/mdx-docs-common`
- feat (SearchIndexer): the initial frontmatter parser now only checks the frontmatter section of the file (big performance increase for large files).
- feat (MarkdownIndexer): mermaid code snippets are now ignored.
- feat (MdxDocsPluginOptions): consolidated types. Now extends `SearchIndexerOptions`.

## 5.1.2

June 27th, 2024

```json defaultCollapsed label="Package Versions"
{
  "@qualcomm-ui/mdx-docs-common": "2.2.0",
  "@qualcomm-ui/mdx-vite": "5.1.2"
}
```

##### Highlights

- fix (DocProps): the hash is no longer missing from links to doc props in the search index.
- fix (mdxDocsPlugin): the exported remark and rehype plugin arrays now have the `PluggableList` type.pbp

## 5.1.1

June 27th, 2024

```json defaultCollapsed label="Package Versions"
{
  "@qualcomm-ui/mdx-docs-common": "2.2.0",
  "@qualcomm-ui/mdx-vite": "5.1.1"
}
```

##### Highlights

- fix (RouteMeta): added missing `sideNavTitle` property.
- fix (NavBuilder): The `sideNavTitle` is now factored into the side nav if supplied on either the frontmatter or routeMeta.

## 5.1.0

June 26th, 2024

```json defaultCollapsed label="Package Versions"
{
  "@qualcomm-ui/mdx-docs-common": "2.2.0",
  "@qualcomm-ui/mdx-vite": "5.1.0"
}
```

##### Highlights

- Update dependencies: `@qualcomm-ui/mdx-docs-common`
- fix (MarkdownIndexer): fixed a bug that was preventing the last section of each page from being indexed.

## 5.0.2

June 26th, 2024

##### Versions

```json defaultCollapsed label="Package Versions"
{
  "@qualcomm-ui/mdx-docs-common": "2.1.0",
  "@qualcomm-ui/mdx-vite": "5.0.2"
}
```

##### Highlights

- Update dependencies: `@qualcomm-ui/mdx-docs-common`

## 5.0.1

June 24th, 2024

##### Versions

```json defaultCollapsed label="Package Versions"
{
  "@qualcomm-ui/mdx-docs-common": "2.0.0",
  "@qualcomm-ui/mdx-vite": "5.0.1"
}
```

##### Highlights

- fix: moved necessary `dependencies` from `devDependencies` to `dependencies`.

## 5.0.0

June 23rd, 2024

##### Versions

```json defaultCollapsed label="Package Versions"
{
  "@qualcomm-ui/mdx-docs-common": "2.0.0",
  "@qualcomm-ui/mdx-vite": "5.0.0"
}
```

##### Highlights

- Update dependencies: `@qualcomm-ui/mdx-docs-common`
- breaking: added missing peerDependencies: `rehype-mdx-code-props`, `remark-frontmatter`, `remark-gfm`, `remark-mdx-frontmatter`.
- breaking: renamed `RouteMetaEntry` type to `RouteMeta`.
- breaking: removed the `RouteMeta.order` property. This has been replaced with `ignoreRouteMetaOrder`.
- breaking: renamed the `RouteMeta["."]` property to `RouteMeta.children`.
- feat: completely restructured the HTML parsing process using rehype utilities. Parsing is significantly faster and far more reliable.
- feat: added `remarkAlerts` plugin for creating inline alerts with blockquotes.
- feat: added `rehypeQuiPlugins` export. Any new QUI rehype plugins will be added to this array. This should be spread onto the consuming app's Vite MDX plugin for forward compat.
- feat: added `remarkQuiPlugins` export. Any new QUI remark plugins will be added to this array. This should be spread onto the consuming app's Vite MDX plugin for forward compat.
- feat: added `experimental.typeDocProps` option to plugin. If props are supplied, they will be built into the search index for each page, where applicable.

## 4.1.0

June 19th, 2024

##### Versions

```json defaultCollapsed label="Package Versions"
{
  "@qualcomm-ui/mdx-docs-common": "1.2.0",
  "@qualcomm-ui/mdx-vite": "4.1.0"
}
```

##### Highlights

- feat: added `order` property to RouteMetaEntry. This property determines the strategy for ordering the item in the side navigation relative to its adjacent items.

## 4.0.0

June 19th, 2024

##### Versions

```json defaultCollapsed label="Package Versions"
{
  "@qualcomm-ui/mdx-docs-common": "1.2.0",
  "@qualcomm-ui/mdx-vite": "4.0.0"
}
```

##### Highlights

- Update dependencies: `@qualcomm-ui/mdx-docs-common`
- breaking: Removed the RouteMeta Record configuration option. RouteMeta can only be supplied as an array.
- breaking: Removed the RouteMetaEntry `order` property.
- fix: Adjusted build logs in dev mode to account for vite.config.ts edits, which restart the build process.
- feat: added the ability to hide the page links per page using the `hidePageLinks` frontmatter/routeMeta.
- feat: added the ability to hide the side navigation per page using the `hideSideNav` frontmatter/routeMeta.
- feat: added the ability to hide a page from page links and the side navigation using the `hidden` frontmatter/routeMeta.
- feat: almost all the frontmatter properties can now be defined in the routeMeta. If both exist, the routeMeta entry takes precedence over the page's frontmatter.
- feat: routes ending with `.tsx` are now parsed if they have a corresponding routeMeta entry.

## 3.1.2

June 16th, 2024

##### Versions

```json
{
  "@qualcomm-ui/mdx-docs-common": "1.1.0",
  "@qualcomm-ui/mdx-vite": "3.1.2"
}
```

##### Highlights

- fix (Vite Plugin): removed duplicate logs in dev mode.

## 3.1.1

June 12th, 2024

##### Versions

```json
{
  "@qualcomm-ui/mdx-docs-common": "1.1.0",
  "@qualcomm-ui/mdx-vite": "3.1.1"
}
```

##### Highlights

- fix (SearchIndexer): the `RouteMeta` is now factored into the `categories` generation.
- fix (SearchIndexer): the frontmatter title now applies to the last path segment of a page's `categories`.
- fix (NavBuilder): fixed route collision detection for routes with the same path segment under different parents.

## 3.1.0

June 10th, 2024

##### Versions

```json
{
  "@qualcomm-ui/mdx-docs-common": "1.1.0",
  "@qualcomm-ui/mdx-vite": "3.1.0"
}
```

##### Highlights

- Update dependencies: `@qualcomm-ui/mdx-docs-common`
- fix (NavBuilder): parent routes are now defined eagerly instead of on-demand. This fixes a bug that was preventing some routes from being included in the nav item hierarchy.
- feat: RouteMeta can now be provided as an array.

## 3.0.0

May 30th, 2024

##### Versions

```json
{
  "@qualcomm-ui/mdx-docs-common": "1.0.0",
  "@qualcomm-ui/mdx-vite": "3.0.0"
}
```

##### Highlights

- breaking: added the `pageDirectory` input, which is now required.
- breaking: added the `router` input, which is now required.
- feat: added support for Vite applications using [generouted](https://github.com/oedotme/generouted).

## 2.0.0

May 27th, 2024

##### Versions

```json
{
  "@qualcomm-ui/mdx-docs-common": "1.0.0",
  "@qualcomm-ui/mdx-vite": "2.0.0"
}
```

##### Highlights

- breaking: added `@qualcomm-ui/mdx-docs-common` peerDependency.
- removed `@qualcomm-ui/mdx-docs` peerDependency. Shared types and utilities have been moved to `@qualcomm-ui/mdx-docs`.
- removed `react` dependencies.
- removed `remix` dependencies.

## 1.0.4

May 26th, 2024

##### Versions

```json
{
  "@qualcomm-ui/mdx-docs": "1.0.3",
  "@qualcomm-ui/mdx-vite": "1.0.4"
}
```

##### Highlights

- Update dependencies: `@qualcomm-ui/mdx-docs`

## 1.0.3

May 22nd, 2024

##### Versions

```json
{
  "@qualcomm-ui/mdx-docs": "1.0.2",
  "@qualcomm-ui/mdx-vite": "1.0.3"
}
```

##### Highlights

- Update dependencies: `@qualcomm-ui/mdx-docs`

## 1.0.2

May 22nd, 2024

- fix: glob dependency updated.
- fix: many `devDependencies` have been moved to `dependencies`.

## 1.0.1

May 22nd, 2024

- dev: scripts update.

## 1.0.0

May 22nd, 2024

- Initial release.
