import {Link} from "react-router" // or react-router

import {ApiReference, ApiReferenceProps} from "@qualcomm-ui/react-open-api"

interface ApiDocsProps {
  spec: ApiReferenceProps["document"]
}

export function ApiDocs({spec}: ApiDocsProps) {
  return (
    <ApiReference
      document={spec}
      layout="modern"
      onNavigate={(id: string) => {
        console.debug(`navigate triggered to ${id} (no-op, wire this up)`)
      }}
      renderLink={({href, ...props}) => <Link to={href} {...props} />}
    />
  )
}
