import {Component} from "@angular/core"

import {CheckboxModule} from "@qualcomm-ui/angular/checkbox"
import {ComboboxModule} from "@qualcomm-ui/angular/combobox"
import {NumberInputModule} from "@qualcomm-ui/angular/number-input"
import {PasswordInputModule} from "@qualcomm-ui/angular/password-input"
import {RadioModule} from "@qualcomm-ui/angular/radio"
import {SelectModule} from "@qualcomm-ui/angular/select"
import {SwitchModule} from "@qualcomm-ui/angular/switch"
import {TextInputModule} from "@qualcomm-ui/angular/text-input"
import {useListCollection} from "@qualcomm-ui/angular-core/collection"
import {PortalDirective} from "@qualcomm-ui/angular-core/portal"
import type {ComboboxInputValueChangeDetails} from "@qualcomm-ui/core/combobox"
import {selectCollection} from "@qualcomm-ui/core/select"

const countries = [
  "Andorra",
  "United Arab Emirates",
  "Afghanistan",
  "Antigua and Barbuda",
  "Anguilla",
  "Albania",
  "Armenia",
  "Angola",
  "Antarctica",
  "Argentina",
  "American Samoa",
  "Austria",
  "Australia",
  "Aruba",
  "Azerbaijan",
  "Bosnia and Herzegovina",
  "Barbados",
  "Bangladesh",
  "Belgium",
  "Burkina Faso",
]

@Component({
  imports: [
    CheckboxModule,
    ComboboxModule,
    NumberInputModule,
    PasswordInputModule,
    RadioModule,
    SelectModule,
    SwitchModule,
    TextInputModule,
  ],
  selector: "app-form-controls-demo",
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
        <h2 class="section-title">Checkbox</h2>
        <div class="demo-container">
          <label q-checkbox-root>
            <input q-checkbox-hidden-input />
            <div q-checkbox-control></div>
            <span q-checkbox-label>Label</span>
          </label>
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">Combobox</h2>
        <div class="demo-container">
          <q-combobox
            style="width: 14rem;"
            placeholder="Select a country"
            [collection]="listCollection.collection()"
            (inputValueChanged)="onInputChange($event)"
          />
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">Number Input</h2>
        <div class="demo-container">
          <div style="width: 18rem;" q-number-input-root>
            <label q-number-input-label>Label</label>
            <div q-number-input-input-group>
              <input placeholder="Enter a number" q-number-input-input />
              <div q-number-input-control></div>
              <span q-number-input-error-indicator></span>
            </div>
            <div q-number-input-error-text>Error</div>
          </div>
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">Password Input</h2>
        <div class="demo-container">
          <div style="width: 18rem;" q-password-input-root>
            <label q-password-input-label>Label</label>
            <div q-password-input-input-group>
              <input placeholder="Placeholder text" q-password-input-input />
              <button q-password-input-clear-trigger></button>
              <button q-password-input-visibility-trigger></button>
              <span q-password-input-error-indicator></span>
            </div>
            <div q-password-input-error-text>Error text</div>
            <div q-password-input-hint>Optional hint</div>
          </div>
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">Radio</h2>
        <div class="demo-container">
          <form>
            <fieldset defaultValue="html" name="language" q-radio-group>
              <div q-radio-group-label>Language</div>
              <div q-radio-group-items>
                <label q-radio-root value="html">
                  <input q-radio-hidden-input />
                  <div q-radio-control></div>
                  <span q-radio-label>HTML</span>
                </label>
                <label q-radio-root value="css">
                  <input q-radio-hidden-input />
                  <div q-radio-control></div>
                  <span q-radio-label>CSS</span>
                </label>
                <label q-radio-root value="ts">
                  <input q-radio-hidden-input />
                  <div q-radio-control></div>
                  <span q-radio-label>TypeScript</span>
                </label>
              </div>
            </fieldset>
          </form>
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">Select</h2>
        <div class="demo-container">
          <q-select
            placeholder="Select a city"
            style="width: 192px"
            [collection]="cityCollection"
          />
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">Switch</h2>
        <div class="demo-container">
          <label q-switch-root>
            <input q-switch-hidden-input />
            <div q-switch-control></div>
            <span q-switch-label>Label</span>
          </label>
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">Text Input</h2>
        <div class="demo-container">
          <div style="width: 18rem;" q-text-input-root>
            <label q-text-input-label>Label</label>
            <div q-text-input-input-group>
              <input placeholder="Placeholder text" q-text-input-input />
              <button q-text-input-clear-trigger></button>
              <span q-text-input-error-indicator></span>
            </div>
            <div q-text-input-hint>Optional hint</div>
            <div q-text-input-error-text>Error text</div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class FormControlsDemo {
  readonly listCollection = useListCollection<string>({
    filter: "contains",
    items: countries,
  })

  cityCollection = selectCollection({
    items: [
      "San Diego",
      "Nashville",
      "Denver",
      "Miami",
      "Las Vegas",
      "New York City",
      "San Francisco",
    ],
  })

  onInputChange(event: ComboboxInputValueChangeDetails) {
    this.listCollection.filterText.set(event.inputValue)
  }
}
