// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {z, type ZodObject} from "zod"

import type {PageFrontmatter} from "@qualcomm-ui/mdx-common"

import {implement} from "../config/zod"

/**
 * Used to validate the MDX frontmatter and emit warnings for pages that violate the
 * schema.
 */
export const frontmatterSchema: ZodObject<{}> =
  implement<PageFrontmatter>().with({
    categories: z.string().array().optional(),
    description: z.string().optional(),
    group: z.string().optional(),
    hidden: z.boolean().optional(),
    hideBreadcrumbs: z.boolean().optional(),
    hideFromSearch: z.boolean().optional(),
    hidePageLinks: z.boolean().optional(),
    hideSideNav: z.boolean().optional(),
    hideToc: z.boolean().optional(),
    id: z.string().optional(),
    restricted: z.boolean().optional(),
    sideNavTitle: z.string().optional(),
    title: z.string(),
    updatedBy: z.string().optional(),
    updatedOn: z.string().optional(),
  })
