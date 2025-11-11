import {
  Directive,
  inject,
  type OnInit,
  TemplateRef,
  ViewContainerRef,
} from "@angular/core"

import {
  ANGULAR_VIRTUALIZER_INSTANCE_TOKEN,
  type AngularVirtualizer,
} from "@qualcomm-ui/angular-core/virtual"

@Directive({
  selector: "[comboboxVirtualizer]",
  standalone: false,
})
export class ComboboxVirtualizerDirective implements OnInit {
  private templateRef = inject(TemplateRef)
  private viewContainerRef = inject(ViewContainerRef)
  private virtualizer = inject(ANGULAR_VIRTUALIZER_INSTANCE_TOKEN)

  static ngTemplateContextGuard(
    dir: ComboboxVirtualizerDirective,
    ctx: unknown,
  ): ctx is {$implicit: AngularVirtualizer<any, any>; index: number} {
    return true
  }

  ngOnInit() {
    const virtualizer = this.virtualizer
    this.viewContainerRef.createEmbeddedView(this.templateRef, {
      $implicit: virtualizer,
    })
  }
}
