// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {PropNormalizer} from "@qualcomm-ui/utils/machine"

import type {
  QdsDividerApi,
  QdsDividerApiProps,
  QdsDividerRootBindings,
} from "./divider.types"

export function createQdsDividerApi(
  props: QdsDividerApiProps,
  normalizer: PropNormalizer,
): QdsDividerApi {
  return {
    getRootBindings(): QdsDividerRootBindings {
      return normalizer.element({
        "aria-orientation":
          props.orientation === "vertical" ? "vertical" : "horizontal",
        "data-variant": props.variant || "normal",
        role: "separator",
      })
    },
  }
}
