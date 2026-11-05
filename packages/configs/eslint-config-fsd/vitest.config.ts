import {defineConfig} from "vitest/config"

export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      reporter: ["html"],
    },
    css: false,
    include: ["tests/*.spec.ts"],
    testTimeout: 30000,
  },
})
