import {AvatarContent, type AvatarContentProps} from "./avatar-content"
import {AvatarImage, type AvatarImageProps} from "./avatar-image"
import {AvatarRoot, type AvatarRootProps} from "./avatar-root"
import {AvatarStatus, type AvatarStatusProps} from "./avatar-status"

export type {
  AvatarContentProps,
  AvatarImageProps,
  AvatarRootProps,
  AvatarStatusProps,
}

type AvatarComponent = {
  /**
   * Displays alternate content, such as initials or an icon, and acts as a fallback
   * if the image fails to load. Renders a `<span>` element by default.
   */
  Content: typeof AvatarContent
  /**
   * The image to display in the avatar. Renders an `<img>` element by default.
   */
  Image: typeof AvatarImage
  /**
   * Displays a user's profile picture, initials, or fallback icon. Renders a
   * `<span>` element by default.
   */
  Root: typeof AvatarRoot
  /**
   * Displays a status indicator dot for the avatar. Renders a `<div>` element by
   * default.
   */
  Status: typeof AvatarStatus
}

export const Avatar: AvatarComponent = {
  Content: AvatarContent,
  Image: AvatarImage,
  Root: AvatarRoot,
  Status: AvatarStatus,
}
