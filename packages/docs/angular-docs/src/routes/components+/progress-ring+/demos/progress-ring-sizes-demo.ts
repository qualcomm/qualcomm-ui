import {Component, type OnInit, signal} from "@angular/core"

import {ProgressRingModule} from "@qualcomm-ui/angular/progress-ring"
import {useOnDestroy} from "@qualcomm-ui/angular-core/common"

@Component({
  imports: [ProgressRingModule],
  selector: "progress-ring-sizes-demo",
  template: `
    <div class="flex items-center gap-4">
      <div
        class="grid grid-cols-3 items-center justify-items-center gap-x-8 gap-y-4"
      >
        <div class="font-heading-xs text-neutral-primary">xxs</div>
        <div q-progress-ring size="xxs" [value]="value()"></div>
        <div q-progress-ring size="xxs"></div>

        <div class="font-heading-xs text-neutral-primary">xs</div>
        <div q-progress-ring size="xs" [value]="value()"></div>
        <div q-progress-ring size="xs"></div>

        <div class="font-heading-xs text-neutral-primary">sm</div>
        <div q-progress-ring size="sm" [value]="value()"></div>
        <div q-progress-ring size="sm"></div>

        <div class="font-heading-xs text-neutral-primary">md</div>
        <div q-progress-ring size="md" [value]="value()"></div>
        <div q-progress-ring size="md"></div>

        <div class="font-heading-xs text-neutral-primary">lg</div>
        <div q-progress-ring size="lg" [value]="value()"></div>
        <div q-progress-ring size="lg"></div>

        <div class="font-heading-xs text-neutral-primary">xl</div>
        <div q-progress-ring size="xl" [value]="value()"></div>
        <div q-progress-ring size="xl"></div>
      </div>
    </div>
  `,
})
export class ProgressRingSizesDemo implements OnInit {
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
