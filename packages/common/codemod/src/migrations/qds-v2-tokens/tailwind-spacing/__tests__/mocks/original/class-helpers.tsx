import {clsx} from "clsx"

const card = clsx("p-qds-40", {"!mx-qds-60": true}, ["md:size-qds-200"])

export function Card({wide}: {wide: boolean}) {
  return <div className={clsx(card, wide ? "w-qds-300" : "w-qds-150")} />
}
