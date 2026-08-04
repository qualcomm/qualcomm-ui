import babel from "@rolldown/plugin-babel"
import tailwindcss from "@tailwindcss/vite"
import react, {reactCompilerPreset} from "@vitejs/plugin-react"
import {defineConfig} from "vitest/config"

import {getReactTestConfig} from "@qualcomm-ui/react-test-utils"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    babel({
      presets: [reactCompilerPreset()],
    }),
  ],
  resolve: {
    tsconfigPaths: true,
  },
  test: getReactTestConfig(),
})
