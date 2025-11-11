import type {ComponentPropsWithRef, ReactNode} from "react"

import type {
  QuiComment,
  QuiPropDeclaration,
  SerializedParameters,
} from "@qualcomm-ui/mdx-docs-common"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {PropDescriptionFunctionArgs} from "./prop-description-function-args"
import {PropDescriptionOptionTags} from "./prop-description-option-tags"
import {PropDescriptionSeeTags} from "./prop-description-see-tags"
import {PropDescriptionSummary} from "./prop-description-summary"

export interface PropDescriptionProps extends ComponentPropsWithRef<"div"> {
  children?: ReactNode
  prop: QuiPropDeclaration
}

export function PropDescription({
  children,
  prop,
  ...props
}: PropDescriptionProps): ReactNode {
  const comment: QuiComment = prop.comment ?? {
    blockTags: [],
    summary: [],
  }

  const deprecatedBlock = comment?.blockTags?.find(
    (tag) => tag.tag === "@deprecated",
  )

  const parameterArgs: Array<SerializedParameters[]> = (
    prop.resolvedType.parameters ?? []
  ).reduce((acc: Array<SerializedParameters[]>, current) => {
    if (current.args) {
      acc.push(current.args)
    }
    return acc
  }, [])

  const optionTags =
    comment.blockTags?.filter((tag) => tag.tag === "@option") ?? []
  const seeTags = comment?.blockTags?.filter((tag) => tag.tag === "@see") ?? []

  if (
    !comment.summary.length &&
    !deprecatedBlock &&
    !optionTags.length &&
    !seeTags.length &&
    !parameterArgs.length &&
    !prop.resolvedType.functionArgs?.length &&
    !prop.resolvedType.parameters?.length &&
    !parameterArgs.length
  ) {
    return null
  }

  const mergedProps = mergeProps(
    {className: "doc-props-description__root"},
    props,
  )

  return (
    <div {...mergedProps}>
      <span>
        <PropDescriptionSummary summary={comment.summary} />
        {deprecatedBlock ? (
          <span>
            Deprecated{" "}
            <PropDescriptionSummary summary={deprecatedBlock.content} />
          </span>
        ) : null}

        {prop.resolvedType.functionArgs ? (
          <PropDescriptionFunctionArgs
            functionArgs={prop.resolvedType.functionArgs}
          />
        ) : null}

        {prop.resolvedType.parameters &&
        prop.resolvedType.baseType === "reflection" ? (
          <PropDescriptionFunctionArgs
            functionArgs={prop.resolvedType.parameters}
          />
        ) : null}

        {parameterArgs.length
          ? parameterArgs.map((args, index) => {
              return (
                <div key={`${prop.name}-parameter-function-args-${index}`}>
                  <PropDescriptionFunctionArgs functionArgs={args} />
                </div>
              )
            })
          : null}
      </span>

      {optionTags.length ? (
        <PropDescriptionOptionTags tags={optionTags} />
      ) : null}

      {seeTags.length ? <PropDescriptionSeeTags seeTags={seeTags} /> : null}

      {children}
    </div>
  )
}
