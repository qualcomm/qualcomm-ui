import {type AfterViewInit, Directive, signal} from "@angular/core"

import {useCsrCheck} from "@qualcomm-ui/angular-core/common"

@Directive({
  host: {
    "[attr.data-qui-preload]": "preload()",
  },
})
export class QuiPreloadDirective implements AfterViewInit {
  readonly preload = signal<true | undefined>(true)

  protected readonly isBrowser = useCsrCheck()

  ngAfterViewInit() {
    if (this.isBrowser()) {
      requestAnimationFrame(() => {
        this.preload.set(undefined)
      })
    }
  }
}
