import {type ReactElement, useEffect, useState} from "react"

import {ProgressRing} from "@qualcomm-ui/react/progress-ring"

export default function ProgressRingValueTextDemo(): ReactElement {
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
    // preview
    <ProgressRing
      size="lg"
      value={value}
      valueText={(api) => `${api.valuePercent}%`}
    />
    // preview
  )
}
