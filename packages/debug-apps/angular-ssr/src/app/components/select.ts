import {Component} from "@angular/core"

import {SelectAriaLabelDemo} from "@qualcomm-ui/angular-docs/components+/select+/demos/select-aria-label-demo"
import {SelectCompositeDemo} from "@qualcomm-ui/angular-docs/components+/select+/demos/select-composite-demo"
import {SelectControlledOpenDemo} from "@qualcomm-ui/angular-docs/components+/select+/demos/select-controlled-open-demo"
import {SelectErrorDemo} from "@qualcomm-ui/angular-docs/components+/select+/demos/select-error-demo"
import {SelectIconDemo} from "@qualcomm-ui/angular-docs/components+/select+/demos/select-icon-demo"
import {SelectItemCustomizationDemo} from "@qualcomm-ui/angular-docs/components+/select+/demos/select-item-customization-demo"
import {SelectItemsDemo} from "@qualcomm-ui/angular-docs/components+/select+/demos/select-items-demo"
import {SelectMaxHeightDemo} from "@qualcomm-ui/angular-docs/components+/select+/demos/select-max-height-demo"
import {SelectMultipleDemo} from "@qualcomm-ui/angular-docs/components+/select+/demos/select-multiple-demo"
import {SelectObjectReactiveFormsDemo} from "@qualcomm-ui/angular-docs/components+/select+/demos/select-object-reactive-forms-demo"
import {SelectObjectTemplateFormsDemo} from "@qualcomm-ui/angular-docs/components+/select+/demos/select-object-template-forms-demo"
import {SelectReactiveFormStatesDemo} from "@qualcomm-ui/angular-docs/components+/select+/demos/select-reactive-form-states-demo"
import {SelectRequiredTemplateFormsDemo} from "@qualcomm-ui/angular-docs/components+/select+/demos/select-required-template-forms-demo"
import {SelectSameWidthDemo} from "@qualcomm-ui/angular-docs/components+/select+/demos/select-same-width-demo"
import {SelectSimpleDemo} from "@qualcomm-ui/angular-docs/components+/select+/demos/select-simple-demo"
import {SelectSizesDemo} from "@qualcomm-ui/angular-docs/components+/select+/demos/select-sizes-demo"
import {SelectStringsReactiveFormsDemo} from "@qualcomm-ui/angular-docs/components+/select+/demos/select-strings-reactive-forms-demo"
import {SelectStringsTemplateFormsDemo} from "@qualcomm-ui/angular-docs/components+/select+/demos/select-strings-template-forms-demo"
import {SelectTemplateFormStateDemo} from "@qualcomm-ui/angular-docs/components+/select+/demos/select-template-form-state-demo"
import {SelectWithinDialogDemo} from "@qualcomm-ui/angular-docs/components+/select+/demos/select-within-dialog-demo"
import {SelectWithinPopoverDemo} from "@qualcomm-ui/angular-docs/components+/select+/demos/select-within-popover-demo"

@Component({
  imports: [
    SelectAriaLabelDemo,
    SelectCompositeDemo,
    SelectControlledOpenDemo,
    SelectErrorDemo,
    SelectIconDemo,
    SelectItemCustomizationDemo,
    SelectItemsDemo,
    SelectMaxHeightDemo,
    SelectMultipleDemo,
    SelectObjectReactiveFormsDemo,
    SelectObjectTemplateFormsDemo,
    SelectReactiveFormStatesDemo,
    SelectRequiredTemplateFormsDemo,
    SelectSameWidthDemo,
    SelectSimpleDemo,
    SelectSizesDemo,
    SelectStringsReactiveFormsDemo,
    SelectStringsTemplateFormsDemo,
    SelectTemplateFormStateDemo,
    SelectWithinDialogDemo,
    SelectWithinPopoverDemo,
  ],
  selector: "app-select",
  template: `
    <div
      class="container"
      style="max-width: 1200px; margin: 0 auto; padding: 2rem;"
    >
      <div class="section">
        <h2 class="section-title">Aria Label</h2>
        <div class="demo-container">
          <select-aria-label-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Composite</h2>
        <div class="demo-container">
          <select-composite-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Controlled Open</h2>
        <div class="demo-container">
          <select-controlled-open-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Error</h2>
        <div class="demo-container">
          <select-error-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Icon</h2>
        <div class="demo-container">
          <select-icon-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Item Customization</h2>
        <div class="demo-container">
          <select-item-customization-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Items</h2>
        <div class="demo-container">
          <select-items-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Max Height</h2>
        <div class="demo-container">
          <select-max-height-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Multiple</h2>
        <div class="demo-container">
          <select-multiple-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Object Reactive Forms</h2>
        <div class="demo-container">
          <select-object-reactive-forms-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Object Template Forms</h2>
        <div class="demo-container">
          <select-object-template-forms-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Reactive Form States</h2>
        <div class="demo-container">
          <select-reactive-form-states-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Required Template Forms</h2>
        <div class="demo-container">
          <select-required-template-forms-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Same Width</h2>
        <div class="demo-container">
          <select-same-width-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Simple</h2>
        <div class="demo-container">
          <select-simple-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Sizes</h2>
        <div class="demo-container">
          <select-sizes-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Strings Reactive Forms</h2>
        <div class="demo-container">
          <select-strings-reactive-forms-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Strings Template Forms</h2>
        <div class="demo-container">
          <select-strings-template-forms-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Template Form State</h2>
        <div class="demo-container">
          <select-template-form-state-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Within Dialog</h2>
        <div class="demo-container">
          <select-within-dialog-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Within Popover</h2>
        <div class="demo-container">
          <select-within-popover-demo />
        </div>
      </div>
    </div>
  `,
})
export class SelectPage {}
