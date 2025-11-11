// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

/**
 * A shiki theme based on my preferred editor settings.
 */
export const quiCustomDarkTheme: Record<string, any> = {
  colors: {
    "activityBar.background": "#0F1013",
    "activityBarBadge.background": "#1D978D",
    "button.background": "#0077B5",
    "button.foreground": "#FFF",
    "button.hoverBackground": "#005076",
    "debugExceptionWidget.background": "#141414",
    "debugExceptionWidget.border": "#FFF",
    "debugToolBar.background": "#141414",
    "editor.background": "#0F1013",
    "editor.foreground": "#d2d2d2",
    "editor.inactiveSelectionBackground": "#3a3d41",
    "editor.lineHighlightBackground": "#141414",
    "editor.lineHighlightBorder": "#141414",
    "editor.selectionHighlightBackground": "#add6ff26",
    "editorIndentGuide.activeBackground": "#707070",
    "editorIndentGuide.background": "#404040",
    "editorLink.activeForeground": "#0077B5",
    "editorSuggestWidget.selectedBackground": "#0077B5",
    "extensionButton.prominentBackground": "#0077B5",
    "extensionButton.prominentForeground": "#FFF",
    "extensionButton.prominentHoverBackground": "#005076",
    focusBorder: "#0077B5",
    "gitDecoration.addedResourceForeground": "#ECB22E",
    "gitDecoration.conflictingResourceForeground": "#FFF",
    "gitDecoration.deletedResourceForeground": "#FFF",
    "gitDecoration.ignoredResourceForeground": "#877583",
    "gitDecoration.modifiedResourceForeground": "#ECB22E",
    "gitDecoration.untrackedResourceForeground": "#ECB22E",
    "input.placeholderForeground": "#7A7A7A",
    "list.activeSelectionBackground": "#0F1013",
    "list.dropBackground": "#383b3d",
    "list.focusBackground": "#0077B5",
    "list.hoverBackground": "#0F1013",
    "menu.background": "#252526",
    "menu.foreground": "#E6E6E6",
    "notificationLink.foreground": "#0077B5",
    "settings.numberInputBackground": "#292929",
    "settings.textInputBackground": "#292929",
    "sideBarSectionHeader.background": "#0F1013",
    "sideBarTitle.foreground": "#E6E6E6",
    "statusBar.background": "#0F1013",
    "statusBar.debuggingBackground": "#1D978D",
    "statusBar.noFolderBackground": "#141414",
    "textLink.activeForeground": "#0077B5",
    "textLink.foreground": "#0077B5",
    "titleBar.activeBackground": "#0F1013",
    "titleBar.activeForeground": "#E6E6E6",
    "titleBar.inactiveBackground": "#0F1013",
    "titleBar.inactiveForeground": "#7A7A7A",
  },
  displayName: "Qualcomm Dark",
  name: "qualcomm-dark",
  tokenColors: [
    {
      scope: ["meta.embedded", "source.groovy.embedded"],
      settings: {
        foreground: "#D4D4D4",
      },
    },
    {
      scope: "emphasis",
      settings: {
        fontStyle: "italic",
      },
    },
    {
      scope: "strong",
      settings: {
        fontStyle: "bold",
      },
    },
    {
      scope: "header",
      settings: {
        foreground: "#000080",
      },
    },
    {
      scope: "comment",
      settings: {
        foreground: "#6A9955",
      },
    },
    {
      scope: "constant.language",
      settings: {
        foreground: "#739ed6",
      },
    },
    {
      scope: ["constant.numeric"],
      settings: {
        foreground: "#b5cea8",
      },
    },
    {
      scope: "constant.regexp",
      settings: {
        foreground: "#646695",
      },
    },
    {
      scope: "entity.name.tag",
      settings: {
        foreground: "#e0d4a0",
      },
    },
    {
      scope: "entity.name.tag.css",
      settings: {
        foreground: "#d7ba7d",
      },
    },
    {
      scope: "entity.other.attribute-name",
      settings: {
        foreground: "#a9b9d4",
      },
    },
    {
      scope: [
        "entity.other.attribute-name.class.css",
        "entity.other.attribute-name.class.mixin.css",
        "entity.other.attribute-name.id.css",
        "entity.other.attribute-name.parent-selector.css",
        "entity.other.attribute-name.pseudo-class.css",
        "entity.other.attribute-name.pseudo-element.css",
        "source.css.less entity.other.attribute-name.id",
        "entity.other.attribute-name.attribute.scss",
        "entity.other.attribute-name.scss",
      ],
      settings: {
        foreground: "#d7ba7d",
      },
    },
    {
      scope: "invalid",
      settings: {
        foreground: "#f44747",
      },
    },
    {
      scope: "markup.underline",
      settings: {
        fontStyle: "underline",
      },
    },
    {
      scope: "markup.bold",
      settings: {
        fontStyle: "bold",
        foreground: "#739ed6",
      },
    },
    {
      scope: "markup.heading",
      settings: {
        fontStyle: "bold",
        foreground: "#739ed6",
      },
    },
    {
      scope: "markup.italic",
      settings: {
        fontStyle: "italic",
      },
    },
    {
      scope: "markup.inserted",
      settings: {
        foreground: "#b5cea8",
      },
    },
    {
      scope: "markup.deleted",
      settings: {
        foreground: "#d09d71",
      },
    },
    {
      scope: "markup.changed",
      settings: {
        foreground: "#739ed6",
      },
    },
    {
      scope: "punctuation.definition.quote.begin.markdown",
      settings: {
        foreground: "#6A9955",
      },
    },
    {
      scope: "punctuation.definition.list.begin.markdown",
      settings: {
        foreground: "#6796e6",
      },
    },
    {
      scope: "markup.inline.raw",
      settings: {
        foreground: "#d09d71",
      },
    },
    {
      scope: [
        "punctuation.definition.tag",
        "punctuation.definition.bracket.curly.begin.jsdoc",
        "punctuation.definition.bracket.curly.end.jsdoc",
        "storage.type.function.arrow",
      ],
      settings: {
        foreground: "#babbb8",
      },
    },
    {
      scope: "meta.preprocessor",
      settings: {
        foreground: "#739ed6",
      },
    },
    {
      scope: "meta.preprocessor.string",
      settings: {
        foreground: "#d09d71",
      },
    },
    {
      scope: "meta.preprocessor.numeric",
      settings: {
        foreground: "#b5cea8",
      },
    },
    {
      scope: "meta.structure.dictionary.key.python",
      settings: {
        foreground: "#a9b9d4",
      },
    },
    {
      scope: "meta.diff.header",
      settings: {
        foreground: "#739ed6",
      },
    },
    {
      scope: "storage",
      settings: {
        foreground: "#739ed6",
      },
    },
    {
      scope: "storage.type",
      settings: {
        foreground: "#739ed6",
      },
    },
    {
      scope: "storage.modifier",
      settings: {
        foreground: "#739ed6",
      },
    },
    {
      scope: "string",
      settings: {
        foreground: "#d9b770",
      },
    },
    {
      scope: "string.tag",
      settings: {
        foreground: "#d09d71",
      },
    },
    {
      scope: "string.value",
      settings: {
        foreground: "#d09d71",
      },
    },
    {
      scope: "string.regexp",
      settings: {
        foreground: "#d16969",
      },
    },
    {
      scope: [
        "punctuation.definition.template-expression.begin",
        "punctuation.definition.template-expression.end",
        "punctuation.section.embedded",
      ],
      settings: {
        foreground: "#739ed6",
      },
    },
    {
      scope: ["meta.template.expression"],
      settings: {
        foreground: "#d4d4d4",
      },
    },
    {
      scope: [
        "support.type.vendored.property-name",
        "support.type.property-name",
        "variable.css",
        "variable.scss",
        "variable.other.less",
        "source.coffee.embedded",
      ],
      settings: {
        foreground: "#a9b9d4",
      },
    },
    {
      scope: "keyword",
      settings: {
        foreground: "#739ed6",
      },
    },
    {
      scope: "keyword.control",
      settings: {
        foreground: "#739ed6",
      },
    },
    {
      scope: "keyword.operator",
      settings: {
        foreground: "#d4d4d4",
      },
    },
    {
      scope: [
        "keyword.operator.new",
        "keyword.operator.expression",
        "keyword.operator.cast",
        "keyword.operator.sizeof",
        "keyword.operator.instanceof",
        "keyword.operator.logical.python",
      ],
      settings: {
        foreground: "#739ed6",
      },
    },
    {
      scope: "keyword.other.unit",
      settings: {
        foreground: "#b5cea8",
      },
    },
    {
      scope: [
        "punctuation.section.embedded.begin.php",
        "punctuation.section.embedded.end.php",
      ],
      settings: {
        foreground: "#739ed6",
      },
    },
    {
      scope: "support.function.git-rebase",
      settings: {
        foreground: "#a9b9d4",
      },
    },
    {
      scope: "constant.sha.git-rebase",
      settings: {
        foreground: "#b5cea8",
      },
    },
    {
      scope: [
        "storage.modifier.import.java",
        "variable.language.wildcard.java",
        "storage.modifier.package.java",
      ],
      settings: {
        foreground: "#d4d4d4",
      },
    },
    {
      scope: "variable.language",
      settings: {
        foreground: "#739ed6",
      },
    },
    {
      scope: ["meta.return-type", "support.type", "entity.name.type"],
      settings: {
        foreground: "#739ed6",
      },
    },
    {
      scope: [
        "entity.name.function",
        "support.function",
        "support.constant.handlebars",
        "entity.name.type.class",
      ],
      settings: {
        foreground: "#DCDCAA",
      },
    },
    {
      scope: [
        "storage.type.numeric.go",
        "storage.type.byte.go",
        "storage.type.boolean.go",
        "storage.type.string.go",
        "storage.type.uintptr.go",
        "storage.type.error.go",
        "storage.type.rune.go",
        "storage.type.cs",
        "storage.type.generic.cs",
        "storage.type.modifier.cs",
        "storage.type.variable.cs",
        "storage.type.annotation.java",
        "storage.type.generic.java",
        "storage.type.java",
        "storage.type.object.array.java",
        "storage.type.primitive.array.java",
        "storage.type.primitive.java",
        "storage.type.token.java",
        "storage.type.groovy",
        "storage.type.annotation.groovy",
        "storage.type.parameters.groovy",
        "storage.type.generic.groovy",
        "storage.type.object.array.groovy",
        "storage.type.primitive.array.groovy",
        "storage.type.primitive.groovy",
      ],
      settings: {
        foreground: "#4EC9B0",
      },
    },
    {
      scope: [
        "meta.type.cast.expr",
        "meta.type.new.expr",
        "support.constant.math",
        "support.constant.dom",
        "support.constant.json",
        "entity.other.inherited-class",
      ],
      settings: {
        foreground: "#4EC9B0",
      },
    },
    {
      scope: "keyword.control",
      settings: {
        foreground: "#C586C0",
      },
    },
    {
      scope: [
        "variable.language.this.ts",
        "keyword.control",
        "storage.modifier",
        "storage.type",
        "constant.language",
        "support.type.primitive.ts",
        "support.type.primitive.tsx",
        "keyword.operator.typeof.js",
        "keyword.operator.logical.js",
        "keyword.operator.in.js",
        "keyword.operator.expression",
        "variable.language.super",
      ],
      settings: {
        foreground: "#739ed6",
      },
    },
    {
      scope: [
        "punctuation.definition.block.ts",
        "punctuation.definition.binding-pattern.object.ts",
        "meta.parameter.object-binding-pattern.ts",
        "meta.block.ts",
        "punctuation.section.embedded.begin.tsx",
        "punctuation.section.embedded.end.tsx",
      ],
      settings: {
        foreground: "#d4d4d4",
      },
    },
    {
      scope: ["entity.name.variable"],
      settings: {
        foreground: "#B6A9D4",
      },
    },
    {
      scope: [
        "variable.other.object",
        "variable.other.constant",
        "variable.object.property",
      ],
      settings: {
        foreground: "#c2c2c2",
      },
    },
    {
      scope: [
        "entity.name.type",
        "entity.name.type.interface",
        "meta.var.expr.ts",
      ],
      settings: {
        foreground: "#d4c4a9",
      },
    },
    {
      scope: ["variable"],
      settings: {
        foreground: "#c2c2c2",
      },
    },
    {
      scope: [
        "variable.other.property.ts",
        "variable.other.property.tsx",
        "variable.other.object.property.ts",
        "variable.other.object.property.tsx",
      ],
      settings: {
        foreground: "#B6A9D4",
      },
    },
    {
      scope: ["variable.parameter"],
      settings: {
        foreground: "#a9b9d4",
      },
    },
    {
      scope: ["meta.object-literal.key"],
      settings: {
        foreground: "#a9b9d4",
      },
    },
    {
      scope: [
        "support.constant.property-value",
        "support.constant.font-name",
        "support.constant.media-type",
        "support.constant.media",
        "constant.other.color.rgb-value",
        "constant.other.rgb-value",
        "support.constant.color",
      ],
      settings: {
        foreground: "#ccac67",
      },
    },
    {
      scope: [
        "punctuation.definition.group.regexp",
        "punctuation.definition.group.assertion.regexp",
        "punctuation.definition.character-class.regexp",
        "punctuation.character.set.begin.regexp",
        "punctuation.character.set.end.regexp",
        "keyword.operator.negation.regexp",
        "support.other.parenthesis.regexp",
      ],
      settings: {
        foreground: "#ccac67",
      },
    },
    {
      scope: [
        "constant.character.character-class.regexp",
        "constant.other.character-class.set.regexp",
        "constant.other.character-class.regexp",
        "constant.character.set.regexp",
      ],
      settings: {
        foreground: "#d16969",
      },
    },
    {
      scope: ["keyword.operator.or.regexp", "keyword.control.anchor.regexp"],
      settings: {
        foreground: "#DCDCAA",
      },
    },
    {
      scope: "keyword.operator.quantifier.regexp",
      settings: {
        foreground: "#d7ba7d",
      },
    },
    {
      scope: "constant.character",
      settings: {
        foreground: "#739ed6",
      },
    },
    {
      scope: "constant.character.escape",
      settings: {
        foreground: "#d7ba7d",
      },
    },
    {
      scope: "token.info-token",
      settings: {
        foreground: "#6796e6",
      },
    },
    {
      scope: "token.warn-token",
      settings: {
        foreground: "#cd9731",
      },
    },
    {
      scope: "token.error-token",
      settings: {
        foreground: "#f44747",
      },
    },
    {
      scope: "token.debug-token",
      settings: {
        foreground: "#b267e6",
      },
    },
  ],
  type: "dark",
}
