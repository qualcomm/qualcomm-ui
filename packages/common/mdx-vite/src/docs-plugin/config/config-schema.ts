// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {z, type ZodObject, type ZodSchema} from "zod"

import type {NavMeta, RouteMeta} from "../nav-builder/types"

import type {
  KnowledgeConfig,
  KnowledgeExtraFile,
  OpenWebUiIntegration,
  PagesExportConfig,
  QuiDocsConfig,
  QuiDocsTypeDocOptions,
  SectionExportConfig,
} from "./types"
import {implement} from "./zod"

export const navMetaSchema: ZodObject<{}> = implement<NavMeta>().with({
  id: z.never().optional(),
  sectionTitle: z.string().optional(),
  separator: z.boolean().optional(),
})

export const routeMetaSchema: ZodSchema<RouteMeta> =
  implement<RouteMeta>().with({
    children: z.array(z.lazy(() => routeMetaSchema)).optional(),
    expanded: z.boolean().optional(),
    group: z.string().optional(),
    groupOrder: z.string().array().optional(),
    hidden: z.boolean().optional(),
    hideBreadcrumbs: z.boolean().optional(),
    hideFromSearch: z.boolean().optional(),
    hidePageLinks: z.boolean().optional(),
    hideSideNav: z.boolean().optional(),
    hideToc: z.boolean().optional(),
    id: z.string(),
    ignoreRouteMetaOrder: z.boolean().optional(),
    restricted: z.boolean().optional(),
    sectionTitle: z.never().optional(),
    separator: z.never().optional(),
    sideNavTitle: z.string().optional(),
    title: z.string().optional(),
  })

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

const openWebUiIntegrationSchema = implement<OpenWebUiIntegration>().with({
  envFile: z.string().optional(),
  id: z.string(),
})

const knowledgeConfigSchema = implement<KnowledgeConfig>().with({
  baseUrl: z.string().optional(),
  exclude: z.array(z.string()).optional(),
  extraFiles: z.array(knowledgeExtraFileSchema).optional(),
  frontmatter: frontmatterConfigSchema,
  integrations: z
    .object({
      openWebUi: z.array(openWebUiIntegrationSchema).optional(),
    })
    .optional(),
  outputPath: z.string().optional(),
  pageIdPrefix: z.string().optional(),
  pages: pagesExportsSchema.optional(),
  sections: sectionsExportsSchema.optional(),
})

export const configSchema = implement<QuiDocsConfig>().with({
  appDirectory: z.string().optional(),
  disableCache: z.boolean().optional(),
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
  navConfig: z.array(z.union([routeMetaSchema, navMetaSchema])).optional(),
  pageDirectory: z.string().optional(),
  pageTimestampMetadata: z
    .union([
      z.literal("off"),
      z.literal("timestamp"),
      z.literal("user-and-timestamp"),
    ])
    .optional(),
  routingStrategy: z.union([z.literal("vite-generouted"), z.any()]).optional(),
  throwOnError: z.boolean().optional(),
  typeDocProps: z.string().optional(),
  typeDocPropsOptions: typeDocPropsSchema.optional(),
  validatePageLinks: z.boolean().optional(),
})
