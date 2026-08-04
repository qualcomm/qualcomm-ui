// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactNode, useCallback} from "react"

import {Check, Copy, Download} from "lucide-react"

import {Portal} from "@qualcomm-ui/react-core/portal"
import {useSiteContext} from "@qualcomm-ui/react-mdx/context"
import {useCopyToClipboard} from "@qualcomm-ui/react-mdx/copy-to-clipboard"
import {Menu} from "@qualcomm-ui/react/menu"

import {useMdxDocsLayoutContext} from "./use-mdx-docs-layout.js"

export function pathnameToExportId(pathSegments: string[]): string {
  return pathSegments.join("-")
}

export function PageActions(): ReactNode {
  const {exports, getPages, pageMap} = useSiteContext()
  const {pageExport, pathname} = useMdxDocsLayoutContext()
  const page = pageMap[pathname]
  const exportId = pathnameToExportId(page?.pathSegments || [])

  const getExportAsText = useCallback(async (): Promise<string> => {
    if (!pageExport || !exports) {
      return ""
    }
    try {
      const pages = await getPages?.()
      return pages?.pages?.find((p) => p.pathname === pathname)?.content ?? ""
    } catch (error) {
      console.error("Error fetching export Markdown:", error)
      return ""
    }
  }, [pageExport, exports, pathname, getPages])

  const handleDownload = useCallback(async () => {
    const content = await getExportAsText()
    if (!content) {
      return
    }
    const blob = new Blob([content], {type: "text/markdown"})
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${exportId}.md`
    a.click()
    URL.revokeObjectURL(url)
  }, [getExportAsText, exportId])

  const {copyToClipboard, isCopied} = useCopyToClipboard({
    valueOrFn: getExportAsText,
  })

  if (!page || !pageExport || !getPages) {
    return null
  }

  return (
    <div className="qui-docs__page-actions">
      <Menu.Root size="sm">
        <Menu.SplitButton
          endIcon={isCopied ? Check : Copy}
          onClick={copyToClipboard}
          size="sm"
          triggerProps={{"aria-label": "More page actions"}}
          variant="outline"
        >
          Copy Page
        </Menu.SplitButton>
        <Portal>
          <Menu.Positioner>
            <Menu.Content>
              <Menu.Item onClick={copyToClipboard} value="copy-page">
                <Menu.ItemStartIcon icon={Copy} />
                <Menu.ItemLabel>Copy Page</Menu.ItemLabel>
                <Menu.ItemDescription>
                  Copy page as markdown for LLMs
                </Menu.ItemDescription>
              </Menu.Item>
              <Menu.Item
                onClick={() => void handleDownload()}
                value="download-page"
              >
                <Menu.ItemStartIcon icon={Download} />
                <Menu.ItemLabel>Download Page</Menu.ItemLabel>
                <Menu.ItemDescription>
                  Download page as markdown
                </Menu.ItemDescription>
              </Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
    </div>
  )
}
