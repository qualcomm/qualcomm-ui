// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, useEffect, useState} from "react"

import {AlertCircle, FilePlus, Layers, Trash2, Upload} from "lucide-react"

import type {FileDetails} from "@qualcomm-ui/core/file-upload"
import {Button} from "@qualcomm-ui/react/button"
import {FileUpload} from "@qualcomm-ui/react/file-upload"
import {Icon} from "@qualcomm-ui/react/icon"
import {
  useFileUploadContext,
  useFileUploadItemContext,
} from "@qualcomm-ui/react-core/file-upload"
import {getFileErrorMessage} from "@qualcomm-ui/utils/files"

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

function FileUploadCompositeDemoContent({
  fileUrls,
}: {
  fileUrls: Record<string, string>
}): ReactElement {
  const api = useFileUploadContext()

  if (api.acceptedFiles.length === 0 && api.rejectedFiles.length === 0) {
    return <></>
  }

  return (
    <>
      <FileUpload.ItemGroup
        data-invalid={api.rejectedFiles.length > 0 ? true : undefined}
      >
        {api.acceptedFiles.map((file) => (
          <FileUpload.Item key={file.name} file={file}>
            <FileUpload.ItemPreview>
              {file.type.startsWith("image/") && fileUrls[file.name] ? (
                <FileUpload.ItemPreviewImage url={fileUrls[file.name]} />
              ) : (
                <Icon icon={Layers} style={{height: 36, width: 36}} />
              )}
            </FileUpload.ItemPreview>
            <FileUpload.ItemContent>
              <FileUpload.ItemName />
              <FileUpload.ItemSizeText />
            </FileUpload.ItemContent>
            <FileUploadItemDeleteButton />
          </FileUpload.Item>
        ))}
        {api.rejectedFiles.map((rejection) => (
          <FileUpload.Item
            key={rejection.file.name}
            file={rejection.file}
            type="rejected"
          >
            <FileUpload.ItemPreview>
              <Icon icon={Layers} style={{height: 36, width: 36}} />
            </FileUpload.ItemPreview>
            <FileUpload.ItemContent>
              <FileUpload.ItemName />
              <FileUpload.ItemSizeText data-invalid>
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
              </FileUpload.ItemSizeText>
            </FileUpload.ItemContent>
            <FileUploadItemDeleteButton />
          </FileUpload.Item>
        ))}
      </FileUpload.ItemGroup>

      <div className="flex justify-start">
        <FileUpload.Trigger>
          {(triggerProps) => (
            <Button
              {...triggerProps}
              startIcon={<Icon icon={FilePlus} />}
              variant="outline"
            >
              Add more files
            </Button>
          )}
        </FileUpload.Trigger>
        <Button
          {...api.getClearTriggerBindings()}
          startIcon={<Icon icon={Trash2} />}
          variant="ghost"
        >
          Clear all
        </Button>
      </div>
    </>
  )
}

function FileUploadCompositeDemoDropzone(): ReactElement {
  const api = useFileUploadContext()

  if (api.acceptedFiles.length > 0 || api.rejectedFiles.length > 0) {
    return <></>
  }

  return (
    <FileUpload.Dropzone>
      <Icon icon={Upload} style={{height: 24, width: 24}} />
      <FileUpload.DropzoneTextGroup>
        <FileUpload.DropzoneTextLine>
          <FileUpload.DropzoneText>
            Drag & drop images, or
          </FileUpload.DropzoneText>
          <FileUpload.Trigger>
            {(triggerProps) => (
              <button {...triggerProps} type="button">
                browse
              </button>
            )}
          </FileUpload.Trigger>
        </FileUpload.DropzoneTextLine>
        <FileUpload.DropzoneHint>
          Supported file types: Images only
        </FileUpload.DropzoneHint>
      </FileUpload.DropzoneTextGroup>
    </FileUpload.Dropzone>
  )
}

export function FileUploadCompositeDemo(): ReactElement {
  const [fileUrls, setFileUrls] = useState<Record<string, string>>({})

  const handleFileChange = (details: FileDetails) => {
    setFileUrls((currentUrls) => {
      const newUrls: Record<string, string> = {}
      const currentFileNames = new Set(details.acceptedFiles.map((f) => f.name))

      details.acceptedFiles.forEach((file) => {
        if (currentUrls[file.name]) {
          newUrls[file.name] = currentUrls[file.name]
        } else {
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
  }

  useEffect(() => {
    return () => {
      Object.values(fileUrls).forEach((url) => {
        URL.revokeObjectURL(url)
      })
    }
  }, [fileUrls])

  return (
    // preview
    <FileUpload.Root
      accept={["image/*"]}
      className="w-full max-w-md"
      maxFiles={10}
      onFileChange={handleFileChange}
    >
      <FileUpload.Label>Upload images</FileUpload.Label>

      <FileUploadCompositeDemoDropzone />

      <FileUpload.HiddenInput />

      <FileUploadCompositeDemoContent fileUrls={fileUrls} />
    </FileUpload.Root>
    // preview
  )
}
