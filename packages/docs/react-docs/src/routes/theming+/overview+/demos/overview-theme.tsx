import type {ReactNode} from "react"

import {Moon, Sun} from "lucide-react"

import {Button} from "@qualcomm-ui/react/button"
import {Theme, useTheme} from "@qualcomm-ui/react-router-utils/client"

// This site is based on react-router and uses `@qualcomm-ui/react-router-utils` to manage
// the active theme.
export default function OverviewTheme(): ReactNode {
  const [theme, setTheme] = useTheme()

  return (
    <div className="flex flex-col gap-4">
      <div className="dark" data-brand="qualcomm" data-theme="dark">
        <div className="border-neutral-03 bg-neutral-01 flex w-full rounded-sm border px-3 py-2">
          <span className="text-neutral-primary">
            This section will always feature the dark theme regardless of the
            active theme.
          </span>
        </div>
      </div>

      <div className="flex justify-center">
        <Button
          emphasis="primary"
          endIcon={theme === Theme.LIGHT ? Sun : Moon}
          onClick={() =>
            setTheme(theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT)
          }
          variant="fill"
        >
          Toggle Site Theme
        </Button>
      </div>
    </div>
  )
}
