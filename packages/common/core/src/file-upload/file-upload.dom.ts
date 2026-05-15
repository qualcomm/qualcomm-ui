// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ScopeDomElements, ScopeDomIds} from "@qualcomm-ui/utils/machine"

import type {FileUploadElementIds, FileUploadScope} from "./file-upload.types"

export const domIds: ScopeDomIds<
  Omit<
    FileUploadElementIds,
    "item" | "itemName" | "itemPreview" | "itemSizeText"
  >,
  FileUploadScope
> = {
  dropzone: (scope) => scope.ids.get("dropzone"),
  errorText: (scope) => scope.ids.get("errorText"),
  hiddenInput: (scope) => scope.ids.get("hiddenInput"),
  label: (scope) => scope.ids.get("label"),
  root: (scope) => scope.ids.get("root"),
  trigger: (scope) => scope.ids.get("trigger"),
}

export const domEls: ScopeDomElements<
  Omit<
    FileUploadElementIds,
    | "trigger"
    | "item"
    | "itemName"
    | "itemPreview"
    | "itemSizeText"
    | "label"
    | "hiddenInput"
  >,
  FileUploadScope
> & {
  hiddenInput: (scope: FileUploadScope) => HTMLInputElement | null
} = {
  dropzone: (scope) => scope.getById<HTMLElement>(domIds.dropzone(scope)),
  errorText: (scope) => scope.getById(domIds.errorText(scope)),
  hiddenInput: (scope) => scope.getById(domIds.hiddenInput(scope)),
  root: (scope) => scope.getById<HTMLElement>(domIds.root(scope)),
}

export function getItem(scope: FileUploadScope, id: string) {
  return `${domIds.root(scope)}-item-${id}`
}

export function getItemName(scope: FileUploadScope, id: string) {
  return `${domIds.root(scope)}-item-name-${id}`
}

export function getItemPreview(scope: FileUploadScope, id: string) {
  return `${domIds.root(scope)}-item-preview-${id}`
}

export function getItemSizeText(scope: FileUploadScope, id: string) {
  return `${domIds.root(scope)}-item-size-text-${id}`
}
