import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import {playwright} from "@vitest/browser-playwright"
import viteTsconfigPaths from "vite-tsconfig-paths"
import {defineConfig} from "vitest/config"

export default defineConfig({
  plugins: [tailwindcss(), viteTsconfigPaths(), react({}) as any],
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
