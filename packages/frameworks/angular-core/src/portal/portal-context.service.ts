import {ElementRef, inject, Injectable, InjectionToken} from "@angular/core"

export const PORTAL_CONTAINER = new InjectionToken<
  ElementRef<HTMLElement> | HTMLElement | null
>("PORTAL_CONTAINER", {
  factory: () => null,
})

@Injectable()
export class PortalContextService {
  readonly container = inject(PORTAL_CONTAINER, {optional: true})
}
