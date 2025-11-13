import {Component, inject} from "@angular/core"

import {ButtonModule} from "@qualcomm-ui/angular/button"
import {InlineNotificationModule} from "@qualcomm-ui/angular/inline-notification"
import {LinkDirective} from "@qualcomm-ui/angular/link"
import {ProgressModule} from "@qualcomm-ui/angular/progress"
import {ProgressRingModule} from "@qualcomm-ui/angular/progress-ring"
import {
  provideToaster,
  ToasterService,
  ToastModule,
} from "@qualcomm-ui/angular/toast"
import type {QdsNotificationEmphasis} from "@qualcomm-ui/qds-core/inline-notification"

@Component({
  imports: [
    ButtonModule,
    InlineNotificationModule,
    LinkDirective,
    ProgressModule,
    ProgressRingModule,
    ToastModule,
  ],
  providers: [provideToaster({placement: "bottom-end"})],
  selector: "app-feedback-demo",
  styles: `
    .section {
      margin-bottom: 3rem;
    }

    .section-title {
      font: var(--font-static-heading-md-default);
      margin-bottom: 1rem;
      color: var(--color-text-neutral-primary);
    }

    .demo-container {
      padding: 2rem;
      border: 1px solid var(--color-border-neutral-01);
      border-radius: 8px;
      background-color: var(--color-background-neutral-01);
    }
  `,
  template: `
    <div
      class="container"
      style="max-width: 1200px; margin: 0 auto; padding: 2rem;"
    >
      <div class="section">
        <h2 class="section-title">Inline Notification</h2>
        <div class="demo-container">
          <div style="width: 24rem;" q-inline-notification-root>
            <span q-inline-notification-icon></span>
            <button q-inline-notification-close-button></button>
            <div q-inline-notification-label>Label</div>
            <div q-inline-notification-description>Description</div>
            <button q-inline-notification-action q-link>Action</button>
          </div>
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">Progress</h2>
        <div class="demo-container">
          <div style="width: 16rem;" q-progress-root value="64">
            <div q-progress-label>Label</div>
            <div *progressContext="let context" q-progress-value-text>
              <div q-progress-value-text>{{ context.valuePercent }}%</div>
            </div>
            <div q-progress-track></div>
            <div q-progress-error-text></div>
            <div q-progress-hint>Optional hint</div>
          </div>
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">Progress Ring</h2>
        <div class="demo-container">
          <div q-progress-ring-root>
            <div q-progress-ring-circle-container>
              <svg q-progress-ring-circle></svg>
            </div>
            <div q-progress-ring-label>Loading...</div>
          </div>
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">Toast</h2>
        <div class="demo-container">
          <div q-toaster [toaster]="toaster"></div>

          <div style="display: flex; flex-wrap: wrap; gap: 1rem;">
            @for (emphasis of types; track emphasis) {
              <button
                q-button
                variant="outline"
                (click)="createToast(emphasis)"
              >
                {{ emphasis }}
              </button>
            }
          </div>
        </div>
      </div>
    </div>
  `,
})
export class FeedbackDemo {
  toaster = inject(ToasterService).toaster

  protected readonly types: QdsNotificationEmphasis[] = [
    "info",
    "success",
    "warning",
    "danger",
    "neutral",
    "loading",
  ]

  createToast(emphasis: QdsNotificationEmphasis) {
    this.toaster.create({
      label: `The status is ${emphasis}`,
      type: emphasis,
    })
  }
}
