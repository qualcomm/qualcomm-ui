import {defineConfig} from "vitest/config"

export default defineConfig({
  test: {
    css: false,
    include: ["src/**/*.spec.ts"],
    poolOptions: {
      threads: {
        singleThread: true,
      },
    },
  },
})
