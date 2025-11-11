import {Avatar, type AvatarImageProps} from "@qualcomm-ui/react/avatar"

export const testIds = {
  avatarContent: "avatar-content",
  avatarImage: "avatar-image",
  avatarRoot: "avatar-root",
  avatarStatus: "avatar-status",
} as const

export function TestAvatar({src}: AvatarImageProps) {
  return (
    <Avatar.Root data-test-id={testIds.avatarRoot}>
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
