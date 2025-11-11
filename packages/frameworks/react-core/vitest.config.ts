import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import {defineConfig} from "vitest/config"

import {getReactTestConfig} from "@qualcomm-ui/react-test-utils"

const specMatch = (process.env.SPEC_MATCH ?? "src/**/*.spec.tsx").split(",")

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react({
      babel: {
        plugins: ["babel-plugin-react-compiler"],
      },
    }) as any,
  ],
  test: getReactTestConfig({
    include: specMatch,
  }),
})
