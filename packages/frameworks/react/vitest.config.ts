import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import {defineConfig} from "vitest/config"

const specMatchEnv = (process.env.SPEC_MATCH ?? "src/**/*.spec.tsx").split(",")
const testComponent = process.env.TEST_COMPONENT

const specMatch = testComponent
  ? testComponent.split(",").map((c) => `src/${c}/**/*.spec.tsx`)
  : specMatchEnv

export default defineConfig({
  optimizeDeps: {
    include: [
      "@qualcomm-ui/utils/array",
      "lucide-react",
      "react-remove-scroll",
      "react-transition-group",
    ],
  },
  plugins: [
    tailwindcss(),
    react({
      babel: {
        plugins: ["babel-plugin-react-compiler"],
      },
    }) as any,
  ],
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
      provider: "playwright",
      testerHtmlPath: "../react-test-utils/src/react-test-setup.html",
      viewport: {
        height: 500,
        width: 500,
      },
    },
    coverage: {
      allowExternal: true,
      enabled: true,
      exclude: [
        "*.ts",
        "src/legacy/**/*.ts",
        "src/legacy/**/*.tsx",
        "src/index.ts",
        "../react-test-utils/src/index.ts",
        "dist",
      ],
      excludeAfterRemap: true,
      experimentalAstAwareRemapping: true,
      provider: "v8",
      reporter: ["html", "json"],
      reportOnFailure: true,
    },
    css: true,
    exclude: ["src/**/q-*.spec.tsx"],
    expect: {
      poll: {
        timeout: 2500,
      },
    },
    globals: true,
    include: specMatch,
    passWithNoTests: true,
    setupFiles: ["@qualcomm-ui/react-test-utils/src/react-test-setup.ts"],
  },
})
