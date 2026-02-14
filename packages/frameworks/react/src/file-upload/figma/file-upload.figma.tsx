// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import figma from "@figma/code-connect"
import {Layers} from "lucide-react"

import type {QdsFileUploadSize} from "@qualcomm-ui/qds-core/file-upload"
import {FileUpload} from "@qualcomm-ui/react/file-upload"
import {Icon} from "@qualcomm-ui/react/icon"

const sharedProps = {
  size: figma.enum<QdsFileUploadSize>("size", {
    lg: "lg",
    md: "md",
  }),
}

figma.connect(FileUpload, "<FIGMA_COMPONENTS_BASE>?node-id=8347-516", {
  example: (props) => (
    <FileUpload
      disabled={props.disabled}
      dropzoneHint="Supported file types: .jpg, .png, .pdf"
      invalid={props.invalid}
      label="Import files"
      size={props.size}
    />
  ),
  props: {
    disabled: figma.enum("state", {
      disabled: true,
    }),
    invalid: figma.enum("state", {
      invalid: true,
    }),
    ...sharedProps,
  },
})

figma.connect(FileUpload.Item, "<FIGMA_COMPONENTS_BASE>?node-id=8720-968", {
  example: (props) => (
    <FileUpload.Item file={new File([], "test.txt")}>
      {props.startIcon && (
        <FileUpload.ItemPreview>
          <Icon icon={Layers} />
        </FileUpload.ItemPreview>
      )}
      <FileUpload.ItemContent>
        <FileUpload.ItemName />
        {props.fileInfo && <FileUpload.ItemSizeText />}
      </FileUpload.ItemContent>
      <FileUpload.ItemDeleteTrigger />
    </FileUpload.Item>
  ),
  imports: [
    'import {FileUpload} from "@qualcomm-ui/react/file-upload"',
    'import {Icon} from "@qualcomm-ui/react/icon"',
    'import {Layers} from "lucide-react"',
  ],
  props: {
    fileInfo: figma.boolean("fileInfo"),
    ...sharedProps,
    startIcon: figma.boolean("startIcon"),
  },
})
