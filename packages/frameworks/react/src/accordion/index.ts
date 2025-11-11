import {AccordionItem, type AccordionItemProps} from "./accordion-item"
import {
  AccordionItemContent,
  type AccordionItemContentProps,
} from "./accordion-item-content"
import {
  AccordionItemContentAnimator,
  type AccordionItemContentAnimatorProps,
} from "./accordion-item-content-animator"
import {
  AccordionItemContentBody,
  type AccordionItemContentBodyProps,
} from "./accordion-item-content-body"
import {
  AccordionItemIndicator,
  type AccordionItemIndicatorProps,
} from "./accordion-item-indicator"
import {
  AccordionItemRoot,
  type AccordionItemRootProps,
} from "./accordion-item-root"
import {
  AccordionItemSecondaryText,
  type AccordionItemSecondaryTextProps,
} from "./accordion-item-secondary-text"
import {
  AccordionItemText,
  type AccordionItemTextProps,
} from "./accordion-item-text"
import {
  AccordionItemTrigger,
  type AccordionItemTriggerProps,
} from "./accordion-item-trigger"
import {AccordionRoot, type AccordionRootProps} from "./accordion-root"

export type {
  AccordionItemContentAnimatorProps,
  AccordionItemContentBodyProps,
  AccordionItemContentProps,
  AccordionItemIndicatorProps,
  AccordionItemRootProps,
  AccordionItemSecondaryTextProps,
  AccordionItemTextProps,
  AccordionItemTriggerProps,
  AccordionItemProps,
  AccordionRootProps,
}

type AccordionComponent = {
  /**
   * Groups all parts of the accordion item and exposes customization via props.
   * Renders a `<div>` element by default.
   */
  Item: typeof AccordionItem
  /**
   * A collapsible panel with the accordion item contents. Renders a `<div>` element
   * by default.
   *
   * @remarks
   * This component is a shortcut for the following structure:
   * ```tsx
   * <Accordion.ItemContentAnimator>
   *   <Accordion.ItemContentBody>
   *     {props.children}
   *   </Accordion.ItemContentBody>
   * </Accordion.ItemContentAnimator>
   * ```
   */
  ItemContent: typeof AccordionItemContent
  /**
   * The outer container of the accordion item content. Responsible for animating the
   * inner accordion contents. Renders a `<div>` element by default.
   */
  ItemContentAnimator: typeof AccordionItemContentAnimator
  /**
   * The inner container of the accordion item content. Renders a `<div>` element by
   * default.
   */
  ItemContentBody: typeof AccordionItemContentBody
  /**
   * Indicates the open/close state of the trigger's associated panel. Renders a
   * `<div>` element by default.
   */
  ItemIndicator: typeof AccordionItemIndicator
  /**
   * Groups all parts of the accordion item. Renders a `<div>` element by default.
   * Intended to be used only with the composite API:
   *
   * @example
   * ```tsx
   * <Accordion.ItemRoot value="...">
   *   <Accordion.ItemTrigger>
   *     <Accordion.ItemText>...</Accordion.ItemText>
   *     <Accordion.ItemSecondaryText>
   *       ...
   *     </Accordion.ItemSecondaryText>
   *     <Accordion.ItemIndicator />
   *   </Accordion.ItemTrigger>
   *   <Accordion.ItemContent>
   *     ...
   *   </Accordion.ItemContent>
   * </Accordion.ItemRoot>
   * ```
   */
  ItemRoot: typeof AccordionItemRoot
  /**
   * A description with additional information about the accordion item. Renders a
   * `<span>` element by default.
   */
  ItemSecondaryText: typeof AccordionItemSecondaryText
  /**
   * A heading that labels the accordion item. Renders a `<span>` element by default.
   */
  ItemText: typeof AccordionItemText
  /**
   * A button that opens and closes the corresponding panel. Renders a `<button>`
   * element by default.
   */
  ItemTrigger: typeof AccordionItemTrigger
  /**
   * Groups all parts of the accordion. Renders a `<div>` element by default.
   */
  Root: typeof AccordionRoot
}

export const Accordion: AccordionComponent = {
  Item: AccordionItem,
  ItemContent: AccordionItemContent,
  ItemContentAnimator: AccordionItemContentAnimator,
  ItemContentBody: AccordionItemContentBody,
  ItemIndicator: AccordionItemIndicator,
  ItemRoot: AccordionItemRoot,
  ItemSecondaryText: AccordionItemSecondaryText,
  ItemText: AccordionItemText,
  ItemTrigger: AccordionItemTrigger,
  Root: AccordionRoot,
}
