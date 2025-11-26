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
