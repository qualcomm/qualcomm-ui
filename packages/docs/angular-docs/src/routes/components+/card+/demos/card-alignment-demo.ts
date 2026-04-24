import {Component, signal} from "@angular/core"

import {CardModule} from "@qualcomm-ui/angular/card"
import {RadioModule} from "@qualcomm-ui/angular/radio"
import type {QdsCardAlignment} from "@qualcomm-ui/qds-core/card"

@Component({
  imports: [CardModule, RadioModule],
  selector: "card-alignment-demo",
  template: `
    <div class="flex flex-col items-center gap-8">
      <!-- preview -->
      <div class="w-80" q-card variant="outline" [alignment]="alignment()">
        <div q-card-content>
          <div q-card-heading>
            <span q-card-eyebrow-text>Eyebrow</span>
            <div q-card-heading-text>Card Title</div>
            <div q-card-subheading-text>Subheading</div>
          </div>
          <p q-card-paragraph-text>
            Toggle between start and center alignment to see how heading and
            footer content repositions.
          </p>
        </div>
        <div q-card-footer>
          <button q-card-button variant="secondary">Cancel</button>
          <button q-card-button variant="primary">Confirm</button>
        </div>
      </div>
      <!-- preview -->
      <fieldset
        defaultValue="start"
        name="card-alignment"
        orientation="horizontal"
        q-radio-group
        (valueChanged)="onAlignmentChanged($event!)"
      >
        <div q-radio-group-items>
          <label label="start" q-radio value="start"></label>
          <label label="center" q-radio value="center"></label>
        </div>
      </fieldset>
    </div>
  `,
})
export class CardAlignmentDemo {
  readonly alignment = signal<QdsCardAlignment>("start")
  onAlignmentChanged(value: string) {
    this.alignment.set(value as QdsCardAlignment)
  }
}
