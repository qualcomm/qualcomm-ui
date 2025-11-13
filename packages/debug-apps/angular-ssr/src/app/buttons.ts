import {Component} from "@angular/core"
import {AArrowDown, ExternalLink} from "lucide-angular"

import {ButtonModule} from "@qualcomm-ui/angular/button"
import {InlineIconButtonComponent} from "@qualcomm-ui/angular/inline-icon-button"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import type {QdsButtonGroupLayout} from "@qualcomm-ui/qds-core/button"

@Component({
  imports: [ButtonModule, InlineIconButtonComponent],
  providers: [provideIcons({AArrowDown, ExternalLink})],
  selector: "app-buttons-demo",
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
        <h2 class="section-title">Button</h2>
        <div class="demo-container">
          <div
            style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); grid-template-rows: repeat(4, minmax(0, 1fr)); column-gap: 2rem; row-gap: 1.25rem;"
          >
            <button emphasis="primary" q-button variant="fill">Action</button>
            <button emphasis="primary" q-button variant="outline">
              Action
            </button>
            <button emphasis="primary" q-button variant="ghost">Action</button>
            <button emphasis="neutral" q-button variant="fill">Action</button>
            <button emphasis="neutral" q-button variant="outline">
              Action
            </button>
            <button emphasis="neutral" q-button variant="ghost">Action</button>
            <button emphasis="danger" q-button variant="fill">Action</button>
            <button emphasis="danger" q-button variant="outline">Action</button>
            <button emphasis="danger" q-button variant="ghost">Action</button>
            <button disabled emphasis="danger" q-button variant="fill">
              Action
            </button>
            <button disabled emphasis="danger" q-button variant="outline">
              Action
            </button>
            <button disabled emphasis="danger" q-button variant="ghost">
              Action
            </button>
          </div>
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">Button Group</h2>
        <div class="demo-container">
          <div
            style="display: flex; width: 100%; flex-direction: column; gap: 1rem;"
          >
            @for (layout of layouts; track layout) {
              <div
                q-button-group
                style="border: 1px dashed var(--color-border-brand-primary-subtle); padding: 0.375rem;"
                [layout]="layout"
              >
                <button q-button startIcon="AArrowDown" variant="ghost">
                  Button
                </button>
                <button q-button startIcon="AArrowDown" variant="outline">
                  Button
                </button>
                <button
                  emphasis="primary"
                  q-button
                  startIcon="AArrowDown"
                  variant="fill"
                >
                  Button
                </button>
              </div>
            }
          </div>
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">Icon Button</h2>
        <div class="demo-container">
          <div
            style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); grid-template-rows: repeat(2, minmax(0, 1fr)); column-gap: 2rem; row-gap: 0.25rem;"
          >
            <button icon="ExternalLink" q-icon-button variant="fill"></button>
            <button
              icon="ExternalLink"
              q-icon-button
              variant="outline"
            ></button>
            <button icon="ExternalLink" q-icon-button variant="ghost"></button>
          </div>
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">Inline Icon Button</h2>
        <div class="demo-container">
          <button q-inline-icon-button></button>
        </div>
      </div>
    </div>
  `,
})
export class ButtonsDemo {
  protected layouts: QdsButtonGroupLayout[] = ["hug", "start", "end", "fill"]
}
