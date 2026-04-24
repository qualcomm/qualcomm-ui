// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {AnatomyPart, AnatomyPartName} from "@qualcomm-ui/utils/anatomy"
import type {Direction, DirectionProperty} from "@qualcomm-ui/utils/direction"
import type {RequiredBy} from "@qualcomm-ui/utils/guard"
import type {
  ActionSchema,
  EffectSchema,
  IdRegistrationProps,
  MachineSchema,
} from "@qualcomm-ui/utils/machine"

import type {avatarAnatomy} from "./avatar.anatomy"

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

type PartName = AnatomyPartName<typeof avatarAnatomy>
interface Part<P extends PartName> extends AnatomyPart<"avatar", P> {}

export interface AvatarRootBindings extends Part<"root"> {
  dir: Direction | undefined
  id: string
}

export interface AvatarImageBindings extends Part<"image"> {
  "data-state": "hidden" | "visible"
  dir: Direction | undefined
  hidden: boolean
  id: string
  onError: () => void
  onLoad: () => void
}

export interface AvatarContentBindings extends Part<"content"> {
  "data-state": "hidden" | "visible"
  dir: Direction | undefined
  hidden: boolean
  id: string
}

export interface AvatarStatusBindings extends Part<"status"> {
  dir: Direction | undefined
  id: string
}

export interface AvatarApi {
  getContentBindings(props: IdRegistrationProps): AvatarContentBindings
  getImageBindings(props: IdRegistrationProps): AvatarImageBindings
  getRootBindings(props: IdRegistrationProps): AvatarRootBindings
  getStatusBindings(props: IdRegistrationProps): AvatarStatusBindings
}
