import {HTMLAttributes, ReactNode, useState} from "react"

import {ChevronRightIcon, ExternalLinkIcon} from "lucide-react"

import {IconButton} from "@qualcomm-ui/react/button"
import {clsx} from "@qualcomm-ui/utils/clsx"

import {DocLink} from "~components/layout"

LinkOverlayPanel.displayName = "LinkOverlayPanel"

export interface LinkOverlayPanelProps
  extends HTMLAttributes<HTMLAnchorElement> {
  href: string
  target?: string
}

export function LinkOverlayPanel({
  children,
  className,
  href,
  onMouseEnter,
  onMouseLeave,
  ...props
}: LinkOverlayPanelProps): ReactNode {
  const [hover, setHover] = useState(false)

  const isInternalLink = href?.startsWith("/")

  const Element = isInternalLink ? DocLink : "a"

  return (
    <Element
      className={clsx("relative rounded-xl", className)}
      href={href}
      onMouseEnter={(event) => {
        onMouseEnter?.(event)
        setHover(true)
      }}
      onMouseLeave={(event) => {
        onMouseLeave?.(event)
        setHover(false)
      }}
      {...props}
    >
      {children}
      {hover ? (
        <div className="absolute right-2 bottom-2">
          <IconButton
            emphasis="primary"
            icon={isInternalLink ? ChevronRightIcon : ExternalLinkIcon}
            size="sm"
            style={{
              backgroundColor: hover ? "var(--q-button-background-hover)" : "",
            }}
            variant="outline"
          />
        </div>
      ) : null}
    </Element>
  )
}
