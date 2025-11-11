// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {z, type ZodObject, type ZodSchema} from "zod"

import type {
  NavMeta,
  QuiDocsConfig,
  QuiDocsTypeDocOptions,
  RouteMeta,
} from "../types"

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
  navConfig: z.array(z.union([routeMetaSchema, navMetaSchema])).optional(),
  pageDirectory: z.string().optional(),
  routingStrategy: z
    .union([
      z.literal("vite-generouted"),
      z.function(z.tuple([z.string()]), z.array(z.string())),
    ])
    .optional(),
  typeDocProps: z.string().optional(),
  typeDocPropsOptions: typeDocPropsSchema.optional(),
})
