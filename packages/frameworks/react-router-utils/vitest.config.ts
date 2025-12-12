import {defineConfig} from "vitest/config"

export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      reporter: ["html"],
    },
    css: false,
    include: ["src/**/*.spec.ts"],
  },
})
