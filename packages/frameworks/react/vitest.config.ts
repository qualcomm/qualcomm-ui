import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import {playwright} from "@vitest/browser-playwright"
import {defineConfig} from "vitest/config"

export default defineConfig({
  plugins: [tailwindcss(), react({compiler: true})],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    browser: {
      enabled: true,
      headless: true,
      instances: [
        {
          browser: "chromium",
        },
      ],
      locators: {
        testIdAttribute: "data-test-id",
      },
      provider: playwright(),
      testerHtmlPath: "../react-test-utils/src/react-test-setup.html",
      viewport: {
        height: 500,
        width: 500,
      },
    },
    coverage: {
      allowExternal: true,
      exclude: ["**common/utils/**/*"],
      provider: "v8",
      reportOnFailure: true,
    },
    css: true,
    expect: {
      poll: {
        timeout: 2500,
      },
    },
    globals: true,
    include: ["src/**/*.spec.tsx"],
    passWithNoTests: true,
    setupFiles: ["@qualcomm-ui/react-test-utils/src/react-test-setup.ts"],
  },
})
