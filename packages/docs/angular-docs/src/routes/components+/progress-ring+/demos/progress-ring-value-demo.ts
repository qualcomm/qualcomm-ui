import {Component, signal} from "@angular/core"
import {Minus, Plus} from "lucide-angular"

import {ButtonModule} from "@qualcomm-ui/angular/button"
import {ProgressRingModule} from "@qualcomm-ui/angular/progress-ring"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"

@Component({
  imports: [ProgressRingModule, ButtonModule],
  providers: [provideIcons({Minus, Plus})],
  selector: "progress-ring-value-demo",
  template: `
    <div class="flex flex-col gap-4">
      <!-- preview -->
      <div q-progress-ring size="lg" [value]="value()">
        <svg aria-label="Loading" q-progress-ring-circle></svg>
        <div *progressRingContext="let context" q-progress-ring-value-text>
          {{ context.valuePercent }}%
        </div>
      </div>
      <!-- preview -->
      <div class="flex gap-2">
        <button
          icon="Minus"
          q-icon-button
          size="sm"
          variant="outline"
          (click)="decrement()"
        ></button>
        <button
          icon="Plus"
          q-icon-button
          size="sm"
          variant="outline"
          (click)="increment()"
        ></button>
      </div>
    </div>
  `,
})
export class ProgressRingValueDemo {
  readonly value = signal(0)

  increment() {
    this.value.update((prev) => Math.min(prev + 10, 100))
  }

  decrement() {
    this.value.update((prev) => Math.max(prev - 10, 0))
  }
}
