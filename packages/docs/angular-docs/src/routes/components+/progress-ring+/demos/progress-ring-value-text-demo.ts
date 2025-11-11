import {Component, type OnInit, signal} from "@angular/core"

import {ProgressRingModule} from "@qualcomm-ui/angular/progress-ring"
import {useOnDestroy} from "@qualcomm-ui/angular-core/common"

@Component({
  imports: [ProgressRingModule],
  selector: "progress-ring-value-text-demo",
  template: `
    <div label="Loading..." q-progress-ring size="lg" [value]="value()">
      <div *progressRingContext="let context" q-progress-ring-value-text>
        {{ context.valuePercent }}%
      </div>
    </div>
  `,
})
export class ProgressRingValueTextDemo implements OnInit {
  protected readonly onDestroy = useOnDestroy()
  protected readonly value = signal(0)

  ngOnInit() {
    const timer = setInterval(() => {
      this.value.update((prevValue) => {
        if (prevValue === 100) {
          return 0
        }
        return prevValue + 10
      })
    }, 1000)

    this.onDestroy(() => {
      clearInterval(timer)
    })
  }
}
