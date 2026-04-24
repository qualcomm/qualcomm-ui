/**
 * Virtual module for qui-docs site data, only accessible in vite runtime context.
 */
declare module "@qualcomm-ui/mdx-vite-plugin" {
  import type {SiteData} from "@qualcomm-ui/mdx-common"

  export const siteData: SiteData
}

/**
 * Virtual module for fetching the QUI Docs config. Only accessible in vite
 * runtime context.
 */
declare module "@qualcomm-ui/docs-plugin/config" {
  import type {ResolvedQuiDocsConfig} from "./types"

  export const quiDocsConfig: ResolvedQuiDocsConfig & {
    /**
     * The resolved cwd of the qui-docs project.
     */
    cwd: string
    /**
     * The Vite publicDir.
     */
    publicDir: string
  }
}

/**
 * Virtual module for markdown content, only accessible in vite runtime context.
 */
declare module "@qualcomm-ui/docs-plugin/markdown-content" {
  import type {KnowledgePages, KnowledgeSections} from "@qualcomm-ui/mdx-common"

  /**
   * Virtual module for markdown content
   */
  export async function getPages(): Promise<KnowledgePages | null>

  /**
   * Virtual module for markdown content
   */
  export async function getSections(): Promise<KnowledgeSections | null>
}
