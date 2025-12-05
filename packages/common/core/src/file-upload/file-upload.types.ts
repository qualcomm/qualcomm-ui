import type {
  BooleanAriaAttr,
  BooleanDataAttr,
} from "@qualcomm-ui/utils/attributes"
import type {DirectionProperty, Locale} from "@qualcomm-ui/utils/direction"
import type {FileError, FileMimeType} from "@qualcomm-ui/utils/files"
import type {RequiredBy} from "@qualcomm-ui/utils/guard"
import type {
  ActionSchema,
  CommonProperties,
  EffectSchema,
  JSX,
  MachineSchema,
  PropNormalizer,
  ScopeWithIds,
} from "@qualcomm-ui/utils/machine"

export interface FileRejection {
  errors: FileError[]
  file: File
}

export interface FileDetails {
  acceptedFiles: File[]
  rejectedFiles: FileRejection[]
}

export interface FileAcceptDetails {
  files: File[]
}

export interface FileRejectDetails {
  files: FileRejection[]
}

export interface FileUploadElementIds {
  dropzone: string
  hiddenInput: string
  item: string[]
  itemName: string[]
  itemPreview: string[]
  itemSizeText: string[]
  label: string
  root: string
  trigger: string
}

export interface IntlTranslations {
  clearTriggerLabel: string
  deleteFile?: ((file: File) => string) | undefined
  dropzone?: string | undefined
  itemPreview?: ((file: File) => string) | undefined
}

export interface FileUploadApiProps extends Locale, CommonProperties {
  /**
   * The accept file types
   */
  accept?: Record<string, string[]> | FileMimeType | FileMimeType[] | undefined
  /**
   * The controlled accepted files
   */
  acceptedFiles?: File[] | undefined
  /**
   * Whether to allow drag and drop in the dropzone element
   * @default true
   */
  allowDrop?: boolean | undefined
  /**
   * The default camera to use when capturing media
   */
  capture?: "user" | "environment" | undefined
  /**
   * The default accepted files when rendered.
   * Use when you don't need to control the accepted files of the input.
   */
  defaultAcceptedFiles?: File[] | undefined
  /**
   * Whether to accept directories, only works in webkit browsers
   */
  directory?: boolean | undefined
  /**
   * Whether the file input is disabled
   */
  disabled?: boolean | undefined
  /**
   * The ids of the elements. Useful for composition.
   */
  ids?: Partial<FileUploadElementIds> | undefined
  /**
   * Whether the file input is invalid
   */
  invalid?: boolean | undefined
  /**
   * The maximum number of files
   * @default 1
   */
  maxFiles?: number | undefined
  /**
   * The maximum file size in bytes
   *
   * @default Infinity
   */
  maxFileSize?: number | undefined
  /**
   * The minimum file size in bytes
   *
   * @default 0
   */
  minFileSize?: number | undefined
  /**
   * The name of the underlying file input
   */
  name?: string | undefined
  /**
   * Function called when the file is accepted
   */
  onFileAccept?: ((details: FileAcceptDetails) => void) | undefined
  /**
   * Function called when the value changes, whether accepted or rejected
   */
  onFileChange?: ((details: FileDetails) => void) | undefined
  /**
   * Function called when the file is rejected
   */
  onFileReject?: ((details: FileRejectDetails) => void) | undefined
  /**
   * Whether to prevent the drop event on the document
   * @default true
   */
  preventDocumentDrop?: boolean | undefined
  /**
   * Whether the file input is required
   */
  required?: boolean | undefined
  /**
   * Function to transform the accepted files to apply transformations
   */
  transformFiles?: ((files: File[]) => Promise<File[]>) | undefined
  /**
   * The localized messages to use.
   */
  translations?: IntlTranslations | undefined
  /**
   * Function to validate a file
   */
  validate?:
    | ((file: File, details: FileDetails) => FileError[] | null)
    | undefined
}

