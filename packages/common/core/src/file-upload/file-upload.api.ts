// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  contains,
  getEventTarget,
  visuallyHiddenStyle,
} from "@qualcomm-ui/dom/query"
import {flatArray} from "@qualcomm-ui/utils/array"
import {
  ariaAttr,
  booleanAriaAttr,
  booleanDataAttr,
} from "@qualcomm-ui/utils/attributes"
import type {DirectionProperty} from "@qualcomm-ui/utils/direction"
import {getFileEntries} from "@qualcomm-ui/utils/files"
import {formatBytes} from "@qualcomm-ui/utils/i18n"
import type {
  IdRegistrationProps,
  Machine,
  PropNormalizer,
} from "@qualcomm-ui/utils/machine"
import {warn} from "@qualcomm-ui/utils/warning"

import {fileUploadAnatomy} from "./file-upload.anatomy.js"
import {
  domEls,
  domIds,
  getItem,
  getItemName,
  getItemPreview,
  getItemSizeText,
} from "./file-upload.dom.js"
import type {
  FileUploadApi,
  FileUploadClearTriggerBindings,
  FileUploadDropzoneBindings,
  FileUploadErrorTextBindings,
  FileUploadItemBindings,
  FileUploadItemDeleteTriggerBindings,
  FileUploadItemGroupBindings,
  FileUploadItemNameBindings,
  FileUploadItemPreviewBindings,
  FileUploadItemPreviewImageBindings,
  FileUploadItemSizeTextBindings,
  FileUploadLabelBindings,
  FileUploadRootBindings,
  FileUploadSchema,
  FileUploadTriggerBindings,
  ItemType,
} from "./file-upload.types.js"
import {isEventWithFiles} from "./file-upload.utils.js"

const DEFAULT_ITEM_TYPE: ItemType = "accepted"
const parts = fileUploadAnatomy.parts

const INTERACTIVE_SELECTOR =
  "button, a[href], input:not([type='file']), select, textarea, [tabindex], [contenteditable]"

function isInteractiveTarget(
  element: HTMLElement | null,
  container: HTMLElement,
): boolean {
  if (!element || element.getAttribute("type") === "file") {
    return false
  }
  const interactive = element.closest(INTERACTIVE_SELECTOR)
  return interactive !== container && contains(container, interactive)
}

