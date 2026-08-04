import {defineConfig} from "vitest/config"

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    css: false,
    include: ["src/**/*.spec.ts"],
  },
})
