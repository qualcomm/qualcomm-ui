// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

export const VIRTUAL_MODULE_IDS = {
  AUTO: "\0virtual:qui-demo-scope/auto",
  CONFIG: "\0virtual:qui-demo-scope/config",
  PAGE_PREFIX: "\0virtual:qui-demo-scope/page:",
} as const

export const LOG_PREFIX = "@qualcomm-ui/mdx-vite/react-demo-plugin:"

export const REACT_IMPORTS: string[] = [
  "useState",
  "useEffect",
  "useMemo",
  "useCallback",
  "useRef",
  "useContext",
  "createContext",
  "forwardRef",
  "memo",
  "lazy",
  "Suspense",
  "Fragment",
] as const

export const NODE_BUILTINS: string[] = [
  "fs",
  "path",
  "url",
  "util",
  "os",
  "crypto",
  "events",
  "stream",
  "buffer",
] as const
