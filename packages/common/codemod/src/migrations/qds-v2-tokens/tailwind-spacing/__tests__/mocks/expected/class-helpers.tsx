import {clsx} from "clsx"

const card = clsx("p-qds-100", {"!mx-qds-175": true}, ["md:size-qds-1400"])

export function Card({wide}: {wide: boolean}) {
  return <div className={clsx(card, wide ? "w-qds-2400" : "w-qds-900")} />
}
