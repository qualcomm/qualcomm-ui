import {NgModule} from "@angular/core"

import {InlineIconButtonComponent} from "@qualcomm-ui/angular/inline-icon-button"
import {TagModule} from "@qualcomm-ui/angular/tag"

@NgModule({
  exports: [InlineIconButtonComponent, TagModule],
  imports: [InlineIconButtonComponent, TagModule],
})
export class SharedModule {}
