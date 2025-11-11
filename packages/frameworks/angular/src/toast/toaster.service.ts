import {inject, Injectable, InjectionToken, type Provider} from "@angular/core"

import type {ToasterCreateOptions} from "@qualcomm-ui/core/toast"

import {createToaster} from "./create-toaster"

export const TOASTER_OPTIONS = new InjectionToken<ToasterCreateOptions>(
  "TOASTER_OPTIONS",
)

export function provideToaster(options: ToasterCreateOptions): Provider[] {
  return [{provide: TOASTER_OPTIONS, useValue: options}, ToasterService]
}

@Injectable()
export class ToasterService {
  protected readonly toasterOptions = inject(TOASTER_OPTIONS, {
    optional: true,
  })

  readonly toaster = createToaster({
    placement: "bottom-end",
    ...this.toasterOptions,
  })
}