type PropsWithDefault =
  | "minFileSize"
  | "maxFileSize"
  | "maxFiles"
  | "preventDocumentDrop"
  | "allowDrop"
  | "translations"

interface PrivateContext {
  /**
   * The current value of the file input
   */
  acceptedFiles: File[]
  /**
   * The rejected files
   */
  rejectedFiles: FileRejection[]
  /**
   * Whether files are currently being transformed
   */
  transforming: boolean
}

export interface FileUploadScope extends ScopeWithIds<FileUploadSchema> {}

interface ComputedContext {
  /**
   * The accept attribute as a string
   */
  acceptAttr: string | undefined
  /**
   * Whether the file can select multiple files
   */
  multiple: boolean
}

type Events =
  | {
      file: File
      itemType: string
      type: "FILE.DELETE"
    }
  | {
      files: (File | (File | null)[] | null)[]
      type: "FILE.SELECT" | "DROPZONE.DROP"
    }
  | {
      count?: number
      files: File[]
      type: "FILES.SET"
    }
  | {
      count: number
      type: "DROPZONE.DRAG_OVER"
    }
  | {
      src?: "keydown"
      type: "DROPZONE.CLICK"
    }
  | {
      type:
        | "FILES.CLEAR"
        | "REJECTED_FILES.CLEAR"
        | "DROPZONE.DRAG_LEAVE"
        | "DROPZONE.BLUR"
        | "OPEN"
        | "DROPZONE.FOCUS"
    }

export interface FileUploadSchema extends MachineSchema {
  actions: ActionSchema<
    | "syncInputElement"
    | "openFilePicker"
    | "setFiles"
    | "setEventFiles"
    | "removeFile"
    | "clearRejectedFiles"
    | "clearFiles"
  >
  computed: ComputedContext
  context: PrivateContext
  effects: EffectSchema<"preventDocumentDrop">
  events: Events
  ids: FileUploadElementIds
  props: RequiredBy<FileUploadApiProps, PropsWithDefault>
  state: "idle" | "focused" | "dragging"
}

export type ItemType = "accepted" | "rejected"

export interface ItemTypeProps {
  type?: ItemType | undefined
}

export interface ItemProps extends ItemTypeProps {
  file: File
}

export interface ItemPreviewImageProps extends ItemProps {
  url: string
}

export interface ItemGroupProps extends ItemTypeProps {}

export interface DropzoneProps {
  /**
   * Whether to disable the click event on the dropzone
   */
  disableClick?: boolean | undefined
}

export interface FileUploadApi<T extends PropNormalizer = PropNormalizer> {
  /**
   * The accepted files that have been dropped or selected
   */
  acceptedFiles: File[]
  /**
   * Clears the accepted files
   */
  clearFiles: VoidFunction
  /**
   * Clears the rejected files
   */
  clearRejectedFiles: VoidFunction
  /**
   * Returns the preview url of a file.
   * Returns a function to revoke the url.
   */
  createFileUrl: (file: File, cb: (url: string) => void) => VoidFunction
  /**
   * Function to delete the file from the list
   */
  deleteFile: (file: File, type?: ItemType) => void
  /**
   * Whether the file input is disabled
   */
  disabled: boolean
  /**
   * Whether the user is dragging something over the root element
   */
  dragging: boolean
  /**
   * Whether the user is focused on the dropzone element
   */
  focused: boolean
  getClearTriggerProps: () => FileUploadClearTriggerBindings
  getDropzoneProps: (props?: DropzoneProps) => FileUploadDropzoneBindings
  /**
   * Returns the formatted file size (e.g. 1.2MB)
   */
  getFileSize: (file: File) => string
  getHiddenInputProps: () => FileUploadHiddenInputBindings
  getItemDeleteTriggerProps: (
    props: ItemProps,
  ) => FileUploadItemDeleteTriggerBindings
  getItemGroupProps: (props?: ItemGroupProps) => FileUploadItemBindings
  getItemNameProps: (props: ItemProps) => FileUploadItemIdBindings
  getItemPreviewImageProps: (
    props: ItemPreviewImageProps,
  ) => FileUploadItemPreviewImageBindings
  getItemPreviewProps: (props: ItemProps) => FileUploadItemIdBindings
  getItemProps: (props: ItemProps) => FileUploadItemIdBindings
  getItemSizeTextProps: (props: ItemProps) => FileUploadItemIdBindings
  getLabelProps: () => FileUploadLabelBindings
  getRootProps: () => FileUploadRootBindings
  getTriggerProps: () => FileUploadTriggerBindings
  /**
   * Function to open the file dialog
   */
  openFilePicker: VoidFunction
  /**
   * The files that have been rejected
   */
  rejectedFiles: FileRejection[]
  /**
   * Sets the clipboard files
   * Returns `true` if the clipboard data contains files, `false` otherwise.
   */
  setClipboardFiles: (dt: DataTransfer | null) => boolean
  /**
   * Sets the accepted files
   */
  setFiles: (files: File[]) => void
  /**
   * Whether files are currently being transformed via `transformFiles`
   */
  transforming: boolean
}