export function createFileUploadApi(
  machine: Machine<FileUploadSchema>,
  normalize: PropNormalizer,
): FileUploadApi {
  const {computed, context, prop, scope, send, state} = machine
  const disabled = !!prop("disabled")
  const required = !!prop("required")
  const invalid = prop("invalid")
  const allowDrop = prop("allowDrop")
  const translations = prop("translations")

  const dragging = state.matches("dragging")
  const focused = state.matches("focused") && !disabled
  const commonBindings: DirectionProperty = {
    dir: prop("dir"),
  }

  return {
    acceptedFiles: context.get("acceptedFiles"),
    clearFiles() {
      send({type: "FILES.CLEAR"})
    },
    clearRejectedFiles() {
      send({type: "REJECTED_FILES.CLEAR"})
    },
    createFileUrl(file: File, cb: (url: string) => void) {
      const win = scope.getWin()
      const url = win.window.URL.createObjectURL(file)
      cb(url)
      return () => win.window.URL.revokeObjectURL(url)
    },
    deleteFile(file, type = DEFAULT_ITEM_TYPE) {
      send({file, itemType: type, type: "FILE.DELETE"})
    },
    disabled,
    dragging,
    focused,

    openFilePicker() {
      if (disabled) {
        return
      }
      send({type: "OPEN"})
    },

    rejectedFiles: context.get("rejectedFiles"),

    required,

    setClipboardFiles(dt) {
      if (disabled) {
        return false
      }
      const items = Array.from(dt?.items ?? [])
      const files = items.reduce<File[]>((acc, item) => {
        if (item.kind !== "file") {
          return acc
        }
        const file = item.getAsFile()
        if (!file) {
          return acc
        }
        return [...acc, file]
      }, [])
      if (!files.length) {
        return false
      }
      send({files, type: "FILES.SET"})
      return true
    },

    setFiles(files) {
      send({count: files.length, files, type: "FILES.SET"})
    },

    transforming: context.get("transforming"),

    // group: bindings
    getClearTriggerBindings(): FileUploadClearTriggerBindings {
      return normalize.button({
        ...parts.clearTrigger,
        ...commonBindings,
        "aria-label": translations.clearTriggerLabel,
        "data-invalid": booleanDataAttr(invalid),
        disabled,
        hidden:
          context.get("acceptedFiles").length === 0 &&
          context.get("rejectedFiles").length === 0,
        onClick(event) {
          if (event.defaultPrevented || disabled) {
            return
          }
          send({type: "FILES.CLEAR"})
        },
        type: "button",
      })
    },
    getDropzoneBindings(
      props: {disableClick?: boolean; id?: string} = {},
    ): FileUploadDropzoneBindings {
      if (props.id) {
        scope.ids.register("dropzone", props as {id: string})
      }
      return normalize.element({
        ...parts.dropzone,
        ...commonBindings,
        "aria-disabled": booleanAriaAttr(disabled),
        "aria-label": translations.dropzone,
        "data-disabled": booleanDataAttr(disabled),
        "data-dragging": booleanDataAttr(dragging),
        "data-focus": booleanDataAttr(focused),
        "data-has-file": booleanDataAttr(
          !!context.get("acceptedFiles")?.length ||
            !!context.get("rejectedFiles")?.length,
        ),
        "data-invalid": booleanDataAttr(invalid),
        id: domIds.dropzone(scope),
        onBlur() {
          if (disabled) {
            return
          }
          send({type: "DROPZONE.BLUR"})
        },
        onClick(event) {
          if (disabled || event.defaultPrevented || props.disableClick) {
            return
          }

          const target = getEventTarget<HTMLElement>(event)
          if (
            !contains(event.currentTarget, target) ||
            isInteractiveTarget(target, event.currentTarget)
          ) {
            return
          }

          // prevent opening the file dialog when clicking on the label (to avoid
          // double opening)
          if (event.currentTarget.localName === "label") {
            event.preventDefault()
          }
          send({type: "DROPZONE.CLICK"})
        },
        onDragLeave(event) {
          if (disabled) {
            return
          }
          if (!allowDrop) {
            return
          }
          if (contains(event.currentTarget, event.relatedTarget)) {
            return
          }
          send({type: "DROPZONE.DRAG_LEAVE"})
        },
        onDragOver(event) {
          if (disabled) {
            return
          }
          if (!allowDrop) {
            return
          }
          event.preventDefault()
          event.stopPropagation()
          try {
            event.dataTransfer.dropEffect = "copy"
          } catch {}

          const hasFiles = isEventWithFiles(event)
          if (!hasFiles) {
            return
          }

          const count = event.dataTransfer.items.length
          send({count, type: "DROPZONE.DRAG_OVER"})
        },
        onDrop(event) {
          if (disabled) {
            return
          }
          if (allowDrop) {
            event.preventDefault()
            event.stopPropagation()
          }

          const hasFiles = isEventWithFiles(event)
          if (disabled || !hasFiles) {
            return
          }

          getFileEntries(event.dataTransfer.items, prop("directory"))
            .then((files) => {
              return send({files: flatArray(files), type: "DROPZONE.DROP"})
            })
            .catch((err) => {
              warn(
                `[qualcomm-ui/file-upload] error processing dropped files\n${String(err)}`,
              )
            })
        },
        onFocus() {
          if (disabled) {
            return
          }
          send({type: "DROPZONE.FOCUS"})
        },
        onKeyDown(event) {
          if (disabled) {
            return
          }
          if (event.defaultPrevented) {
            return
          }

          const target = getEventTarget<HTMLElement>(event)
          if (!contains(event.currentTarget, target)) {
            return
          }
          if (isInteractiveTarget(target, event.currentTarget)) {
            return
          }

          if (props.disableClick) {
            return
          }
          if (event.key !== "Enter" && event.key !== " ") {
            return
          }
          send({src: "keydown", type: "DROPZONE.CLICK"})
        },
        role: props.disableClick ? "application" : "button",
        tabIndex: disabled || props.disableClick ? undefined : 0,
      })
    },
    getErrorTextBindings(
      props: IdRegistrationProps,
    ): FileUploadErrorTextBindings {
      scope.ids.register("errorText", props)
      return normalize.element({
        ...parts.errorText,
        ...commonBindings,
        "aria-live": "polite",
        hidden: !invalid,
        id: domIds.errorText(scope),
      })
    },
    getFileSize(file) {
      return formatBytes(file.size, prop("locale"))
    },
    getHiddenInputBindings(props: {id: string}) {
      scope.ids.register("hiddenInput", props)
      return normalize.input({
        ...parts.hiddenInput,
        ...commonBindings,
        accept: computed("acceptAttr"),
        "aria-describedby": ariaAttr(
          invalid ? domIds.errorText(scope) : undefined,
        ),
        "aria-invalid": booleanAriaAttr(invalid),
        capture: prop("capture"),
        disabled,
        id: domIds.hiddenInput(scope),
        multiple: computed("multiple") || prop("maxFiles") > 1,
        name: prop("name"),
        onClick(event) {
          event.stopPropagation()
          // allow for re-selection of the same file
          event.currentTarget.value = ""
        },
        onInput(event) {
          if (disabled) {
            return
          }
          const {files} = event.currentTarget
          send({files: files ? Array.from(files) : [], type: "FILE.SELECT"})
        },
        required: prop("required"),
        style: visuallyHiddenStyle,
        tabIndex: -1,
        type: "file",
        webkitdirectory: prop("directory") ? "" : undefined,
      })
    },
    getItemBindings(props): FileUploadItemBindings {
      const {file, fileErrors, type = DEFAULT_ITEM_TYPE} = props
      return normalize.element({
        ...parts.item,
        ...commonBindings,
        "data-disabled": booleanDataAttr(disabled),
        "data-invalid": booleanDataAttr(!!fileErrors?.length),
        "data-type": type,
        id: getItem(scope, file.name),
      })
    },
    getItemDeleteTriggerBindings(props): FileUploadItemDeleteTriggerBindings {
      const {file, type = DEFAULT_ITEM_TYPE} = props
      return normalize.button({
        ...parts.itemDeleteTrigger,
        ...commonBindings,
        "aria-label": translations.deleteFile?.(file),
        "data-disabled": booleanDataAttr(disabled),
        "data-type": type,
        disabled,
        onClick() {
          if (disabled) {
            return
          }
          send({file, itemType: type, type: "FILE.DELETE"})
        },
        type: "button",
      })
    },
    getItemGroupBindings(props = {}): FileUploadItemGroupBindings {
      const {type = DEFAULT_ITEM_TYPE} = props
      return normalize.element({
        ...parts.itemGroup,
        ...commonBindings,
        "data-disabled": booleanDataAttr(disabled),
        "data-type": type,
      })
    },

    getItemNameBindings(props): FileUploadItemNameBindings {
      const {file, type = DEFAULT_ITEM_TYPE} = props
      return normalize.element({
        ...parts.itemName,
        ...commonBindings,
        "data-disabled": booleanDataAttr(disabled),
        "data-type": type,
        id: getItemName(scope, file.name),
      })
    },

    getItemPreviewBindings(props): FileUploadItemPreviewBindings {
      const {file, type = DEFAULT_ITEM_TYPE} = props
      return normalize.element({
        ...parts.itemPreview,
        ...commonBindings,
        "data-disabled": booleanDataAttr(disabled),
        "data-type": type,
        id: getItemPreview(scope, file.name),
      })
    },

    getItemPreviewImageBindings(props): FileUploadItemPreviewImageBindings {
      const {file, type = DEFAULT_ITEM_TYPE, url} = props
      const isImage = file.type.startsWith("image/")
      if (!isImage) {
        throw new Error("Preview Image is only supported for image files")
      }
      return normalize.img({
        ...parts.itemPreviewImage,
        ...commonBindings,
        alt: translations.itemPreview?.(file),
        "data-disabled": booleanDataAttr(disabled),
        "data-type": type,
        src: url,
      })
    },

    getItemSizeTextBindings(props): FileUploadItemSizeTextBindings {
      const {file, type = DEFAULT_ITEM_TYPE} = props
      return normalize.element({
        ...parts.itemSizeText,
        ...commonBindings,
        "data-disabled": booleanDataAttr(disabled),
        "data-type": type,
        id: getItemSizeText(scope, file.name),
      })
    },

    getLabelBindings(props: {id: string}): FileUploadLabelBindings {
      scope.ids.register("label", props)
      return normalize.label({
        ...parts.label,
        ...commonBindings,
        "data-disabled": booleanDataAttr(disabled),
        "data-required": booleanDataAttr(required),
        dir: prop("dir"),
        htmlFor: domIds.hiddenInput(scope),
        id: domIds.label(scope),
      })
    },

    getRootBindings(props: IdRegistrationProps): FileUploadRootBindings {
      scope.ids.register("root", props)
      return normalize.element({
        ...parts.root,
        ...commonBindings,
        "data-disabled": booleanDataAttr(disabled),
        "data-dragging": booleanDataAttr(dragging),
        id: domIds.root(scope),
      })
    },

    getTriggerBindings(props: {id: string}): FileUploadTriggerBindings {
      scope.ids.register("trigger", props)
      return normalize.button({
        ...parts.trigger,
        ...commonBindings,
        "data-disabled": booleanDataAttr(disabled),
        "data-invalid": booleanDataAttr(invalid),
        disabled,
        id: domIds.trigger(scope),
        onClick(event) {
          if (disabled) {
            return
          }
          // if trigger is wrapped within the dropzone, stop propagation to avoid
          // double opening
          if (contains(domEls.dropzone(scope), event.currentTarget)) {
            event.stopPropagation()
          }
          send({type: "OPEN"})
        },
        type: "button",
      })
    },
  }
}
