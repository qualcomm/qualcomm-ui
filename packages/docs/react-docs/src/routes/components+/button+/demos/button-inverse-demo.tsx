import {Button} from "@qualcomm-ui/react/button"

export function ButtonInverseDemo() {
  return (
    <div className="bg-neutral-10 flex gap-8 rounded-md p-3">
      {/* preview */}
      <Button emphasis="inverse" variant="fill">
        Action
      </Button>
      <Button emphasis="inverse" variant="outline">
        Action
      </Button>
      <Button emphasis="inverse" variant="ghost">
        Action
      </Button>
      {/* preview */}
    </div>
  )
}
