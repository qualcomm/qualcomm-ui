// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {z, type ZodObject, type ZodSafeParseResult, type ZodSchema} from "zod"

import type {FolderNavConfig, NavMeta, RouteMeta} from "../nav-builder/types.js"

import type {
  KnowledgeConfig,
  KnowledgeExtraFile,
  PagesExportConfig,
  QuiDocsConfig,
  QuiDocsLintOptions,
  QuiDocsTypeDocOptions,
  SectionExportConfig,
} from "./types.js"
import type {Implements} from "./zod.js"

function implement<Model = never>() {
  return {
    with: <
      Schema extends Implements<Model> & {
        [unknownKey in Exclude<keyof Schema, keyof Model>]: never
      },
    >(
      schema: Schema,
    ) => z.object(schema),
  }
}

export const navMetaSchema: ZodObject<{}> = implement<NavMeta>().with({
  id: z.never().optional(),
  sectionTitle: z.string().optional(),
  separator: z.boolean().optional(),
})

/**
 * Descriptions are included in the generated `_nav.json` JSON Schema, which
 * editors show on hover and in autocomplete. Keep them in sync with the JSDoc in
 * `nav-builder/types.ts`.
 */
const routeMetaFields = {
  expanded: z.boolean().optional().meta({
    description:
      "If `true`, the side nav item will be expanded on initial load. Does nothing if the entry is a leaf node.",
  }),
  flattenChildren: z.boolean().optional().meta({
    description:
      "Replace a top-level side nav folder with its immediate children. Deeper nesting and route URLs are preserved. The parent label is removed. Add a separate `sectionTitle` entry before the route to display a heading. Has no effect on nested routes or leaf pages.",
  }),
  group: z.string().optional().meta({
    description:
      "Used for grouping pages at the same level under a common section heading.",
  }),
  groupOrder: z.string().array().optional().meta({
    description: "Order for the groups within this item's hierarchy.",
  }),
  hidden: z.boolean().optional().meta({
    description:
      "If `true`, this route will not be shown in the side navigation or adjacent routes' page links.",
  }),
  hideBreadcrumbs: z.boolean().optional().meta({
    description: "If `true`, the breadcrumbs will not render on this route.",
  }),
  hideFromSearch: z.boolean().optional().meta({
    description:
      "If `true`, this page's contents will not be added to the search index.",
  }),
  hidePageLinks: z.boolean().optional().meta({
    description: "If `true`, the page links will be hidden on this route.",
  }),
  hideSideNav: z.boolean().optional().meta({
    description: "If `true`, the side navigation will be hidden on this route.",
  }),
  hideToc: z.boolean().optional().meta({
    description:
      "If `true`, the table of contents will be hidden on this route.",
  }),
  ignoreRouteMetaOrder: z.boolean().optional().meta({
    description:
      "By default, pages with a RouteMeta are ordered before pages that are not defined. Set this property to `true` to disable that behavior.",
  }),
  restricted: z.boolean().optional().meta({
    description:
      "If `true`, the route will be flagged as restricted. This flag does nothing internally. You will need to handle this in your application.",
  }),
  sideNavTitle: z.string().optional().meta({
    description:
      "Title for the page in the side nav. Takes precedence over `title`.",
  }),
  title: z.string().optional().meta({
    description:
      "The title of the item in the side nav. Will be parsed from the page's frontmatter if it is not defined in the RouteMeta.",
  }),
} satisfies Implements<
  Omit<RouteMeta, "children" | "id" | "sectionTitle" | "separator">
>

const childrenDescription = "Nested routes."

export const routeMetaSchema: ZodSchema<RouteMeta> =
  implement<RouteMeta>().with({
    ...routeMetaFields,
    children: z.array(z.lazy(() => routeMetaSchema)).optional(),
    id: z.string(),
    sectionTitle: z.never().optional(),
    separator: z.never().optional(),
  })

/**
 * Unlike {@link routeMetaSchema}, `_nav.json` entries reject unknown properties
 * so that typos are reported instead of silently ignored.
 */
