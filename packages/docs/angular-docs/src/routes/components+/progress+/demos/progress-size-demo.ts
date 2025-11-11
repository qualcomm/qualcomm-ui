import {Component, type OnInit, signal} from "@angular/core"

import {ProgressModule} from "@qualcomm-ui/angular/progress"
import {useOnDestroy} from "@qualcomm-ui/angular-core/common"

@Component({
  imports: [ProgressModule],
  selector: "progress-size-demo",
  template: `
    <div class="flex w-64 flex-col gap-6">
      <!-- preview -->
      <div label="sm" q-progress size="sm" [value]="value()"></div>
      <div label="md" q-progress size="md" [value]="value()"></div>
      <div label="lg" q-progress size="lg" [value]="value()"></div>
      <!-- preview -->
    </div>
  `,
})
export class ProgressSizeDemo implements OnInit {
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
