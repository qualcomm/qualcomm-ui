// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {defineConfig} from "eslint/config"

export default defineConfig({
  name: "qui-react-strict",
  rules: {
    "react-hooks/component-hook-factories": "error",
    "react-hooks/config": "error",
    "react-hooks/error-boundaries": "error",
    "react-hooks/gating": "error",
    "react-hooks/globals": "error",
    "react-hooks/immutability": "error",
    "react-hooks/incompatible-library": "warn",
    "react-hooks/preserve-manual-memoization": "error",
    "react-hooks/purity": "error",
    "react-hooks/refs": "off",
    "react-hooks/set-state-in-effect": "error",
    "react-hooks/set-state-in-render": "error",
    "react-hooks/static-components": "error",
    "react-hooks/unsupported-syntax": "warn",
    "react-hooks/use-memo": "error",
  },
})
