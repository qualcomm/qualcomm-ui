import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react"

import {
  type ExtractedPreview,
  extractPreviewsAndCleanSource,
} from "../code-demo.utils"

/**
 * @public
 */
export interface UseCodeDemoPreviewProps {
  disableSnippets?: boolean
  initialExpanded: boolean
  sourceCode: string
}

export interface UseCodeDemoPreviewReturn {
  code: string
  expanded: boolean
  hasPreview: boolean
  setExpanded: Dispatch<SetStateAction<boolean>>
  toggleExpanded: () => void
}

/**
 * @deprecated this is handled automatically by the vite plugin backend
 */
export function useCodeDemoPreview({
  disableSnippets,
  initialExpanded,
  sourceCode,
}: UseCodeDemoPreviewProps): UseCodeDemoPreviewReturn {
  const [expanded, setExpanded] = useState(initialExpanded)

  const extractedPreview: ExtractedPreview = useMemo(() => {
    if (disableSnippets) {
      return {sourceWithoutPreviews: sourceCode}
    }
    return extractPreviewsAndCleanSource(sourceCode)
  }, [disableSnippets, sourceCode])

  const code = useMemo(() => {
    return expanded
      ? extractedPreview.sourceWithoutPreviews
      : extractedPreview.formattedPreview || ""
  }, [extractedPreview, expanded])

  const toggleExpanded = useCallback(() => {
    setExpanded((prevState) => !prevState)
  }, [])

  return {
    code,
    expanded,
    hasPreview: !!extractedPreview?.previewBlocks?.length,
    setExpanded,
    toggleExpanded,
  }
}
