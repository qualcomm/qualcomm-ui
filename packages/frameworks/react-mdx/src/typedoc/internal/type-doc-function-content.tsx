// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  type ComponentPropsWithRef,
  type MouseEvent,
  type ReactNode,
  useMemo,
} from "react"

import {ExternalLink} from "lucide-react"

import {Link} from "@qualcomm-ui/react/link"
import {CodeHighlight} from "@qualcomm-ui/react-mdx/code-highlight"
import {Github} from "@qualcomm-ui/react-mdx/icons"
import {
  SpoilerContent,
  SpoilerRoot,
  SpoilerSummary,
} from "@qualcomm-ui/react-mdx/spoiler"
import type {QuiComment, SerializedType} from "@qualcomm-ui/typedoc-common"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {
  PropDescriptionBlockTags,
  PropDescriptionSummary,
} from "../prop-description"
import {usePropsLayoutContext} from "../use-props-layout-context"

import {FunctionParamsList} from "./function-params-list"
import {FunctionParamsTable} from "./function-params-table"
import {FunctionReturns} from "./function-returns"

export interface TypeDocFunctionContentProps extends Omit<
  ComponentPropsWithRef<"div">,
  "children"
> {
  comment?: QuiComment
  resolvedType: SerializedType
}

export function TypeDocFunctionContent({
  comment,
  resolvedType,
  ...props
}: TypeDocFunctionContentProps): ReactNode {
  const parameters = resolvedType.functionParameters ?? []
  const {propsLayout} = usePropsLayoutContext()

  const {descriptionComment, exampleTags, returnsTag} = useMemo(() => {
    const blockTags = comment?.blockTags ?? []
    const returns = blockTags.find((tag) => tag.tag === "@returns")
    const examples = blockTags.filter(
      (tag) => tag.tag === "@example" || tag.tag === "@remarks",
    )
    const filtered = blockTags.filter(
      (tag) =>
        tag.tag !== "@returns" &&
        tag.tag !== "@example" &&
        tag.tag !== "@remarks",
    )

    return {
      descriptionComment: comment
        ? {...comment, blockTags: filtered}
        : undefined,
      exampleTags: examples,
      returnsTag: returns,
    }
  }, [comment])

  return (
    <div {...mergeProps({className: "doc-function__root"}, props)}>
      {descriptionComment?.summary?.length ? (
        <div className="doc-function__description doc-props-description__root doc-props__top-level-jsdoc-comment">
          <PropDescriptionSummary summary={descriptionComment.summary} />
          {descriptionComment.blockTags?.length ? (
            <PropDescriptionBlockTags tags={descriptionComment.blockTags} />
          ) : null}
        </div>
      ) : null}

      {resolvedType.url ? (
        <Link
          className="doc-function__source-link"
          endIcon={ExternalLink}
          href={resolvedType.url}
          onClick={(e: MouseEvent) => e.stopPropagation()}
          rel="noreferrer"
          size="sm"
          startIcon={Github}
          target="_blank"
        >
          Source
        </Link>
      ) : null}

      {parameters.length ? (
        propsLayout === "table" ? (
          <>
            <div className="docs-table__wrapper">
              <FunctionParamsTable
                params={parameters}
                returns={
                  <FunctionReturns
                    resolvedType={resolvedType}
                    returnsTag={returnsTag}
                  />
                }
              />
            </div>
            <div className="docs-list-wrapper">
              <FunctionParamsList params={parameters} />
            </div>
          </>
        ) : (
          <FunctionParamsList params={parameters} />
        )
      ) : null}

      {resolvedType.prettyType ? (
        <div className="doc-function__signature">
          <SpoilerRoot>
            <SpoilerSummary>Signature</SpoilerSummary>
            <SpoilerContent>
              <CodeHighlight
                className="doc-function__signature"
                code={resolvedType.prettyType}
                disableCopy
                language="tsx"
              />
            </SpoilerContent>
          </SpoilerRoot>
        </div>
      ) : null}

      {exampleTags.length ? (
        <div className="doc-function__examples doc-props__top-level-jsdoc-comment">
          <PropDescriptionBlockTags tags={exampleTags} />
        </div>
      ) : null}
    </div>
  )
}
