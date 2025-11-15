import angular from "@analogjs/vite-plugin-angular"
import tailwindcss from "@tailwindcss/vite"
import {playwright} from "@vitest/browser-playwright"
import {dirname, resolve} from "node:path"
import {fileURLToPath} from "node:url"
import {defineConfig} from "vite"
import tsconfigPaths from "vite-tsconfig-paths"

const __dirname = dirname(fileURLToPath(import.meta.url))

const specMatchEnv = (process.env.SPEC_MATCH ?? "src/**/*.spec.ts").split(",")
const testComponent = process.env.TEST_COMPONENT

const specMatch = testComponent
  ? testComponent.split(",").map((c) => `src/${c}/**/*.spec.ts`)
  : specMatchEnv

export default defineConfig(({mode}) => ({
  define: {
    "import.meta.vitest": mode !== "production",
  },
  optimizeDeps: {
    include: ["@faker-js/faker"],
  },
  plugins: [
    tailwindcss(),
    angular({tsconfig: resolve(__dirname, "./tsconfig.analog-vitest.json")}),
    tsconfigPaths(),
  ],
  test: {
    browser: {
      enabled: true,
      headless: true,
      instances: [
        {
          browser: "chromium",
          locators: {
            testIdAttribute: "data-test-id",
          },
        },
      ],
      provider: playwright({
        actionTimeout: 3000,
      }),
      testerHtmlPath: "./test/test-setup.html",
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
    include: specMatch,
    reporters: ["default"],
    setupFiles: ["test/test-setup.ts"],
  },
}))
