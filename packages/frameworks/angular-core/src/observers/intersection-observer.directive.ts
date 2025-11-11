import {isPlatformServer} from "@angular/common"
import {
  Directive,
  ElementRef,
  inject,
  type OnInit,
  output,
  PLATFORM_ID,
} from "@angular/core"

import {useOnDestroy} from "@qualcomm-ui/angular-core/common"

@Directive({
  selector: "[qIntersectionObserver]",
})
export class IntersectionObserverDirective implements OnInit {
  private elementRef = inject(ElementRef<HTMLElement>)
  private platformId = inject(PLATFORM_ID)
  private onDestroy = useOnDestroy()

  qIntersectionObserver = output<IntersectionObserverEntry[]>()

  ngOnInit() {
    this.initObserver()
  }

  private initObserver() {
    const element = this.elementRef.nativeElement
    if (isPlatformServer(this.platformId) || !element) {
      return
    }

    const observer = new IntersectionObserver((entries) => {
      this.qIntersectionObserver.emit(entries)
    })

    observer.observe(element)

    this.onDestroy(() => {
      observer.disconnect()
    })
  }
}
