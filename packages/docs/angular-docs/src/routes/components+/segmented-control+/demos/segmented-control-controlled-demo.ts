import {Component, signal} from "@angular/core"

import {SegmentedControlModule} from "@qualcomm-ui/angular/segmented-control"

@Component({
  imports: [SegmentedControlModule],
  selector: "segmented-control-controlled-demo",
  template: `
    <!-- preview -->
    <fieldset
      multiple
      q-segmented-control
      [value]="value()"
      (valueChanged)="valueChanged($event)"
    >
      <label q-segmented-control-item text="Production" value="prod"></label>
      <label q-segmented-control-item text="Staging" value="staging"></label>
      <label q-segmented-control-item text="Development" value="dev"></label>
      <label q-segmented-control-item text="QA" value="qa"></label>
    </fieldset>
    <!-- preview -->
  `,
})
export class SegmentedControlControlledDemo {
  readonly value = signal<string[] | null | undefined>([])

  valueChanged(newValue: string[] | null | undefined) {
    console.log(`Selected values: ${newValue?.length ? newValue : "<none>"}`)
    this.value.set(newValue)
  }
}
