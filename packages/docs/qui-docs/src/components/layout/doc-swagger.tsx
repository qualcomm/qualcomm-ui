import {ReactNode, useCallback} from "react"

import {useLocation} from "react-router"

import {DocLink} from "@qualcomm-ui/react-internal/layout"
import {useTheme} from "@qualcomm-ui/react-router-utils/client"
import {Swagger, SwaggerProps, SwaggerUIProps} from "@qualcomm-ui/react-swagger"

export interface DocSwaggerProps
  extends SwaggerUIProps, Pick<SwaggerProps, "hideTitleSection"> {}

export function DocSwagger({...props}: DocSwaggerProps): ReactNode {
  const [theme] = useTheme()
  const hash = useLocation().hash

  const getHash = useCallback(() => {
    return hash
  }, [hash])

  return (
    <Swagger
      getHash={getHash}
      renderLink={DocLink}
      theme={theme || "dark"}
      {...props}
    />
  )
}
