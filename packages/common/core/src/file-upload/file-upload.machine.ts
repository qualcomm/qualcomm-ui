// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  addDomEvent,
  contains,
  getEventTarget,
  getWindow,
  raf,
} from "@qualcomm-ui/dom/query"
import {getAcceptAttrString, isFileEqual} from "@qualcomm-ui/utils/files"
import {callAll} from "@qualcomm-ui/utils/functions"
import {createMachine, type MachineConfig} from "@qualcomm-ui/utils/machine"
import {warn} from "@qualcomm-ui/utils/warning"

import {domEls} from "./file-upload.dom"
import type {FileRejection, FileUploadSchema} from "./file-upload.types"
import {getEventFiles, setInputFiles} from "./file-upload.utils"

export const fileUploadMachine: MachineConfig<FileUploadSchema> = createMachine(
  {
    actions: {
      clearFiles({context}) {
        context.set("acceptedFiles", [])
        context.set("rejectedFiles", [])
      },
      clearRejectedFiles({context}) {
        context.set("rejectedFiles", [])
      },
      openFilePicker({scope}) {
        raf(() => {
          domEls.hiddenInput(scope)?.click()
        })
      },
      removeFile({context, event}) {
        if (event.type !== "FILE.DELETE") {
          return
        }
        if (event.itemType === "rejected") {
          const rejectedFiles = context
            .get("rejectedFiles")
            .filter((item) => !isFileEqual(item.file, event.file))
          context.set("rejectedFiles", rejectedFiles)
        } else {
          const files = context
            .get("acceptedFiles")
            .filter((file) => !isFileEqual(file, event.file))
          context.set("acceptedFiles", files)
        }
      },
      setEventFiles(params) {
        const {computed, context, event, prop} = params
        if (event.type !== "FILE.SELECT" && event.type !== "DROPZONE.DROP") {
          return
        }

        const currentAcceptedFiles = context.get("acceptedFiles")
        const currentRejectedFiles = context.get("rejectedFiles")
        const eventFiles = event.files.flat().filter((f) => f !== null)
        const {acceptedFiles, rejectedFiles} = getEventFiles(
          params,
          eventFiles,
          currentAcceptedFiles,
          currentRejectedFiles,
        )

        const set = (files: File[]) => {
          if (computed("multiple")) {
            context.set("acceptedFiles", (prev) => [...prev, ...files])
            context.set("rejectedFiles", rejectedFiles)
            return
          }

          if (files.length) {
            context.set("acceptedFiles", [files[0]])
            context.set("rejectedFiles", rejectedFiles)
            return
          }

          if (rejectedFiles.length) {
            context.set("acceptedFiles", context.get("acceptedFiles"))
            context.set("rejectedFiles", rejectedFiles)
          }
        }

        const transform = prop("transformFiles")
        if (transform) {
          context.set("transforming", true)
          transform(acceptedFiles)
            .then(set)
            .catch((err) => {
              warn(`[qualcomm-ui/file-upload] error transforming files\n${err}`)
            })
            .finally(() => {
              context.set("transforming", false)
            })
        } else {
          set(acceptedFiles)
        }
      },
      setFiles(params) {
        const {computed, context, event} = params
        if (event.type !== "FILES.SET") {
          return
        }
        const {acceptedFiles, rejectedFiles} = getEventFiles(
          params,
          event.files,
        )
        context.set(
          "acceptedFiles",
          computed("multiple")
            ? acceptedFiles
            : acceptedFiles.length > 0
              ? [acceptedFiles[0]]
              : [],
        )
        context.set("rejectedFiles", rejectedFiles)
      },
      syncInputElement({context, scope}) {
        queueMicrotask(() => {
          const inputEl = domEls.hiddenInput(scope)
          if (!inputEl) {
            return
          }
          setInputFiles(inputEl, context.get("acceptedFiles"))
          const win = getWindow(inputEl)
          inputEl.dispatchEvent(new win.Event("change", {bubbles: true}))
        })
      },
    },
    computed: {
      acceptAttr: ({prop}) => getAcceptAttrString(prop("accept")),
      multiple: ({prop}) => prop("maxFiles") > 1,
    },
    context({bindable, getContext, prop}) {
      return {
        acceptedFiles: bindable<File[]>(() => ({
          defaultValue: prop("defaultAcceptedFiles"),
          hash(value) {
            return value.map((file) => `${file.name}-${file.size}`).join(",")
          },
          isEqual: (a, b) =>
            a.length === b?.length &&
            a.every((file, i) => isFileEqual(file, b[i])),
          onChange(value) {
            const ctx = getContext()
            prop("onFileAccept")?.({files: value})
            prop("onFileChange")?.({
              acceptedFiles: value,
              rejectedFiles: ctx.get("rejectedFiles"),
            })
          },
          value: prop("acceptedFiles"),
        })),
        rejectedFiles: bindable<FileRejection[]>(() => ({
          defaultValue: [],
          isEqual: (a, b) =>
            a.length === b?.length &&
            a.every((file, i) => isFileEqual(file.file, b[i].file)),
          onChange(value) {
            const ctx = getContext()
            prop("onFileReject")?.({files: value})
            prop("onFileChange")?.({
              acceptedFiles: ctx.get("acceptedFiles"),
              rejectedFiles: value,
            })
          },
        })),
        transforming: bindable<boolean>(() => ({
          defaultValue: false,
        })),
      }
    },
    effects: {
      preventDocumentDrop({prop, scope}) {
        if (!prop("preventDocumentDrop")) {
          return
        }
        if (!prop("allowDrop")) {
          return
        }
        if (prop("disabled")) {
          return
        }
        const doc = scope.getDoc()
        const onDragOver = (event: DragEvent) => {
          event?.preventDefault()
        }
        const onDrop = (event: DragEvent) => {
          if (contains(domEls.root(scope), getEventTarget(event))) {
            return
          }
          event.preventDefault()
        }
        return callAll(
          addDomEvent(doc, "dragover", onDragOver, false),
          addDomEvent(doc, "drop", onDrop, false),
        )
      },
    },
    ids: ({bindableId, bindableIdCollection, ids}) => {
      return {
        dropzone: bindableId<string>(ids?.dropzone),
        errorText: bindableId<string>(ids?.errorText),
        hiddenInput: bindableId<string>(ids?.hiddenInput),
        item: bindableIdCollection(),
        itemName: bindableIdCollection(),
        itemPreview: bindableIdCollection(),
        itemSizeText: bindableIdCollection(),
        label: bindableId<string>(ids?.label),
        root: bindableId<string>(ids?.root),
        trigger: bindableId<string>(ids?.trigger),
      }
    },
    initialState() {
      return "idle"
    },
    on: {
      "FILE.DELETE": {
        actions: ["removeFile"],
      },
      "FILE.SELECT": {
        actions: ["setEventFiles"],
      },
      "FILES.CLEAR": {
        actions: ["clearFiles"],
      },
      "FILES.SET": {
        actions: ["setFiles"],
      },
      "REJECTED_FILES.CLEAR": {
        actions: ["clearRejectedFiles"],
      },
    },
    onInit: undefined,
    props({props}) {
      return {
        allowDrop: true,
        defaultAcceptedFiles: [],
        maxFiles: 1,
        maxFileSize: Number.POSITIVE_INFINITY,
        minFileSize: 0,
        preventDocumentDrop: true,
        ...props,
        translations: {
          clearTriggerLabel: "Clear file",
          deleteFile: (file) => `delete file ${file.name}`,
          dropzone: "dropzone",
          itemPreview: (file) => `preview of ${file.name}`,
          ...props.translations,
        },
      }
    },
    states: {
      dragging: {
        on: {
          "DROPZONE.DRAG_LEAVE": {
            target: "idle",
          },
          "DROPZONE.DROP": {
            actions: ["setEventFiles"],
            target: "idle",
          },
        },
      },
      focused: {
        on: {
          "DROPZONE.BLUR": {
            target: "idle",
          },
          "DROPZONE.CLICK": {
            actions: ["openFilePicker"],
          },
          "DROPZONE.DRAG_OVER": {
            target: "dragging",
          },
          OPEN: {
            actions: ["openFilePicker"],
          },
        },
      },
      idle: {
        on: {
          "DROPZONE.CLICK": {
            actions: ["openFilePicker"],
          },
          "DROPZONE.DRAG_OVER": {
            target: "dragging",
          },
          "DROPZONE.FOCUS": {
            target: "focused",
          },
          OPEN: {
            actions: ["openFilePicker"],
          },
        },
      },
    },
    watch({action, context, track}) {
      track([() => context.hash("acceptedFiles")], () => {
        action(["syncInputElement"])
      })
    },
  },
)