interface CommonBindings extends DirectionProperty {
  "data-scope": "file-upload"
}

export interface FileUploadClearTriggerBindings extends CommonBindings {
  "aria-label": string | undefined
  "data-invalid": BooleanDataAttr
  "data-part": "clear-trigger"
  disabled: boolean | undefined
  hidden: boolean
  onClick: JSX.MouseEventHandler
  type: "button"
}

export interface FileUploadDropzoneBindings extends CommonBindings {
  "aria-disabled": BooleanAriaAttr
  "aria-label": string | undefined
  "data-disabled": BooleanDataAttr
  "data-dragging": BooleanDataAttr
  "data-invalid": BooleanDataAttr
  id: string
  onBlur: JSX.FocusEventHandler
  onClick: JSX.MouseEventHandler<HTMLElement>
  onDragLeave: JSX.DragEventHandler
  onDragOver: JSX.DragEventHandler
  onDrop: JSX.DragEventHandler
  onFocus: JSX.FocusEventHandler
  onKeyDown: JSX.KeyboardEventHandler<HTMLElement>
  role: "application" | "button"
  tabIndex: 0 | undefined
}

export interface FileUploadHiddenInputBindings extends CommonBindings {
  accept: string | undefined
  capture: string | undefined
  disabled: boolean | undefined
  id: string
  multiple: boolean
  name?: string
  onClick: JSX.MouseEventHandler<HTMLInputElement>
  onInput: JSX.FormEventHandler<HTMLInputElement>
  required: boolean | undefined
  style: JSX.CSSProperties
  tabIndex: -1
  type: "file"
  webkitdirectory: string | undefined
}

export interface FileUploadItemDeleteTriggerBindings extends CommonBindings {
  "aria-label": string | undefined
  "data-disabled": BooleanDataAttr
  "data-type": ItemType
  disabled: boolean
  onClick: JSX.MouseEventHandler<HTMLInputElement>
  type: "button"
}

export interface FileUploadItemBindings extends CommonBindings {
  "data-disabled": BooleanDataAttr
  "data-type": ItemType
}

export interface FileUploadItemIdBindings extends FileUploadItemBindings {
  id: string
}

export interface FileUploadItemPreviewImageBindings
  extends FileUploadItemBindings {
  alt: string | undefined
  src: string
}

export interface FileUploadLabelBindings extends CommonBindings {
  "data-disabled": BooleanDataAttr
  "data-required": BooleanDataAttr
  htmlFor: string
  id: string
}

export interface FileUploadRootBindings extends CommonBindings {
  "data-disabled": BooleanDataAttr
  "data-dragging": BooleanDataAttr
  id: string
}

export interface FileUploadTriggerBindings extends CommonBindings {
  "data-disabled": BooleanDataAttr
  "data-invalid": BooleanDataAttr
  disabled: boolean
  id: string
  onClick: JSX.MouseEventHandler<HTMLElement>
  type: "button"
}
