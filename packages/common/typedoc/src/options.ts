// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {TypeDocOptions} from "typedoc"

/**
 * {@link https://typedoc.org/options/input/ see options}
 */
export const defaultOptions: Partial<TypeDocOptions> = {
  entryPointStrategy: "expand",
  // custom categories that we set to exclude specific properties or interfaces.
  excludeCategories: ["react-dom"],
  excludeExternals: true,
  excludeInternal: true,
  excludeNotDocumented: true,
  excludeNotDocumentedKinds: [
    "Module",
    "Function",
    "Namespace",
    "Constructor",
    "CallSignature",
    "IndexSignature",
    "ConstructorSignature",
    "Accessor",
    "GetSignature",
    "SetSignature",
  ],
  excludePrivate: true,
  excludeProtected: true,
  logLevel: "Error",
  plugin: [],
}
