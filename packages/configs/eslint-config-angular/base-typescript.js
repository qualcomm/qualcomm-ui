import angularEslint from "angular-eslint"
import {defineConfig} from "eslint/config"

export default defineConfig({
  extends: [...angularEslint.configs.tsRecommended],
  name: "qui-angular-base-typescript",
  plugins: {"@angular-eslint": angularEslint.tsPlugin},
  processor: angularEslint.processInlineTemplates,
})
