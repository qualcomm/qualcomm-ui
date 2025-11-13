import {Component} from "@angular/core"
import {ChevronLeft, ChevronRight, ExternalLink, Link2} from "lucide-angular"

import {AvatarModule} from "@qualcomm-ui/angular/avatar"
import {DividerDirective} from "@qualcomm-ui/angular/divider"
import {IconDirective} from "@qualcomm-ui/angular/icon"
import {LinkDirective} from "@qualcomm-ui/angular/link"
import {SegmentedControlModule} from "@qualcomm-ui/angular/segmented-control"
import {TagDirective} from "@qualcomm-ui/angular/tag"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import type {QdsSegmentedControlVariant} from "@qualcomm-ui/qds-core/segmented-control"

@Component({
  imports: [
    AvatarModule,
    DividerDirective,
    IconDirective,
    LinkDirective,
    SegmentedControlModule,
    TagDirective,
  ],
  providers: [provideIcons({ChevronLeft, ChevronRight, ExternalLink, Link2})],
  selector: "app-data-display-demo",
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

    .text-icon-neutral-primary {
      color: var(--color-icon-neutral-primary);
    }

    .text-neutral-primary {
      color: var(--color-text-neutral-primary);
    }
  `,
  template: `
    <div
      class="container"
      style="max-width: 1200px; margin: 0 auto; padding: 2rem;"
    >
      <div class="section">
        <h2 class="section-title">Avatar</h2>
        <div class="demo-container">
          <div style="display: flex; align-items: center; gap: 1rem;">
            <div q-avatar variant="neutral">
              <div q-avatar-content>OK</div>
            </div>
            <div q-avatar variant="contrast">
              <div q-avatar-content>OK</div>
            </div>
            <div q-avatar variant="brand">
              <div q-avatar-content>OK</div>
            </div>
          </div>
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">Divider</h2>
        <div class="demo-container">
          <div
            style="display: flex; flex-direction: column; gap: 1rem; padding-left: 2rem; padding-right: 2rem;"
          >
            <span
              class="text-neutral-primary"
              style="font: var(--font-static-body-md-default);"
            >
              subtle: Low contrast, less visually prominent
            </span>
            <div q-divider variant="subtle"></div>
            <span
              class="text-neutral-primary"
              style="font: var(--font-static-body-md-default);"
            >
              normal (default): Standard appearance with balanced visibility
            </span>
            <div q-divider></div>
            <span
              class="text-neutral-primary"
              style="font: var(--font-static-body-md-default);"
            >
              strong: High contrast, maximum visual separation
            </span>
            <div q-divider variant="strong"></div>
          </div>
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">Icon</h2>
        <div class="demo-container">
          <div
            class="text-icon-neutral-primary"
            style="display: grid; justify-content: center; gap: 1rem;"
          >
            <div
              style="display: flex; align-items: flex-end; justify-content: center; gap: 1rem;"
            >
              <svg qIcon="ExternalLink" size="xs"></svg>
              <svg qIcon="ExternalLink" size="sm"></svg>
              <svg qIcon="ExternalLink" size="md"></svg>
              <svg qIcon="ExternalLink" size="lg"></svg>
              <svg qIcon="ExternalLink" size="xl"></svg>
            </div>
          </div>
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">Link</h2>
        <div class="demo-container">
          <a endIcon="ChevronRight" q-link>Next Page</a>
          <a q-link startIcon="ChevronLeft">Go Back</a>
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">Segmented Control</h2>
        <div class="demo-container">
          <div
            style="display: flex; width: 100%; flex-direction: column; align-items: center; gap: 1rem;"
          >
            @for (variant of variants; track variant) {
              <fieldset
                q-segmented-control
                [defaultValue]="['chart']"
                [variant]="variant"
              >
                <label
                  q-segmented-control-item
                  text="Chart"
                  value="chart"
                ></label>
                <label
                  q-segmented-control-item
                  text="Table"
                  value="table"
                ></label>
                <label q-segmented-control-item text="Map" value="map"></label>
              </fieldset>
            }
          </div>
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">Tag</h2>
        <div class="demo-container">
          <div
            style="display: flex; flex-direction: column; align-items: flex-start; gap: 0.5rem;"
          >
            <button endIcon="Link2" q-tag variant="link">link</button>
            <button q-tag variant="selectable">selectable</button>
            <button q-tag variant="dismissable">dismissable</button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class DataDisplayDemo {
  protected variants: QdsSegmentedControlVariant[] = ["primary", "neutral"]
}
