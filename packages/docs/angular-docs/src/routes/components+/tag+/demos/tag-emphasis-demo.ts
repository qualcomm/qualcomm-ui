import {Component} from "@angular/core"
import {LucideFaceSlightlySmiling} from "@lucide/angular"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {TagDirective} from "@qualcomm-ui/angular/tag"

@Component({
  imports: [TagDirective],
  providers: [provideIcons({LucideFaceSlightlySmiling})],
  selector: "tag-emphasis-demo",
  template: `
    <div class="flex flex-wrap items-center gap-2">
      <!-- preview -->
      <button
        emphasis="outline-brand"
        q-tag
        startIcon="FaceSlightlySmiling"
        variant="selectable"
      >
        outline-brand
      </button>
      <button
        emphasis="outline-neutral"
        q-tag
        startIcon="FaceSlightlySmiling"
        variant="selectable"
      >
        outline-neutral
      </button>
      <button
        emphasis="neutral"
        q-tag
        startIcon="FaceSlightlySmiling"
        variant="selectable"
      >
        neutral
      </button>
      <button
        emphasis="blue"
        q-tag
        startIcon="FaceSlightlySmiling"
        variant="selectable"
      >
        blue
      </button>
      <button
        emphasis="cyan"
        q-tag
        startIcon="FaceSlightlySmiling"
        variant="selectable"
      >
        cyan
      </button>
      <button
        emphasis="teal"
        q-tag
        startIcon="FaceSlightlySmiling"
        variant="selectable"
      >
        teal
      </button>
      <button
        emphasis="lime"
        q-tag
        startIcon="FaceSlightlySmiling"
        variant="selectable"
      >
        lime
      </button>
      <button
        emphasis="green"
        q-tag
        startIcon="FaceSlightlySmiling"
        variant="selectable"
      >
        green
      </button>
      <button
        emphasis="yellow"
        q-tag
        startIcon="FaceSlightlySmiling"
        variant="selectable"
      >
        yellow
      </button>
      <button
        emphasis="amber"
        q-tag
        startIcon="FaceSlightlySmiling"
        variant="selectable"
      >
        amber
      </button>
      <button
        emphasis="orange"
        q-tag
        startIcon="FaceSlightlySmiling"
        variant="selectable"
      >
        orange
      </button>
      <button
        emphasis="red"
        q-tag
        startIcon="FaceSlightlySmiling"
        variant="selectable"
      >
        red
      </button>
      <button
        emphasis="magenta"
        q-tag
        startIcon="FaceSlightlySmiling"
        variant="selectable"
      >
        magenta
      </button>
      <button
        emphasis="violet"
        q-tag
        startIcon="FaceSlightlySmiling"
        variant="selectable"
      >
        violet
      </button>
      <button
        emphasis="purple"
        q-tag
        startIcon="FaceSlightlySmiling"
        variant="selectable"
      >
        purple
      </button>
      <!-- preview -->
    </div>
  `,
})
export class TagEmphasisDemo {}
