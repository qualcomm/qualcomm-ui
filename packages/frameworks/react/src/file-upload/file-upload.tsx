// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, type ReactNode, useEffect, useState} from "react"

import {AlertCircle, FilePlus, Layers, Trash2, Upload} from "lucide-react"

import type {FileDetails} from "@qualcomm-ui/core/file-upload"
import {Button} from "@qualcomm-ui/react/button"
import {Icon} from "@qualcomm-ui/react/icon"
import {
  useFileUploadContext,
  useFileUploadItemContext,
} from "@qualcomm-ui/react-core/file-upload"
import {useControlledId} from "@qualcomm-ui/react-core/state"
import {getFileErrorMessage} from "@qualcomm-ui/utils/files"

import {
  FileUploadDropzone,
  type FileUploadDropzoneProps,
} from "./file-upload-dropzone"
import {FileUploadDropzoneHint} from "./file-upload-dropzone-hint"
import {FileUploadDropzoneText} from "./file-upload-dropzone-text"
import {FileUploadDropzoneTextGroup} from "./file-upload-dropzone-text-group"
import {FileUploadDropzoneTextLine} from "./file-upload-dropzone-text-line"
import {FileUploadErrorText} from "./file-upload-error-text"
import {
  FileUploadHiddenInput,
  type FileUploadHiddenInputProps,
} from "./file-upload-hidden-input"
import {FileUploadItem, type FileUploadItemProps} from "./file-upload-item"
import {FileUploadItemContent} from "./file-upload-item-content"
import {
  FileUploadItemGroup,
  type FileUploadItemGroupProps,
} from "./file-upload-item-group"
import {FileUploadItemName} from "./file-upload-item-name"
import {FileUploadItemPreview} from "./file-upload-item-preview"
import {FileUploadItemPreviewImage} from "./file-upload-item-preview-image"
import {FileUploadItemSizeText} from "./file-upload-item-size-text"
import {FileUploadLabel, type FileUploadLabelProps} from "./file-upload-label"
import {FileUploadRoot, type FileUploadRootProps} from "./file-upload-root"
import {FileUploadTrigger} from "./file-upload-trigger"

function FileUploadItemDeleteButton(): ReactElement {
  const api = useFileUploadContext()
  const itemContext = useFileUploadItemContext()

  return (
    <Button
      {...api.getItemDeleteTriggerBindings(itemContext)}
      aria-label="Remove file"
      startIcon={<Icon icon={Trash2} />}
      variant="ghost"
    />
  )
}

interface FileUploadDefaultDropzoneProps {
  dropzoneHint?: ReactNode
  dropzoneProps?: FileUploadDropzoneProps
  dropzoneText: string
  triggerText: string
}

function FileUploadDefaultDropzone({
  dropzoneHint,
  dropzoneProps,
  dropzoneText,
  triggerText,
}: FileUploadDefaultDropzoneProps): ReactElement {
  const api = useFileUploadContext()

  if (api.acceptedFiles.length > 0 || api.rejectedFiles.length > 0) {
    return <></>
  }

  return (
    <FileUploadDropzone {...dropzoneProps}>
      <Icon icon={Upload} style={{height: 24, width: 24}} />
      <FileUploadDropzoneTextGroup>
        <FileUploadDropzoneTextLine>
          <FileUploadDropzoneText>{dropzoneText}</FileUploadDropzoneText>
          <FileUploadTrigger>
            {(triggerProps) => (
              <button {...triggerProps} type="button">
                {triggerText}
              </button>
            )}
          </FileUploadTrigger>
        </FileUploadDropzoneTextLine>
        {dropzoneHint && (
          <FileUploadDropzoneHint>{dropzoneHint}</FileUploadDropzoneHint>
        )}
      </FileUploadDropzoneTextGroup>
    </FileUploadDropzone>
  )
}

interface FileUploadDefaultContentProps {
  addMoreButtonText: string
  clearButtonText: string
  fileUrls: Record<string, string>
  itemGroupProps?: FileUploadItemGroupProps
  itemProps?: FileUploadItemProps
  showAddMoreButton: boolean
  showClearButton: boolean
  showPreviews: boolean
  size?: "sm" | "md" | "lg"
}

