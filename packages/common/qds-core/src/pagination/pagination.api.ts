// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {PropNormalizer} from "@qualcomm-ui/utils/machine"

import {paginationClasses} from "./pagination.classes"
import type {
  QdsPaginationApi,
  QdsPaginationApiProps,
  QdsPaginationPageItemBindings,
  QdsPaginationPageMetadataBindings,
  QdsPaginationPageSizeBindings,
  QdsPaginationPageSizeLabelBindings,
  QdsPaginationRootBindings,
} from "./pagination.types"

export function createQdsPaginationApi(
  props: QdsPaginationApiProps,
  normalize: PropNormalizer,
): QdsPaginationApi {
  const size = props.size || "sm"

  return {
    size,

    // group: bindings
    getPageItemBindings(): QdsPaginationPageItemBindings {
      return normalize.element({
        className: paginationClasses.pageItem,
        "data-size": size,
      })
    },
    getPageMetadataBindings(): QdsPaginationPageMetadataBindings {
      return normalize.element({
        className: paginationClasses.pageMetadata,
        "data-size": size,
      })
    },
    getPageSizeBindings(): QdsPaginationPageSizeBindings {
      return normalize.element({
        className: paginationClasses.pageSize,
        "data-size": size,
      })
    },
    getPageSizeLabelBindings(): QdsPaginationPageSizeLabelBindings {
      return normalize.element({
        className: paginationClasses.pageSizeLabel,
        "data-size": size,
      })
    },
    getRootBindings(): QdsPaginationRootBindings {
      return normalize.element({
        className: paginationClasses.root,
      })
    },
  }
}
