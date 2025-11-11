import {Directive} from "@angular/core"

import {
  CorePopoverRootDirective,
  providePopoverContext,
} from "@qualcomm-ui/angular-core/popover"

@Directive({
  providers: [providePopoverContext()],
  selector: "[q-popover-root]",
  standalone: false,
})
export class PopoverRootDirective extends CorePopoverRootDirective {}
