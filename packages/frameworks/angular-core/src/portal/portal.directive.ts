import {DomPortalOutlet, TemplatePortal} from "@angular/cdk/portal"
import {DOCUMENT} from "@angular/common"
import {
  type AfterViewInit,
  ApplicationRef,
  booleanAttribute,
  computed,
  Directive,
  effect,
  ElementRef,
  inject,
  Injector,
  input,
  type OnInit,
  signal,
  TemplateRef,
  untracked,
  ViewContainerRef,
} from "@angular/core"

import {useCsrCheck, useOnDestroy} from "@qualcomm-ui/angular-core/common"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"

import {PortalContextService} from "./portal-context.service"

@Directive({
  selector: "[qPortal]",
  standalone: true,
})
export class PortalDirective implements OnInit, AfterViewInit {
  readonly disabled = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })
  readonly container = input<ElementRef<HTMLElement> | HTMLElement | null>(null)

  protected readonly onDestroy = useOnDestroy()
  private readonly templatePortal = signal<TemplatePortal | null>(null)
  private outlet: DomPortalOutlet | null = null
  private readonly appRef = inject(ApplicationRef)
  private readonly vcr = inject(ViewContainerRef)
  private readonly document = inject(DOCUMENT)
  private readonly templateRef = inject(TemplateRef)
  private readonly isBrowser = useCsrCheck()
  private readonly injector = inject(Injector)
  private readonly portalContext = inject(PortalContextService, {
    optional: true,
  })
  private attachedToSelf: boolean = false

  constructor() {
    effect(() => {
      const disabled = this.disabled()
      this.container()
      const portal = this.templatePortal()

      untracked(() => {
        if (!this.isBrowser() || !portal) {
          return
        }

        if (disabled) {
          if (this.outlet?.hasAttached()) {
            this.outlet.detach()
          }
          this.vcr.clear()
          this.vcr.createEmbeddedView(this.templateRef)
          return
        }

        this.vcr.clear()

        if (this.outlet?.hasAttached()) {
          this.outlet.detach()
        }

        const resolvedContainer = this.resolveContainer()
        const host = resolvedContainer ?? this.document.body
        this.outlet = new DomPortalOutlet(host, this.appRef, this.injector)
        this.outlet.attach(portal)
      })
    })

    this.onDestroy(() => {
      if (this.outlet && this.outlet.hasAttached()) {
        this.outlet.detach()
      }
      const portal = this.templatePortal()
      if (portal?.isAttached) {
        portal?.detach()
      }
    })
  }

  ngOnInit() {
    this.tryAttach()
  }

  ngAfterViewInit() {
    this.tryAttach()
  }

  private tryAttach() {
    const disabled = this.disabled()

    if (!this.isBrowser() || this.templatePortal()) {
      return
    }

    if (disabled && !this.attachedToSelf) {
      this.vcr.createEmbeddedView(this.templateRef)
      this.attachedToSelf = true
      return
    }

    const portal = new TemplatePortal(this.templateRef, this.vcr)
    this.templatePortal.set(portal)
    const host = this.resolveContainer() ?? this.document.body

    if (this.outlet?.hasAttached()) {
      this.outlet.detach()
    }

    this.outlet = new DomPortalOutlet(host, this.appRef, this.injector)
    this.outlet.attach(portal)
  }

  protected readonly resolveContainer = computed(() => {
    const containerProp = this.container()
    const containerContext = this.portalContext?.container

    if (containerProp) {
      return this.accessElement(containerProp)
    }
    if (containerContext) {
      return this.accessElement(containerContext)
    }
    return null
  })

  private accessElement(element: ElementRef<HTMLElement> | HTMLElement | null) {
    if (element instanceof ElementRef) {
      return element.nativeElement
    }
    return element || null
  }
}