function FileUploadDefaultContent({
  addMoreButtonText,
  clearButtonText,
  fileUrls,
  itemGroupProps,
  itemProps,
  showAddMoreButton,
  showClearButton,
  showPreviews,
  size = "md",
}: FileUploadDefaultContentProps): ReactElement {
  const api = useFileUploadContext()

  const fileIconSize = size === "sm" ? 32 : 64

  if (api.acceptedFiles.length === 0 && api.rejectedFiles.length === 0) {
    return <></>
  }

  return (
    <>
      <FileUploadItemGroup
        {...itemGroupProps}
        data-invalid={api.rejectedFiles.length > 0 ? true : undefined}
      >
        {api.acceptedFiles.map((file) => (
          <FileUploadItem key={file.name} {...itemProps} file={file}>
            <FileUploadItemPreview>
              {showPreviews &&
                file.type.startsWith("image/") &&
                fileUrls[file.name] && (
                  <FileUploadItemPreviewImage url={fileUrls[file.name]} />
                )}
              {(!showPreviews ||
                !file.type.startsWith("image/") ||
                !fileUrls[file.name]) && (
                <Icon
                  icon={Layers}
                  style={{height: fileIconSize, width: fileIconSize}}
                />
              )}
            </FileUploadItemPreview>
            <FileUploadItemContent>
              <FileUploadItemName />
              <FileUploadItemSizeText />
            </FileUploadItemContent>
            <FileUploadItemDeleteButton />
          </FileUploadItem>
        ))}
        {api.rejectedFiles.map((rejection) => (
          <FileUploadItem
            key={rejection.file.name}
            {...itemProps}
            file={rejection.file}
            type="rejected"
          >
            <FileUploadItemPreview>
              <Icon
                icon={Layers}
                style={{height: fileIconSize, width: fileIconSize}}
              />
            </FileUploadItemPreview>
            <FileUploadItemContent>
              <FileUploadItemName />
              <FileUploadItemSizeText data-invalid>
                <Icon
                  icon={AlertCircle}
                  style={{
                    height: 12,
                    minHeight: 12,
                    minWidth: 12,
                    width: 12,
                  }}
                />
                {getFileErrorMessage(rejection.errors)}
              </FileUploadItemSizeText>
            </FileUploadItemContent>
            <FileUploadItemDeleteButton />
          </FileUploadItem>
        ))}
      </FileUploadItemGroup>

      <div className="flex justify-start">
        {showAddMoreButton && (
          <FileUploadTrigger>
            {(triggerProps) => (
              <Button
                {...triggerProps}
                startIcon={<Icon icon={FilePlus} />}
                variant="outline"
              >
                {addMoreButtonText}
              </Button>
            )}
          </FileUploadTrigger>
        )}
        {showClearButton && (
          <Button
            {...api.getClearTriggerBindings()}
            startIcon={<Icon icon={Trash2} />}
            variant="ghost"
          >
            {clearButtonText}
          </Button>
        )}
      </div>
    </>
  )
}

export interface FileUploadProps extends FileUploadRootProps {
  /**
   * Text to display on the "Add more files" button.
   *
   * @default "Add more files"
   */
  addMoreButtonText?: string

  /**
   * Text to display on the clear button.
   *
   * @default "Clear all"
   */
  clearButtonText?: string

  /**
   * Optional hint text to display in the dropzone below the main instruction.
   * Typically used to show supported file types or size limits.
   *
   * @example "Supported file types: .jpg, .png, .pdf"
   */
  dropzoneHint?: ReactNode

  /**
   * Props applied to the dropzone element.
   */
  dropzoneProps?: FileUploadDropzoneProps

  /**
   * The main text displayed in the dropzone.
   *
   * @default "Drag & drop files, or"
   */
  dropzoneText?: string

  /**
   * Optional error message that describes the element when {@link invalid} is true.
   *
   * @remarks
   * To customize the element, provide it using the component instead:
   *
   * ```tsx
   * <FileUpload.ErrorText>...</FileUpload.ErrorText>
   * ```
   */
  errorText?: ReactNode

