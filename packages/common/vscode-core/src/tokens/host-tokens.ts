// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

export interface VscodeHostToken {
  /** Kebab-case name used by the NextGen utility adapter. */
  name: string
  /** CSS custom property supplied by the VS Code host. */
  variable: string
}

/** Color mappings carried forward from the legacy VS Code Tailwind registry. */
export const hostColorTokens: readonly VscodeHostToken[] = [
  {
    name: "action-bar-toggled-background",
    variable: "--vscode-actionBar-toggledBackground",
  },
  {
    name: "activity-bar-active-background",
    variable: "--vscode-activityBar-activeBackground",
  },
  {
    name: "activity-bar-active-border",
    variable: "--vscode-activityBar-activeBorder",
  },
  {
    name: "activity-bar-active-focus-border",
    variable: "--vscode-activityBar-activeFocusBorder",
  },
  {
    name: "activity-bar-background",
    variable: "--vscode-activityBar-background",
  },
  {
    name: "activity-bar-badge-background",
    variable: "--vscode-activityBarBadge-background",
  },
  {
    name: "activity-bar-badge-foreground",
    variable: "--vscode-activityBarBadge-foreground",
  },
  {name: "activity-bar-border", variable: "--vscode-activityBar-border"},
  {
    name: "activity-bar-drop-border",
    variable: "--vscode-activityBar-dropBorder",
  },
  {
    name: "activity-bar-foreground",
    variable: "--vscode-activityBar-foreground",
  },
  {
    name: "activity-bar-inactive-foreground",
    variable: "--vscode-activityBar-inactiveForeground",
  },
  {
    name: "activity-bar-top-active-background",
    variable: "--vscode-activityBarTop-activeBackground",
  },
  {
    name: "activity-bar-top-active-border",
    variable: "--vscode-activityBarTop-activeBorder",
  },
  {
    name: "activity-bar-top-background",
    variable: "--vscode-activityBarTop-background",
  },
  {
    name: "activity-bar-top-drop-border",
    variable: "--vscode-activityBarTop-dropBorder",
  },
  {
    name: "activity-bar-top-foreground",
    variable: "--vscode-activityBarTop-foreground",
  },
  {
    name: "activity-bar-top-inactive-foreground",
    variable: "--vscode-activityBarTop-inactiveForeground",
  },
  {
    name: "activity-error-badge-background",
    variable: "--vscode-activityErrorBadge-background",
  },
  {
    name: "activity-error-badge-foreground",
    variable: "--vscode-activityErrorBadge-foreground",
  },
  {
    name: "activity-warning-badge-background",
    variable: "--vscode-activityWarningBadge-background",
  },
  {
    name: "activity-warning-badge-foreground",
    variable: "--vscode-activityWarningBadge-foreground",
  },
  {name: "badge-background", variable: "--vscode-badge-background"},
  {name: "badge-foreground", variable: "--vscode-badge-foreground"},
  {name: "banner-background", variable: "--vscode-banner-background"},
  {name: "banner-foreground", variable: "--vscode-banner-foreground"},
  {name: "banner-icon-foreground", variable: "--vscode-banner-iconForeground"},
  {
    name: "breadcrumb-active-selection-foreground",
    variable: "--vscode-breadcrumb-activeSelectionForeground",
  },
  {name: "breadcrumb-background", variable: "--vscode-breadcrumb-background"},
  {
    name: "breadcrumb-focus-foreground",
    variable: "--vscode-breadcrumb-focusForeground",
  },
  {name: "breadcrumb-foreground", variable: "--vscode-breadcrumb-foreground"},
  {
    name: "breadcrumb-picker-background",
    variable: "--vscode-breadcrumbPicker-background",
  },
  {name: "button-background", variable: "--vscode-button-background"},
  {name: "button-border", variable: "--vscode-button-border"},
  {name: "button-foreground", variable: "--vscode-button-foreground"},
  {
    name: "button-hover-background",
    variable: "--vscode-button-hoverBackground",
  },
  {
    name: "button-secondary-background",
    variable: "--vscode-button-secondaryBackground",
  },
  {
    name: "button-secondary-foreground",
    variable: "--vscode-button-secondaryForeground",
  },
  {
    name: "button-secondary-hover-background",
    variable: "--vscode-button-secondaryHoverBackground",
  },
  {name: "button-separator", variable: "--vscode-button-separator"},
  {name: "chart-axis", variable: "--vscode-chart-axis"},
  {name: "chart-guide", variable: "--vscode-chart-guide"},
  {name: "chart-line", variable: "--vscode-chart-line"},
  {name: "charts-blue", variable: "--vscode-charts-blue"},
  {name: "charts-foreground", variable: "--vscode-charts-foreground"},
  {name: "charts-green", variable: "--vscode-charts-green"},
  {name: "charts-lines", variable: "--vscode-charts-lines"},
  {name: "charts-orange", variable: "--vscode-charts-orange"},
  {name: "charts-purple", variable: "--vscode-charts-purple"},
  {name: "charts-red", variable: "--vscode-charts-red"},
  {name: "charts-yellow", variable: "--vscode-charts-yellow"},
  {name: "chat-avatar-background", variable: "--vscode-chat-avatarBackground"},
  {name: "chat-avatar-foreground", variable: "--vscode-chat-avatarForeground"},
  {
    name: "chat-edited-file-foreground",
    variable: "--vscode-chat-editedFileForeground",
  },
  {
    name: "chat-request-background",
    variable: "--vscode-chat-requestBackground",
  },
  {name: "chat-request-border", variable: "--vscode-chat-requestBorder"},
  {
    name: "chat-slash-command-background",
    variable: "--vscode-chat-slashCommandBackground",
  },
  {
    name: "chat-slash-command-foreground",
    variable: "--vscode-chat-slashCommandForeground",
  },
  {name: "checkbox-background", variable: "--vscode-checkbox-background"},
  {name: "checkbox-border", variable: "--vscode-checkbox-border"},
  {name: "checkbox-foreground", variable: "--vscode-checkbox-foreground"},
  {
    name: "checkbox-select-background",
    variable: "--vscode-checkbox-selectBackground",
  },
  {name: "checkbox-select-border", variable: "--vscode-checkbox-selectBorder"},
  {
    name: "command-center-active-background",
    variable: "--vscode-commandCenter-activeBackground",
  },
  {
    name: "command-center-active-border",
    variable: "--vscode-commandCenter-activeBorder",
  },
  {
    name: "command-center-active-foreground",
    variable: "--vscode-commandCenter-activeForeground",
  },
  {
    name: "command-center-background",
    variable: "--vscode-commandCenter-background",
  },
  {name: "command-center-border", variable: "--vscode-commandCenter-border"},
  {
    name: "command-center-debugging-background",
    variable: "--vscode-commandCenter-debuggingBackground",
  },
  {
    name: "command-center-foreground",
    variable: "--vscode-commandCenter-foreground",
  },
  {
    name: "command-center-inactive-border",
    variable: "--vscode-commandCenter-inactiveBorder",
  },
  {
    name: "command-center-inactive-foreground",
    variable: "--vscode-commandCenter-inactiveForeground",
  },
  {
    name: "comments-view-resolved-icon",
    variable: "--vscode-commentsView-resolvedIcon",
  },
  {
    name: "comments-view-unresolved-icon",
    variable: "--vscode-commentsView-unresolvedIcon",
  },
  {name: "contrast-active-border", variable: "--vscode-contrastActiveBorder"},
  {name: "contrast-border", variable: "--vscode-contrastBorder"},
  {
    name: "debug-console-error-foreground",
    variable: "--vscode-debugConsole-errorForeground",
  },
  {
    name: "debug-console-info-foreground",
    variable: "--vscode-debugConsole-infoForeground",
  },
  {
    name: "debug-console-input-icon-foreground",
    variable: "--vscode-debugConsoleInputIcon-foreground",
  },
  {
    name: "debug-console-source-foreground",
    variable: "--vscode-debugConsole-sourceForeground",
  },
  {
    name: "debug-console-warning-foreground",
    variable: "--vscode-debugConsole-warningForeground",
  },
  {
    name: "debug-exception-widget-background",
    variable: "--vscode-debugExceptionWidget-background",
  },
  {
    name: "debug-exception-widget-border",
    variable: "--vscode-debugExceptionWidget-border",
  },
  {
    name: "debug-icon-breakpoint-current-stackframe-foreground",
    variable: "--vscode-debugIcon-breakpointCurrentStackframeForeground",
  },
  {
    name: "debug-icon-breakpoint-disabled-foreground",
    variable: "--vscode-debugIcon-breakpointDisabledForeground",
  },
  {
    name: "debug-icon-breakpoint-foreground",
    variable: "--vscode-debugIcon-breakpointForeground",
  },
  {
    name: "debug-icon-breakpoint-stackframe-foreground",
    variable: "--vscode-debugIcon-breakpointStackframeForeground",
  },
  {
    name: "debug-icon-breakpoint-unverified-foreground",
    variable: "--vscode-debugIcon-breakpointUnverifiedForeground",
  },
  {
    name: "debug-icon-continue-foreground",
    variable: "--vscode-debugIcon-continueForeground",
  },
  {
    name: "debug-icon-disconnect-foreground",
    variable: "--vscode-debugIcon-disconnectForeground",
  },
  {
    name: "debug-icon-pause-foreground",
    variable: "--vscode-debugIcon-pauseForeground",
  },
  {
    name: "debug-icon-restart-foreground",
    variable: "--vscode-debugIcon-restartForeground",
  },
  {
    name: "debug-icon-start-foreground",
    variable: "--vscode-debugIcon-startForeground",
  },
  {
    name: "debug-icon-step-back-foreground",
    variable: "--vscode-debugIcon-stepBackForeground",
  },
  {
    name: "debug-icon-step-into-foreground",
    variable: "--vscode-debugIcon-stepIntoForeground",
  },
  {
    name: "debug-icon-step-out-foreground",
    variable: "--vscode-debugIcon-stepOutForeground",
  },
  {
    name: "debug-icon-step-over-foreground",
    variable: "--vscode-debugIcon-stepOverForeground",
  },
  {
    name: "debug-icon-stop-foreground",
    variable: "--vscode-debugIcon-stopForeground",
  },
  {
    name: "debug-token-expression-boolean",
    variable: "--vscode-debugTokenExpression-boolean",
  },
  {
    name: "debug-token-expression-error",
    variable: "--vscode-debugTokenExpression-error",
  },
  {
    name: "debug-token-expression-name",
    variable: "--vscode-debugTokenExpression-name",
  },
  {
    name: "debug-token-expression-number",
    variable: "--vscode-debugTokenExpression-number",
  },
  {
    name: "debug-token-expression-string",
    variable: "--vscode-debugTokenExpression-string",
  },
  {
    name: "debug-token-expression-type",
    variable: "--vscode-debugTokenExpression-type",
  },
  {
    name: "debug-token-expression-value",
    variable: "--vscode-debugTokenExpression-value",
  },
  {
    name: "debug-tool-bar-background",
    variable: "--vscode-debugToolBar-background",
  },
  {name: "debug-tool-bar-border", variable: "--vscode-debugToolBar-border"},
  {
    name: "debug-view-exception-label-background",
    variable: "--vscode-debugView-exceptionLabelBackground",
  },
  {
    name: "debug-view-exception-label-foreground",
    variable: "--vscode-debugView-exceptionLabelForeground",
  },
  {
    name: "debug-view-state-label-background",
    variable: "--vscode-debugView-stateLabelBackground",
  },
  {
    name: "debug-view-state-label-foreground",
    variable: "--vscode-debugView-stateLabelForeground",
  },
  {
    name: "debug-view-value-changed-highlight",
    variable: "--vscode-debugView-valueChangedHighlight",
  },
  {name: "description-foreground", variable: "--vscode-descriptionForeground"},
  {name: "diff-editor-border", variable: "--vscode-diffEditor-border"},
  {
    name: "diff-editor-diagonal-fill",
    variable: "--vscode-diffEditor-diagonalFill",
  },
  {
    name: "diff-editor-gutter-inserted-line-background",
    variable: "--vscode-diffEditorGutter-insertedLineBackground",
  },
  {
    name: "diff-editor-gutter-removed-line-background",
    variable: "--vscode-diffEditorGutter-removedLineBackground",
  },
  {
    name: "diff-editor-inserted-line-background",
    variable: "--vscode-diffEditor-insertedLineBackground",
  },
  {
    name: "diff-editor-inserted-text-background",
    variable: "--vscode-diffEditor-insertedTextBackground",
  },
  {
    name: "diff-editor-inserted-text-border",
    variable: "--vscode-diffEditor-insertedTextBorder",
  },
  {
    name: "diff-editor-move-active-border",
    variable: "--vscode-diffEditor-moveActive-border",
  },
  {
    name: "diff-editor-move-border",
    variable: "--vscode-diffEditor-move-border",
  },
  {
    name: "diff-editor-overview-inserted-foreground",
    variable: "--vscode-diffEditorOverview-insertedForeground",
  },
  {
    name: "diff-editor-overview-removed-foreground",
    variable: "--vscode-diffEditorOverview-removedForeground",
  },
  {
    name: "diff-editor-removed-line-background",
    variable: "--vscode-diffEditor-removedLineBackground",
  },
  {
    name: "diff-editor-removed-text-background",
    variable: "--vscode-diffEditor-removedTextBackground",
  },
  {
    name: "diff-editor-removed-text-border",
    variable: "--vscode-diffEditor-removedTextBorder",
  },
  {
    name: "diff-editor-unchanged-code-background",
    variable: "--vscode-diffEditor-unchangedCodeBackground",
  },
  {
    name: "diff-editor-unchanged-region-background",
    variable: "--vscode-diffEditor-unchangedRegionBackground",
  },
  {
    name: "diff-editor-unchanged-region-foreground",
    variable: "--vscode-diffEditor-unchangedRegionForeground",
  },
  {
    name: "diff-editor-unchanged-region-shadow",
    variable: "--vscode-diffEditor-unchangedRegionShadow",
  },
  {name: "disabled-foreground", variable: "--vscode-disabledForeground"},
  {name: "dropdown-background", variable: "--vscode-dropdown-background"},
  {name: "dropdown-border", variable: "--vscode-dropdown-border"},
  {name: "dropdown-foreground", variable: "--vscode-dropdown-foreground"},
  {
    name: "dropdown-list-background",
    variable: "--vscode-dropdown-listBackground",
  },
  {
    name: "editor-action-list-background",
    variable: "--vscode-editorActionList-background",
  },
  {
    name: "editor-action-list-focus-background",
    variable: "--vscode-editorActionList-focusBackground",
  },
  {
    name: "editor-action-list-focus-foreground",
    variable: "--vscode-editorActionList-focusForeground",
  },
  {
    name: "editor-action-list-foreground",
    variable: "--vscode-editorActionList-foreground",
  },
  {
    name: "editor-active-line-number-foreground",
    variable: "--vscode-editorActiveLineNumber-foreground",
  },
  {name: "editor-background", variable: "--vscode-editor-background"},
  {
    name: "editor-bracket-highlight-foreground1",
    variable: "--vscode-editorBracketHighlight-foreground1",
  },
  {
    name: "editor-bracket-highlight-foreground2",
    variable: "--vscode-editorBracketHighlight-foreground2",
  },
  {
    name: "editor-bracket-highlight-foreground3",
    variable: "--vscode-editorBracketHighlight-foreground3",
  },
  {
    name: "editor-bracket-highlight-foreground4",
    variable: "--vscode-editorBracketHighlight-foreground4",
  },
  {
    name: "editor-bracket-highlight-foreground5",
    variable: "--vscode-editorBracketHighlight-foreground5",
  },
  {
    name: "editor-bracket-highlight-foreground6",
    variable: "--vscode-editorBracketHighlight-foreground6",
  },
  {
    name: "editor-bracket-highlight-unexpected-bracket-foreground",
    variable: "--vscode-editorBracketHighlight-unexpectedBracket-foreground",
  },
  {
    name: "editor-bracket-match-background",
    variable: "--vscode-editorBracketMatch-background",
  },
  {
    name: "editor-bracket-match-border",
    variable: "--vscode-editorBracketMatch-border",
  },
  {
    name: "editor-bracket-pair-guide-active-background1",
    variable: "--vscode-editorBracketPairGuide-activeBackground1",
  },
  {
    name: "editor-bracket-pair-guide-active-background2",
    variable: "--vscode-editorBracketPairGuide-activeBackground2",
  },
  {
    name: "editor-bracket-pair-guide-active-background3",
    variable: "--vscode-editorBracketPairGuide-activeBackground3",
  },
  {
    name: "editor-bracket-pair-guide-active-background4",
    variable: "--vscode-editorBracketPairGuide-activeBackground4",
  },
  {
    name: "editor-bracket-pair-guide-active-background5",
    variable: "--vscode-editorBracketPairGuide-activeBackground5",
  },
  {
    name: "editor-bracket-pair-guide-active-background6",
    variable: "--vscode-editorBracketPairGuide-activeBackground6",
  },
  {
    name: "editor-bracket-pair-guide-background1",
    variable: "--vscode-editorBracketPairGuide-background1",
  },
  {
    name: "editor-bracket-pair-guide-background2",
    variable: "--vscode-editorBracketPairGuide-background2",
  },
  {
    name: "editor-bracket-pair-guide-background3",
    variable: "--vscode-editorBracketPairGuide-background3",
  },
  {
    name: "editor-bracket-pair-guide-background4",
    variable: "--vscode-editorBracketPairGuide-background4",
  },
  {
    name: "editor-bracket-pair-guide-background5",
    variable: "--vscode-editorBracketPairGuide-background5",
  },
  {
    name: "editor-bracket-pair-guide-background6",
    variable: "--vscode-editorBracketPairGuide-background6",
  },
  {
    name: "editor-code-lens-foreground",
    variable: "--vscode-editorCodeLens-foreground",
  },
  {
    name: "editor-comments-widget-range-active-background",
    variable: "--vscode-editorCommentsWidget-rangeActiveBackground",
  },
  {
    name: "editor-comments-widget-range-background",
    variable: "--vscode-editorCommentsWidget-rangeBackground",
  },
  {
    name: "editor-comments-widget-reply-input-background",
    variable: "--vscode-editorCommentsWidget-replyInputBackground",
  },
  {
    name: "editor-comments-widget-resolved-border",
    variable: "--vscode-editorCommentsWidget-resolvedBorder",
  },
  {
    name: "editor-comments-widget-unresolved-border",
    variable: "--vscode-editorCommentsWidget-unresolvedBorder",
  },
  {
    name: "editor-composition-border",
    variable: "--vscode-editor-compositionBorder",
  },
  {
    name: "editor-cursor-background",
    variable: "--vscode-editorCursor-background",
  },
  {
    name: "editor-cursor-foreground",
    variable: "--vscode-editorCursor-foreground",
  },
  {
    name: "editor-error-background",
    variable: "--vscode-editorError-background",
  },
  {name: "editor-error-border", variable: "--vscode-editorError-border"},
  {
    name: "editor-error-foreground",
    variable: "--vscode-editorError-foreground",
  },
  {
    name: "editor-find-match-background",
    variable: "--vscode-editor-findMatchBackground",
  },
  {
    name: "editor-find-match-border",
    variable: "--vscode-editor-findMatchBorder",
  },
  {
    name: "editor-find-match-foreground",
    variable: "--vscode-editor-findMatchForeground",
  },
  {
    name: "editor-find-match-highlight-background",
    variable: "--vscode-editor-findMatchHighlightBackground",
  },
  {
    name: "editor-find-match-highlight-border",
    variable: "--vscode-editor-findMatchHighlightBorder",
  },
  {
    name: "editor-find-match-highlight-foreground",
    variable: "--vscode-editor-findMatchHighlightForeground",
  },
  {
    name: "editor-find-range-highlight-background",
    variable: "--vscode-editor-findRangeHighlightBackground",
  },
  {
    name: "editor-find-range-highlight-border",
    variable: "--vscode-editor-findRangeHighlightBorder",
  },
  {
    name: "editor-focused-stack-frame-highlight-background",
    variable: "--vscode-editor-focusedStackFrameHighlightBackground",
  },
  {name: "editor-fold-background", variable: "--vscode-editor-foldBackground"},
  {
    name: "editor-fold-placeholder-foreground",
    variable: "--vscode-editor-foldPlaceholderForeground",
  },
  {name: "editor-foreground", variable: "--vscode-editor-foreground"},
  {
    name: "editor-ghost-text-background",
    variable: "--vscode-editorGhostText-background",
  },
  {
    name: "editor-ghost-text-border",
    variable: "--vscode-editorGhostText-border",
  },
  {
    name: "editor-ghost-text-foreground",
    variable: "--vscode-editorGhostText-foreground",
  },
  {name: "editor-group-border", variable: "--vscode-editorGroup-border"},
  {
    name: "editor-group-drop-background",
    variable: "--vscode-editorGroup-dropBackground",
  },
  {
    name: "editor-group-drop-into-prompt-background",
    variable: "--vscode-editorGroup-dropIntoPromptBackground",
  },
  {
    name: "editor-group-drop-into-prompt-border",
    variable: "--vscode-editorGroup-dropIntoPromptBorder",
  },
  {
    name: "editor-group-drop-into-prompt-foreground",
    variable: "--vscode-editorGroup-dropIntoPromptForeground",
  },
  {
    name: "editor-group-empty-background",
    variable: "--vscode-editorGroup-emptyBackground",
  },
  {
    name: "editor-group-focused-empty-border",
    variable: "--vscode-editorGroup-focusedEmptyBorder",
  },
  {
    name: "editor-group-header-border",
    variable: "--vscode-editorGroupHeader-border",
  },
  {
    name: "editor-group-header-no-tabs-background",
    variable: "--vscode-editorGroupHeader-noTabsBackground",
  },
  {
    name: "editor-group-header-tabs-background",
    variable: "--vscode-editorGroupHeader-tabsBackground",
  },
  {
    name: "editor-group-header-tabs-border",
    variable: "--vscode-editorGroupHeader-tabsBorder",
  },
  {
    name: "editor-gutter-added-background",
    variable: "--vscode-editorGutter-addedBackground",
  },
  {
    name: "editor-gutter-background",
    variable: "--vscode-editorGutter-background",
  },
  {
    name: "editor-gutter-comment-glyph-foreground",
    variable: "--vscode-editorGutter-commentGlyphForeground",
  },
  {
    name: "editor-gutter-comment-range-foreground",
    variable: "--vscode-editorGutter-commentRangeForeground",
  },
  {
    name: "editor-gutter-comment-unresolved-glyph-foreground",
    variable: "--vscode-editorGutter-commentUnresolvedGlyphForeground",
  },
  {
    name: "editor-gutter-deleted-background",
    variable: "--vscode-editorGutter-deletedBackground",
  },
  {
    name: "editor-gutter-folding-control-foreground",
    variable: "--vscode-editorGutter-foldingControlForeground",
  },
  {
    name: "editor-gutter-modified-background",
    variable: "--vscode-editorGutter-modifiedBackground",
  },
  {name: "editor-hint-border", variable: "--vscode-editorHint-border"},
  {name: "editor-hint-foreground", variable: "--vscode-editorHint-foreground"},
  {
    name: "editor-hover-highlight-background",
    variable: "--vscode-editor-hoverHighlightBackground",
  },
  {
    name: "editor-hover-widget-background",
    variable: "--vscode-editorHoverWidget-background",
  },
  {
    name: "editor-hover-widget-border",
    variable: "--vscode-editorHoverWidget-border",
  },
  {
    name: "editor-hover-widget-foreground",
    variable: "--vscode-editorHoverWidget-foreground",
  },
  {
    name: "editor-hover-widget-highlight-foreground",
    variable: "--vscode-editorHoverWidget-highlightForeground",
  },
  {
    name: "editor-hover-widget-status-bar-background",
    variable: "--vscode-editorHoverWidget-statusBarBackground",
  },
  {
    name: "editor-inactive-selection-background",
    variable: "--vscode-editor-inactiveSelectionBackground",
  },
  {
    name: "editor-indent-guide-active-background",
    variable: "--vscode-editorIndentGuide-activeBackground",
  },
  {
    name: "editor-indent-guide-active-background1",
    variable: "--vscode-editorIndentGuide-activeBackground1",
  },
  {
    name: "editor-indent-guide-active-background2",
    variable: "--vscode-editorIndentGuide-activeBackground2",
  },
  {
    name: "editor-indent-guide-active-background3",
    variable: "--vscode-editorIndentGuide-activeBackground3",
  },
  {
    name: "editor-indent-guide-active-background4",
    variable: "--vscode-editorIndentGuide-activeBackground4",
  },
  {
    name: "editor-indent-guide-active-background5",
    variable: "--vscode-editorIndentGuide-activeBackground5",
  },
  {
    name: "editor-indent-guide-active-background6",
    variable: "--vscode-editorIndentGuide-activeBackground6",
  },
  {
    name: "editor-indent-guide-background",
    variable: "--vscode-editorIndentGuide-background",
  },
  {
    name: "editor-indent-guide-background1",
    variable: "--vscode-editorIndentGuide-background1",
  },
  {
    name: "editor-indent-guide-background2",
    variable: "--vscode-editorIndentGuide-background2",
  },
  {
    name: "editor-indent-guide-background3",
    variable: "--vscode-editorIndentGuide-background3",
  },
  {
    name: "editor-indent-guide-background4",
    variable: "--vscode-editorIndentGuide-background4",
  },
  {
    name: "editor-indent-guide-background5",
    variable: "--vscode-editorIndentGuide-background5",
  },
  {
    name: "editor-indent-guide-background6",
    variable: "--vscode-editorIndentGuide-background6",
  },
  {name: "editor-info-background", variable: "--vscode-editorInfo-background"},
  {name: "editor-info-border", variable: "--vscode-editorInfo-border"},
  {name: "editor-info-foreground", variable: "--vscode-editorInfo-foreground"},
  {
    name: "editor-inlay-hint-background",
    variable: "--vscode-editorInlayHint-background",
  },
  {
    name: "editor-inlay-hint-foreground",
    variable: "--vscode-editorInlayHint-foreground",
  },
  {
    name: "editor-inlay-hint-parameter-background",
    variable: "--vscode-editorInlayHint-parameterBackground",
  },
  {
    name: "editor-inlay-hint-parameter-foreground",
    variable: "--vscode-editorInlayHint-parameterForeground",
  },
  {
    name: "editor-inlay-hint-type-background",
    variable: "--vscode-editorInlayHint-typeBackground",
  },
  {
    name: "editor-inlay-hint-type-foreground",
    variable: "--vscode-editorInlayHint-typeForeground",
  },
  {
    name: "editor-inline-values-background",
    variable: "--vscode-editor-inlineValuesBackground",
  },
  {
    name: "editor-inline-values-foreground",
    variable: "--vscode-editor-inlineValuesForeground",
  },
  {
    name: "editor-light-bulb-ai-foreground",
    variable: "--vscode-editorLightBulbAi-foreground",
  },
  {
    name: "editor-light-bulb-auto-fix-foreground",
    variable: "--vscode-editorLightBulbAutoFix-foreground",
  },
  {
    name: "editor-light-bulb-foreground",
    variable: "--vscode-editorLightBulb-foreground",
  },
  {
    name: "editor-line-highlight-background",
    variable: "--vscode-editor-lineHighlightBackground",
  },
  {
    name: "editor-line-highlight-border",
    variable: "--vscode-editor-lineHighlightBorder",
  },
  {
    name: "editor-line-number-active-foreground",
    variable: "--vscode-editorLineNumber-activeForeground",
  },
  {
    name: "editor-line-number-dimmed-foreground",
    variable: "--vscode-editorLineNumber-dimmedForeground",
  },
  {
    name: "editor-line-number-foreground",
    variable: "--vscode-editorLineNumber-foreground",
  },
  {
    name: "editor-link-active-foreground",
    variable: "--vscode-editorLink-activeForeground",
  },
  {
    name: "editor-linked-editing-background",
    variable: "--vscode-editor-linkedEditingBackground",
  },
  {
    name: "editor-marker-navigation-background",
    variable: "--vscode-editorMarkerNavigation-background",
  },
  {
    name: "editor-marker-navigation-error-background",
    variable: "--vscode-editorMarkerNavigationError-background",
  },
  {
    name: "editor-marker-navigation-error-header-background",
    variable: "--vscode-editorMarkerNavigationError-headerBackground",
  },
  {
    name: "editor-marker-navigation-info-background",
    variable: "--vscode-editorMarkerNavigationInfo-background",
  },
  {
    name: "editor-marker-navigation-info-header-background",
    variable: "--vscode-editorMarkerNavigationInfo-headerBackground",
  },
  {
    name: "editor-marker-navigation-warning-background",
    variable: "--vscode-editorMarkerNavigationWarning-background",
  },
  {
    name: "editor-marker-navigation-warning-header-background",
    variable: "--vscode-editorMarkerNavigationWarning-headerBackground",
  },
  {
    name: "editor-multi-cursor-primary-background",
    variable: "--vscode-editorMultiCursor-primary-background",
  },
  {
    name: "editor-multi-cursor-primary-foreground",
    variable: "--vscode-editorMultiCursor-primary-foreground",
  },
  {
    name: "editor-multi-cursor-secondary-background",
    variable: "--vscode-editorMultiCursor-secondary-background",
  },
  {
    name: "editor-multi-cursor-secondary-foreground",
    variable: "--vscode-editorMultiCursor-secondary-foreground",
  },
  {
    name: "editor-overview-ruler-added-foreground",
    variable: "--vscode-editorOverviewRuler-addedForeground",
  },
  {
    name: "editor-overview-ruler-background",
    variable: "--vscode-editorOverviewRuler-background",
  },
  {
    name: "editor-overview-ruler-border",
    variable: "--vscode-editorOverviewRuler-border",
  },
  {
    name: "editor-overview-ruler-bracket-match-foreground",
    variable: "--vscode-editorOverviewRuler-bracketMatchForeground",
  },
  {
    name: "editor-overview-ruler-comment-foreground",
    variable: "--vscode-editorOverviewRuler-commentForeground",
  },
  {
    name: "editor-overview-ruler-comment-unresolved-foreground",
    variable: "--vscode-editorOverviewRuler-commentUnresolvedForeground",
  },
  {
    name: "editor-overview-ruler-common-content-foreground",
    variable: "--vscode-editorOverviewRuler-commonContentForeground",
  },
  {
    name: "editor-overview-ruler-current-content-foreground",
    variable: "--vscode-editorOverviewRuler-currentContentForeground",
  },
  {
    name: "editor-overview-ruler-deleted-foreground",
    variable: "--vscode-editorOverviewRuler-deletedForeground",
  },
  {
    name: "editor-overview-ruler-error-foreground",
    variable: "--vscode-editorOverviewRuler-errorForeground",
  },
  {
    name: "editor-overview-ruler-find-match-foreground",
    variable: "--vscode-editorOverviewRuler-findMatchForeground",
  },
  {
    name: "editor-overview-ruler-incoming-content-foreground",
    variable: "--vscode-editorOverviewRuler-incomingContentForeground",
  },
  {
    name: "editor-overview-ruler-info-foreground",
    variable: "--vscode-editorOverviewRuler-infoForeground",
  },
  {
    name: "editor-overview-ruler-inline-chat-inserted",
    variable: "--vscode-editorOverviewRuler-inlineChatInserted",
  },
  {
    name: "editor-overview-ruler-inline-chat-removed",
    variable: "--vscode-editorOverviewRuler-inlineChatRemoved",
  },
  {
    name: "editor-overview-ruler-modified-foreground",
    variable: "--vscode-editorOverviewRuler-modifiedForeground",
  },
  {
    name: "editor-overview-ruler-range-highlight-foreground",
    variable: "--vscode-editorOverviewRuler-rangeHighlightForeground",
  },
  {
    name: "editor-overview-ruler-selection-highlight-foreground",
    variable: "--vscode-editorOverviewRuler-selectionHighlightForeground",
  },
  {
    name: "editor-overview-ruler-warning-foreground",
    variable: "--vscode-editorOverviewRuler-warningForeground",
  },
  {
    name: "editor-overview-ruler-word-highlight-foreground",
    variable: "--vscode-editorOverviewRuler-wordHighlightForeground",
  },
  {
    name: "editor-overview-ruler-word-highlight-strong-foreground",
    variable: "--vscode-editorOverviewRuler-wordHighlightStrongForeground",
  },
  {
    name: "editor-overview-ruler-word-highlight-text-foreground",
    variable: "--vscode-editorOverviewRuler-wordHighlightTextForeground",
  },
  {name: "editor-pane-background", variable: "--vscode-editorPane-background"},
  {
    name: "editor-placeholder-foreground",
    variable: "--vscode-editor-placeholder-foreground",
  },
  {
    name: "editor-range-highlight-background",
    variable: "--vscode-editor-rangeHighlightBackground",
  },
  {
    name: "editor-range-highlight-border",
    variable: "--vscode-editor-rangeHighlightBorder",
  },
  {
    name: "editor-ruler-foreground",
    variable: "--vscode-editorRuler-foreground",
  },
  {
    name: "editor-selection-background",
    variable: "--vscode-editor-selectionBackground",
  },
  {
    name: "editor-selection-foreground",
    variable: "--vscode-editor-selectionForeground",
  },
  {
    name: "editor-selection-highlight-background",
    variable: "--vscode-editor-selectionHighlightBackground",
  },
  {
    name: "editor-selection-highlight-border",
    variable: "--vscode-editor-selectionHighlightBorder",
  },
  {
    name: "editor-snippet-final-tabstop-highlight-background",
    variable: "--vscode-editor-snippetFinalTabstopHighlightBackground",
  },
  {
    name: "editor-snippet-final-tabstop-highlight-border",
    variable: "--vscode-editor-snippetFinalTabstopHighlightBorder",
  },
  {
    name: "editor-snippet-tabstop-highlight-background",
    variable: "--vscode-editor-snippetTabstopHighlightBackground",
  },
  {
    name: "editor-snippet-tabstop-highlight-border",
    variable: "--vscode-editor-snippetTabstopHighlightBorder",
  },
  {
    name: "editor-stack-frame-highlight-background",
    variable: "--vscode-editor-stackFrameHighlightBackground",
  },
  {
    name: "editor-sticky-scroll-background",
    variable: "--vscode-editorStickyScroll-background",
  },
  {
    name: "editor-sticky-scroll-border",
    variable: "--vscode-editorStickyScroll-border",
  },
  {
    name: "editor-sticky-scroll-hover-background",
    variable: "--vscode-editorStickyScrollHover-background",
  },
  {
    name: "editor-sticky-scroll-shadow",
    variable: "--vscode-editorStickyScroll-shadow",
  },
  {
    name: "editor-suggest-widget-background",
    variable: "--vscode-editorSuggestWidget-background",
  },
  {
    name: "editor-suggest-widget-border",
    variable: "--vscode-editorSuggestWidget-border",
  },
  {
    name: "editor-suggest-widget-focus-highlight-foreground",
    variable: "--vscode-editorSuggestWidget-focusHighlightForeground",
  },
  {
    name: "editor-suggest-widget-foreground",
    variable: "--vscode-editorSuggestWidget-foreground",
  },
  {
    name: "editor-suggest-widget-highlight-foreground",
    variable: "--vscode-editorSuggestWidget-highlightForeground",
  },
  {
    name: "editor-suggest-widget-selected-background",
    variable: "--vscode-editorSuggestWidget-selectedBackground",
  },
  {
    name: "editor-suggest-widget-selected-foreground",
    variable: "--vscode-editorSuggestWidget-selectedForeground",
  },
  {
    name: "editor-suggest-widget-selected-icon-foreground",
    variable: "--vscode-editorSuggestWidget-selectedIconForeground",
  },
  {
    name: "editor-suggest-widget-status-foreground",
    variable: "--vscode-editorSuggestWidgetStatus-foreground",
  },
  {
    name: "editor-symbol-highlight-background",
    variable: "--vscode-editor-symbolHighlightBackground",
  },
  {
    name: "editor-symbol-highlight-border",
    variable: "--vscode-editor-symbolHighlightBorder",
  },
  {
    name: "editor-unicode-highlight-background",
    variable: "--vscode-editorUnicodeHighlight-background",
  },
  {
    name: "editor-unicode-highlight-border",
    variable: "--vscode-editorUnicodeHighlight-border",
  },
  {
    name: "editor-unnecessary-code-border",
    variable: "--vscode-editorUnnecessaryCode-border",
  },
  {
    name: "editor-warning-background",
    variable: "--vscode-editorWarning-background",
  },
  {name: "editor-warning-border", variable: "--vscode-editorWarning-border"},
  {
    name: "editor-warning-foreground",
    variable: "--vscode-editorWarning-foreground",
  },
  {
    name: "editor-watermark-foreground",
    variable: "--vscode-editorWatermark-foreground",
  },
  {
    name: "editor-whitespace-foreground",
    variable: "--vscode-editorWhitespace-foreground",
  },
  {
    name: "editor-widget-background",
    variable: "--vscode-editorWidget-background",
  },
  {name: "editor-widget-border", variable: "--vscode-editorWidget-border"},
  {
    name: "editor-widget-foreground",
    variable: "--vscode-editorWidget-foreground",
  },
  {
    name: "editor-widget-resize-border",
    variable: "--vscode-editorWidget-resizeBorder",
  },
  {
    name: "editor-word-highlight-background",
    variable: "--vscode-editor-wordHighlightBackground",
  },
  {
    name: "editor-word-highlight-border",
    variable: "--vscode-editor-wordHighlightBorder",
  },
  {
    name: "editor-word-highlight-strong-background",
    variable: "--vscode-editor-wordHighlightStrongBackground",
  },
  {
    name: "editor-word-highlight-strong-border",
    variable: "--vscode-editor-wordHighlightStrongBorder",
  },
  {
    name: "editor-word-highlight-text-background",
    variable: "--vscode-editor-wordHighlightTextBackground",
  },
  {
    name: "editor-word-highlight-text-border",
    variable: "--vscode-editor-wordHighlightTextBorder",
  },
  {name: "error-foreground", variable: "--vscode-errorForeground"},
  {
    name: "extension-badge-remote-background",
    variable: "--vscode-extensionBadge-remoteBackground",
  },
  {
    name: "extension-badge-remote-foreground",
    variable: "--vscode-extensionBadge-remoteForeground",
  },
  {
    name: "extension-button-background",
    variable: "--vscode-extensionButton-background",
  },
  {
    name: "extension-button-foreground",
    variable: "--vscode-extensionButton-foreground",
  },
  {
    name: "extension-button-hover-background",
    variable: "--vscode-extensionButton-hoverBackground",
  },
  {
    name: "extension-button-prominent-background",
    variable: "--vscode-extensionButton-prominentBackground",
  },
  {
    name: "extension-button-prominent-foreground",
    variable: "--vscode-extensionButton-prominentForeground",
  },
  {
    name: "extension-button-prominent-hover-background",
    variable: "--vscode-extensionButton-prominentHoverBackground",
  },
  {
    name: "extension-button-separator",
    variable: "--vscode-extensionButton-separator",
  },
  {
    name: "extension-icon-pre-release-foreground",
    variable: "--vscode-extensionIcon-preReleaseForeground",
  },
  {
    name: "extension-icon-sponsor-foreground",
    variable: "--vscode-extensionIcon-sponsorForeground",
  },
  {
    name: "extension-icon-star-foreground",
    variable: "--vscode-extensionIcon-starForeground",
  },
  {
    name: "extension-icon-verified-foreground",
    variable: "--vscode-extensionIcon-verifiedForeground",
  },
  {name: "focus-border", variable: "--vscode-focusBorder"},
  {name: "foreground", variable: "--vscode-foreground"},
  {name: "icon-foreground", variable: "--vscode-icon-foreground"},
  {name: "inline-chat-background", variable: "--vscode-inlineChat-background"},
  {name: "inline-chat-border", variable: "--vscode-inlineChat-border"},
  {
    name: "inline-chat-diff-inserted",
    variable: "--vscode-inlineChatDiff-inserted",
  },
  {
    name: "inline-chat-diff-removed",
    variable: "--vscode-inlineChatDiff-removed",
  },
  {name: "inline-chat-foreground", variable: "--vscode-inlineChat-foreground"},
  {
    name: "inline-chat-input-background",
    variable: "--vscode-inlineChatInput-background",
  },
  {
    name: "inline-chat-input-border",
    variable: "--vscode-inlineChatInput-border",
  },
  {
    name: "inline-chat-input-focus-border",
    variable: "--vscode-inlineChatInput-focusBorder",
  },
  {
    name: "inline-chat-input-placeholder-foreground",
    variable: "--vscode-inlineChatInput-placeholderForeground",
  },
  {name: "inline-chat-shadow", variable: "--vscode-inlineChat-shadow"},
  {
    name: "inline-edit-accepted-background",
    variable: "--vscode-inlineEdit-acceptedBackground",
  },
  {name: "inline-edit-border", variable: "--vscode-inlineEdit-border"},
  {
    name: "inline-edit-indicator-background",
    variable: "--vscode-inlineEdit-indicator-background",
  },
  {
    name: "inline-edit-indicator-border",
    variable: "--vscode-inlineEdit-indicator-border",
  },
  {
    name: "inline-edit-indicator-foreground",
    variable: "--vscode-inlineEdit-indicator-foreground",
  },
  {
    name: "inline-edit-modified-background",
    variable: "--vscode-inlineEdit-modifiedBackground",
  },
  {
    name: "inline-edit-modified-changed-line-background",
    variable: "--vscode-inlineEdit-modifiedChangedLineBackground",
  },
  {
    name: "inline-edit-modified-changed-text-background",
    variable: "--vscode-inlineEdit-modifiedChangedTextBackground",
  },
  {
    name: "inline-edit-original-background",
    variable: "--vscode-inlineEdit-originalBackground",
  },
  {
    name: "inline-edit-original-changed-line-background",
    variable: "--vscode-inlineEdit-originalChangedLineBackground",
  },
  {
    name: "inline-edit-original-changed-text-background",
    variable: "--vscode-inlineEdit-originalChangedTextBackground",
  },
  {name: "input-background", variable: "--vscode-input-background"},
  {name: "input-border", variable: "--vscode-input-border"},
  {name: "input-foreground", variable: "--vscode-input-foreground"},
  {
    name: "input-option-active-background",
    variable: "--vscode-inputOption-activeBackground",
  },
  {
    name: "input-option-active-border",
    variable: "--vscode-inputOption-activeBorder",
  },
  {
    name: "input-option-active-foreground",
    variable: "--vscode-inputOption-activeForeground",
  },
  {
    name: "input-option-hover-background",
    variable: "--vscode-inputOption-hoverBackground",
  },
  {
    name: "input-placeholder-foreground",
    variable: "--vscode-input-placeholderForeground",
  },
  {
    name: "input-validation-error-background",
    variable: "--vscode-inputValidation-errorBackground",
  },
  {
    name: "input-validation-error-border",
    variable: "--vscode-inputValidation-errorBorder",
  },
  {
    name: "input-validation-error-foreground",
    variable: "--vscode-inputValidation-errorForeground",
  },
  {
    name: "input-validation-info-background",
    variable: "--vscode-inputValidation-infoBackground",
  },
  {
    name: "input-validation-info-border",
    variable: "--vscode-inputValidation-infoBorder",
  },
  {
    name: "input-validation-info-foreground",
    variable: "--vscode-inputValidation-infoForeground",
  },
  {
    name: "input-validation-warning-background",
    variable: "--vscode-inputValidation-warningBackground",
  },
  {
    name: "input-validation-warning-border",
    variable: "--vscode-inputValidation-warningBorder",
  },
  {
    name: "input-validation-warning-foreground",
    variable: "--vscode-inputValidation-warningForeground",
  },
  {
    name: "interactive-active-code-border",
    variable: "--vscode-interactive-activeCodeBorder",
  },
  {
    name: "interactive-inactive-code-border",
    variable: "--vscode-interactive-inactiveCodeBorder",
  },
  {
    name: "keybinding-label-background",
    variable: "--vscode-keybindingLabel-background",
  },
  {
    name: "keybinding-label-border",
    variable: "--vscode-keybindingLabel-border",
  },
  {
    name: "keybinding-label-bottom-border",
    variable: "--vscode-keybindingLabel-bottomBorder",
  },
  {
    name: "keybinding-label-foreground",
    variable: "--vscode-keybindingLabel-foreground",
  },
  {
    name: "keybinding-table-header-background",
    variable: "--vscode-keybindingTable-headerBackground",
  },
  {
    name: "keybinding-table-rows-background",
    variable: "--vscode-keybindingTable-rowsBackground",
  },
  {
    name: "list-active-selection-background",
    variable: "--vscode-list-activeSelectionBackground",
  },
  {
    name: "list-active-selection-foreground",
    variable: "--vscode-list-activeSelectionForeground",
  },
  {
    name: "list-active-selection-icon-foreground",
    variable: "--vscode-list-activeSelectionIconForeground",
  },
  {
    name: "list-deemphasized-foreground",
    variable: "--vscode-list-deemphasizedForeground",
  },
  {name: "list-drop-background", variable: "--vscode-list-dropBackground"},
  {
    name: "list-drop-between-background",
    variable: "--vscode-list-dropBetweenBackground",
  },
  {name: "list-error-foreground", variable: "--vscode-list-errorForeground"},
  {
    name: "list-filter-match-background",
    variable: "--vscode-list-filterMatchBackground",
  },
  {
    name: "list-filter-match-border",
    variable: "--vscode-list-filterMatchBorder",
  },
  {
    name: "list-filter-widget-background",
    variable: "--vscode-listFilterWidget-background",
  },
  {
    name: "list-filter-widget-no-matches-outline",
    variable: "--vscode-listFilterWidget-noMatchesOutline",
  },
  {
    name: "list-filter-widget-outline",
    variable: "--vscode-listFilterWidget-outline",
  },
  {
    name: "list-filter-widget-shadow",
    variable: "--vscode-listFilterWidget-shadow",
  },
  {
    name: "list-focus-and-selection-outline",
    variable: "--vscode-list-focusAndSelectionOutline",
  },
  {name: "list-focus-background", variable: "--vscode-list-focusBackground"},
  {name: "list-focus-foreground", variable: "--vscode-list-focusForeground"},
  {
    name: "list-focus-highlight-foreground",
    variable: "--vscode-list-focusHighlightForeground",
  },
  {name: "list-focus-outline", variable: "--vscode-list-focusOutline"},
  {
    name: "list-highlight-foreground",
    variable: "--vscode-list-highlightForeground",
  },
  {name: "list-hover-background", variable: "--vscode-list-hoverBackground"},
  {name: "list-hover-foreground", variable: "--vscode-list-hoverForeground"},
  {
    name: "list-inactive-focus-background",
    variable: "--vscode-list-inactiveFocusBackground",
  },
  {
    name: "list-inactive-focus-outline",
    variable: "--vscode-list-inactiveFocusOutline",
  },
  {
    name: "list-inactive-selection-background",
    variable: "--vscode-list-inactiveSelectionBackground",
  },
  {
    name: "list-inactive-selection-foreground",
    variable: "--vscode-list-inactiveSelectionForeground",
  },
  {
    name: "list-inactive-selection-icon-foreground",
    variable: "--vscode-list-inactiveSelectionIconForeground",
  },
  {
    name: "list-invalid-item-foreground",
    variable: "--vscode-list-invalidItemForeground",
  },
  {
    name: "list-warning-foreground",
    variable: "--vscode-list-warningForeground",
  },
  {name: "menu-background", variable: "--vscode-menu-background"},
  {name: "menu-border", variable: "--vscode-menu-border"},
  {name: "menu-foreground", variable: "--vscode-menu-foreground"},
  {
    name: "menu-selection-background",
    variable: "--vscode-menu-selectionBackground",
  },
  {name: "menu-selection-border", variable: "--vscode-menu-selectionBorder"},
  {
    name: "menu-selection-foreground",
    variable: "--vscode-menu-selectionForeground",
  },
  {
    name: "menu-separator-background",
    variable: "--vscode-menu-separatorBackground",
  },
  {
    name: "menubar-selection-background",
    variable: "--vscode-menubar-selectionBackground",
  },
  {
    name: "menubar-selection-border",
    variable: "--vscode-menubar-selectionBorder",
  },
  {
    name: "menubar-selection-foreground",
    variable: "--vscode-menubar-selectionForeground",
  },
  {name: "merge-border", variable: "--vscode-merge-border"},
  {
    name: "merge-common-content-background",
    variable: "--vscode-merge-commonContentBackground",
  },
  {
    name: "merge-common-header-background",
    variable: "--vscode-merge-commonHeaderBackground",
  },
  {
    name: "merge-current-content-background",
    variable: "--vscode-merge-currentContentBackground",
  },
  {
    name: "merge-current-header-background",
    variable: "--vscode-merge-currentHeaderBackground",
  },
  {
    name: "merge-editor-change-background",
    variable: "--vscode-mergeEditor-change-background",
  },
  {
    name: "merge-editor-change-base-background",
    variable: "--vscode-mergeEditor-changeBase-background",
  },
  {
    name: "merge-editor-change-base-word-background",
    variable: "--vscode-mergeEditor-changeBase-word-background",
  },
  {
    name: "merge-editor-change-word-background",
    variable: "--vscode-mergeEditor-change-word-background",
  },
  {
    name: "merge-editor-conflict-handled-focused-border",
    variable: "--vscode-mergeEditor-conflict-handledFocused-border",
  },
  {
    name: "merge-editor-conflict-handled-minimap-over-view-ruler",
    variable: "--vscode-mergeEditor-conflict-handled-minimapOverViewRuler",
  },
  {
    name: "merge-editor-conflict-handled-unfocused-border",
    variable: "--vscode-mergeEditor-conflict-handledUnfocused-border",
  },
  {
    name: "merge-editor-conflict-input1-background",
    variable: "--vscode-mergeEditor-conflict-input1-background",
  },
  {
    name: "merge-editor-conflict-input2-background",
    variable: "--vscode-mergeEditor-conflict-input2-background",
  },
  {
    name: "merge-editor-conflict-unhandled-focused-border",
    variable: "--vscode-mergeEditor-conflict-unhandledFocused-border",
  },
  {
    name: "merge-editor-conflict-unhandled-minimap-over-view-ruler",
    variable: "--vscode-mergeEditor-conflict-unhandled-minimapOverViewRuler",
  },
  {
    name: "merge-editor-conflict-unhandled-unfocused-border",
    variable: "--vscode-mergeEditor-conflict-unhandledUnfocused-border",
  },
  {
    name: "merge-editor-conflicting-lines-background",
    variable: "--vscode-mergeEditor-conflictingLines-background",
  },
  {
    name: "merge-incoming-content-background",
    variable: "--vscode-merge-incomingContentBackground",
  },
  {
    name: "merge-incoming-header-background",
    variable: "--vscode-merge-incomingHeaderBackground",
  },
  {name: "minimap-background", variable: "--vscode-minimap-background"},
  {
    name: "minimap-error-highlight",
    variable: "--vscode-minimap-errorHighlight",
  },
  {
    name: "minimap-find-match-highlight",
    variable: "--vscode-minimap-findMatchHighlight",
  },
  {
    name: "minimap-gutter-added-background",
    variable: "--vscode-minimapGutter-addedBackground",
  },
  {
    name: "minimap-gutter-deleted-background",
    variable: "--vscode-minimapGutter-deletedBackground",
  },
  {
    name: "minimap-gutter-modified-background",
    variable: "--vscode-minimapGutter-modifiedBackground",
  },
  {name: "minimap-info-highlight", variable: "--vscode-minimap-infoHighlight"},
  {
    name: "minimap-selection-highlight",
    variable: "--vscode-minimap-selectionHighlight",
  },
  {
    name: "minimap-selection-occurrence-highlight",
    variable: "--vscode-minimap-selectionOccurrenceHighlight",
  },
  {
    name: "minimap-slider-active-background",
    variable: "--vscode-minimapSlider-activeBackground",
  },
  {
    name: "minimap-slider-background",
    variable: "--vscode-minimapSlider-background",
  },
  {
    name: "minimap-slider-hover-background",
    variable: "--vscode-minimapSlider-hoverBackground",
  },
  {
    name: "minimap-warning-highlight",
    variable: "--vscode-minimap-warningHighlight",
  },
  {
    name: "multi-diff-editor-background",
    variable: "--vscode-multiDiffEditor-background",
  },
  {
    name: "multi-diff-editor-border",
    variable: "--vscode-multiDiffEditor-border",
  },
  {
    name: "multi-diff-editor-header-background",
    variable: "--vscode-multiDiffEditor-headerBackground",
  },
  {
    name: "notebook-cell-border-color",
    variable: "--vscode-notebook-cellBorderColor",
  },
  {
    name: "notebook-cell-editor-background",
    variable: "--vscode-notebook-cellEditorBackground",
  },
  {
    name: "notebook-cell-hover-background",
    variable: "--vscode-notebook-cellHoverBackground",
  },
  {
    name: "notebook-cell-insertion-indicator",
    variable: "--vscode-notebook-cellInsertionIndicator",
  },
  {
    name: "notebook-cell-status-bar-item-hover-background",
    variable: "--vscode-notebook-cellStatusBarItemHoverBackground",
  },
  {
    name: "notebook-cell-toolbar-separator",
    variable: "--vscode-notebook-cellToolbarSeparator",
  },
  {
    name: "notebook-editor-background",
    variable: "--vscode-notebook-editorBackground",
  },
  {
    name: "notebook-editor-overview-ruler-running-cell-foreground",
    variable: "--vscode-notebookEditorOverviewRuler-runningCellForeground",
  },
  {
    name: "notebook-focused-cell-background",
    variable: "--vscode-notebook-focusedCellBackground",
  },
  {
    name: "notebook-focused-cell-border",
    variable: "--vscode-notebook-focusedCellBorder",
  },
  {
    name: "notebook-focused-editor-border",
    variable: "--vscode-notebook-focusedEditorBorder",
  },
  {
    name: "notebook-inactive-focused-cell-border",
    variable: "--vscode-notebook-inactiveFocusedCellBorder",
  },
  {
    name: "notebook-inactive-selected-cell-border",
    variable: "--vscode-notebook-inactiveSelectedCellBorder",
  },
  {
    name: "notebook-output-container-background-color",
    variable: "--vscode-notebook-outputContainerBackgroundColor",
  },
  {
    name: "notebook-output-container-border-color",
    variable: "--vscode-notebook-outputContainerBorderColor",
  },
  {
    name: "notebook-scrollbar-slider-active-background",
    variable: "--vscode-notebookScrollbarSlider-activeBackground",
  },
  {
    name: "notebook-scrollbar-slider-background",
    variable: "--vscode-notebookScrollbarSlider-background",
  },
  {
    name: "notebook-scrollbar-slider-hover-background",
    variable: "--vscode-notebookScrollbarSlider-hoverBackground",
  },
  {
    name: "notebook-selected-cell-background",
    variable: "--vscode-notebook-selectedCellBackground",
  },
  {
    name: "notebook-selected-cell-border",
    variable: "--vscode-notebook-selectedCellBorder",
  },
  {
    name: "notebook-status-error-icon-foreground",
    variable: "--vscode-notebookStatusErrorIcon-foreground",
  },
  {
    name: "notebook-status-running-icon-foreground",
    variable: "--vscode-notebookStatusRunningIcon-foreground",
  },
  {
    name: "notebook-status-success-icon-foreground",
    variable: "--vscode-notebookStatusSuccessIcon-foreground",
  },
  {
    name: "notebook-symbol-highlight-background",
    variable: "--vscode-notebook-symbolHighlightBackground",
  },
  {
    name: "notification-center-border",
    variable: "--vscode-notificationCenter-border",
  },
  {
    name: "notification-center-header-background",
    variable: "--vscode-notificationCenterHeader-background",
  },
  {
    name: "notification-center-header-foreground",
    variable: "--vscode-notificationCenterHeader-foreground",
  },
  {
    name: "notification-link-foreground",
    variable: "--vscode-notificationLink-foreground",
  },
  {
    name: "notification-toast-border",
    variable: "--vscode-notificationToast-border",
  },
  {
    name: "notifications-background",
    variable: "--vscode-notifications-background",
  },
  {name: "notifications-border", variable: "--vscode-notifications-border"},
  {
    name: "notifications-error-icon-foreground",
    variable: "--vscode-notificationsErrorIcon-foreground",
  },
  {
    name: "notifications-foreground",
    variable: "--vscode-notifications-foreground",
  },
  {
    name: "notifications-info-icon-foreground",
    variable: "--vscode-notificationsInfoIcon-foreground",
  },
  {
    name: "notifications-warning-icon-foreground",
    variable: "--vscode-notificationsWarningIcon-foreground",
  },
  {name: "output-view-background", variable: "--vscode-outputView-background"},
  {
    name: "output-view-sticky-scroll-background",
    variable: "--vscode-outputViewStickyScroll-background",
  },
  {name: "panel-background", variable: "--vscode-panel-background"},
  {name: "panel-border", variable: "--vscode-panel-border"},
  {name: "panel-drop-border", variable: "--vscode-panel-dropBorder"},
  {name: "panel-input-border", variable: "--vscode-panelInput-border"},
  {name: "panel-section-border", variable: "--vscode-panelSection-border"},
  {
    name: "panel-section-drop-background",
    variable: "--vscode-panelSection-dropBackground",
  },
  {
    name: "panel-section-header-background",
    variable: "--vscode-panelSectionHeader-background",
  },
  {
    name: "panel-section-header-border",
    variable: "--vscode-panelSectionHeader-border",
  },
  {
    name: "panel-section-header-foreground",
    variable: "--vscode-panelSectionHeader-foreground",
  },
  {
    name: "panel-sticky-scroll-background",
    variable: "--vscode-panelStickyScroll-background",
  },
  {
    name: "panel-sticky-scroll-border",
    variable: "--vscode-panelStickyScroll-border",
  },
  {
    name: "panel-sticky-scroll-shadow",
    variable: "--vscode-panelStickyScroll-shadow",
  },
  {
    name: "panel-title-active-border",
    variable: "--vscode-panelTitle-activeBorder",
  },
  {
    name: "panel-title-active-foreground",
    variable: "--vscode-panelTitle-activeForeground",
  },
  {name: "panel-title-border", variable: "--vscode-panelTitle-border"},
  {
    name: "panel-title-inactive-foreground",
    variable: "--vscode-panelTitle-inactiveForeground",
  },
  {name: "peek-view-border", variable: "--vscode-peekView-border"},
  {
    name: "peek-view-editor-background",
    variable: "--vscode-peekViewEditor-background",
  },
  {
    name: "peek-view-editor-gutter-background",
    variable: "--vscode-peekViewEditorGutter-background",
  },
  {
    name: "peek-view-editor-match-highlight-background",
    variable: "--vscode-peekViewEditor-matchHighlightBackground",
  },
  {
    name: "peek-view-editor-match-highlight-border",
    variable: "--vscode-peekViewEditor-matchHighlightBorder",
  },
  {
    name: "peek-view-editor-sticky-scroll-background",
    variable: "--vscode-peekViewEditorStickyScroll-background",
  },
  {
    name: "peek-view-result-background",
    variable: "--vscode-peekViewResult-background",
  },
  {
    name: "peek-view-result-file-foreground",
    variable: "--vscode-peekViewResult-fileForeground",
  },
  {
    name: "peek-view-result-line-foreground",
    variable: "--vscode-peekViewResult-lineForeground",
  },
  {
    name: "peek-view-result-match-highlight-background",
    variable: "--vscode-peekViewResult-matchHighlightBackground",
  },
  {
    name: "peek-view-result-selection-background",
    variable: "--vscode-peekViewResult-selectionBackground",
  },
  {
    name: "peek-view-result-selection-foreground",
    variable: "--vscode-peekViewResult-selectionForeground",
  },
  {
    name: "peek-view-title-background",
    variable: "--vscode-peekViewTitle-background",
  },
  {
    name: "peek-view-title-description-foreground",
    variable: "--vscode-peekViewTitleDescription-foreground",
  },
  {
    name: "peek-view-title-label-foreground",
    variable: "--vscode-peekViewTitleLabel-foreground",
  },
  {name: "picker-group-border", variable: "--vscode-pickerGroup-border"},
  {
    name: "picker-group-foreground",
    variable: "--vscode-pickerGroup-foreground",
  },
  {
    name: "ports-icon-running-process-foreground",
    variable: "--vscode-ports-iconRunningProcessForeground",
  },
  {
    name: "problems-error-icon-foreground",
    variable: "--vscode-problemsErrorIcon-foreground",
  },
  {
    name: "problems-info-icon-foreground",
    variable: "--vscode-problemsInfoIcon-foreground",
  },
  {
    name: "problems-warning-icon-foreground",
    variable: "--vscode-problemsWarningIcon-foreground",
  },
  {
    name: "profile-badge-background",
    variable: "--vscode-profileBadge-background",
  },
  {
    name: "profile-badge-foreground",
    variable: "--vscode-profileBadge-foreground",
  },
  {name: "profiles-sash-border", variable: "--vscode-profiles-sashBorder"},
  {
    name: "progress-bar-background",
    variable: "--vscode-progressBar-background",
  },
  {name: "quick-input-background", variable: "--vscode-quickInput-background"},
  {name: "quick-input-foreground", variable: "--vscode-quickInput-foreground"},
  {
    name: "quick-input-list-focus-background",
    variable: "--vscode-quickInputList-focusBackground",
  },
  {
    name: "quick-input-list-focus-foreground",
    variable: "--vscode-quickInputList-focusForeground",
  },
  {
    name: "quick-input-list-focus-icon-foreground",
    variable: "--vscode-quickInputList-focusIconForeground",
  },
  {
    name: "quick-input-title-background",
    variable: "--vscode-quickInputTitle-background",
  },
  {
    name: "radio-active-background",
    variable: "--vscode-radio-activeBackground",
  },
  {name: "radio-active-border", variable: "--vscode-radio-activeBorder"},
  {
    name: "radio-active-foreground",
    variable: "--vscode-radio-activeForeground",
  },
  {
    name: "radio-inactive-background",
    variable: "--vscode-radio-inactiveBackground",
  },
  {name: "radio-inactive-border", variable: "--vscode-radio-inactiveBorder"},
  {
    name: "radio-inactive-foreground",
    variable: "--vscode-radio-inactiveForeground",
  },
  {
    name: "radio-inactive-hover-background",
    variable: "--vscode-radio-inactiveHoverBackground",
  },
  {name: "sash-hover-border", variable: "--vscode-sash-hoverBorder"},
  {name: "scm-graph-foreground1", variable: "--vscode-scmGraph-foreground1"},
  {name: "scm-graph-foreground2", variable: "--vscode-scmGraph-foreground2"},
  {name: "scm-graph-foreground3", variable: "--vscode-scmGraph-foreground3"},
  {name: "scm-graph-foreground4", variable: "--vscode-scmGraph-foreground4"},
  {name: "scm-graph-foreground5", variable: "--vscode-scmGraph-foreground5"},
  {
    name: "scm-graph-history-item-base-ref-color",
    variable: "--vscode-scmGraph-historyItemBaseRefColor",
  },
  {
    name: "scm-graph-history-item-hover-additions-foreground",
    variable: "--vscode-scmGraph-historyItemHoverAdditionsForeground",
  },
  {
    name: "scm-graph-history-item-hover-default-label-background",
    variable: "--vscode-scmGraph-historyItemHoverDefaultLabelBackground",
  },
  {
    name: "scm-graph-history-item-hover-default-label-foreground",
    variable: "--vscode-scmGraph-historyItemHoverDefaultLabelForeground",
  },
  {
    name: "scm-graph-history-item-hover-deletions-foreground",
    variable: "--vscode-scmGraph-historyItemHoverDeletionsForeground",
  },
  {
    name: "scm-graph-history-item-hover-label-foreground",
    variable: "--vscode-scmGraph-historyItemHoverLabelForeground",
  },
  {
    name: "scm-graph-history-item-ref-color",
    variable: "--vscode-scmGraph-historyItemRefColor",
  },
  {
    name: "scm-graph-history-item-remote-ref-color",
    variable: "--vscode-scmGraph-historyItemRemoteRefColor",
  },
  {name: "scrollbar-shadow", variable: "--vscode-scrollbar-shadow"},
  {
    name: "scrollbar-slider-active-background",
    variable: "--vscode-scrollbarSlider-activeBackground",
  },
  {
    name: "scrollbar-slider-background",
    variable: "--vscode-scrollbarSlider-background",
  },
  {
    name: "scrollbar-slider-hover-background",
    variable: "--vscode-scrollbarSlider-hoverBackground",
  },
  {
    name: "search-editor-find-match-background",
    variable: "--vscode-searchEditor-findMatchBackground",
  },
  {
    name: "search-editor-find-match-border",
    variable: "--vscode-searchEditor-findMatchBorder",
  },
  {
    name: "search-editor-text-input-border",
    variable: "--vscode-searchEditor-textInputBorder",
  },
  {
    name: "search-results-info-foreground",
    variable: "--vscode-search-resultsInfoForeground",
  },
  {name: "selection-background", variable: "--vscode-selection-background"},
  {
    name: "settings-checkbox-background",
    variable: "--vscode-settings-checkboxBackground",
  },
  {
    name: "settings-checkbox-border",
    variable: "--vscode-settings-checkboxBorder",
  },
  {
    name: "settings-checkbox-foreground",
    variable: "--vscode-settings-checkboxForeground",
  },
  {
    name: "settings-dropdown-background",
    variable: "--vscode-settings-dropdownBackground",
  },
  {
    name: "settings-dropdown-border",
    variable: "--vscode-settings-dropdownBorder",
  },
  {
    name: "settings-dropdown-foreground",
    variable: "--vscode-settings-dropdownForeground",
  },
  {
    name: "settings-dropdown-list-border",
    variable: "--vscode-settings-dropdownListBorder",
  },
  {
    name: "settings-focused-row-background",
    variable: "--vscode-settings-focusedRowBackground",
  },
  {
    name: "settings-focused-row-border",
    variable: "--vscode-settings-focusedRowBorder",
  },
  {name: "settings-header-border", variable: "--vscode-settings-headerBorder"},
  {
    name: "settings-header-foreground",
    variable: "--vscode-settings-headerForeground",
  },
  {
    name: "settings-modified-item-indicator",
    variable: "--vscode-settings-modifiedItemIndicator",
  },
  {
    name: "settings-number-input-background",
    variable: "--vscode-settings-numberInputBackground",
  },
  {
    name: "settings-number-input-border",
    variable: "--vscode-settings-numberInputBorder",
  },
  {
    name: "settings-number-input-foreground",
    variable: "--vscode-settings-numberInputForeground",
  },
  {
    name: "settings-row-hover-background",
    variable: "--vscode-settings-rowHoverBackground",
  },
  {name: "settings-sash-border", variable: "--vscode-settings-sashBorder"},
  {
    name: "settings-settings-header-hover-foreground",
    variable: "--vscode-settings-settingsHeaderHoverForeground",
  },
  {
    name: "settings-text-input-background",
    variable: "--vscode-settings-textInputBackground",
  },
  {
    name: "settings-text-input-border",
    variable: "--vscode-settings-textInputBorder",
  },
  {
    name: "settings-text-input-foreground",
    variable: "--vscode-settings-textInputForeground",
  },
  {
    name: "side-bar-activity-bar-top-border",
    variable: "--vscode-sideBarActivityBarTop-border",
  },
  {name: "side-bar-background", variable: "--vscode-sideBar-background"},
  {name: "side-bar-border", variable: "--vscode-sideBar-border"},
  {
    name: "side-bar-drop-background",
    variable: "--vscode-sideBar-dropBackground",
  },
  {name: "side-bar-foreground", variable: "--vscode-sideBar-foreground"},
  {
    name: "side-bar-section-header-background",
    variable: "--vscode-sideBarSectionHeader-background",
  },
  {
    name: "side-bar-section-header-border",
    variable: "--vscode-sideBarSectionHeader-border",
  },
  {
    name: "side-bar-section-header-foreground",
    variable: "--vscode-sideBarSectionHeader-foreground",
  },
  {
    name: "side-bar-sticky-scroll-background",
    variable: "--vscode-sideBarStickyScroll-background",
  },
  {
    name: "side-bar-sticky-scroll-border",
    variable: "--vscode-sideBarStickyScroll-border",
  },
  {
    name: "side-bar-sticky-scroll-shadow",
    variable: "--vscode-sideBarStickyScroll-shadow",
  },
  {
    name: "side-bar-title-background",
    variable: "--vscode-sideBarTitle-background",
  },
  {name: "side-bar-title-border", variable: "--vscode-sideBarTitle-border"},
  {
    name: "side-bar-title-foreground",
    variable: "--vscode-sideBarTitle-foreground",
  },
  {
    name: "side-by-side-editor-horizontal-border",
    variable: "--vscode-sideBySideEditor-horizontalBorder",
  },
  {
    name: "side-by-side-editor-vertical-border",
    variable: "--vscode-sideBySideEditor-verticalBorder",
  },
  {
    name: "simple-find-widget-sash-border",
    variable: "--vscode-simpleFindWidget-sashBorder",
  },
  {name: "status-bar-background", variable: "--vscode-statusBar-background"},
  {name: "status-bar-border", variable: "--vscode-statusBar-border"},
  {
    name: "status-bar-debugging-background",
    variable: "--vscode-statusBar-debuggingBackground",
  },
  {
    name: "status-bar-debugging-border",
    variable: "--vscode-statusBar-debuggingBorder",
  },
  {
    name: "status-bar-debugging-foreground",
    variable: "--vscode-statusBar-debuggingForeground",
  },
  {name: "status-bar-focus-border", variable: "--vscode-statusBar-focusBorder"},
  {name: "status-bar-foreground", variable: "--vscode-statusBar-foreground"},
  {
    name: "status-bar-item-active-background",
    variable: "--vscode-statusBarItem-activeBackground",
  },
  {
    name: "status-bar-item-compact-hover-background",
    variable: "--vscode-statusBarItem-compactHoverBackground",
  },
  {
    name: "status-bar-item-error-background",
    variable: "--vscode-statusBarItem-errorBackground",
  },
  {
    name: "status-bar-item-error-foreground",
    variable: "--vscode-statusBarItem-errorForeground",
  },
  {
    name: "status-bar-item-error-hover-background",
    variable: "--vscode-statusBarItem-errorHoverBackground",
  },
  {
    name: "status-bar-item-error-hover-foreground",
    variable: "--vscode-statusBarItem-errorHoverForeground",
  },
  {
    name: "status-bar-item-focus-border",
    variable: "--vscode-statusBarItem-focusBorder",
  },
  {
    name: "status-bar-item-hover-background",
    variable: "--vscode-statusBarItem-hoverBackground",
  },
  {
    name: "status-bar-item-hover-foreground",
    variable: "--vscode-statusBarItem-hoverForeground",
  },
  {
    name: "status-bar-item-offline-background",
    variable: "--vscode-statusBarItem-offlineBackground",
  },
  {
    name: "status-bar-item-offline-foreground",
    variable: "--vscode-statusBarItem-offlineForeground",
  },
  {
    name: "status-bar-item-offline-hover-background",
    variable: "--vscode-statusBarItem-offlineHoverBackground",
  },
  {
    name: "status-bar-item-offline-hover-foreground",
    variable: "--vscode-statusBarItem-offlineHoverForeground",
  },
  {
    name: "status-bar-item-prominent-background",
    variable: "--vscode-statusBarItem-prominentBackground",
  },
  {
    name: "status-bar-item-prominent-foreground",
    variable: "--vscode-statusBarItem-prominentForeground",
  },
  {
    name: "status-bar-item-prominent-hover-background",
    variable: "--vscode-statusBarItem-prominentHoverBackground",
  },
  {
    name: "status-bar-item-prominent-hover-foreground",
    variable: "--vscode-statusBarItem-prominentHoverForeground",
  },
  {
    name: "status-bar-item-remote-background",
    variable: "--vscode-statusBarItem-remoteBackground",
  },
  {
    name: "status-bar-item-remote-foreground",
    variable: "--vscode-statusBarItem-remoteForeground",
  },
  {
    name: "status-bar-item-remote-hover-background",
    variable: "--vscode-statusBarItem-remoteHoverBackground",
  },
  {
    name: "status-bar-item-remote-hover-foreground",
    variable: "--vscode-statusBarItem-remoteHoverForeground",
  },
  {
    name: "status-bar-item-warning-background",
    variable: "--vscode-statusBarItem-warningBackground",
  },
  {
    name: "status-bar-item-warning-foreground",
    variable: "--vscode-statusBarItem-warningForeground",
  },
  {
    name: "status-bar-item-warning-hover-background",
    variable: "--vscode-statusBarItem-warningHoverBackground",
  },
  {
    name: "status-bar-item-warning-hover-foreground",
    variable: "--vscode-statusBarItem-warningHoverForeground",
  },
  {
    name: "status-bar-no-folder-background",
    variable: "--vscode-statusBar-noFolderBackground",
  },
  {
    name: "status-bar-no-folder-border",
    variable: "--vscode-statusBar-noFolderBorder",
  },
  {
    name: "status-bar-no-folder-foreground",
    variable: "--vscode-statusBar-noFolderForeground",
  },
  {
    name: "symbol-icon-array-foreground",
    variable: "--vscode-symbolIcon-arrayForeground",
  },
  {
    name: "symbol-icon-boolean-foreground",
    variable: "--vscode-symbolIcon-booleanForeground",
  },
  {
    name: "symbol-icon-class-foreground",
    variable: "--vscode-symbolIcon-classForeground",
  },
  {
    name: "symbol-icon-color-foreground",
    variable: "--vscode-symbolIcon-colorForeground",
  },
  {
    name: "symbol-icon-constant-foreground",
    variable: "--vscode-symbolIcon-constantForeground",
  },
  {
    name: "symbol-icon-constructor-foreground",
    variable: "--vscode-symbolIcon-constructorForeground",
  },
  {
    name: "symbol-icon-enumerator-foreground",
    variable: "--vscode-symbolIcon-enumeratorForeground",
  },
  {
    name: "symbol-icon-enumerator-member-foreground",
    variable: "--vscode-symbolIcon-enumeratorMemberForeground",
  },
  {
    name: "symbol-icon-event-foreground",
    variable: "--vscode-symbolIcon-eventForeground",
  },
  {
    name: "symbol-icon-field-foreground",
    variable: "--vscode-symbolIcon-fieldForeground",
  },
  {
    name: "symbol-icon-file-foreground",
    variable: "--vscode-symbolIcon-fileForeground",
  },
  {
    name: "symbol-icon-folder-foreground",
    variable: "--vscode-symbolIcon-folderForeground",
  },
  {
    name: "symbol-icon-function-foreground",
    variable: "--vscode-symbolIcon-functionForeground",
  },
  {
    name: "symbol-icon-interface-foreground",
    variable: "--vscode-symbolIcon-interfaceForeground",
  },
  {
    name: "symbol-icon-key-foreground",
    variable: "--vscode-symbolIcon-keyForeground",
  },
  {
    name: "symbol-icon-keyword-foreground",
    variable: "--vscode-symbolIcon-keywordForeground",
  },
  {
    name: "symbol-icon-method-foreground",
    variable: "--vscode-symbolIcon-methodForeground",
  },
  {
    name: "symbol-icon-module-foreground",
    variable: "--vscode-symbolIcon-moduleForeground",
  },
  {
    name: "symbol-icon-namespace-foreground",
    variable: "--vscode-symbolIcon-namespaceForeground",
  },
  {
    name: "symbol-icon-null-foreground",
    variable: "--vscode-symbolIcon-nullForeground",
  },
  {
    name: "symbol-icon-number-foreground",
    variable: "--vscode-symbolIcon-numberForeground",
  },
  {
    name: "symbol-icon-object-foreground",
    variable: "--vscode-symbolIcon-objectForeground",
  },
  {
    name: "symbol-icon-operator-foreground",
    variable: "--vscode-symbolIcon-operatorForeground",
  },
  {
    name: "symbol-icon-package-foreground",
    variable: "--vscode-symbolIcon-packageForeground",
  },
  {
    name: "symbol-icon-property-foreground",
    variable: "--vscode-symbolIcon-propertyForeground",
  },
  {
    name: "symbol-icon-reference-foreground",
    variable: "--vscode-symbolIcon-referenceForeground",
  },
  {
    name: "symbol-icon-snippet-foreground",
    variable: "--vscode-symbolIcon-snippetForeground",
  },
  {
    name: "symbol-icon-string-foreground",
    variable: "--vscode-symbolIcon-stringForeground",
  },
  {
    name: "symbol-icon-struct-foreground",
    variable: "--vscode-symbolIcon-structForeground",
  },
  {
    name: "symbol-icon-text-foreground",
    variable: "--vscode-symbolIcon-textForeground",
  },
  {
    name: "symbol-icon-type-parameter-foreground",
    variable: "--vscode-symbolIcon-typeParameterForeground",
  },
  {
    name: "symbol-icon-unit-foreground",
    variable: "--vscode-symbolIcon-unitForeground",
  },
  {
    name: "symbol-icon-variable-foreground",
    variable: "--vscode-symbolIcon-variableForeground",
  },
  {name: "tab-active-background", variable: "--vscode-tab-activeBackground"},
  {name: "tab-active-border", variable: "--vscode-tab-activeBorder"},
  {name: "tab-active-border-top", variable: "--vscode-tab-activeBorderTop"},
  {name: "tab-active-foreground", variable: "--vscode-tab-activeForeground"},
  {
    name: "tab-active-modified-border",
    variable: "--vscode-tab-activeModifiedBorder",
  },
  {name: "tab-border", variable: "--vscode-tab-border"},
  {
    name: "tab-drag-and-drop-border",
    variable: "--vscode-tab-dragAndDropBorder",
  },
  {name: "tab-hover-background", variable: "--vscode-tab-hoverBackground"},
  {name: "tab-hover-border", variable: "--vscode-tab-hoverBorder"},
  {name: "tab-hover-foreground", variable: "--vscode-tab-hoverForeground"},
  {
    name: "tab-inactive-background",
    variable: "--vscode-tab-inactiveBackground",
  },
  {
    name: "tab-inactive-foreground",
    variable: "--vscode-tab-inactiveForeground",
  },
  {
    name: "tab-inactive-modified-border",
    variable: "--vscode-tab-inactiveModifiedBorder",
  },
  {name: "tab-last-pinned-border", variable: "--vscode-tab-lastPinnedBorder"},
  {
    name: "tab-selected-background",
    variable: "--vscode-tab-selectedBackground",
  },
  {name: "tab-selected-border-top", variable: "--vscode-tab-selectedBorderTop"},
  {
    name: "tab-selected-foreground",
    variable: "--vscode-tab-selectedForeground",
  },
  {
    name: "tab-unfocused-active-background",
    variable: "--vscode-tab-unfocusedActiveBackground",
  },
  {
    name: "tab-unfocused-active-border",
    variable: "--vscode-tab-unfocusedActiveBorder",
  },
  {
    name: "tab-unfocused-active-border-top",
    variable: "--vscode-tab-unfocusedActiveBorderTop",
  },
  {
    name: "tab-unfocused-active-foreground",
    variable: "--vscode-tab-unfocusedActiveForeground",
  },
  {
    name: "tab-unfocused-active-modified-border",
    variable: "--vscode-tab-unfocusedActiveModifiedBorder",
  },
  {
    name: "tab-unfocused-hover-background",
    variable: "--vscode-tab-unfocusedHoverBackground",
  },
  {
    name: "tab-unfocused-hover-border",
    variable: "--vscode-tab-unfocusedHoverBorder",
  },
  {
    name: "tab-unfocused-hover-foreground",
    variable: "--vscode-tab-unfocusedHoverForeground",
  },
  {
    name: "tab-unfocused-inactive-background",
    variable: "--vscode-tab-unfocusedInactiveBackground",
  },
  {
    name: "tab-unfocused-inactive-foreground",
    variable: "--vscode-tab-unfocusedInactiveForeground",
  },
  {
    name: "tab-unfocused-inactive-modified-border",
    variable: "--vscode-tab-unfocusedInactiveModifiedBorder",
  },
  {name: "terminal-ansi-black", variable: "--vscode-terminal-ansiBlack"},
  {name: "terminal-ansi-blue", variable: "--vscode-terminal-ansiBlue"},
  {
    name: "terminal-ansi-bright-black",
    variable: "--vscode-terminal-ansiBrightBlack",
  },
  {
    name: "terminal-ansi-bright-blue",
    variable: "--vscode-terminal-ansiBrightBlue",
  },
  {
    name: "terminal-ansi-bright-cyan",
    variable: "--vscode-terminal-ansiBrightCyan",
  },
  {
    name: "terminal-ansi-bright-green",
    variable: "--vscode-terminal-ansiBrightGreen",
  },
  {
    name: "terminal-ansi-bright-magenta",
    variable: "--vscode-terminal-ansiBrightMagenta",
  },
  {
    name: "terminal-ansi-bright-red",
    variable: "--vscode-terminal-ansiBrightRed",
  },
  {
    name: "terminal-ansi-bright-white",
    variable: "--vscode-terminal-ansiBrightWhite",
  },
  {
    name: "terminal-ansi-bright-yellow",
    variable: "--vscode-terminal-ansiBrightYellow",
  },
  {name: "terminal-ansi-cyan", variable: "--vscode-terminal-ansiCyan"},
  {name: "terminal-ansi-green", variable: "--vscode-terminal-ansiGreen"},
  {name: "terminal-ansi-magenta", variable: "--vscode-terminal-ansiMagenta"},
  {name: "terminal-ansi-red", variable: "--vscode-terminal-ansiRed"},
  {name: "terminal-ansi-white", variable: "--vscode-terminal-ansiWhite"},
  {name: "terminal-ansi-yellow", variable: "--vscode-terminal-ansiYellow"},
  {name: "terminal-background", variable: "--vscode-terminal-background"},
  {name: "terminal-border", variable: "--vscode-terminal-border"},
  {
    name: "terminal-command-decoration-default-background",
    variable: "--vscode-terminalCommandDecoration-defaultBackground",
  },
  {
    name: "terminal-command-decoration-error-background",
    variable: "--vscode-terminalCommandDecoration-errorBackground",
  },
  {
    name: "terminal-command-decoration-success-background",
    variable: "--vscode-terminalCommandDecoration-successBackground",
  },
  {
    name: "terminal-command-guide-foreground",
    variable: "--vscode-terminalCommandGuide-foreground",
  },
  {
    name: "terminal-cursor-background",
    variable: "--vscode-terminalCursor-background",
  },
  {
    name: "terminal-cursor-foreground",
    variable: "--vscode-terminalCursor-foreground",
  },
  {
    name: "terminal-drop-background",
    variable: "--vscode-terminal-dropBackground",
  },
  {
    name: "terminal-find-match-background",
    variable: "--vscode-terminal-findMatchBackground",
  },
  {
    name: "terminal-find-match-border",
    variable: "--vscode-terminal-findMatchBorder",
  },
  {
    name: "terminal-find-match-highlight-background",
    variable: "--vscode-terminal-findMatchHighlightBackground",
  },
  {
    name: "terminal-find-match-highlight-border",
    variable: "--vscode-terminal-findMatchHighlightBorder",
  },
  {name: "terminal-foreground", variable: "--vscode-terminal-foreground"},
  {
    name: "terminal-hover-highlight-background",
    variable: "--vscode-terminal-hoverHighlightBackground",
  },
  {
    name: "terminal-inactive-selection-background",
    variable: "--vscode-terminal-inactiveSelectionBackground",
  },
  {
    name: "terminal-initial-hint-foreground",
    variable: "--vscode-terminal-initialHintForeground",
  },
  {
    name: "terminal-overview-ruler-border",
    variable: "--vscode-terminalOverviewRuler-border",
  },
  {
    name: "terminal-overview-ruler-cursor-foreground",
    variable: "--vscode-terminalOverviewRuler-cursorForeground",
  },
  {
    name: "terminal-overview-ruler-find-match-foreground",
    variable: "--vscode-terminalOverviewRuler-findMatchForeground",
  },
  {
    name: "terminal-selection-background",
    variable: "--vscode-terminal-selectionBackground",
  },
  {
    name: "terminal-selection-foreground",
    variable: "--vscode-terminal-selectionForeground",
  },
  {
    name: "terminal-sticky-scroll-background",
    variable: "--vscode-terminalStickyScroll-background",
  },
  {
    name: "terminal-sticky-scroll-border",
    variable: "--vscode-terminalStickyScroll-border",
  },
  {
    name: "terminal-sticky-scroll-hover-background",
    variable: "--vscode-terminalStickyScrollHover-background",
  },
  {
    name: "terminal-tab-active-border",
    variable: "--vscode-terminal-tab-activeBorder",
  },
  {
    name: "testing-cover-count-badge-background",
    variable: "--vscode-testing-coverCountBadgeBackground",
  },
  {
    name: "testing-cover-count-badge-foreground",
    variable: "--vscode-testing-coverCountBadgeForeground",
  },
  {
    name: "testing-covered-background",
    variable: "--vscode-testing-coveredBackground",
  },
  {name: "testing-covered-border", variable: "--vscode-testing-coveredBorder"},
  {
    name: "testing-covered-gutter-background",
    variable: "--vscode-testing-coveredGutterBackground",
  },
  {name: "testing-icon-errored", variable: "--vscode-testing-iconErrored"},
  {
    name: "testing-icon-errored-retired",
    variable: "--vscode-testing-iconErrored-retired",
  },
  {name: "testing-icon-failed", variable: "--vscode-testing-iconFailed"},
  {
    name: "testing-icon-failed-retired",
    variable: "--vscode-testing-iconFailed-retired",
  },
  {name: "testing-icon-passed", variable: "--vscode-testing-iconPassed"},
  {
    name: "testing-icon-passed-retired",
    variable: "--vscode-testing-iconPassed-retired",
  },
  {name: "testing-icon-queued", variable: "--vscode-testing-iconQueued"},
  {
    name: "testing-icon-queued-retired",
    variable: "--vscode-testing-iconQueued-retired",
  },
  {name: "testing-icon-skipped", variable: "--vscode-testing-iconSkipped"},
  {
    name: "testing-icon-skipped-retired",
    variable: "--vscode-testing-iconSkipped-retired",
  },
  {name: "testing-icon-unset", variable: "--vscode-testing-iconUnset"},
  {
    name: "testing-icon-unset-retired",
    variable: "--vscode-testing-iconUnset-retired",
  },
  {
    name: "testing-message-error-badge-background",
    variable: "--vscode-testing-message-error-badgeBackground",
  },
  {
    name: "testing-message-error-badge-border",
    variable: "--vscode-testing-message-error-badgeBorder",
  },
  {
    name: "testing-message-error-badge-foreground",
    variable: "--vscode-testing-message-error-badgeForeground",
  },
  {
    name: "testing-message-error-line-background",
    variable: "--vscode-testing-message-error-lineBackground",
  },
  {
    name: "testing-message-info-decoration-foreground",
    variable: "--vscode-testing-message-info-decorationForeground",
  },
  {
    name: "testing-message-info-line-background",
    variable: "--vscode-testing-message-info-lineBackground",
  },
  {
    name: "testing-message-peek-border",
    variable: "--vscode-testing-messagePeekBorder",
  },
  {
    name: "testing-message-peek-header-background",
    variable: "--vscode-testing-messagePeekHeaderBackground",
  },
  {name: "testing-peek-border", variable: "--vscode-testing-peekBorder"},
  {
    name: "testing-peek-header-background",
    variable: "--vscode-testing-peekHeaderBackground",
  },
  {name: "testing-run-action", variable: "--vscode-testing-runAction"},
  {
    name: "testing-uncovered-background",
    variable: "--vscode-testing-uncoveredBackground",
  },
  {
    name: "testing-uncovered-border",
    variable: "--vscode-testing-uncoveredBorder",
  },
  {
    name: "testing-uncovered-branch-background",
    variable: "--vscode-testing-uncoveredBranchBackground",
  },
  {
    name: "testing-uncovered-gutter-background",
    variable: "--vscode-testing-uncoveredGutterBackground",
  },
  {
    name: "text-block-quote-background",
    variable: "--vscode-textBlockQuote-background",
  },
  {name: "text-block-quote-border", variable: "--vscode-textBlockQuote-border"},
  {
    name: "text-code-block-background",
    variable: "--vscode-textCodeBlock-background",
  },
  {
    name: "text-link-active-foreground",
    variable: "--vscode-textLink-activeForeground",
  },
  {name: "text-link-foreground", variable: "--vscode-textLink-foreground"},
  {
    name: "text-preformat-background",
    variable: "--vscode-textPreformat-background",
  },
  {
    name: "text-preformat-foreground",
    variable: "--vscode-textPreformat-foreground",
  },
  {
    name: "text-separator-foreground",
    variable: "--vscode-textSeparator-foreground",
  },
  {
    name: "title-bar-active-background",
    variable: "--vscode-titleBar-activeBackground",
  },
  {
    name: "title-bar-active-foreground",
    variable: "--vscode-titleBar-activeForeground",
  },
  {name: "title-bar-border", variable: "--vscode-titleBar-border"},
  {
    name: "title-bar-inactive-background",
    variable: "--vscode-titleBar-inactiveBackground",
  },
  {
    name: "title-bar-inactive-foreground",
    variable: "--vscode-titleBar-inactiveForeground",
  },
  {
    name: "toolbar-active-background",
    variable: "--vscode-toolbar-activeBackground",
  },
  {
    name: "toolbar-hover-background",
    variable: "--vscode-toolbar-hoverBackground",
  },
  {name: "toolbar-hover-outline", variable: "--vscode-toolbar-hoverOutline"},
  {
    name: "tree-inactive-indent-guides-stroke",
    variable: "--vscode-tree-inactiveIndentGuidesStroke",
  },
  {
    name: "tree-indent-guides-stroke",
    variable: "--vscode-tree-indentGuidesStroke",
  },
  {
    name: "tree-table-columns-border",
    variable: "--vscode-tree-tableColumnsBorder",
  },
  {
    name: "tree-table-odd-rows-background",
    variable: "--vscode-tree-tableOddRowsBackground",
  },
  {
    name: "walk-through-embedded-editor-background",
    variable: "--vscode-walkThrough-embeddedEditorBackground",
  },
  {
    name: "walkthrough-step-title-foreground",
    variable: "--vscode-walkthrough-stepTitle-foreground",
  },
  {
    name: "welcome-page-background",
    variable: "--vscode-welcomePage-background",
  },
  {
    name: "welcome-page-progress-background",
    variable: "--vscode-welcomePage-progress-background",
  },
  {
    name: "welcome-page-progress-foreground",
    variable: "--vscode-welcomePage-progress-foreground",
  },
  {
    name: "welcome-page-tile-background",
    variable: "--vscode-welcomePage-tileBackground",
  },
  {
    name: "welcome-page-tile-border",
    variable: "--vscode-welcomePage-tileBorder",
  },
  {
    name: "welcome-page-tile-hover-background",
    variable: "--vscode-welcomePage-tileHoverBackground",
  },
  {name: "widget-border", variable: "--vscode-widget-border"},
  {name: "widget-shadow", variable: "--vscode-widget-shadow"},
  {name: "window-active-border", variable: "--vscode-window-activeBorder"},
  {name: "window-inactive-border", variable: "--vscode-window-inactiveBorder"},
]

/** Host colors used with explicit shadow geometry. */
export const hostShadowTokens: readonly VscodeHostToken[] = [
  {name: "diff-editor", variable: "--vscode-diffEditor-unchangedRegionShadow"},
  {
    name: "editor-sticky-scroll",
    variable: "--vscode-editorStickyScroll-shadow",
  },
  {name: "inline-chat", variable: "--vscode-inlineChat-shadow"},
  {name: "list-filter-widget", variable: "--vscode-listFilterWidget-shadow"},
  {name: "panel-sticky-scroll", variable: "--vscode-panelStickyScroll-shadow"},
  {name: "scrollbar", variable: "--vscode-scrollbar-shadow"},
  {
    name: "side-bar-sticky-scroll",
    variable: "--vscode-sideBarStickyScroll-shadow",
  },
  {name: "widget", variable: "--vscode-widget-shadow"},
]

/** Host color alpha requires conversion before assigning CSS opacity. */
export const hostOpacityTokens: readonly VscodeHostToken[] = [
  {
    name: "editor-unnecessary-code",
    variable: "--vscode-editorUnnecessaryCode-opacity",
  },
  {name: "minimap-foreground", variable: "--vscode-minimap-foregroundOpacity"},
]
