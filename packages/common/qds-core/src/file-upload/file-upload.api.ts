// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {QdsButtonApiProps} from "@qualcomm-ui/qds-core/button"
import type {PropNormalizer} from "@qualcomm-ui/utils/machine"

import {fileUploadClasses} from "./file-upload.classes.js"
import type {
  QdsFileUploadAddMoreButtonBindings,
  QdsFileUploadApi,
  QdsFileUploadApiProps,
  QdsFileUploadClearTriggerBindings,
  QdsFileUploadDropzoneBindings,
  QdsFileUploadDropzoneHintBindings,
  QdsFileUploadDropzoneIconBindings,
  QdsFileUploadDropzoneTextBindings,
  QdsFileUploadDropzoneTextGroupBindings,
  QdsFileUploadDropzoneTextLineBindings,
  QdsFileUploadErrorTextBindings,
  QdsFileUploadInputDisplayBindings,
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
} from "./file-upload.types.js"

export function createQdsFileUploadApi(
  props: QdsFileUploadApiProps,
  normalize: PropNormalizer,
): QdsFileUploadApi {
  const size = props.size || "md"

  return {
    size,

    // group: bindings
    getAddMoreButtonBindings(): QdsFileUploadAddMoreButtonBindings {
      return normalize.element({
        className: fileUploadClasses.addMoreButton,
        "data-size": size === "sm" ? "sm" : "md",
      })
    },
    getAddMoreButtonProps(): QdsButtonApiProps {
      return {
        size: size === "sm" ? "sm" : "md",
        variant: "outline",
      }
    },
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
    getDropzoneIconBindings(): QdsFileUploadDropzoneIconBindings {
      return normalize.element({
        className: fileUploadClasses.dropzoneIcon,
        "data-size": size === "sm" ? "md" : "lg",
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
    getInputDisplayBindings(): QdsFileUploadInputDisplayBindings {
      return normalize.element({
        className: fileUploadClasses.inputDisplay,
        "data-size": size,
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
      })
    },
  }
}