  /**
   * Props applied to the hidden input element.
   */
  hiddenInputProps?: FileUploadHiddenInputProps

  /**
   * Props applied to the item group element.
   */
  itemGroupProps?: FileUploadItemGroupProps

  /**
   * Props applied to each file item element.
   */
  itemProps?: FileUploadItemProps

  /**
   * Optional label describing the file upload. This element is automatically
   * associated with the hidden input element for accessibility.
   *
   * @remarks
   * To customize the element, provide it using the component instead:
   *
   * ```tsx
   * <FileUpload.Label>...</FileUpload.Label>
   * ```
   */
  label?: ReactNode

  /**
   * Props applied to the label element.
   */
  labelProps?: FileUploadLabelProps

  /**
   * When `true`, renders an "Add more files" button when files are present.
   *
   * @default true
   */
  showAddMoreButton?: boolean

  /**
   * When `true`, renders a button to clear all accepted files.
   *
   * @default true
   */
  showClearButton?: boolean

  /**
   * When `true`, shows image previews for uploaded image files.
   *
   * @default true
   */
  showPreviews?: boolean

  /**
   * The text displayed on the browse trigger button within the dropzone.
   *
   * @default "browse"
   */
  triggerText?: string
}

export function FileUpload({
  addMoreButtonText = "Add more files",
  children,
  clearButtonText = "Clear all",
  dropzoneHint,
  dropzoneProps,
  dropzoneText = "Drag & drop files, or",
  errorText,
  hiddenInputProps,
  itemGroupProps,
  itemProps,
  label,
  labelProps,
  onFileChange,
  showAddMoreButton = true,
  showClearButton = true,
  showPreviews = true,
  triggerText = "browse",
  ...props
}: FileUploadProps): ReactElement {
  const [fileUrls, setFileUrls] = useState<Record<string, string>>({})

  const labelContent = label || labelProps?.children

  const handleFileChange = (details: FileDetails) => {
    setFileUrls((currentUrls) => {
      const newUrls: Record<string, string> = {}
      const currentFileNames = new Set(details.acceptedFiles.map((f) => f.name))

      details.acceptedFiles.forEach((file) => {
        if (currentUrls[file.name]) {
          newUrls[file.name] = currentUrls[file.name]
        } else if (file.type.startsWith("image/")) {
          newUrls[file.name] = URL.createObjectURL(file)
        }
      })

      Object.keys(currentUrls).forEach((fileName) => {
        if (!currentFileNames.has(fileName)) {
          URL.revokeObjectURL(currentUrls[fileName])
        }
      })

      return newUrls
    })

    onFileChange?.(details)
  }

  useEffect(() => {
    return () => {
      Object.values(fileUrls).forEach((url) => {
        URL.revokeObjectURL(url)
      })
    }
  }, [fileUrls])

  const ids = {
    hiddenInput: useControlledId(hiddenInputProps?.id),
    label: useControlledId(labelProps?.id),
    root: useControlledId(props.id),
    ...props.ids,
  }

  return (
    <FileUploadRoot
      {...props}
      id={ids.root}
      ids={ids}
      onFileChange={handleFileChange}
    >
      {labelContent && (
        <FileUploadLabel {...labelProps} id={ids.label}>
          {labelContent}
        </FileUploadLabel>
      )}

      <FileUploadDefaultDropzone
        dropzoneHint={dropzoneHint}
        dropzoneProps={dropzoneProps}
        dropzoneText={dropzoneText}
        triggerText={triggerText}
      />

      <FileUploadHiddenInput {...hiddenInputProps} id={ids.hiddenInput} />

      <FileUploadDefaultContent
        addMoreButtonText={addMoreButtonText}
        clearButtonText={clearButtonText}
        fileUrls={fileUrls}
        itemGroupProps={itemGroupProps}
        itemProps={itemProps}
        showAddMoreButton={showAddMoreButton}
        showClearButton={showClearButton}
        showPreviews={showPreviews}
        size={props.size}
      />

      {children}

      {errorText && <FileUploadErrorText>{errorText}</FileUploadErrorText>}
    </FileUploadRoot>
  )
}
