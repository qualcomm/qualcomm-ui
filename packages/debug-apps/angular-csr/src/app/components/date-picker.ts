import {Component} from "@angular/core"

import {DatePickerActionsDemo} from "@qualcomm-ui/angular-docs/components+/date-picker+/demos/date-picker-actions-demo"
import {DatePickerCompositeDemo} from "@qualcomm-ui/angular-docs/components+/date-picker+/demos/date-picker-composite-demo"
import {DatePickerCustomTriggerDemo} from "@qualcomm-ui/angular-docs/components+/date-picker+/demos/date-picker-custom-trigger-demo"
import {DatePickerHideOutsideDaysDemo} from "@qualcomm-ui/angular-docs/components+/date-picker+/demos/date-picker-hide-outside-days-demo"
import {DatePickerHintDemo} from "@qualcomm-ui/angular-docs/components+/date-picker+/demos/date-picker-hint-demo"
import {DatePickerInlineDemo} from "@qualcomm-ui/angular-docs/components+/date-picker+/demos/date-picker-inline-demo"
import {DatePickerLocaleDemo} from "@qualcomm-ui/angular-docs/components+/date-picker+/demos/date-picker-locale-demo"
import {DatePickerMinMaxDemo} from "@qualcomm-ui/angular-docs/components+/date-picker+/demos/date-picker-min-max-demo"
import {DatePickerMultipleDemo} from "@qualcomm-ui/angular-docs/components+/date-picker+/demos/date-picker-multiple-demo"
import {DatePickerOpenOnClickDemo} from "@qualcomm-ui/angular-docs/components+/date-picker+/demos/date-picker-open-on-click-demo"
import {DatePickerPresetsDemo} from "@qualcomm-ui/angular-docs/components+/date-picker+/demos/date-picker-presets-demo"
import {DatePickerRangeDemo} from "@qualcomm-ui/angular-docs/components+/date-picker+/demos/date-picker-range-demo"
import {DatePickerReactiveFormsDemo} from "@qualcomm-ui/angular-docs/components+/date-picker+/demos/date-picker-reactive-forms-demo"
import {DatePickerSingleDemo} from "@qualcomm-ui/angular-docs/components+/date-picker+/demos/date-picker-single-demo"
import {DatePickerSizesDemo} from "@qualcomm-ui/angular-docs/components+/date-picker+/demos/date-picker-sizes-demo"
import {DatePickerStatesDemo} from "@qualcomm-ui/angular-docs/components+/date-picker+/demos/date-picker-states-demo"
import {DatePickerTemplateFormsDemo} from "@qualcomm-ui/angular-docs/components+/date-picker+/demos/date-picker-template-forms-demo"
import {DatePickerUnavailableDemo} from "@qualcomm-ui/angular-docs/components+/date-picker+/demos/date-picker-unavailable-demo"
import {DatePickerWithinDialogDemo} from "@qualcomm-ui/angular-docs/components+/date-picker+/demos/date-picker-within-dialog-demo"

@Component({
  imports: [
    DatePickerActionsDemo,
    DatePickerCompositeDemo,
    DatePickerCustomTriggerDemo,
    DatePickerHideOutsideDaysDemo,
    DatePickerHintDemo,
    DatePickerInlineDemo,
    DatePickerLocaleDemo,
    DatePickerMinMaxDemo,
    DatePickerMultipleDemo,
    DatePickerOpenOnClickDemo,
    DatePickerPresetsDemo,
    DatePickerRangeDemo,
    DatePickerReactiveFormsDemo,
    DatePickerSingleDemo,
    DatePickerSizesDemo,
    DatePickerStatesDemo,
    DatePickerTemplateFormsDemo,
    DatePickerUnavailableDemo,
    DatePickerWithinDialogDemo,
  ],
  selector: "app-date-picker",
  template: `
    <div class="container">
      <div class="section">
        <h2 class="section-title">Action Buttons</h2>
        <div class="demo-container">
          <date-picker-actions-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Composite</h2>
        <div class="demo-container">
          <date-picker-composite-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Custom Trigger</h2>
        <div class="demo-container">
          <date-picker-custom-trigger-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Hide Outside Days</h2>
        <div class="demo-container">
          <date-picker-hide-outside-days-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Hint</h2>
        <div class="demo-container">
          <date-picker-hint-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Inline</h2>
        <div class="demo-container">
          <date-picker-inline-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Locale</h2>
        <div class="demo-container">
          <date-picker-locale-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Min Max</h2>
        <div class="demo-container">
          <date-picker-min-max-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Multiple</h2>
        <div class="demo-container">
          <date-picker-multiple-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Open On Click</h2>
        <div class="demo-container">
          <date-picker-open-on-click-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Presets</h2>
        <div class="demo-container">
          <date-picker-presets-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Range</h2>
        <div class="demo-container">
          <date-picker-range-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Reactive Forms</h2>
        <div class="demo-container">
          <date-picker-reactive-forms-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Single</h2>
        <div class="demo-container">
          <date-picker-single-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Sizes</h2>
        <div class="demo-container">
          <date-picker-sizes-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">States</h2>
        <div class="demo-container">
          <date-picker-states-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Template Forms</h2>
        <div class="demo-container">
          <date-picker-template-forms-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Unavailable</h2>
        <div class="demo-container">
          <date-picker-unavailable-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Within Dialog</h2>
        <div class="demo-container">
          <date-picker-within-dialog-demo />
        </div>
      </div>
    </div>
  `,
})
export class DatePickerPage {}
