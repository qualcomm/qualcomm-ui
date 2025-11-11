import {createContext, type Dispatch, type SetStateAction} from "react"

export interface RowPinningContextState {
  includeLeafRows: boolean
  includeParentRows: boolean
  keepPinnedRows: boolean
  setIncludeLeafRows: Dispatch<SetStateAction<boolean>>
  setIncludeParentRows: Dispatch<SetStateAction<boolean>>
  setKeepPinnedRows: Dispatch<SetStateAction<boolean>>
}

export const RowPinningContext = createContext<RowPinningContextState>(null!)
