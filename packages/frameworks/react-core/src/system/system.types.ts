// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {
  ComponentPropsWithoutRef,
  ComponentPropsWithRef,
  ComponentType,
  ElementType,
  HTMLAttributes,
  JSX,
  JSXElementConstructor,
  ReactElement,
  ReactNode,
} from "react"

export type As = ElementType | ComponentType

/**
 * Extract the props of a React element or component
 */
export type PropsOf<
  C extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>,
> = JSX.LibraryManagedAttributes<C, ComponentPropsWithoutRef<C>>

export type MergeWithAs<C extends As, Props = object> = Props &
  Omit<PropsOf<C>, keyof Props>

/**
 * @custom ComponentPropsWithRef<C>
 */
export type PolymorphicComponentPropsWithRef<
  C extends As,
  Props = object,
> = MergeWithAs<C, Props> & {
  /**
   * React {@link https://react.dev/learn/referencing-values-with-refs ref}
   */
  ref?: PolymorphicRef<C>
}

/**
 * Returns the type of ref for the polymorphic component.
 */
export type PolymorphicRef<C extends As> = ComponentPropsWithRef<C>["ref"]

/**
 * @typeParam Props The props of the element, only applies to the render function.
 * @typeParam Element The type of JSX being rendered.
 */
export type RenderFunction<
  Props = HTMLAttributes<HTMLElement>,
  Element = ReactElement,
> = (props: Props) => Element

/**
 * @deprecated migrate to {@link BindingRenderProp}
 */
export type RenderPropLegacy<
  Props = HTMLAttributes<HTMLElement>,
  Element = ReactElement,
> = BindingRenderProp<Props, Element>

/**
 * Render prop for elements that need intelligent prop merging.
 * Used with {@link bindingRenderProp} - combines user props with computed props.
 *
 * @typeParam Props The props of the element, only applies to the render function.
 * @typeParam Element The JSX element type or component.
 */
export type BindingRenderProp<
  Props = HTMLAttributes<HTMLElement>,
  Element = ReactElement,
> = Element | ((props: Props) => Element)

/**
 * @deprecated migrate to {@link RenderProp}
 */
export type NodeRenderProp<Props = HTMLAttributes<HTMLElement>> =
  | ReactNode
  | ((props: Props) => ReactNode)

/**
 * Simple render prop without prop manipulation.
 * Used with `renderNonBinding()` - passes content through as-is and does not augment
 * the passed ReactNode.
 */
export type RenderProp<
  Props = HTMLAttributes<HTMLElement>,
  ElementType = ReactNode,
> = ElementType | ((props: Props) => ElementType)

/**
 * Simple render prop without direct element support. The user must always pass a
 * function.
 */
export type FunctionRenderProp<
  Props = HTMLAttributes<HTMLElement>,
  ElementType = ReactNode,
> = (props: Props) => ElementType

export interface IdProp {
  /**
   * {@link https://www.w3schools.com/html/html_id.asp id attribute}. If
   * omitted, a unique identifier will be automatically generated for accessibility.
   */
  id?: string
}

/**
 * @interface
 */
export type ElementRenderProp<
  DefaultTagName extends ElementType,
  Props = object,
> = ComponentPropsWithRef<DefaultTagName> & {
  /**
   * Allows you to replace the component's HTML element with a different tag or component. {@link https://react-next.qui.qualcomm.com/polymorphic-components Learn more}
   */
  render?: BindingRenderProp<Props, ReactElement>
}
