import {Component} from "@angular/core"
import {RouterLink} from "@angular/router"

import {TagDirective} from "@qualcomm-ui/angular/tag"

@Component({
  imports: [RouterLink, TagDirective],
  selector: "tag-variants-demo",

  template: `
    <div class="flex flex-col items-start gap-2">
      <!-- preview -->
      <span q-tag>read-only</span>
      <span q-tag variant="dismissable">dismissable</span>
      <button q-tag variant="selectable">selectable</button>
      <a q-tag routerLink="/">link</a>
      <a active aria-current="true" q-tag routerLink="/components/tag">
        active link
      </a>
      <!-- preview -->
    </div>
  `,
})
export class TagVariantsDemo {}
