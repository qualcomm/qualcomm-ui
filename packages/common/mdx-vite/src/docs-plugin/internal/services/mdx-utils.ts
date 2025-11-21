import type {MdxJsxAttribute} from "mdast-util-mdx-jsx"

export function extractNamesFromAttribute(attr: MdxJsxAttribute): string[] {
  if (!attr.value) {
    return []
  }

  if (typeof attr.value === "string") {
    return [attr.value]
  }

  if (attr.value.type === "mdxJsxAttributeValueExpression") {
    const estree = attr.value.data?.estree
    if (!estree?.body?.[0] || estree.body[0].type !== "ExpressionStatement") {
      return []
    }

    const expression = estree.body[0].expression

    if (expression.type === "ArrayExpression") {
      const names: string[] = []
      for (const element of expression.elements) {
        if (element?.type === "Literal" && typeof element.value === "string") {
          names.push(element.value)
        }
      }
      return names
    }

    // Handle single string expression
    if (expression.type === "Literal" && typeof expression.value === "string") {
      return [expression.value]
    }
  }

  return []
}
