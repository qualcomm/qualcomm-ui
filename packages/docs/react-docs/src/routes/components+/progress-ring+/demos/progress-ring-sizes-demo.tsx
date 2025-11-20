import {type ReactElement, useEffect, useState} from "react"

import {ProgressRing} from "@qualcomm-ui/react/progress-ring"

export function ProgressRingSizesDemo(): ReactElement {
  const [value, setValue] = useState<number>(0)

  useEffect(() => {
    function increment() {
      setValue((prevValue) => {
        if (prevValue === 100) {
          return 0
        }
        return prevValue + 10
      })
    }
    const timer = setInterval(increment, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex items-center gap-4">
      <div className="grid grid-cols-3 items-center justify-items-center gap-x-8 gap-y-4">
        <div className="font-heading-xs text-neutral-primary">xxs</div>
        <ProgressRing size="xxs" value={value} />
        <ProgressRing size="xxs" />

        <div className="font-heading-xs text-neutral-primary">xs</div>
        <ProgressRing size="xs" value={value} />
        <ProgressRing size="xs" />

        <div className="font-heading-xs text-neutral-primary">sm</div>
        <ProgressRing size="sm" value={value} />
        <ProgressRing size="sm" />

        <div className="font-heading-xs text-neutral-primary">md</div>
        <ProgressRing size="md" value={value} />
        <ProgressRing size="md" />

        <div className="font-heading-xs text-neutral-primary">lg</div>
        <ProgressRing
          size="lg"
          value={value}
          valueText={(api) => `${api.valuePercent}%`}
        />
        <ProgressRing size="lg" />

        <div className="font-heading-xs text-neutral-primary">xl</div>
        <ProgressRing
          size="xl"
          value={value}
          valueText={(api) => `${api.valuePercent}%`}
        />
        <ProgressRing size="xl" />
      </div>
    </div>
  )
}
