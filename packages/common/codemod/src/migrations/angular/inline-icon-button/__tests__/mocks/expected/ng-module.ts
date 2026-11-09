import {NgModule} from "@angular/core"

import {ButtonModule} from "@qualcomm-ui/angular/button"
import {TagModule} from "@qualcomm-ui/angular/tag"

@NgModule({
  exports: [ButtonModule, TagModule],
  imports: [ButtonModule, TagModule],
})
export class SharedModule {}
