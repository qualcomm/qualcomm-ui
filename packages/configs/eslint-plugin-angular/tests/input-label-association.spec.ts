import {RuleTester} from "@typescript-eslint/rule-tester"
import {afterAll, describe, it} from "vitest"

import {inputLabelAssociation} from "../src/rules/input-label-association.js"

RuleTester.afterAll = afterAll
RuleTester.it = it
RuleTester.itOnly = it.only
RuleTester.describe = describe

const angularEslint = await import("angular-eslint")

const ruleTester = new RuleTester({
  languageOptions: {
    parser: angularEslint.templateParser,
  },
})

describe("input-label-association", () => {
  ruleTester.run("simple components", inputLabelAssociation, {
    invalid: [
      {
        code: `<q-text-input></q-text-input>`,
        errors: [{messageId: "missingLabel"}],
      },
      {
        code: `<q-number-input label=""></q-number-input>`,
        errors: [{messageId: "missingLabel"}],
      },
      {
        code: `<q-password-input></q-password-input>`,
        errors: [{messageId: "missingLabel"}],
      },
      {
        code: `<q-select></q-select>`,
        errors: [{messageId: "missingLabel"}],
      },
      {
        code: `<q-combobox></q-combobox>`,
        errors: [{messageId: "missingLabel"}],
      },
      {
        code: `<q-combobox aria-label=""></q-combobox>`,
        errors: [{messageId: "missingLabel"}],
      },
      {
        code: `<q-combobox [aria-label]="''"></q-combobox>`,
        errors: [{messageId: "missingLabel"}],
      },
      {
        code: `<q-password-input [attr.aria-label]="passwordLabel"></q-password-input>`,
        errors: [{messageId: "missingLabel"}],
      },
      {
        code: `<q-combobox [attr.aria-labelledby]="comboboxLabelId"></q-combobox>`,
        errors: [{messageId: "missingLabel"}],
      },
      {
        code: `<label q-switch></label>`,
        errors: [{messageId: "missingLabel"}],
      },
      {
        code: `<label q-checkbox></label>`,
        errors: [{messageId: "missingLabel"}],
      },
      {
        code: `<label q-radio></label>`,
        errors: [{messageId: "missingLabel"}],
      },
    ],
    valid: [
      {
        code: `<q-text-input label="Full name"></q-text-input>`,
      },
      {
        code: `<q-text-input [label]="nameLabel"></q-text-input>`,
      },
      {
        code: `<q-text-input aria-label="Full name"></q-text-input>`,
      },
      {
        code: `<q-text-input [aria-label]="nameLabel"></q-text-input>`,
      },
      {
        code: `<q-number-input aria-label="Quantity"></q-number-input>`,
      },
      {
        code: `<q-number-input aria-labelledby="quantity-label"></q-number-input>`,
      },
      {
        code: `<q-password-input [aria-label]="passwordLabel"></q-password-input>`,
      },
      {
        code: `<q-password-input [aria-labelledby]="passwordLabelId"></q-password-input>`,
      },
      {
        code: `<q-select aria-label="Country"></q-select>`,
      },
      {
        code: `<q-select aria-labelledby="select-label"></q-select>`,
      },
      {
        code: `<q-combobox aria-label="Country"></q-combobox>`,
      },
      {
        code: `<q-combobox [aria-label]="comboboxLabel"></q-combobox>`,
      },
      {
        code: `<q-combobox [aria-labelledby]="comboboxLabelId"></q-combobox>`,
      },
      {
        code: `<label q-switch label="Enabled"></label>`,
      },
      {
        code: `<label q-switch aria-label="Enabled"></label>`,
      },
      {
        code: `<label q-switch aria-labelledby="switch-label"></label>`,
      },
      {
        code: `<label q-checkbox [label]="acceptLabel"></label>`,
      },
      {
        code: `<label q-checkbox [aria-label]="acceptLabel"></label>`,
      },
      {
        code: `<label q-checkbox [aria-labelledby]="acceptLabelId"></label>`,
      },
      {
        code: `<label q-radio aria-label="Choice"></label>`,
      },
      {
        code: `<label q-radio [aria-labelledby]="choiceLabelId"></label>`,
      },
      {
        code: `
          <q-text-input>
            <label q-text-input-label>Full name</label>
          </q-text-input>
        `,
      },
      {
        code: `
          <q-number-input>
            <label q-number-input-label>Quantity</label>
          </q-number-input>
        `,
      },
      {
        code: `
          <q-password-input>
            <label q-password-input-label>Password</label>
          </q-password-input>
        `,
      },
      {
        code: `
          <q-select>
            <div q-select-label>Country</div>
          </q-select>
        `,
      },
      {
        code: `
          <q-select>
            <button q-select-control aria-label="Country"></button>
          </q-select>
        `,
      },
      {
        code: `
          <q-combobox>
            <div q-combobox-label>Country</div>
          </q-combobox>
        `,
      },
      {
        code: `
          <q-combobox>
            <input q-combobox-input aria-label="Country" />
          </q-combobox>
        `,
      },
      {
        code: `
          <q-combobox>
            <input aria-labelledby="combobox-label" q-combobox-input />
          </q-combobox>
        `,
      },
      {
        code: `
          <label q-switch>
            <span q-switch-label>Enabled</span>
          </label>
        `,
      },
      {
        code: `
          <label q-checkbox>
            <input q-checkbox-hidden-input aria-label="Accept terms" />
          </label>
        `,
      },
      {
        code: `
          <label q-checkbox>
            <input aria-label="Accept terms" q-checkbox-hidden-input />
          </label>
        `,
      },
      {
        code: `
          <label q-radio>
            <span q-radio-label>Choice</span>
          </label>
        `,
      },
    ],
  })

  ruleTester.run("compound roots", inputLabelAssociation, {
    invalid: [
      {
        code: `
          <div q-text-input-root>
            <input q-text-input-input />
          </div>
        `,
        errors: [{messageId: "missingLabelChild"}],
      },
      {
        code: `
          <div q-select-root>
            <button q-select-control></button>
          </div>
        `,
        errors: [
          {
            data: {
              componentName: "q-select",
              selector: "q-select-control",
            },
            messageId: "missingLabelChild",
          },
        ],
      },
      {
        code: `
          <div q-select-root>
            <select q-select-hidden-select aria-label="Country"></select>
          </div>
        `,
        errors: [
          {
            data: {
              componentName: "q-select",
              selector: "q-select-control",
            },
            messageId: "missingLabelChild",
          },
        ],
      },
      {
        code: `
          <label q-checkbox-root>
            <input q-checkbox-hidden-input />
          </label>
        `,
        errors: [{messageId: "missingLabelChild"}],
      },
    ],
    valid: [
      {
        code: `
          <div q-text-input-root>
            <label q-text-input-label>Full name</label>
            <input q-text-input-input />
          </div>
        `,
      },
      {
        code: `
          <div q-select-root>
            <button q-select-control aria-label="Country"></button>
          </div>
        `,
      },
      {
        code: `
          <div q-select-root>
            <button aria-labelledby="country-label" q-select-control></button>
          </div>
        `,
      },
      {
        code: `
          <label q-checkbox-root>
            <input q-checkbox-hidden-input [aria-label]="acceptLabel" />
          </label>
        `,
      },
      {
        code: `
          <label q-checkbox-root>
            <input [aria-labelledby]="acceptLabelId" q-checkbox-hidden-input />
          </label>
        `,
      },
    ],
  })
})
