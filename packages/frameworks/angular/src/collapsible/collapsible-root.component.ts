import {Directive} from "@angular/core"

import {
  CoreCollapsibleRootDirective,
  provideCollapsibleContext,
} from "@qualcomm-ui/angular-core/collapsible"

@Directive({
  providers: [provideCollapsibleContext()],
  selector: "[q-collapsible-root]",
  standalone: false,
})
export class CollapsibleRootComponent extends CoreCollapsibleRootDirective {}
