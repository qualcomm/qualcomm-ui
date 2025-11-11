import {Component, type ReactElement} from "react"

import type {RunnerOptions, Scope} from "./types"
import {generateElement} from "./utils"

export interface RunnerProps extends RunnerOptions {
  /**
   * Callback fired when code is rendered. Returns an error message when code is
   * invalid.
   */
  onRendered?: (error?: Error) => void
}

interface RunnerState {
  element: ReactElement | null
  error: Error | null
  prevCode: string | null
  prevScope: Scope | undefined
}

export class Runner extends Component<RunnerProps, RunnerState> {
  state: RunnerState = {
    element: null,
    error: null,
    prevCode: null,
    prevScope: undefined,
  }

  static getDerivedStateFromProps(
    props: RunnerProps,
    state: RunnerState,
  ): Partial<RunnerState> | null {
    // only regenerate on code/scope change
    if (state.prevCode === props.code && state.prevScope === props.scope) {
      return null
    }

    try {
      return {
        element: generateElement(props),
        error: null,
        prevCode: props.code,
        prevScope: props.scope,
      }
    } catch (error: unknown) {
      return {
        element: null,
        error: error as Error,
        prevCode: props.code,
        prevScope: props.scope,
      }
    }
  }

  static getDerivedStateFromError(error: Error): Partial<RunnerState> {
    return {error}
  }

  componentDidMount(): void {
    this.props.onRendered?.(this.state.error || undefined)
  }

  shouldComponentUpdate(
    nextProps: RunnerProps,
    nextState: RunnerState,
  ): boolean {
    return (
      nextProps.code !== this.props.code ||
      nextProps.scope !== this.props.scope ||
      nextState.error !== this.state.error
    )
  }

  componentDidUpdate(): void {
    this.props.onRendered?.(this.state.error || undefined)
  }

  render(): ReactElement | null {
    return this.state.error ? null : this.state.element
  }
}
