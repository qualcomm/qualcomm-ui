type SemanticSearchAction =
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

interface SemanticSearchState {
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
      activeIndex: null,
      showDialog: true,
    }
  }
  throw Error("Unknown action.")
}
