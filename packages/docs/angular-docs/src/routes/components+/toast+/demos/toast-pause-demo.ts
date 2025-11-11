import {Component, inject, signal} from "@angular/core"

import {ButtonModule} from "@qualcomm-ui/angular/button"
import {provideToaster, ToasterService, ToastModule} from "@qualcomm-ui/angular/toast"

@Component({
  imports: [ToastModule, ButtonModule],
  providers: [provideToaster({placement: "bottom-end"})],
  selector: "toast-pause-demo",
  template: `
    <div q-toaster [toaster]="toaster"></div>

    <div class="flex gap-4">
      <button q-button variant="outline" [disabled]="shown()" (click)="show()">
        Show Toast
      </button>
      <button
        q-button
        variant="outline"
        [disabled]="!shown() || paused()"
        (click)="pause()"
      >
        Pause Toast
      </button>
      <button
        q-button
        variant="outline"
        [disabled]="!shown() || !paused()"
        (click)="play()"
      >
        Play Toast
      </button>
    </div>
  `,
})
export class ToastPauseDemo {
  toaster = inject(ToasterService).toaster

  protected readonly paused = signal(false)
  protected readonly shown = signal(false)

  show() {
    this.toaster.create({
      label: "This is a success toast",
      onStatusChange: (details) => {
        if (details.status === "visible") {
          this.shown.set(true)
        } else if (details.status === "dismissing") {
          this.shown.set(false)
        }
      },
      type: "success",
    })
  }

  pause() {
    this.toaster.pause()
    this.paused.set(true)
  }

  play() {
    this.toaster.resume()
    this.paused.set(false)
  }
}
