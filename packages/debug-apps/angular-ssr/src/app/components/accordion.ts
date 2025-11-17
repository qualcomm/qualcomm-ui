import {Component} from "@angular/core"

import {AccordionCollapsibleDemo} from "@qualcomm-ui/angular-docs/components+/accordion+/demos/accordion-collapsible-demo"
import {AccordionCompositeDemo} from "@qualcomm-ui/angular-docs/components+/accordion+/demos/accordion-composite-demo"
import {AccordionCompositeLayoutDemo} from "@qualcomm-ui/angular-docs/components+/accordion+/demos/accordion-composite-layout-demo"
import {AccordionControlledStateDemo} from "@qualcomm-ui/angular-docs/components+/accordion+/demos/accordion-controlled-state-demo"
import {AccordionDefaultValueDemo} from "@qualcomm-ui/angular-docs/components+/accordion+/demos/accordion-default-value-demo"
import {AccordionDisabledDemo} from "@qualcomm-ui/angular-docs/components+/accordion+/demos/accordion-disabled-demo"
import {AccordionFocusCallbackDemo} from "@qualcomm-ui/angular-docs/components+/accordion+/demos/accordion-focus-callback-demo"
import {AccordionIconDemo} from "@qualcomm-ui/angular-docs/components+/accordion+/demos/accordion-icon-demo"
import {AccordionMultipleDemo} from "@qualcomm-ui/angular-docs/components+/accordion+/demos/accordion-multiple-demo"
import {AccordionSecondaryTextDemo} from "@qualcomm-ui/angular-docs/components+/accordion+/demos/accordion-secondary-text-demo"
import {AccordionSimpleDemo} from "@qualcomm-ui/angular-docs/components+/accordion+/demos/accordion-simple-demo"
import {AccordionSimpleDirectivesDemo} from "@qualcomm-ui/angular-docs/components+/accordion+/demos/accordion-simple-directives-demo"
import {AccordionSizeDemo} from "@qualcomm-ui/angular-docs/components+/accordion+/demos/accordion-size-demo"
import {AccordionUncontainedDemo} from "@qualcomm-ui/angular-docs/components+/accordion+/demos/accordion-uncontained-demo"

@Component({
  imports: [
    AccordionCollapsibleDemo,
    AccordionCompositeDemo,
    AccordionCompositeLayoutDemo,
    AccordionControlledStateDemo,
    AccordionDefaultValueDemo,
    AccordionDisabledDemo,
    AccordionFocusCallbackDemo,
    AccordionIconDemo,
    AccordionMultipleDemo,
    AccordionSecondaryTextDemo,
    AccordionSimpleDemo,
    AccordionSimpleDirectivesDemo,
    AccordionSizeDemo,
    AccordionUncontainedDemo,
  ],
  selector: "app-accordion",
  template: `
    <div
      class="container"
      style="max-width: 1200px; margin: 0 auto; padding: 2rem;"
    >
      <div class="section">
        <h2 class="section-title">Collapsible</h2>
        <div class="demo-container">
          <accordion-collapsible-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Composite</h2>
        <div class="demo-container">
          <accordion-composite-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Composite Layout</h2>
        <div class="demo-container">
          <accordion-starting-indicator-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Controlled State</h2>
        <div class="demo-container">
          <accordion-controlled-state-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Default Value</h2>
        <div class="demo-container">
          <accordion-default-value-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Disabled</h2>
        <div class="demo-container">
          <accordion-disabled-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Focus Callback</h2>
        <div class="demo-container">
          <accordion-focus-callback-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Icon</h2>
        <div class="demo-container">
          <accordion-icon-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Multiple</h2>
        <div class="demo-container">
          <accordion-multiple-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Secondary Text</h2>
        <div class="demo-container">
          <accordion-secondary-text-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Simple</h2>
        <div class="demo-container">
          <accordion-simple-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Simple Directives</h2>
        <div class="demo-container">
          <accordion-simple-directives-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Size</h2>
        <div class="demo-container">
          <accordion-size-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Uncontained</h2>
        <div class="demo-container">
          <accordion-uncontained-demo />
        </div>
      </div>
    </div>
  `,
})
export class AccordionPage {}
