// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type Dispatch, useReducer} from "react"

export type SemanticSearchAction =
  | {
      type: "RESET"
    }
  | {
      index: number | null
      type: "SET_ACTIVE_INDEX"
    }
  | {type: "SET_INPUT_VALUE"; value: string}
  | {
      type: "HIDE_DIALOG" | "SHOW_DIALOG"
    }

export interface SemanticSearchState {
  activeIndex: number | null
  inputValue: string
  showDialog: boolean
}

export const initialSemanticSearchState: SemanticSearchState = {
  activeIndex: null,
  inputValue: "",
  showDialog: false,
}

export function semanticSearchReducer(
  state: SemanticSearchState,
  action: SemanticSearchAction,
): SemanticSearchState {
  if (action.type === "RESET") {
    return {
      activeIndex: null,
      inputValue: "",
      showDialog: false,
    }
  } else if (action.type === "SET_ACTIVE_INDEX") {
    return {
      ...state,
      activeIndex: action.index,
    }
  } else if (action.type === "SET_INPUT_VALUE") {
    return {
      ...state,
      activeIndex: null,
      inputValue: action.value,
    }
  } else if (action.type === "HIDE_DIALOG") {
    return {
      ...state,
      activeIndex: null,
      inputValue: "",
      showDialog: false,
    }
  } else if (action.type === "SHOW_DIALOG") {
    return {
      ...state,
      showDialog: true,
    }
  }
  throw Error("Unknown action.")
}

export function useSemanticSearchReducer(
  initialState: Partial<SemanticSearchState> = {},
): [SemanticSearchState, Dispatch<SemanticSearchAction>] {
  const [searchState, dispatchSearchAction] = useReducer(
    semanticSearchReducer,
    initialSemanticSearchState,
    (state) => ({
      ...state,
      ...initialState,
    }),
  )

  return [searchState, dispatchSearchAction]
}
