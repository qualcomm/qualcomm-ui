import react from "@vitejs/plugin-react"
import {defineConfig} from "vitest/config"

import {getReactTestConfig} from "@qualcomm-ui/react-test-utils"

const testConfig = getReactTestConfig()

export default defineConfig({
  plugins: [react({compiler: true})],
  resolve: {tsconfigPaths: true},
  test: {
    ...testConfig,
    browser: {
      ...testConfig.browser,
      testerHtmlPath: "./test/index.html",
    },
    setupFiles: [],
  },
})
