declare module "virtual:qui-demo-scope/auto" {
  import type {ReactDemoWithScope} from "@qualcomm-ui/mdx-common"

  export function getDemo(demoName: string): ReactDemoWithScope
}

declare module "virtual:qui-demo-scope/page:*" {
  import type {ReactDemoWithScope} from "@qualcomm-ui/mdx-common"

  export function getDemo(name: string): ReactDemoWithScope | undefined
}

declare module "virtual:qui-demo-scope/config" {
  export function getReactDemoConfig(): {
    lazyLoadDevModules: boolean
  }
}
