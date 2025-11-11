// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {createImportModEntries} from "../mod-imports"
import type {ImportTransformEntry} from "../transformers"

export const react: ImportTransformEntry[] = createImportModEntries(
  "@qui/react",
  [
    {
      imports: ["createGuardedContext"],
      targetPackage: "@qui/react-core/context",
    },
    {
      imports: [
        "useClickable",
        "UseClickableProps",
        "UseClickableReturn",
        "useEventListeners",
        "ShapeType",
        "getRealShape",
        "ShapeResult",
        "useRealShape",
        "ElementSizeCallback",
        "trackElementSize",
        "useSizes",
        "useSize",
      ],
      targetPackage: "@qui/react-core/dom",
    },
    {
      imports: [
        "useDebounce",
        "useSafeLayoutEffect",
        "isBrowser",
        "useEnhancedEffect",
      ],
      targetPackage: "@qui/react-core/effects",
    },
    {
      imports: [
        {name: "IconOrNode", renameTo: "LucideIconOrNode"},
        {name: "QIconOrNode", renameTo: "LucideIconOrNode"},
        {name: "IconOrElement", renameTo: "LucideIconOrElement"},
        {name: "QIconOrElement", renameTo: "LucideIconOrElement"},
      ],
      targetPackage: "@qui/react-core/lucide",
    },
    {
      imports: ["usePreviousProps"],
      targetPackage: "@qui/react-core/props",
    },
    {
      imports: ["useMergedRef", "assignRef", "ReactRef", "mergeRefs"],
      targetPackage: "@qui/react-core/refs",
    },
    {
      imports: ["useControlledId", "useControlledState"],
      targetPackage: "@qui/react-core/state",
    },
    {
      imports: [
        "As",
        "PolymorphicComponentPropsWithRef",
        "renderElementOrNode",
        "renderElementOrFunc",
        "RenderProp",
      ],
      targetPackage: "@qui/react-core/system",
    },
    {
      imports: ["EndHandler", "EnterHandler", "ExitHandler", "TransitionProps"],
      targetPackage: "@qui/react-core/transitions",
    },
  ],
)
