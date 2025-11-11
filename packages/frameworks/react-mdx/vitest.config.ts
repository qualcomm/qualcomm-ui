import react from "@vitejs/plugin-react"
import {defineConfig} from "vitest/config"

import {getReactTestConfig} from "@qualcomm-ui/react-test-utils"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: getReactTestConfig(),
})
