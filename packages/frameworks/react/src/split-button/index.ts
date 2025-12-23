import {
  SplitButtonButton,
  type SplitButtonButtonProps,
} from "./split-button-button"
import {
  SplitButtonDivider,
  type SplitButtonDividerProps,
} from "./split-button-divider"
import {
  SplitButtonIconButton,
  type SplitButtonIconButtonProps,
} from "./split-button-icon-button"
import {SplitButtonRoot, type SplitButtonRootProps} from "./split-button-root"

export * from "./qds-split-button-context"

export type {
  SplitButtonButtonProps,
  SplitButtonDividerProps,
  SplitButtonIconButtonProps,
  SplitButtonRootProps,
}

type SplitButtonComponent = {
  Button: typeof SplitButtonButton
  Divider: typeof SplitButtonDivider
  IconButton: typeof SplitButtonIconButton
  Root: typeof SplitButtonRoot
}

export const SplitButton: SplitButtonComponent = {
  Button: SplitButtonButton,
  Divider: SplitButtonDivider,
  IconButton: SplitButtonIconButton,
  Root: SplitButtonRoot,
}
