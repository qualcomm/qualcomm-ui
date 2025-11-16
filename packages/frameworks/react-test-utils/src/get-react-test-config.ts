// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {playwright} from "@vitest/browser-playwright"
import {merge} from "lodash-es"
import type {InlineConfig} from "vitest/node"

export function getReactTestConfig(
  config: Partial<InlineConfig> = {},
): InlineConfig {
  return merge(
    {
      browser: {
        enabled: true,
        headless: true,
        instances: [
          {
            browser: "chromium",
          },
        ],
        locators: {
          testIdAttribute: "data-test-id",
        },
        provider: playwright(),
        testerHtmlPath: "../react-test-utils/src/react-test-setup.html",
        viewport: {
          height: 500,
          width: 500,
        },
      },
      css: true,
      expect: {
        poll: {
          timeout: 2500,
        },
      },
      globals: true,
      include: ["src/**/*.spec.tsx"],
      passWithNoTests: true,
      reporters: ["default"],
      setupFiles: ["@qualcomm-ui/react-test-utils/src/react-test-setup.ts"],
    },
    config,
  )
}
