import type {FunctionComponent} from "react"

import {CardAvatar, type CardAvatarProps} from "./card-avatar.js"
import {CardBadge, type CardBadgeProps} from "./card-badge.js"
import {CardButton, type CardButtonProps} from "./card-button.js"
import {CardContent, type CardContentProps} from "./card-content.js"
import {
  CardEyebrowText,
  type CardEyebrowTextProps,
} from "./card-eyebrow-text.js"
import {CardFooter, type CardFooterProps} from "./card-footer.js"
import {
  CardHeadingText,
  type CardHeadingTextProps,
} from "./card-heading-text.js"
import {CardHeading, type CardHeadingProps} from "./card-heading.js"
import {CardLink, type CardLinkProps} from "./card-link.js"
import {CardMedia, type CardMediaProps} from "./card-media.js"
import {
  CardMenuTrigger,
  type CardMenuTriggerProps,
} from "./card-menu-trigger.js"
import {
  CardParagraphText,
  type CardParagraphTextProps,
} from "./card-paragraph-text.js"
import {CardRoot, type CardRootProps} from "./card-root.js"
import {
  CardSubheadingText,
  type CardSubheadingTextProps,
} from "./card-subheading-text.js"

export * from "./qds-card-context.js"
export type {
  CardAvatarProps,
  CardBadgeProps,
  CardButtonProps,
  CardContentProps,
  CardEyebrowTextProps,
  CardFooterProps,
  CardHeadingProps,
  CardHeadingTextProps,
  CardLinkProps,
  CardMediaProps,
  CardMenuTriggerProps,
  CardParagraphTextProps,
  CardRootProps,
  CardSubheadingTextProps,
}

interface CardComponent {
  /**
   * A slot for an avatar within the card.
   * Renders a `<div>` element by default.
   */
  Avatar: FunctionComponent<CardAvatarProps>
  /**
   * A badge slot within the card, typically used to display a status or category
   * badge. Renders a `<div>` element by default.
   */
  Badge: FunctionComponent<CardBadgeProps>
  /**
   * A button area within the card footer.
   * Renders a `<button>` element by default.
   */
  Button: FunctionComponent<CardButtonProps>
  /**
   * The main content area of the card that wraps text, headings, and other body
   * content. Renders a `<div>` element by default.
   */
  Content: FunctionComponent<CardContentProps>
  /**
   * A small label above the heading, typically used for categorization.
   * Renders a `<span>` element by default.
   */
  EyebrowText: FunctionComponent<CardEyebrowTextProps>
  /**
   * The bottom section of the card, typically for actions like buttons or links.
   * Renders a `<div>` element by default.
   */
  Footer: FunctionComponent<CardFooterProps>
  /**
   * A container that wraps the eyebrow text, heading text, and optional menu
   * trigger. Renders a `<div>` element by default.
   */
  Heading: FunctionComponent<CardHeadingProps>
  /**
   * The primary heading of the card.
   * Renders a `<div>` element by default.
   */
  HeadingText: FunctionComponent<CardHeadingTextProps>
  /**
   * A link within the card footer.
   * Renders an `<a>` element by default.
   */
  Link: FunctionComponent<CardLinkProps>
  /**
   * A media area at the top of the card for images, avatars, or other visual
   * content. Renders a `<div>` element by default.
   */
  Media: FunctionComponent<CardMediaProps>
  /**
   * A trigger area for an overflow menu within the card heading.
   * Renders a `<div>` element by default.
   */
  MenuTrigger: FunctionComponent<CardMenuTriggerProps>
  /**
   * A paragraph of body text within the card.
   * Renders a `<p>` element by default.
   */
  ParagraphText: FunctionComponent<CardParagraphTextProps>
  /**
   * The outer container for a card. Provides size and variant context to all child
   * card parts. Renders a `<div>` element by default.
   */
  Root: FunctionComponent<CardRootProps>
  /**
   * A secondary heading below the main heading.
   * Renders a `<div>` element by default.
   */
  SubheadingText: FunctionComponent<CardSubheadingTextProps>
}

export const Card: CardComponent = {
  Avatar: CardAvatar,
  Badge: CardBadge,
  Button: CardButton,
  Content: CardContent,
  EyebrowText: CardEyebrowText,
  Footer: CardFooter,
  Heading: CardHeading,
  HeadingText: CardHeadingText,
  Link: CardLink,
  Media: CardMedia,
  MenuTrigger: CardMenuTrigger,
  ParagraphText: CardParagraphText,
  Root: CardRoot,
  SubheadingText: CardSubheadingText,
}
