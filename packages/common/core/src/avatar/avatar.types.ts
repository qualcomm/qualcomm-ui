// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {DirectionProperty} from "@qualcomm-ui/utils/direction"
import type {RequiredBy} from "@qualcomm-ui/utils/guard"
import type {
  ActionSchema,
  EffectSchema,
  IdRegistrationProps,
  MachineSchema,
} from "@qualcomm-ui/utils/machine"

export interface AvatarApiProps extends DirectionProperty {
  onStateChange?: (event: {state: string | null}) => void
}

interface Events {}

type Effects = EffectSchema<"trackImageRemoval" | "trackSrcChange">

export interface AvatarElementIds {
  content: string
  image: string
  root: string
  status: string
}

export interface AvatarSchema extends MachineSchema {
  actions: Actions
  effects: Effects
  events: Events
  ids: AvatarElementIds
  props: RequiredBy<AvatarApiProps, "dir">
}

type Actions = ActionSchema<
  "checkImageStatus" | "invokeOnError" | "invokeOnLoad"
>

interface CommonBindings extends DirectionProperty {
  "data-scope": "avatar"
  id: string
}

export interface AvatarRootBindings extends CommonBindings {
  "data-part": "root"
}

export interface AvatarImageBindings extends CommonBindings {
  "data-part": "image"
  "data-state": "hidden" | "visible"
  hidden: boolean
  onError: () => void
  onLoad: () => void
}

export interface AvatarContentBindings extends CommonBindings {
  "data-part": "content"
  "data-state": "hidden" | "visible"
  hidden: boolean
}

export interface AvatarStatusBindings extends CommonBindings {
  "data-part": "status"
}

export interface AvatarApi {
  getContentBindings(props: IdRegistrationProps): AvatarContentBindings
  getImageBindings(props: IdRegistrationProps): AvatarImageBindings
  getRootBindings(props: IdRegistrationProps): AvatarRootBindings
  getStatusBindings(props: IdRegistrationProps): AvatarStatusBindings
}
