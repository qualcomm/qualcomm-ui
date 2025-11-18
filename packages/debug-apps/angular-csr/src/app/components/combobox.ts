import {Component} from "@angular/core"

import {ComboboxAriaLabelDemo} from "@qualcomm-ui/angular-docs/components+/combobox+/demos/combobox-aria-label-demo"
import {ComboboxAsyncDemo} from "@qualcomm-ui/angular-docs/components+/combobox+/demos/combobox-async-demo"
import {ComboboxCompositeDemo} from "@qualcomm-ui/angular-docs/components+/combobox+/demos/combobox-composite-demo"
import {ComboboxControlledStateDemo} from "@qualcomm-ui/angular-docs/components+/combobox+/demos/combobox-controlled-state-demo"
import {ComboboxErrorDemo} from "@qualcomm-ui/angular-docs/components+/combobox+/demos/combobox-error-demo"
import {ComboboxHighlightDemo} from "@qualcomm-ui/angular-docs/components+/combobox+/demos/combobox-highlight-demo"
import {ComboboxHintDemo} from "@qualcomm-ui/angular-docs/components+/combobox+/demos/combobox-hint-demo"
import {ComboboxIconCustomizationDemo} from "@qualcomm-ui/angular-docs/components+/combobox+/demos/combobox-icon-customization-demo"
import {ComboboxIconDemo} from "@qualcomm-ui/angular-docs/components+/combobox+/demos/combobox-icon-demo"
import {ComboboxInputBehaviorDemo} from "@qualcomm-ui/angular-docs/components+/combobox+/demos/combobox-input-behavior-demo"
import {ComboboxItemCustomizationDemo} from "@qualcomm-ui/angular-docs/components+/combobox+/demos/combobox-item-customization-demo"
import {ComboboxItemsDemo} from "@qualcomm-ui/angular-docs/components+/combobox+/demos/combobox-items-demo"
import {ComboboxMaxHeightDemo} from "@qualcomm-ui/angular-docs/components+/combobox+/demos/combobox-max-height-demo"
import {ComboboxMultipleDemo} from "@qualcomm-ui/angular-docs/components+/combobox+/demos/combobox-multiple-demo"
import {ComboboxObjectReactiveFormsDemo} from "@qualcomm-ui/angular-docs/components+/combobox+/demos/combobox-object-reactive-forms-demo"
import {ComboboxObjectTemplateFormsDemo} from "@qualcomm-ui/angular-docs/components+/combobox+/demos/combobox-object-template-forms-demo"
import {ComboboxOpenOnClickDemo} from "@qualcomm-ui/angular-docs/components+/combobox+/demos/combobox-open-on-click-demo"
import {ComboboxReactiveFormStatesDemo} from "@qualcomm-ui/angular-docs/components+/combobox+/demos/combobox-reactive-form-states-demo"
import {ComboboxRequiredTemplateFormsDemo} from "@qualcomm-ui/angular-docs/components+/combobox+/demos/combobox-required-template-forms-demo"
import {ComboboxSameWidthDemo} from "@qualcomm-ui/angular-docs/components+/combobox+/demos/combobox-same-width-demo"
import {ComboboxSimpleDemo} from "@qualcomm-ui/angular-docs/components+/combobox+/demos/combobox-simple-demo"
import {ComboboxSizesDemo} from "@qualcomm-ui/angular-docs/components+/combobox+/demos/combobox-sizes-demo"
import {ComboboxStatesDemo} from "@qualcomm-ui/angular-docs/components+/combobox+/demos/combobox-states-demo"
import {ComboboxStringsReactiveFormsDemo} from "@qualcomm-ui/angular-docs/components+/combobox+/demos/combobox-strings-reactive-forms-demo"
import {ComboboxStringsTemplateFormsDemo} from "@qualcomm-ui/angular-docs/components+/combobox+/demos/combobox-strings-template-forms-demo"
import {ComboboxTemplateFormStateDemo} from "@qualcomm-ui/angular-docs/components+/combobox+/demos/combobox-template-form-state-demo"
import {ComboboxVirtualDemo} from "@qualcomm-ui/angular-docs/components+/combobox+/demos/combobox-virtual-demo"
import {ComboboxVirtualItemCustomizationDemo} from "@qualcomm-ui/angular-docs/components+/combobox+/demos/combobox-virtual-item-customization-demo"
import {ComboboxWithinDialogDemo} from "@qualcomm-ui/angular-docs/components+/combobox+/demos/combobox-within-dialog-demo"
import {ComboboxWithinPopoverDemo} from "@qualcomm-ui/angular-docs/components+/combobox+/demos/combobox-within-popover-demo"

