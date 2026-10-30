// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {Provider} from "react"

import {
  DocsManifestProvider,
  type DocsManifestContextValue,
  useDocsManifestContext,
} from "./use-docs-manifest-context.js"
import {
  DocsPageProvider,
  type DocsPageContextValue,
  useDocsPageContext,
} from "./use-docs-page-context.js"
import {
  DocsRuntimeProvider,
  type DocsRuntimeContextValue,
  useDocsRuntimeContext,
} from "./use-docs-runtime-context.js"

/**
 * @deprecated in 3.1.0, migrate to {@link DocsManifestContextValue}
 */
export type SiteDataContextValue = DocsManifestContextValue

/**
 * @deprecated in 3.1.0, migrate to {@link DocsManifestProvider}
 */
export const SiteContextProvider: Provider<DocsManifestContextValue | null> =
  DocsManifestProvider

/**
 * @deprecated in 3.1.0, migrate to {@link useDocsManifestContext}
 */
export const useSiteContext: typeof useDocsManifestContext =
  useDocsManifestContext

/**
 * @deprecated in 3.1.0, migrate to {@link DocsRuntimeContextValue}
 */
export type MdxDocsContextValue = DocsRuntimeContextValue

/**
 * @deprecated in 3.1.0, migrate to {@link DocsRuntimeProvider}
 */
export const MdxDocsProvider: Provider<DocsRuntimeContextValue | null> =
  DocsRuntimeProvider

/**
 * @deprecated in 3.1.0, migrate to {@link useDocsRuntimeContext}
 */
export const useMdxDocsContext: typeof useDocsRuntimeContext =
  useDocsRuntimeContext

/**
 * @deprecated in 3.1.0, migrate to {@link DocsPageContextValue}
 */
export type MdxDocsLayoutContextState = DocsPageContextValue

/**
 * @deprecated in 3.1.0, migrate to {@link DocsPageProvider}
 */
export const MdxDocsLayoutContextProvider: Provider<DocsPageContextValue> =
  DocsPageProvider

/**
 * @deprecated in 3.1.0, migrate to {@link useDocsPageContext}
 */
export const useMdxDocsLayoutContext: typeof useDocsPageContext =
  useDocsPageContext
