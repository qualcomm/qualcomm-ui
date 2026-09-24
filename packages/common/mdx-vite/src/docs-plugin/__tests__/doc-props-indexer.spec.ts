// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {describe, expect, test} from "vitest"

import type {PagePropType} from "@qualcomm-ui/mdx-common"
import type {
  QuiPropDeclaration,
  QuiPropTypes,
} from "@qualcomm-ui/typedoc-common"

import {DocPropsIndexer} from "../doc-props/doc-props-indexer"

function createProp(name: string): QuiPropDeclaration {
  return {
    name,
    resolvedType: {
      name,
      prettyType: "boolean",
      type: "boolean",
    },
  }
}

describe("DocPropsIndexer", () => {
  test("lookup-only component reflections do not reserve prop ids", () => {
    const closeOnSelect = createProp("closeOnSelect")
    const locale = createProp("locale")
    const props: Record<string, QuiPropTypes> = {
      DatePicker: {
        comment: {summary: [{kind: "text", text: "Date picker."}]},
        name: "DatePicker",
        resolvedType: {
          functionParameters: [closeOnSelect, locale],
          name: "DatePicker",
          prettyType: "() => ReactElement",
          type: "signature",
        },
      },
      DatePickerProps: {
        name: "DatePickerProps",
        props: [createProp("presets"), closeOnSelect, locale],
      },
      DatePickerRoot: {
        name: "DatePickerRoot",
      },
      DatePickerRootProps: {
        name: "DatePickerRootProps",
        props: [closeOnSelect, locale],
      },
    }
    const indexer = new DocPropsIndexer(props)
    const sections = indexer.build(
      [
        '<TypeDocProps name="DatePickerProps" omitFrom="DatePickerRootProps" />',
        '<TypeDocProps name="DatePickerRootProps" />',
      ].join("\n"),
      [{headingLevel: 3, id: "locale", tagName: "h3", textContent: "Locale"}],
    )

    expect(sections?.map((section) => section.heading?.id)).toEqual([
      "presets",
      "closeOnSelect",
      "locale-1",
    ])
    expect(indexer.getDocProps().DatePicker.comment).toEqual(
      props.DatePicker.comment,
    )
    expect(indexer.getDocProps().DatePicker.props).toBeUndefined()
    const rootProps = indexer.getDocProps().DatePickerRootProps
      .props as PagePropType[]
    expect(rootProps.map(({id}) => id)).toEqual(["closeOnSelect", "locale-1"])
  })

  test("lookup-only entries do not overwrite explicitly indexed components", () => {
    const value = createProp("value")
    const props: Record<string, QuiPropTypes> = {
      Widget: {
        name: "Widget",
        resolvedType: {
          functionParameters: [value],
          name: "Widget",
          prettyType: "() => ReactElement",
          type: "signature",
        },
      },
      WidgetProps: {
        name: "WidgetProps",
        props: [value],
      },
    }
    const indexer = new DocPropsIndexer(props)

    indexer.build(
      [
        '<TypeDocProps name="Widget" />',
        '<TypeDocProps name="WidgetProps" />',
      ].join("\n"),
      [],
    )

    expect(
      indexer.getDocProps().Widget.resolvedType?.functionParameters?.[0],
    ).toMatchObject({id: "value"})
  })

  test("a lookup-only entry does not inherit props indexed by a previous page", () => {
    const value = createProp("value")
    const props: Record<string, QuiPropTypes> = {
      Widget: {
        comment: {summary: [{kind: "text", text: "Widget."}]},
        name: "Widget",
        resolvedType: {
          functionParameters: [value],
          name: "Widget",
          prettyType: "() => ReactElement",
          type: "signature",
        },
      },
      WidgetProps: {
        name: "WidgetProps",
        props: [value],
      },
    }
    const indexer = new DocPropsIndexer(props)

    indexer.build('<TypeDocProps name="Widget" />', [])
    expect(
      indexer.getDocProps().Widget.resolvedType?.functionParameters,
    ).toBeDefined()

    // A later page references only `WidgetProps`, which indexes `Widget` as
    // lookup-only. It must get the lean entry, not the previous page's.
    indexer.reset()
    indexer.build('<TypeDocProps name="WidgetProps" />', [])

    expect(indexer.getDocProps().Widget).toEqual({
      comment: props.Widget.comment,
      name: "Widget",
    })
  })
})
