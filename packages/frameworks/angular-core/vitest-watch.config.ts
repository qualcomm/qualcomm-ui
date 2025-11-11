import angular from "@analogjs/vite-plugin-angular"
import tailwindcss from "@tailwindcss/vite"
import {dirname, resolve} from "node:path"
import {fileURLToPath} from "node:url"
import {defineConfig} from "vite"
import tsconfigPaths from "vite-tsconfig-paths"

const __dirname = dirname(fileURLToPath(import.meta.url))

const specMatch = (process.env.SPEC_MATCH ?? "src/**/*.spec.ts").split(",")

export default defineConfig(({mode}) => ({
  define: {
    "import.meta.vitest": mode !== "production",
  },
  optimizeDeps: {
    include: ["@faker-js/faker"],
  },
  plugins: [
    tailwindcss(),
    angular({
      tsconfig: resolve(__dirname, "./tsconfig.analog-vitest.json"),
    }),
    tsconfigPaths(),
  ],
  test: {
    browser: {
      enabled: true,
      headless: true,
      name: "chromium",
      provider: "playwright",
      providerOptions: {
        context: {actionTimeout: 10000},
      },
      testerHtmlPath: "./src/test-setup.html",
      viewport: {
        height: 500,
        width: 500,
      },
    },
    coverage: {
      exclude: ["src/**/*index.ts", "src/**/*.spec.ts"],
      include: ["src/**/*"],
      provider: "v8",
      reporter: ["html"],
    },
    css: true,
    expect: {
      poll: {
        timeout: 3000,
      },
    },
    globals: true,
    include: specMatch,
    reporters: ["default"],
    setupFiles: ["src/test-setup.ts"],
    testTimeout: 10000,
    watch: true,
  },
}))
