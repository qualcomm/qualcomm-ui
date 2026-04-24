import {createContext, Dispatch, SetStateAction, useContext} from "react"

export type VscodeTheme =
  | "dark-high-contrast"
  | "dark-modern"
  | "dark-plus"
  | "light-high-contrast"
  | "light-modern"
  | "light-plus"
  | "monokai"
  | "quiet-light"
  | "solarized-dark"
  | "solarized-light"

export interface VscodeThemeContextValue {
  setTheme: Dispatch<SetStateAction<VscodeTheme | null>>
  theme: VscodeTheme | null
}

const VscodeThemeContext = createContext<VscodeThemeContextValue>(null as any)

export const VscodeThemeContextProvider = VscodeThemeContext.Provider

export function useVscodeThemeContext(): VscodeThemeContextValue {
  const context = useContext(VscodeThemeContext)

  if (!context) {
    throw new Error(
      "useVscodeThemeContext can only be called in a child of a VscodeThemeContextProvider",
    )
  }

  return context
}
