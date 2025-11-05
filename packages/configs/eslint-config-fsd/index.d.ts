import {InfiniteDepthConfigWithExtends} from "typescript-eslint"

declare const configs: {
  layers: InfiniteDepthConfigWithExtends[]
  publicApi: InfiniteDepthConfigWithExtends[]
  segments: InfiniteDepthConfigWithExtends[]
}
export default {configs}
