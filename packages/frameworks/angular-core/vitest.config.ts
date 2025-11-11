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
      instances: [
        {
          browser: "chromium",
          providerOptions: {
            context: {actionTimeout: 10000},
          },
        },
      ],
      provider: "playwright",
      testerHtmlPath: "./test/test-setup.html",
      viewport: {
        height: 500,
        width: 500,
      },
    },
    coverage: {
      exclude: [
        "src/**/*index.ts",
        "src/**/*.spec.ts",
        "src/types/**",
        // the following components are deprecated
        "src/components/dialog/**",
        "src/components/select/**",
        "src/components/wrap-balancer/**",
      ],
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
    setupFiles: ["test/test-setup.ts"],
  },
}))
