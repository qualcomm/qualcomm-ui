import type {listboxClasses} from "./listbox.classes.js"

type ListboxClasses = typeof listboxClasses

export type QdsListboxSize = "sm" | "md" | "lg"

export interface QdsListboxApiProps {
  /**
   * @default "sm"
   */
  size?: QdsListboxSize
}

export interface QdsListboxRootBindings {
  className: ListboxClasses["root"]
  "data-size": QdsListboxSize
}

export interface QdsListboxContentBindings {
  className: ListboxClasses["content"]
}

export interface QdsListboxLabelBindings {
  className: ListboxClasses["label"]
  "data-size": QdsListboxSize
}

export interface QdsListboxItemBindings {
  className: ListboxClasses["item"]
  "data-size": QdsListboxSize
}

export interface QdsListboxApi {
  size: QdsListboxSize

  // group: bindings
  getContentBindings(): QdsListboxContentBindings
  getItemBindings(): QdsListboxItemBindings
  getLabelBindings(): QdsListboxLabelBindings
  getRootBindings(): QdsListboxRootBindings
}