const navFileRouteMetaSchema: ZodSchema<RouteMeta> = z.strictObject({
  ...routeMetaFields,
  children: z
    .array(z.lazy(() => navFileRouteMetaSchema))
    .optional()
    .meta({description: childrenDescription}),
  id: z.string().meta({description: "The path segment for this route."}),
})

export const navFileSchema: ZodSchema<FolderNavConfig> = z.strictObject({
  ...routeMetaFields,
  $schema: z.string().optional().meta({
    description:
      "Path or URL of the JSON Schema for this file. Editors use it for validation and autocomplete.",
  }),
  children: z
    .array(navFileRouteMetaSchema)
    .optional()
    .meta({description: childrenDescription}),
})

/**
 * The JSON Schema for `_nav.json` files, shipped as
 * `@qualcomm-ui/mdx-vite/schemas/nav.schema.json`.
 */
export function getNavFileJsonSchema(): Record<string, unknown> {
  return z.toJSONSchema(navFileSchema, {
    io: "input",
    target: "draft-2020-12",
  })
}

const typeDocPropsSchema = implement<QuiDocsTypeDocOptions>().with({
  includeInSearchIndex: z.boolean().optional(),
})

const knowledgeExtraFileSchema = implement<KnowledgeExtraFile>().with({
  contents: z.string(),
  id: z.string(),
  processAsMdx: z.boolean().optional(),
  title: z.string().optional(),
})

const frontmatterConfigSchema = z
  .object({
    exclude: z.array(z.string()).optional(),
    include: z.array(z.string()).optional(),
  })
  .optional()

const pagesExportsSchema = implement<PagesExportConfig>().with({
  outputPath: z.string().optional(),
})

const sectionsExportsSchema = implement<SectionExportConfig>().with({
  depths: z.array(z.number()).optional(),
  minContentLength: z.number().optional(),
  outputPath: z.string().optional(),
})

const knowledgeConfigSchema = implement<KnowledgeConfig>().with({
  baseUrl: z.string().optional(),
  exclude: z.array(z.string()).optional(),
  extraFiles: z.array(knowledgeExtraFileSchema).optional(),
  frontmatter: frontmatterConfigSchema,
  outputPath: z.string().optional(),
  pageIdPrefix: z.string().optional(),
  pages: pagesExportsSchema.optional(),
  sections: sectionsExportsSchema.optional(),
})

const lintSeveritySchema = z.union([
  z.literal("off"),
  z.literal("warn"),
  z.literal("error"),
])

const lintSchema = implement<QuiDocsLintOptions>().with({
  brokenLinks: lintSeveritySchema.optional(),
  fileLinks: lintSeveritySchema.optional(),
  pageTitle: lintSeveritySchema.optional(),
})

const configSchema = implement<QuiDocsConfig>().with({
  appDirectory: z.string().optional(),
  disableCache: z.boolean().optional(),
  disableLegacySearchIndex: z.boolean().optional(),
  headings: z
    .array(
      z.union([
        z.literal("h1"),
        z.literal("h2"),
        z.literal("h3"),
        z.literal("h4"),
        z.literal("h5"),
        z.literal("h6"),
      ]),
    )
    .optional(),
  hotUpdateIgnore: z.instanceof(RegExp).optional(),
  knowledge: knowledgeConfigSchema.optional(),
  lint: lintSchema.optional(),
  navConfig: z.array(z.union([routeMetaSchema, navMetaSchema])).optional(),
  pageDirectory: z.string().optional(),
  pageTimestampMetadata: z
    .union([
      z.literal("off"),
      z.literal("timestamp"),
      z.literal("user-and-timestamp"),
    ])
    .optional(),
  routingStrategy: z
    .union([
      z.literal("vite-generouted"),
      z.literal("react-router-directory-groups"),
      z.any(),
    ])
    .optional(),
  throwOnError: z.boolean().optional(),
  typeDocProps: z.string().optional(),
  typeDocPropsOptions: typeDocPropsSchema.optional(),
})

export function parseSchema(data: unknown): ZodSafeParseResult<QuiDocsConfig> {
  return configSchema.safeParse(data)
}
