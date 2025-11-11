import type {ProviderExoticComponent, ProviderProps} from "react"

import {createGuardedContext} from "@qualcomm-ui/react-core/context"

export interface CopyToClipboardContextValue {
  copyToClipboard: () => void
  isCopied: boolean
}

const context = createGuardedContext<CopyToClipboardContextValue>({
  hookName: "useCopyToClipboardContext",
  providerName: "<CopyToClipboardContextProvider>",
  strict: true,
})

export const CopyToClipboardContextProvider: ProviderExoticComponent<
  ProviderProps<CopyToClipboardContextValue>
> = context[0]

export const useCopyToClipboardContext: (
  requireContext?: boolean,
) => CopyToClipboardContextValue = context[1]
