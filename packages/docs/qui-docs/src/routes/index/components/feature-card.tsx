import {HTMLAttributes, ReactNode} from "react"

import {clsx} from "@qualcomm-ui/utils/clsx"

FeatureCard.displayName = "FeatureCard"

export interface FeatureCardProps extends HTMLAttributes<HTMLDivElement> {}

export function FeatureCard({
  children,
  className,
  ...props
}: FeatureCardProps): ReactNode {
  return (
    <div
      className={clsx(
        "shadow-medium border-neutral-01 relative rounded-xl border",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
