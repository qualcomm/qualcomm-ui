declare module "virtual:angular-demo-registry" {
  import type {AngularDemoInfo} from "@qualcomm-ui/mdx-common"

  export function getAngularDemoInfo(demoId: string): AngularDemoInfo | null
}
