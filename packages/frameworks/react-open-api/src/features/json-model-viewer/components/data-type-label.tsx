import type {FC} from "react"

export type DataLabelProps = {
  dataType: string
  enable?: boolean
}

export const DataTypeLabel: FC<DataLabelProps> = ({
  dataType,
  enable = true,
}) => {
  if (!enable) {
    return null
  }

  return <div className="data-type-label">{dataType}</div>
}
