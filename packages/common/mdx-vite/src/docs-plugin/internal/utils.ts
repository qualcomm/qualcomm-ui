// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {z, type ZodObject} from "zod"

import type {PageFrontmatter} from "@qualcomm-ui/mdx-common"

import {implement} from "./zod"

export const isDefined = (
  value: string | boolean | object | null | undefined | number,
): boolean => typeof value !== "undefined" && value !== null

export function defined<T>(value: T | null | undefined): value is T {
  return typeof value !== "undefined" && value !== null
}

/**
 * Used to validate the MDX frontmatter and emit warnings for pages that violate the
 * schema.
 */
export const frontmatterSchema: ZodObject<{}> =
  implement<PageFrontmatter>().with({
    categories: z.string().array().optional(),
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
  })

/**
 * Winblows fix
 */
export function fixPath(str: string): string {
  return str.replaceAll("\\", "/")
}

/**
 * Removes the trailing slash from a string.
 */
export function removeTrailingSlash(str: string): string {
  return str.endsWith("/") ? str.substring(0, str.length - 1) : str
}
