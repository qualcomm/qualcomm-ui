// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import type {FilterSetCollectionState} from "@qualcomm-ui/core/filter-set"
import {Button} from "@qualcomm-ui/react/button"
import {ProgressRing} from "@qualcomm-ui/react/progress-ring"

import {useQdsFilterControlContext} from "../qds-filter-control-context.js"

/**
 * Text shown while a filter's collection loads or after it fails to load.
 */
export interface FilterCollectionStatusTextProps {
  /**
   * Shown when the filter's collection fails to load.
   *
   * @default "Couldn't load options"
   */
  loadErrorText?: string | undefined

  /**
   * Shown while the filter's collection loads for the first time. A refetch
   * keeps showing the previous collection instead.
   *
   * @default "Loading"
   */
  loadingText?: string | undefined

  /**
   * The label of the button that retries a failed load. The button shows when
   * the collection state provides `retry`.
   *
   * @default "Retry"
   */
  retryLabel?: string | undefined
}

export const defaultLoadErrorText = "Couldn't load options"
export const defaultLoadingText = "Loading"

/**
 * Whether the collection is loading for the first time, with nothing to show.
 */
export function isInitialLoad(
  state: FilterSetCollectionState | undefined,
): boolean {
  return state?.status === "loading" && !state.collection
}

export interface FilterCollectionStatusProps extends FilterCollectionStatusTextProps {
  state: FilterSetCollectionState | undefined
}

/**
 * The loading or error row of a filter control whose collection is not ready.
 */
export function FilterCollectionStatus({
  loadErrorText = defaultLoadErrorText,
  loadingText = defaultLoadingText,
  retryLabel = "Retry",
  state,
}: FilterCollectionStatusProps): ReactElement | null {
  const qdsContext = useQdsFilterControlContext()

  if (isInitialLoad(state)) {
    return (
      <div role="status" {...qdsContext.getStatusBindings({status: "loading"})}>
        <ProgressRing aria-hidden size="xs" />
        <span>{loadingText}</span>
      </div>
    )
  }

  if (state?.status === "error") {
    return (
      <div role="alert" {...qdsContext.getStatusBindings({status: "error"})}>
        <span>{loadErrorText}</span>
        {state.retry ? (
          <Button onClick={state.retry} size="sm" variant="ghost">
            {retryLabel}
          </Button>
        ) : null}
      </div>
    )
  }

  return null
}
