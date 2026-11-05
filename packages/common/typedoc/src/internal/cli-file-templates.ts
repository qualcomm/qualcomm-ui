// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {BuildOptions} from "../types.js"

import {dedent} from "./dedent.js"

export function getTsConfig(options: BuildOptions): string {
  return dedent`
    import {BuildOptions} from "@qualcomm-ui/typedoc"
    
    export default {
      apiFile: "${options.apiFile}",
      logMode: "${options.logMode}",
      outputFile: "${options.outputFile}",
      typedocOptions: {
        entryPoints: [],
        tsconfig: "${options.typedocOptions?.tsconfig}",
      },
    } satisfies BuildOptions

  `
}

export function getJsConfig(options: BuildOptions): string {
  return dedent`
    /**
     * @type {import("@qualcomm-ui/typedoc").BuildOptions}
     */
    export default {
      apiFile: "${options.apiFile}",
      logMode: "${options.logMode}",
      outputFile: "${options.outputFile}",
      typedocOptions: {
        entryPoints: [],
        tsconfig: "${options.typedocOptions?.tsconfig}",
      },
    }

  `
}

export function getJsonConfig(options: BuildOptions): string {
  return JSON.stringify(options)
}
