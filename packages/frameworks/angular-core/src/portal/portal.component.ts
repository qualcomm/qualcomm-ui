// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  DomPortalOutlet,
  PortalModule,
  TemplatePortal,
} from "@angular/cdk/portal"
import {CommonModule, DOCUMENT} from "@angular/common"
import {
  type AfterViewInit,
  ApplicationRef,
  booleanAttribute,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  Injector,
  input,
  type OnInit,
  signal,
  TemplateRef,
  viewChild,
  ViewContainerRef,
} from "@angular/core"

import {useCsrCheck, useOnDestroy} from "@qualcomm-ui/angular-core/common"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"

import {PortalContextService} from "./portal-context.service"

/**
 * @deprecated use the PortalDirective instead
 */
@Component({
  imports: [CommonModule, PortalModule],
  selector: "q-portal",
  template: `
    <ng-template #tpl><ng-content /></ng-template>
  `,
})
export class PortalComponent implements OnInit, AfterViewInit {
  /**
   * Set this to true to disable portalling behavior, causing the children to be
   * rendered as-is.
   */
  readonly disabled = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * Override the element that the portal is attached to.
   */
  readonly container = input<ElementRef<HTMLElement> | HTMLElement | null>(null)

  protected readonly onDestroy = useOnDestroy()

  private readonly tpl = viewChild<TemplateRef<any>>("tpl")
  private readonly templatePortal = signal<TemplatePortal | null>(null)

  private outlet: DomPortalOutlet | null = null
  private readonly appRef = inject(ApplicationRef)
  private readonly vcr = inject(ViewContainerRef)
  private readonly document = inject(DOCUMENT)
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef)
  private readonly isBrowser = useCsrCheck()
  private readonly injector = inject(Injector)
  private readonly portalContext = inject(PortalContextService, {
    optional: true,
  })

  constructor() {
    effect(() => {
      // handle changes to the container
      const resolvedContainer = this.resolveContainer()
      const portal = this.templatePortal()

      if (!this.isBrowser() || !portal) {
        return
      }

      if (this.outlet?.hasAttached()) {
        this.outlet.detach()
      }

      const host = resolvedContainer ?? this.document.body
      this.outlet = new DomPortalOutlet(host, this.appRef, this.injector)
      this.outlet.attach(portal)
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
    if (!this.isBrowser()) {
      return
    }
    const tpl = this.tpl()
    if (!tpl) {
      return
    }

    if (this.templatePortal()) {
      return
    }
    const portal = new TemplatePortal(tpl, this.vcr)
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
    const disabled = this.disabled()
    if (disabled) {
      // when disabled, we append the portal to the element itself to render it as-is
      return this.accessElement(this.elementRef)
    }
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
