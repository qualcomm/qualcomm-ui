import {defineConfig} from "eslint/config"

export default defineConfig({
  rules: {
    "@angular-eslint/template/attributes-order": [
      "error",
      {
        alphabetical: true,
        order: [
          "STRUCTURAL_DIRECTIVE",
          "TEMPLATE_REFERENCE",
          "ATTRIBUTE_BINDING",
          "INPUT_BINDING",
          "TWO_WAY_BINDING",
          "OUTPUT_BINDING",
        ],
      },
    ],
  },
})