@Component({
  imports: [
    ComboboxAriaLabelDemo,
    ComboboxAsyncDemo,
    ComboboxCompositeDemo,
    ComboboxControlledStateDemo,
    ComboboxErrorDemo,
    ComboboxHighlightDemo,
    ComboboxHintDemo,
    ComboboxIconCustomizationDemo,
    ComboboxIconDemo,
    ComboboxInputBehaviorDemo,
    ComboboxItemCustomizationDemo,
    ComboboxItemsDemo,
    ComboboxMaxHeightDemo,
    ComboboxMultipleDemo,
    ComboboxObjectReactiveFormsDemo,
    ComboboxObjectTemplateFormsDemo,
    ComboboxOpenOnClickDemo,
    ComboboxReactiveFormStatesDemo,
    ComboboxRequiredTemplateFormsDemo,
    ComboboxSameWidthDemo,
    ComboboxSimpleDemo,
    ComboboxSizesDemo,
    ComboboxStatesDemo,
    ComboboxStringsReactiveFormsDemo,
    ComboboxStringsTemplateFormsDemo,
    ComboboxTemplateFormStateDemo,
    ComboboxVirtualDemo,
    ComboboxVirtualItemCustomizationDemo,
    ComboboxWithinDialogDemo,
    ComboboxWithinPopoverDemo,
  ],
  selector: "app-combobox",
  template: `
    <div class="container">
      <div class="section">
        <h2 class="section-title">Aria Label</h2>
        <div class="demo-container">
          <combobox-aria-label-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Async</h2>
        <div class="demo-container">
          <combobox-async-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Composite</h2>
        <div class="demo-container">
          <combobox-composite-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Controlled State</h2>
        <div class="demo-container">
          <combobox-controlled-state-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Error</h2>
        <div class="demo-container">
          <combobox-error-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Highlight</h2>
        <div class="demo-container">
          <combobox-highlight-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Hint</h2>
        <div class="demo-container">
          <combobox-hint-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Icon Customization</h2>
        <div class="demo-container">
          <combobox-icon-customization-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Icon</h2>
        <div class="demo-container">
          <combobox-icon-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Input Behavior</h2>
        <div class="demo-container">
          <combobox-input-behavior-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Item Customization</h2>
        <div class="demo-container">
          <combobox-item-customization-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Items</h2>
        <div class="demo-container">
          <combobox-items-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Max Height</h2>
        <div class="demo-container">
          <combobox-max-height-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Multiple</h2>
        <div class="demo-container">
          <combobox-multiple-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Object Reactive Forms</h2>
        <div class="demo-container">
          <combobox-object-reactive-forms-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Object Template Forms</h2>
        <div class="demo-container">
          <combobox-object-template-forms-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Open On Click</h2>
        <div class="demo-container">
          <combobox-open-on-click-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Reactive Form States</h2>
        <div class="demo-container">
          <combobox-reactive-form-states-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Required Template Forms</h2>
        <div class="demo-container">
          <combobox-required-template-forms-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Same Width</h2>
        <div class="demo-container">
          <combobox-same-width-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Simple</h2>
        <div class="demo-container">
          <combobox-simple-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Sizes</h2>
        <div class="demo-container">
          <combobox-sizes-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">States</h2>
        <div class="demo-container">
          <combobox-states-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Strings Reactive Forms</h2>
        <div class="demo-container">
          <combobox-strings-reactive-forms-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Strings Template Forms</h2>
        <div class="demo-container">
          <combobox-strings-template-forms-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Template Form State</h2>
        <div class="demo-container">
          <combobox-template-form-state-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Virtual</h2>
        <div class="demo-container">
          <combobox-virtual-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Virtual Item Customization</h2>
        <div class="demo-container">
          <combobox-virtual-item-customization-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Within Dialog</h2>
        <div class="demo-container">
          <combobox-within-dialog-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Within Popover</h2>
        <div class="demo-container">
          <combobox-within-popover-demo />
        </div>
      </div>
    </div>
  `,
})
export class ComboboxPage {}
