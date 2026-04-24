// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {HTMLAttributes, ReactNode} from "react"

import type {useMDXComponents} from "@mdx-js/react"

import type {
  QdsBadgeCategoryEmphasis,
  QdsBadgeSemanticEmphasis,
} from "@qualcomm-ui/qds-core/badge"
import type {BreadcrumbsItemProps} from "@qualcomm-ui/react/breadcrumbs"
import type {
  DemoSettings,
  MdxDocsContextValue,
  PackageManager,
  RouteDemoState,
} from "@qualcomm-ui/react-mdx/context"

export type TocHighlightStrategy = "nearest" | "viewport"

/**
 * The function used to render the application's clientside link component.
 *
 * @public
 */
export type RenderLink = (
  props: HTMLAttributes<HTMLAnchorElement> & {href: string},
) => ReactNode

/**
 * @public
 */
export interface DocPropsSettings {
  /**
   * URL for the changelog, used by the `@since` tags.
   */
  changelogUrl?: string
}

/**
 * @public
 */
export interface DocsLayoutSettings extends Pick<
  MdxDocsContextValue,
  "demoSettings" | "packageManager" | "ssrUserAgent"
> {
  /**
   * Demo state for each route, typically persisted via localStorage or a session
   * cookie (SSR). This preserves the expand/collapse state of each demo on reload.
   */
  demoState?: RouteDemoState

  /**
   * Configuration for the Typedoc Props.
   *
   * @inheritDoc
   */
  docProps?: DocPropsSettings

  /**
   * Footer node. Renders below the app content.
   */
  footer?: ReactNode

  /**
   * Header node, you'd typically use the {@link https://react.qui.qualcomm.com/components/header QHeader} here.
   */
  header: ReactNode

  /**
   * Forces the TOC to hide for every page. You can also control this per MDX page
   * by using the property by the same name in the page's frontmatter.
   */
  hideToc?: boolean

  /**
   * Override the MDX component definitions. Refer to the {@link https://mdxjs.com/table-of-components/ documentation} to learn more.
   *
   * @inheritDoc
   */
  mdxComponents?: ReturnType<typeof useMDXComponents>

  /**
   * Function fired when the demo settings change.
   */
  onDemoSettingsChange?: (settings: DemoSettings) => void

  /**
   * Function fired when the route demo state changes.
   */
  onDemoStateChange?: (state: RouteDemoState) => void

  /**
   * Function fired when the selected package manager changes.
   */
  onPackageManagerChange?: (packageManager: PackageManager) => void

  /**
   * Current SPA pathname. If using React Router or Remix, this is the value of
   * `useLocation().pathname`
   */
  pathname: string

  /**
   * SPA Link renderer for clientside routing.
   */
  renderLink: RenderLink

  /**
   * Optional root breadcrumb item.
   */
  rootBreadcrumb?: BreadcrumbsItemProps

  /**
   * Controls how the links in the Table of Contents are highlighted.
   *
   * @option 'nearest': only the nearest heading will be highlighted.
   * @option 'viewport': visible headings will be highlighted.
   *
   * @default 'nearest'
   */
  tocHighlightStrategy?: TocHighlightStrategy
}

/**
 * Interface for a badge property in a page's frontmatter. Used internally to
 * display badges next to the page title.
 */
export interface FrontmatterBadge {
  /**
   * Badge emphasis.
   */
  emphasis?: QdsBadgeSemanticEmphasis | QdsBadgeCategoryEmphasis

  /**
   * Unique key for the badge.
   */
  id: string

  /**
   * Text rendered inside the badge.
   */
  label: string

  /**
   * Optional HTML title attribute to show on hover.
   */
  title?: string

  /**
   * Optional URL that the badge links to. To link to a local path, start the pathname with `/`. To link to an external URL, start the url with `https://`
   *
   * @example
   * ```js
   * // local path
   * /guides/developer-preview
   *
   * // external
   * https://github.com/qualcomm/qualcomm-ui
   * ```
   */
  url?: string
}
