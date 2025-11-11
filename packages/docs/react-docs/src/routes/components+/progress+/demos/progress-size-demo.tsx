import {type ReactElement, useEffect, useState} from "react"

import {Progress} from "@qualcomm-ui/react/progress"

export default function ProgressSizeDemo(): ReactElement {
  const [value, setValue] = useState<number>(10)

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
    <div className="flex w-64 flex-col gap-6">
      {/* preview */}
      <Progress label="sm" size="sm" value={value} />
      <Progress label="md" size="md" value={value} />
      <Progress label="lg" size="lg" value={value} />
      {/* preview */}
    </div>
  )
}
