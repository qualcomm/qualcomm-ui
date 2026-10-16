// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {createProps, createSplitProps} from "@qualcomm-ui/utils/object"

import type {ImageViewerApiProps} from "./image-viewer.types.js"

export const imageViewerProps: (keyof ImageViewerApiProps)[] =
  createProps<ImageViewerApiProps>()(
    "ids",
    "translations",
    "zoom",
    "rotation",
    "flip",
    "defaultZoom",
    "defaultRotation",
    "defaultFlip",
    "zoomStep",
    "zoomSensitivity",
    "minZoom",
    "maxZoom",
    "nudgeStep",
    "nudgeStepShift",
    "nudgeStepCtrl",
    "onZoomChange",
    "onRotationChange",
    "onFlipChange",
    "dir",
    "getRootNode",
  )

const splitProps = createSplitProps<ImageViewerApiProps>(imageViewerProps)

export function splitImageViewerProps<Props extends ImageViewerApiProps>(
  props: Props,
): [ImageViewerApiProps, Omit<Props, keyof ImageViewerApiProps>] {
  return splitProps(props)
}
