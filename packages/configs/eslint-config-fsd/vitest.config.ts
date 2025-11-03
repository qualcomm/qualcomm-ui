import {defineConfig} from "vitest/config"

export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      reporter: ["html"],
    },
    css: false,
    include: ["tests/*.spec.ts"],
    poolOptions: {
      threads: {
        singleThread: true,
      },
    },
    testTimeout: 30000,
  },
})
