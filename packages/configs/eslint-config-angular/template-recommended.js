import angularEslint from "angular-eslint"
import oxfmtPlugin from "eslint-plugin-oxfmt"
import {defineConfig} from "eslint/config"

export default defineConfig({
  extends: [
    angularEslint.configs.templateRecommended,
    oxfmtPlugin.configs.recommendedWithoutParser,
  ],
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
    "@angular-eslint/template/prefer-self-closing-tags": "error",
    "oxfmt/oxfmt": "error",
  },
})
