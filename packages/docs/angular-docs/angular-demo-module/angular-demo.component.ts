import {NgComponentOutlet} from "@angular/common"
import {
  Component,
  DOCUMENT,
  effect,
  ElementRef,
  inject,
  signal,
  Type,
  ViewEncapsulation,
} from "@angular/core"

import {useOnDestroy} from "@qualcomm-ui/angular-core/common"
import {PORTAL_CONTAINER, PortalContextService} from "@qualcomm-ui/angular-core/portal"

@Component({
  encapsulation: ViewEncapsulation.None,
  imports: [NgComponentOutlet],
  providers: [
    {
      provide: PORTAL_CONTAINER,
      useFactory: () =>
        inject(DOCUMENT).querySelector("#demo-portal-container"),
    },
    PortalContextService,
  ],
  selector: "angular-demo",
  standalone: true,
  template: `
    @if (!loadingDemo() && !demoComponent()) {
      <p>Demo not found.</p>
    }
    @if (demoComponent()) {
      <ng-container [ngComponentOutlet]="demoComponent()" />
    }
  `,
})
export class AngularDemoComponent {
  readonly filePath = signal<string>("")
  readonly componentName = signal<string>("")

  readonly demoComponent = signal<Type<unknown> | null>(null)

  protected readonly loadingDemo = signal<boolean>(true)
  readonly onDestroy = useOnDestroy()

  private elementRef = inject(ElementRef)

  constructor() {
    this.onDestroy(() => {
      this.demoComponent.set(null)
    })

    effect(() => {
      const component = this.demoComponent()

      if (component && this.loadingDemo()) {
        this.loadingDemo.set(false)
        this.onOutletRendered()
      }
    })

    effect(() => {
      const filePath = this.filePath()
      const componentName = this.componentName()

      this.demoComponent.set(null)

      if (!componentName || !filePath) {
        return
      }

      this.tryImport(filePath, componentName)
    })
  }

  tryImport(filePath: string, componentName: string) {
    /**
     * Imports must be relative or the demo files will not be detected by
     * the angular compiler. The import strings must also be statically
     * analyzable, so a ternary like this is required. We can't just do
     * `./src/routes/` because there are React components and route files at that
     * path, and the compiler pulls them in (with errors). Not great, but at least
     * it works.
     */
    try {
      void import(
        filePath.includes("src/routes/components")
          ? `../src/routes/components+/${filePath.replace("./src/routes/components+/", "")}`
          : filePath.includes("src/routes/patterns")
            ? `../src/routes/patterns+/${filePath.replace("./src/routes/patterns+/", "")}`
            : filePath.includes("src/routes/pitfalls")
              ? `../src/routes/pitfalls+/${filePath.replace("./src/routes/pitfalls+/", "")}`
              : `../src/routes/theme+/${filePath.replace("./src/routes/theme+/", "")}`
      )
        .then((m: Record<string, Type<unknown>>) => {
          const component = m[componentName] as Type<unknown> | undefined
          this.demoComponent.set(component ?? null)
        })
        .catch((err) => {
          console.error(
            `Error importing demo component ${componentName} from ${filePath}:`,
            err,
          )
          this.demoComponent.set(null)
        })
    } catch (e) {
      console.debug("Demo failed to render", e)
    }
  }

  onOutletRendered() {
    const customEvent = new CustomEvent("content-rendered", {
      bubbles: true, // Allow event to bubble up
      detail: {
        componentName: this.componentName(),
        message: "Hello from Angular!",
        timestamp: Date.now(),
      },
    })

    this.elementRef.nativeElement.dispatchEvent(customEvent)
  }
}
