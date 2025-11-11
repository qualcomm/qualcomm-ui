import {InjectionToken, type Signal} from "@angular/core"

import type {Dict} from "@qualcomm-ui/utils/machine"

export interface IconTokenContext {
  getBindings: Signal<Dict>
}

export const START_ICON_CONTEXT_TOKEN = new InjectionToken<IconTokenContext>(
  "START_ICON_TOKEN",
)

export const END_ICON_CONTEXT_TOKEN = new InjectionToken<IconTokenContext>(
  "END_ICON_TOKEN",
)
