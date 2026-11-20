import {
  OperationPage,
  type OperationPageProps,
} from "@qualcomm-ui/react-mdx/open-api"

export {loader} from "@qualcomm-ui/docs-plugin/openapi"

export default function OpenApiRoute(props: OperationPageProps) {
  return <OperationPage {...props} />
}
