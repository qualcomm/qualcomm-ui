import {Component} from "@angular/core"

@Component({
  selector: "app-slider",
  styles: `
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .message {
      font: var(--font-static-body-lg-default);
      color: var(--color-text-neutral-secondary);
      text-align: center;
      padding: 4rem 2rem;
    }
  `,
  template: `
    <div
      class="container"
      style="max-width: 1200px; margin: 0 auto; padding: 2rem;"
    >
      <div class="section">
        <h2 class="section-title">Simple</h2>
        <div class="demo-container">
          <slider-simple-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Variant</h2>
        <div class="demo-container">
          <slider-variant-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Size</h2>
        <div class="demo-container">
          <slider-size-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Hint</h2>
        <div class="demo-container">
          <slider-hint-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Disabled</h2>
        <div class="demo-container">
          <slider-disabled-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Range</h2>
        <div class="demo-container">
          <slider-range-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Min Max Step</h2>
        <div class="demo-container">
          <slider-min-max-step-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Min Steps</h2>
        <div class="demo-container">
          <slider-min-steps-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Origin</h2>
        <div class="demo-container">
          <slider-origin-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Markers</h2>
        <div class="demo-container">
          <slider-markers-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Side Markers</h2>
        <div class="demo-container">
          <slider-side-markers-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Display</h2>
        <div class="demo-container">
          <slider-display-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Tooltip</h2>
        <div class="demo-container">
          <slider-tooltip-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Composite</h2>
        <div class="demo-container">
          <slider-composite-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Template Forms</h2>
        <div class="demo-container">
          <slider-template-forms-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Template Form State</h2>
        <div class="demo-container">
          <slider-template-form-state-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Reactive Form States</h2>
        <div class="demo-container">
          <slider-reactive-form-states-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Value Callback</h2>
        <div class="demo-container">
          <slider-value-callback-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Focus Callback</h2>
        <div class="demo-container">
          <slider-focus-callback-demo />
        </div>
      </div>
    </div>
  `,
})
export class SliderPage {}
