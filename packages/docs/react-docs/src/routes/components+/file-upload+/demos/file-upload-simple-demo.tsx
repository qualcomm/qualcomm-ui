// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, useEffect, useState} from "react"

import {FilePlus, Trash2, Upload} from "lucide-react"

import type {FileDetails} from "@qualcomm-ui/core/file-upload"
import {Button} from "@qualcomm-ui/react/button"
import {FileUpload} from "@qualcomm-ui/react/file-upload"
import {Icon} from "@qualcomm-ui/react/icon"
import {
  useFileUploadContext,
  useFileUploadItemContext,
} from "@qualcomm-ui/react-core/file-upload"

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

function FileUploadSimpleDemoContent({
  fileUrls,
}: {
  fileUrls: Record<string, string>
}): ReactElement {
  const api = useFileUploadContext()

  if (api.acceptedFiles.length === 0) {
    return <></>
  }

  return (
    <>
      <FileUpload.ItemGroup>
        {api.acceptedFiles.map((file) => (
          <FileUpload.Item key={file.name} file={file}>
            <FileUpload.ItemPreview>
              {file.type.startsWith("image/") && fileUrls[file.name] && (
                <FileUpload.ItemPreviewImage url={fileUrls[file.name]} />
              )}
            </FileUpload.ItemPreview>
            <div className="qui-file-upload__item-content">
              <FileUpload.ItemName />
              <FileUpload.ItemSizeText />
            </div>
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

function FileUploadSimpleDemoDropzone(): ReactElement {
  const api = useFileUploadContext()

  if (api.acceptedFiles.length > 0 || api.rejectedFiles.length > 0) {
    return <></>
  }

  return (
    <FileUpload.Dropzone>
      <Icon icon={Upload} style={{height: 24, width: 24}} />
      <div className="qui-file-upload__dropzone-text-group">
        <div className="qui-file-upload__dropzone-text-line">
          <span className="qui-file-upload__dropzone-text">
            Drag & drop images, or
          </span>
          <FileUpload.Trigger>
            {(triggerProps) => (
              <button
                {...triggerProps}
                className="qui-file-upload__trigger"
                type="button"
              >
                browse
              </button>
            )}
          </FileUpload.Trigger>
        </div>
        <span className="qui-file-upload__dropzone-hint">
          Supported file types: Images only
        </span>
      </div>
    </FileUpload.Dropzone>
  )
}

export function FileUploadSimpleDemo(): ReactElement {
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

      <FileUploadSimpleDemoDropzone />

      <FileUpload.HiddenInput />

      <FileUploadSimpleDemoContent fileUrls={fileUrls} />
    </FileUpload.Root>
    // preview
  )
}
