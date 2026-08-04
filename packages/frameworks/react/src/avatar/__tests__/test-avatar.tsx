import {
  Avatar,
  type AvatarImageProps,
  type AvatarRootProps,
} from "@qualcomm-ui/react/avatar"

export const testIds = {
  avatarContent: "avatar-content",
  avatarImage: "avatar-image",
  avatarRoot: "avatar-root",
  avatarStatus: "avatar-status",
} as const

export interface TestAvatarProps
  extends
    Pick<AvatarImageProps, "src">,
    Pick<AvatarRootProps, "onStateChange"> {}

export function TestAvatar({onStateChange, src}: TestAvatarProps) {
  return (
    <Avatar.Root
      data-test-id={testIds.avatarRoot}
      onStateChange={onStateChange}
    >
      <Avatar.Image
        alt="John Doe"
        data-test-id={testIds.avatarImage}
        src={src}
      />
      <Avatar.Content data-test-id={testIds.avatarContent}>
        Fallback
      </Avatar.Content>
      <Avatar.Status data-test-id={testIds.avatarStatus} />
    </Avatar.Root>
  )
}
