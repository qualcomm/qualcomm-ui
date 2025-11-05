// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {CssBuilder} from "./build-css"
import type {CssBuilderConfig} from "./css-utils.types"

export interface ViteCssPluginOptions extends CssBuilderConfig {
  isDev?: boolean
}

let builder: CssBuilder | undefined

/**
 * Vite in library mode works a bit differently than for web apps, so we have to
 * detect whether the app is in dev mode by observing the `watchChange` mode. If dev
 * mode, we disable the CSS watcher whenever a TS file changes (this runs
 * independently anyway).
 */
export function viteCssPlugin(opts: ViteCssPluginOptions): any {
  let dev = false
  return {
    buildEnd: async () => {
      if (!dev) {
        if (!builder) {
          builder = new CssBuilder(opts)
        }
        await builder.build()
      }
    },
    name: "qui-vite-css-plugin",
    watchChange: () => {
      dev = true
    },
  }
}
