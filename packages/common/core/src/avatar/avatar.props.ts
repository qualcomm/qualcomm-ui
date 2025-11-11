// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {createProps, createSplitProps} from "@qualcomm-ui/utils/object"

import type {AvatarApiProps} from "./avatar.types"

const avatarProps: (keyof AvatarApiProps)[] = createProps<AvatarApiProps>()(
  "dir",
  "onStateChange",
)

export const splitAvatarProps: <Props extends AvatarApiProps>(
  props: Props,
) => [AvatarApiProps, Omit<Props, keyof AvatarApiProps>] =
  createSplitProps<AvatarApiProps>(avatarProps)
