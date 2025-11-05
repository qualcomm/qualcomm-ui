import angularEslint from "angular-eslint"
import {defineConfig} from "eslint/config"

export default defineConfig({
  extends: [angularEslint.configs.templateRecommended],
})
