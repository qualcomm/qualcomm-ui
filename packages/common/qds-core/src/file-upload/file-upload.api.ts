// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {PropNormalizer} from "@qualcomm-ui/utils/machine"

import {fileUploadClasses} from "./file-upload.classes"
import type {
  QdsFileUploadApi,
  QdsFileUploadApiProps,
  QdsFileUploadClearTriggerBindings,
  QdsFileUploadDropzoneBindings,
  QdsFileUploadDropzoneHintBindings,
  QdsFileUploadDropzoneTextBindings,
  QdsFileUploadDropzoneTextGroupBindings,
  QdsFileUploadDropzoneTextLineBindings,
  QdsFileUploadErrorTextBindings,
  QdsFileUploadItemBindings,
  QdsFileUploadItemContentBindings,
  QdsFileUploadItemDeleteTriggerBindings,
  QdsFileUploadItemGroupBindings,
  QdsFileUploadItemNameBindings,
  QdsFileUploadItemPreviewBindings,
  QdsFileUploadItemPreviewImageBindings,
  QdsFileUploadItemSizeTextBindings,
  QdsFileUploadLabelBindings,
  QdsFileUploadRequiredIndicatorBindings,
  QdsFileUploadRootBindings,
  QdsFileUploadTriggerBindings,
} from "./file-upload.types"

export function createQdsFileUploadApi(
  props: QdsFileUploadApiProps,
  normalize: PropNormalizer,
): QdsFileUploadApi {
  const size = props.size || "md"

  return {
    size,

    // group: bindings
    getClearTriggerBindings(): QdsFileUploadClearTriggerBindings {
      return normalize.element({
        className: fileUploadClasses.clearTrigger,
        "data-size": size,
      })
    },
    getDropzoneBindings(): QdsFileUploadDropzoneBindings {
      return normalize.element({
        className: fileUploadClasses.dropzone,
        "data-size": size,
      })
    },
    getDropzoneHintBindings(): QdsFileUploadDropzoneHintBindings {
      return normalize.element({
        className: fileUploadClasses.dropzoneHint,
      })
    },
    getDropzoneTextBindings(): QdsFileUploadDropzoneTextBindings {
      return normalize.element({
        className: fileUploadClasses.dropzoneText,
      })
    },
    getDropzoneTextGroupBindings(): QdsFileUploadDropzoneTextGroupBindings {
      return normalize.element({
        className: fileUploadClasses.dropzoneTextGroup,
      })
    },
    getDropzoneTextLineBindings(): QdsFileUploadDropzoneTextLineBindings {
      return normalize.element({
        className: fileUploadClasses.dropzoneTextLine,
      })
    },
    getErrorTextBindings(): QdsFileUploadErrorTextBindings {
      return normalize.element({
        className: fileUploadClasses.errorText,
      })
    },
    getItemBindings(): QdsFileUploadItemBindings {
      return normalize.element({
        className: fileUploadClasses.item,
        "data-size": size,
      })
    },
    getItemContentBindings(): QdsFileUploadItemContentBindings {
      return normalize.element({
        className: fileUploadClasses.itemContent,
      })
    },
    getItemDeleteTriggerBindings(): QdsFileUploadItemDeleteTriggerBindings {
      return normalize.element({
        className: fileUploadClasses.itemDeleteTrigger,
        "data-size": size,
      })
    },
    getItemGroupBindings(): QdsFileUploadItemGroupBindings {
      return normalize.element({
        className: fileUploadClasses.itemGroup,
        "data-size": size,
      })
    },
    getItemNameBindings(): QdsFileUploadItemNameBindings {
      return normalize.element({
        className: fileUploadClasses.itemName,
        "data-size": size,
      })
    },
    getItemPreviewBindings(): QdsFileUploadItemPreviewBindings {
      return normalize.element({
        className: fileUploadClasses.itemPreview,
        "data-size": size,
      })
    },
    getItemPreviewImageBindings(): QdsFileUploadItemPreviewImageBindings {
      return normalize.element({
        className: fileUploadClasses.itemPreviewImage,
        "data-size": size,
      })
    },
    getItemSizeTextBindings(): QdsFileUploadItemSizeTextBindings {
      return normalize.element({
        className: fileUploadClasses.itemSizeText,
        "data-size": size,
      })
    },
    getLabelBindings(): QdsFileUploadLabelBindings {
      return normalize.element({
        className: fileUploadClasses.label,
        "data-size": size,
      })
    },
    getRequiredIndicatorBindings(): QdsFileUploadRequiredIndicatorBindings {
      return normalize.element({
        className: fileUploadClasses.requiredIndicator,
      })
    },
    getRootBindings(): QdsFileUploadRootBindings {
      return normalize.element({
        className: fileUploadClasses.root,
        "data-size": size,
      })
    },
    getTriggerBindings(): QdsFileUploadTriggerBindings {
      return normalize.element({
        className: fileUploadClasses.trigger,
        "data-size": size,
      })
    },
  }
}
