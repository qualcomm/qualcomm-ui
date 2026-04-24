import type {CSSProperties, ReactElement, SVGAttributes} from "react"

import {clsx} from "@qualcomm-ui/utils/clsx"
import {useProgressContext} from "@qualcomm-ui/react-core/progress"

import {useProgressCircleContext} from "./progress-circle-context"
import {
  getPixelSize,
  getStrokeDashOffset,
  getStrokeWidthFromSize,
} from "./progress-circle.utils"

/**
 * @public
 * @interface
 */
export interface ProgressCircleCircleProps
  extends SVGAttributes<SVGSVGElement> {
  /**
   * The style applied to the inner circle elements.
   */
  circleStyle?: CSSProperties
}

export function ProgressCircleCircle({
  circleStyle: circleStyleProp,
  className,
  strokeWidth: strokeWidthProp,
  style: styleProp,
  ...props
}: ProgressCircleCircleProps): ReactElement {
  const progressContext = useProgressContext()
  const {size: sizeProp} = useProgressCircleContext()

  const size = getPixelSize(sizeProp)

  const rootStyle = {
    ...styleProp,
    height: size,
    width: size,
  }

  const circleStyle = {
    ...circleStyleProp,
    strokeWidth: strokeWidthProp
      ? `${strokeWidthProp}px`
      : getStrokeWidthFromSize(sizeProp),
  }

  return (
    <svg
      className={clsx("vs-progress-circle--circle", className)}
      style={rootStyle}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle
        className="vs-progress-circle--inner-circle"
        cx="50"
        cy="50"
        r="46"
        style={circleStyle}
      />
      <circle
        className="vs-progress-circle--outer-circle"
        cx="50"
        cy="50"
        r="46"
        style={{
          ...circleStyle,
          strokeDashoffset: getStrokeDashOffset(progressContext.value),
        }}
      />
    </svg>
  )
}
