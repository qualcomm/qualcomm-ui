import {RuleTester} from "@typescript-eslint/rule-tester"
import {afterAll, describe, it} from "vitest"

import {interactiveCardElementNesting} from "../src/rules/interactive-card-element-nesting.js"

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

describe("interactive-card-element-nesting", () => {
  describe("invalid: native interactive elements", () => {
    ruleTester.run("button", interactiveCardElementNesting, {
      invalid: [
        {
          code: `
            <div q-card interactive>
              <button>Click</button>
            </div>
          `,
          errors: [{messageId: "noInteractiveChildren"}],
        },
      ],
      valid: [],
    })

    ruleTester.run("anchor", interactiveCardElementNesting, {
      invalid: [
        {
          code: `
            <div q-card interactive>
              <a href="/page">Link</a>
            </div>
          `,
          errors: [{messageId: "noInteractiveChildren"}],
        },
      ],
      valid: [],
    })

    ruleTester.run("input", interactiveCardElementNesting, {
      invalid: [
        {
          code: `
            <div q-card interactive>
              <input type="text" />
            </div>
          `,
          errors: [{messageId: "noInteractiveChildren"}],
        },
      ],
      valid: [],
    })

    ruleTester.run("select", interactiveCardElementNesting, {
      invalid: [
        {
          code: `
            <div q-card interactive>
              <select><option>A</option></select>
            </div>
          `,
          errors: [{messageId: "noInteractiveChildren"}],
        },
      ],
      valid: [],
    })

    ruleTester.run("textarea", interactiveCardElementNesting, {
      invalid: [
        {
          code: `
            <div q-card interactive>
              <textarea></textarea>
            </div>
          `,
          errors: [{messageId: "noInteractiveChildren"}],
        },
      ],
      valid: [],
    })

    ruleTester.run("details", interactiveCardElementNesting, {
      invalid: [
        {
          code: `
            <div q-card interactive>
              <details><summary>Info</summary></details>
            </div>
          `,
          errors: [{messageId: "noInteractiveChildren"}],
        },
      ],
      valid: [],
    })
  })

  describe("invalid: deeply nested interactive elements", () => {
    ruleTester.run("nested in div", interactiveCardElementNesting, {
      invalid: [
        {
          code: `
            <div q-card interactive>
              <div>
                <span>
                  <button>Click</button>
                </span>
              </div>
            </div>
          `,
          errors: [{messageId: "noInteractiveChildren"}],
        },
      ],
      valid: [],
    })
  })

  describe("invalid: QUI interactive directives", () => {
    ruleTester.run("q-button", interactiveCardElementNesting, {
      invalid: [
        {
          code: `
            <div q-card interactive>
              <button q-button>Click</button>
            </div>
          `,
          errors: [{messageId: "noInteractiveChildren"}],
        },
      ],
      valid: [],
    })

    ruleTester.run("q-link", interactiveCardElementNesting, {
      invalid: [
        {
          code: `
            <div q-card interactive>
              <a q-link href="/page">Go</a>
            </div>
          `,
          errors: [{messageId: "noInteractiveChildren"}],
        },
      ],
      valid: [],
    })

    ruleTester.run("q-icon-button", interactiveCardElementNesting, {
      invalid: [
        {
          code: `
            <div q-card interactive>
              <button q-icon-button aria-label="action"></button>
            </div>
          `,
          errors: [{messageId: "noInteractiveChildren"}],
        },
      ],
      valid: [],
    })
  })

  describe("invalid: card compound interactive directives", () => {
    ruleTester.run("q-card-button", interactiveCardElementNesting, {
      invalid: [
        {
          code: `
            <div q-card interactive>
              <button q-card-button>Click</button>
            </div>
          `,
          errors: [{messageId: "noInteractiveChildren"}],
        },
      ],
      valid: [],
    })

    ruleTester.run("q-card-link", interactiveCardElementNesting, {
      invalid: [
        {
          code: `
            <div q-card interactive>
              <a q-card-link>Go</a>
            </div>
          `,
          errors: [{messageId: "noInteractiveChildren"}],
        },
      ],
      valid: [],
    })
  })

  describe("invalid: form control directives", () => {
    ruleTester.run("q-text-input-root", interactiveCardElementNesting, {
      invalid: [
        {
          code: `
            <div q-card interactive>
              <div q-text-input-root>
                <input q-text-input-input />
              </div>
            </div>
          `,
          errors: [{messageId: "noInteractiveChildren"}],
        },
      ],
      valid: [],
    })

    ruleTester.run("q-checkbox", interactiveCardElementNesting, {
      invalid: [
        {
          code: `
            <div q-card interactive>
              <label q-checkbox value="agree"></label>
            </div>
          `,
          errors: [{messageId: "noInteractiveChildren"}],
        },
      ],
      valid: [],
    })

    ruleTester.run("q-switch", interactiveCardElementNesting, {
      invalid: [
        {
          code: `
            <div q-card interactive>
              <label q-switch></label>
            </div>
          `,
          errors: [{messageId: "noInteractiveChildren"}],
        },
      ],
      valid: [],
    })

    ruleTester.run("q-radio", interactiveCardElementNesting, {
      invalid: [
        {
          code: `
            <div q-card interactive>
              <label q-radio value="a"></label>
            </div>
          `,
          errors: [{messageId: "noInteractiveChildren"}],
        },
      ],
      valid: [],
    })

    ruleTester.run("q-select-root", interactiveCardElementNesting, {
      invalid: [
        {
          code: `
            <div q-card interactive>
              <div q-select-root></div>
            </div>
          `,
          errors: [{messageId: "noInteractiveChildren"}],
        },
      ],
      valid: [],
    })

    ruleTester.run("q-slider-root", interactiveCardElementNesting, {
      invalid: [
        {
          code: `
            <div q-card interactive>
              <div q-slider-root></div>
            </div>
          `,
          errors: [{messageId: "noInteractiveChildren"}],
        },
      ],
      valid: [],
    })
  })

  describe("invalid: QUI element selectors", () => {
    ruleTester.run("q-text-input element", interactiveCardElementNesting, {
      invalid: [
        {
          code: `
            <div q-card interactive>
              <q-text-input label="Name"></q-text-input>
            </div>
          `,
          errors: [{messageId: "noInteractiveChildren"}],
        },
      ],
      valid: [],
    })

    ruleTester.run("q-select element", interactiveCardElementNesting, {
      invalid: [
        {
          code: `
            <div q-card interactive>
              <q-select label="Choice"></q-select>
            </div>
          `,
          errors: [{messageId: "noInteractiveChildren"}],
        },
      ],
      valid: [],
    })

    ruleTester.run("q-combobox element", interactiveCardElementNesting, {
      invalid: [
        {
          code: `
            <div q-card interactive>
              <q-combobox label="Search"></q-combobox>
            </div>
          `,
          errors: [{messageId: "noInteractiveChildren"}],
        },
      ],
      valid: [],
    })

    ruleTester.run("q-number-input element", interactiveCardElementNesting, {
      invalid: [
        {
          code: `
            <div q-card interactive>
              <q-number-input label="Qty"></q-number-input>
            </div>
          `,
          errors: [{messageId: "noInteractiveChildren"}],
        },
      ],
      valid: [],
    })

    ruleTester.run("q-password-input element", interactiveCardElementNesting, {
      invalid: [
        {
          code: `
            <div q-card interactive>
              <q-password-input label="Secret"></q-password-input>
            </div>
          `,
          errors: [{messageId: "noInteractiveChildren"}],
        },
      ],
      valid: [],
    })

    ruleTester.run("q-slider element", interactiveCardElementNesting, {
      invalid: [
        {
          code: `
            <div q-card interactive>
              <q-slider label="Volume"></q-slider>
            </div>
          `,
          errors: [{messageId: "noInteractiveChildren"}],
        },
      ],
      valid: [],
    })

    ruleTester.run("q-text-area element", interactiveCardElementNesting, {
      invalid: [
        {
          code: `
            <div q-card interactive>
              <q-text-area label="Notes"></q-text-area>
            </div>
          `,
          errors: [{messageId: "noInteractiveChildren"}],
        },
      ],
      valid: [],
    })
  })

  describe("invalid: multiple violations", () => {
    ruleTester.run("two violations", interactiveCardElementNesting, {
      invalid: [
        {
          code: `
            <div q-card interactive>
              <button q-button>Click</button>
              <a href="/page">Link</a>
            </div>
          `,
          errors: [
            {messageId: "noInteractiveChildren"},
            {messageId: "noInteractiveChildren"},
          ],
        },
      ],
      valid: [],
    })
  })

  describe("invalid: interactive card on button element", () => {
    ruleTester.run(
      "button host with nested interactive",
      interactiveCardElementNesting,
      {
        invalid: [
          {
            code: `
              <button q-card interactive>
                <div>
                  <a href="/page">Link</a>
                </div>
              </button>
            `,
            errors: [{messageId: "noInteractiveChildren"}],
          },
        ],
        valid: [],
      },
    )
  })

  describe("valid: non-interactive content", () => {
    ruleTester.run("non-interactive children", interactiveCardElementNesting, {
      invalid: [],
      valid: [
        {
          code: `
            <div q-card interactive>
              <div>
                <span>Text content</span>
                <p>Paragraph</p>
                <img src="/photo.jpg" alt="Photo" />
              </div>
            </div>
          `,
        },
      ],
    })
  })

  describe("valid: q-card without interactive attribute", () => {
    ruleTester.run("no interactive attribute", interactiveCardElementNesting, {
      invalid: [],
      valid: [
        {
          code: `
            <div q-card>
              <button>Click</button>
            </div>
          `,
        },
      ],
    })
  })

  describe("valid: interactive elements outside q-card", () => {
    ruleTester.run("button as sibling", interactiveCardElementNesting, {
      invalid: [],
      valid: [
        {
          code: `
            <div>
              <div q-card interactive>
                <span>Card content</span>
              </div>
              <button>Click</button>
            </div>
          `,
        },
      ],
    })
  })

  describe("valid: not a q-card element", () => {
    ruleTester.run("ignored", interactiveCardElementNesting, {
      invalid: [],
      valid: [
        {
          code: `
            <div interactive>
              <button>Click</button>
            </div>
          `,
        },
      ],
    })
  })
})
