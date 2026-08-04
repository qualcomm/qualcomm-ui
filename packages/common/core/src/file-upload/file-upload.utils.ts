// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {getEventTarget, getWindow} from "@qualcomm-ui/dom/query"
import {
  type FileError,
  isFileEqual,
  isValidFileSize,
  isValidFileType,
} from "@qualcomm-ui/utils/files"
import type {Params} from "@qualcomm-ui/utils/machine"
import {warn} from "@qualcomm-ui/utils/warning"

import type {FileRejection, FileUploadSchema} from "./file-upload.types.js"

export function isEventWithFiles(
  event: Pick<DragEvent, "dataTransfer" | "target">,
): boolean {
  const target = getEventTarget<Element>(event)
  if (!event.dataTransfer) {
    return !!target && "files" in target
  }
  return event.dataTransfer.types.some((type) => {
    return type === "Files" || type === "application/x-moz-file"
  })
}

export function isFilesWithinRange(
  ctx: Params<FileUploadSchema>,
  incomingCount: number,
  currentAcceptedFiles: File[],
): boolean {
  const {computed, prop} = ctx
  if (!computed("multiple") && incomingCount > 1) {
    return false
  }
  if (
    !computed("multiple") &&
    incomingCount + currentAcceptedFiles.length === 2
  ) {
    return true
  }
  return incomingCount + currentAcceptedFiles.length <= prop("maxFiles")
}

export function getEventFiles(
  ctx: Params<FileUploadSchema>,
  files: File[],
  currentAcceptedFiles: File[] = [],
  currentRejectedFiles: FileRejection[] = [],
): {
  acceptedFiles: File[]
  rejectedFiles: FileRejection[]
} {
  const {computed, prop} = ctx
  const acceptedFiles: File[] = []
  const rejectedFiles: FileRejection[] = []

  const validateParams = {
    acceptedFiles: currentAcceptedFiles,
    rejectedFiles: currentRejectedFiles,
  }

  for (const file of files) {
    const [accepted, acceptError] = isValidFileType(
      file,
      computed("acceptAttr"),
    )
    const [sizeMatch, sizeError] = isValidFileSize(
      file,
      prop("minFileSize"),
      prop("maxFileSize"),
    )

    const isDuplicate =
      currentAcceptedFiles.some((f) => isFileEqual(f, file)) ||
      acceptedFiles.some((f) => isFileEqual(f, file))

    const validateErrors = prop("validate")?.(file, validateParams)

    const valid = validateErrors ? validateErrors.length === 0 : true

    if (accepted && sizeMatch && valid && !isDuplicate) {
      acceptedFiles.push(file)
    } else {
      const errors = [acceptError, sizeError]
      if (isDuplicate) {
        errors.push("FILE_EXISTS")
      }
      if (!valid) {
        errors.push(...(validateErrors ?? []))
      }
      rejectedFiles.push({errors: errors.filter(Boolean) as FileError[], file})
    }
  }

  if (!isFilesWithinRange(ctx, acceptedFiles.length, currentAcceptedFiles)) {
    for (const file of acceptedFiles) {
      rejectedFiles.push({errors: ["TOO_MANY_FILES"], file})
    }
    acceptedFiles.splice(0)
  }

  return {
    acceptedFiles,
    rejectedFiles,
  }
}

export function setInputFiles(inputEl: HTMLInputElement, files: File[]): void {
  const win = getWindow(inputEl)
  try {
    if ("DataTransfer" in win) {
      const dataTransfer = new win.DataTransfer()
      for (const file of files) {
        dataTransfer.items.add(file)
      }
      inputEl.files = dataTransfer.files
    }
  } catch (err) {
    warn(`[qualcomm-ui/file-upload] error setting input files\n${String(err)}`)
  }
}
