// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {CSSProperties, ReactNode, Ref} from "react"

export type EndHandler<RefElement extends HTMLElement> = (
  node: RefElement | null,
  done: () => void,
) => void

export type EnterHandler<RefElement extends HTMLElement> = (
  node: RefElement | null,
  isAppearing: boolean,
) => void

export type ExitHandler<RefElement extends HTMLElement> = (
  node: RefElement | null,
) => void

/**
 * @interface
 */
export type TransitionProps<RefElement extends HTMLElement> = {
  /**
   * Add a custom transition end trigger. Called with the transitioning DOM
   * node and a done callback. Allows for more fine-grained transition end
   * logic. Note: Timeouts are still used as a fallback if provided.
   */
  addEndListener?: EndHandler<RefElement> | undefined

  /**
   * Whether to show the animation when the component is first mounted.
   */
  appear?: boolean

  /**
   * React Children
   */
  children?: ReactNode

  /**
   * Class applied to the root element.
   */
  className?: string

  /**
   * Show the component; triggers the enter or exit states
   */
  in?: boolean | undefined

  /**
   * By default, the child component is mounted immediately along with the
   * parent Transition component. If you want to "lazy mount" the component on
   * the first {@link in} = `true` you can set {@link mountOnEnter}. After the
   * first enter transition the component will stay mounted, even on "exited",
   * unless you also specify {@link unmountOnExit}.
   */
  mountOnEnter?: boolean | undefined

  /**
   * A React reference to DOM element that need to transition. {@link https://stackoverflow.com/a/51127130/4671932 example}.
   * When `nodeRef` prop is used, node is not passed to callback functions (e.g.
   * onEnter) because user already has direct access to the node. When changing
   * `key` prop of `Transition` in a `TransitionGroup` a new `nodeRef` needs to be
   * provided to `Transition` with changed `key` prop. {@link https://github.com/reactjs/react-transition-group/blob/master/test/Transition-test.js see also}.
   */
  nodeRef?: Ref<RefElement> | undefined

  /**
   * Callback fired before the "entering" status is applied. An extra
   * parameter `isAppearing` is supplied to indicate if the enter stage is
   * occurring on the initial mount
   */
  onEnter?: EnterHandler<RefElement> | undefined

  /**
   * Callback fired after the "entered" status is applied. An extra parameter
   * isAppearing is supplied to indicate if the enter stage is occurring on
   * the initial mount
   *
   * @interface
   */
  onEntered?: EnterHandler<RefElement> | undefined

  /**
   * Callback fired after the "entering" status is applied. An extra parameter
   * isAppearing is supplied to indicate if the enter stage is occurring on
   * the initial mount
   */
  onEntering?: EnterHandler<RefElement> | undefined

  /**
   * Callback fired before the "exiting" status is applied.
   */
  onExit?: ExitHandler<RefElement> | undefined

  /**
   * Callback fired after the "exited" status is applied.
   */
  onExited?: ExitHandler<RefElement> | undefined

  /**
   * Callback fired after the "exiting" status is applied.
   */
  onExiting?: ExitHandler<RefElement> | undefined

  /**
   * Inline styles
   */
  style?: CSSProperties

  /**
   * The duration of the transition, in milliseconds. Required unless
   * addEndListener is provided.
   *
   * You may specify a single timeout for all transitions:
   *
   * ```js
   *   timeout={500}
   * ```
   *
   * or individually:
   *
   * ```js
   * timeout={{
   *   appear: 500,
   *   enter: 300,
   *   exit: 500,
   * }}
   * ```
   *
   * appear defaults to the value of `enter`.
   * enter defaults to `0`.
   * exit defaults to `0`.
   */
  timeout?:
    | number
    | {
        appear?: number | undefined
        enter?: number | undefined
        exit?: number | undefined
      }

  /**
   * By default, the child component stays mounted after it reaches the
   * 'exited' state. Set `unmountOnExit` if you'd prefer to unmount the
   * component after it finishes exiting.
   */
  unmountOnExit?: boolean | undefined
}
