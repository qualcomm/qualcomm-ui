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
