// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

/* eslint-disable perfectionist/sort-objects */

import plugin from "tailwindcss/plugin"

export const vscodePlugin = plugin(function () {}, {
  theme: {
    fontFamily: {
      sans: "var(--vscode-font-family)",
      mono: `Menlo, monospace`,
    },
    fontSize: {
      "body-1": [
        "13px",
        {
          lineHeight: "normal",
          fontWeight: "500",
        },
      ],
      "body-2": [
        "12px",
        {
          lineHeight: "normal",
          fontWeight: "500",
        },
      ],
      "label-1": [
        "14px",
        {
          lineHeight: "normal",
          fontWeight: "500",
        },
      ],
      "label-2": [
        "12px",
        {
          lineHeight: "normal",
          fontWeight: "700",
        },
      ],
      "label-3": [
        "11px",
        {
          lineHeight: "normal",
          fontWeight: "500",
        },
      ],
      "label-4": [
        "9px",
        {
          lineHeight: "normal",
          fontWeight: "700",
        },
      ],
      "heading-1": [
        "26px",
        {
          lineHeight: "normal",
          fontWeight: "600",
        },
      ],
      "heading-2": [
        "14px",
        {
          lineHeight: "normal",
          fontWeight: "500",
        },
      ],
      "heading-3": [
        "13px",
        {
          lineHeight: "normal",
          fontWeight: "800",
        },
      ],
      "heading-4": [
        "11px",
        {
          lineHeight: "normal",
          fontWeight: "700",
        },
      ],
      "heading-5": [
        "11px",
        {
          lineHeight: "normal",
          fontWeight: "500",
        },
      ],
      "heading-6": [
        "11px",
        {
          lineHeight: "normal",
          fontWeight: "800",
        },
      ],
      "markdown-1": [
        "26px",
        {
          lineHeight: "normal",
          fontWeight: "600",
        },
      ],
      "markdown-2": [
        "20px",
        {
          lineHeight: "normal",
          fontWeight: "600",
        },
      ],
      "markdown-3": [
        "15px",
        {
          lineHeight: "normal",
          fontWeight: "600",
        },
      ],
      "markdown-4": [
        "13px",
        {
          lineHeight: "normal",
          fontWeight: "800",
        },
      ],
      "markdown-5": [
        "11px",
        {
          lineHeight: "normal",
          fontWeight: "800",
        },
      ],
      "markdown-6": [
        "8px",
        {
          lineHeight: "normal",
          fontWeight: "800",
        },
      ],
      paragraph: [
        "13px",
        {
          lineHeight: "normal",
          fontWeight: "500",
        },
      ],
      xs: ["11px", "normal"],
      sm: ["12px", "normal"],
      md: ["13px", "normal"],
    },
    fontWeight: {
      normal: "400",
      medium: "500",
    },
    extend: {
      backgroundColor: {
        actionBar: {
          toggledBackground: "var(--vscode-actionBar-toggledBackground)",
        },
        activityBar: {
          activeBackground: "var(--vscode-activityBar-activeBackground)",
          background: "var(--vscode-activityBar-background)",
        },
        activityBarBadge: {
          background: "var(--vscode-activityBarBadge-background)",
        },
        activityBarTop: {
          activeBackground: "var(--vscode-activityBarTop-activeBackground)",
          background: "var(--vscode-activityBarTop-background)",
        },
        activityErrorBadge: {
          background: "var(--vscode-activityErrorBadge-background)",
        },
        activityWarningBadge: {
          background: "var(--vscode-activityWarningBadge-background)",
        },
        badge: {
          background: "var(--vscode-badge-background)",
        },
        banner: {
          background: "var(--vscode-banner-background)",
        },
        breadcrumb: {
          background: "var(--vscode-breadcrumb-background)",
        },
        breadcrumbPicker: {
          background: "var(--vscode-breadcrumbPicker-background)",
        },
        button: {
          background: "var(--vscode-button-background)",
          hoverBackground: "var(--vscode-button-hoverBackground)",
          secondaryBackground: "var(--vscode-button-secondaryBackground)",
          secondaryHoverBackground:
            "var(--vscode-button-secondaryHoverBackground)",
        },
        chat: {
          avatarBackground: "var(--vscode-chat-avatarBackground)",
          requestBackground: "var(--vscode-chat-requestBackground)",
          slashCommandBackground: "var(--vscode-chat-slashCommandBackground)",
        },
        checkbox: {
          background: "var(--vscode-checkbox-background)",
          selectBackground: "var(--vscode-checkbox-selectBackground)",
        },
        commandCenter: {
          activeBackground: "var(--vscode-commandCenter-activeBackground)",
          background: "var(--vscode-commandCenter-background)",
          debuggingBackground:
            "var(--vscode-commandCenter-debuggingBackground)",
        },
        debugExceptionWidget: {
          background: "var(--vscode-debugExceptionWidget-background)",
        },
        debugToolBar: {
          background: "var(--vscode-debugToolBar-background)",
        },
        debugView: {
          exceptionLabelBackground:
            "var(--vscode-debugView-exceptionLabelBackground)",
          stateLabelBackground: "var(--vscode-debugView-stateLabelBackground)",
        },
        diffEditor: {
          insertedLineBackground:
            "var(--vscode-diffEditor-insertedLineBackground)",
          insertedTextBackground:
            "var(--vscode-diffEditor-insertedTextBackground)",
          removedLineBackground:
            "var(--vscode-diffEditor-removedLineBackground)",
          removedTextBackground:
            "var(--vscode-diffEditor-removedTextBackground)",
          unchangedCodeBackground:
            "var(--vscode-diffEditor-unchangedCodeBackground)",
          unchangedRegionBackground:
            "var(--vscode-diffEditor-unchangedRegionBackground)",
        },
        diffEditorGutter: {
          insertedLineBackground:
            "var(--vscode-diffEditorGutter-insertedLineBackground)",
          removedLineBackground:
            "var(--vscode-diffEditorGutter-removedLineBackground)",
        },
        dropdown: {
          background: "var(--vscode-dropdown-background)",
          listBackground: "var(--vscode-dropdown-listBackground)",
        },
        editor: {
          background: "var(--vscode-editor-background)",
          findMatchBackground: "var(--vscode-editor-findMatchBackground)",
          findMatchHighlightBackground:
            "var(--vscode-editor-findMatchHighlightBackground)",
          findRangeHighlightBackground:
            "var(--vscode-editor-findRangeHighlightBackground)",
          focusedStackFrameHighlightBackground:
            "var(--vscode-editor-focusedStackFrameHighlightBackground)",
          foldBackground: "var(--vscode-editor-foldBackground)",
          hoverHighlightBackground:
            "var(--vscode-editor-hoverHighlightBackground)",
          inactiveSelectionBackground:
            "var(--vscode-editor-inactiveSelectionBackground)",
          inlineValuesBackground: "var(--vscode-editor-inlineValuesBackground)",
          lineHighlightBackground:
            "var(--vscode-editor-lineHighlightBackground)",
          linkedEditingBackground:
            "var(--vscode-editor-linkedEditingBackground)",
          rangeHighlightBackground:
            "var(--vscode-editor-rangeHighlightBackground)",
          selectionBackground: "var(--vscode-editor-selectionBackground)",
          selectionHighlightBackground:
            "var(--vscode-editor-selectionHighlightBackground)",
          snippetFinalTabstopHighlightBackground:
            "var(--vscode-editor-snippetFinalTabstopHighlightBackground)",
          snippetTabstopHighlightBackground:
            "var(--vscode-editor-snippetTabstopHighlightBackground)",
          stackFrameHighlightBackground:
            "var(--vscode-editor-stackFrameHighlightBackground)",
          symbolHighlightBackground:
            "var(--vscode-editor-symbolHighlightBackground)",
          wordHighlightBackground:
            "var(--vscode-editor-wordHighlightBackground)",
          wordHighlightStrongBackground:
            "var(--vscode-editor-wordHighlightStrongBackground)",
          wordHighlightTextBackground:
            "var(--vscode-editor-wordHighlightTextBackground)",
        },
        editorActionList: {
          background: "var(--vscode-editorActionList-background)",
          focusBackground: "var(--vscode-editorActionList-focusBackground)",
        },
        editorBracketMatch: {
          background: "var(--vscode-editorBracketMatch-background)",
        },
        editorBracketPairGuide: {
          activeBackground1:
            "var(--vscode-editorBracketPairGuide-activeBackground1)",
          activeBackground2:
            "var(--vscode-editorBracketPairGuide-activeBackground2)",
          activeBackground3:
            "var(--vscode-editorBracketPairGuide-activeBackground3)",
          activeBackground4:
            "var(--vscode-editorBracketPairGuide-activeBackground4)",
          activeBackground5:
            "var(--vscode-editorBracketPairGuide-activeBackground5)",
          activeBackground6:
            "var(--vscode-editorBracketPairGuide-activeBackground6)",
          background1: "var(--vscode-editorBracketPairGuide-background1)",
          background2: "var(--vscode-editorBracketPairGuide-background2)",
          background3: "var(--vscode-editorBracketPairGuide-background3)",
          background4: "var(--vscode-editorBracketPairGuide-background4)",
          background5: "var(--vscode-editorBracketPairGuide-background5)",
          background6: "var(--vscode-editorBracketPairGuide-background6)",
        },
        editorCommentsWidget: {
          rangeActiveBackground:
            "var(--vscode-editorCommentsWidget-rangeActiveBackground)",
          rangeBackground: "var(--vscode-editorCommentsWidget-rangeBackground)",
          replyInputBackground:
            "var(--vscode-editorCommentsWidget-replyInputBackground)",
        },
        editorCursor: {
          background: "var(--vscode-editorCursor-background)",
        },
        editorError: {
          background: "var(--vscode-editorError-background)",
        },
        editorGhostText: {
          background: "var(--vscode-editorGhostText-background)",
        },
        editorGroup: {
          dropBackground: "var(--vscode-editorGroup-dropBackground)",
          dropIntoPromptBackground:
            "var(--vscode-editorGroup-dropIntoPromptBackground)",
          emptyBackground: "var(--vscode-editorGroup-emptyBackground)",
        },
        editorGroupHeader: {
          noTabsBackground: "var(--vscode-editorGroupHeader-noTabsBackground)",
          tabsBackground: "var(--vscode-editorGroupHeader-tabsBackground)",
        },
        editorGutter: {
          addedBackground: "var(--vscode-editorGutter-addedBackground)",
          background: "var(--vscode-editorGutter-background)",
          deletedBackground: "var(--vscode-editorGutter-deletedBackground)",
          modifiedBackground: "var(--vscode-editorGutter-modifiedBackground)",
        },
        editorHoverWidget: {
          background: "var(--vscode-editorHoverWidget-background)",
          statusBarBackground:
            "var(--vscode-editorHoverWidget-statusBarBackground)",
        },
        editorIndentGuide: {
          activeBackground: "var(--vscode-editorIndentGuide-activeBackground)",
          activeBackground1:
            "var(--vscode-editorIndentGuide-activeBackground1)",
          activeBackground2:
            "var(--vscode-editorIndentGuide-activeBackground2)",
          activeBackground3:
            "var(--vscode-editorIndentGuide-activeBackground3)",
          activeBackground4:
            "var(--vscode-editorIndentGuide-activeBackground4)",
          activeBackground5:
            "var(--vscode-editorIndentGuide-activeBackground5)",
          activeBackground6:
            "var(--vscode-editorIndentGuide-activeBackground6)",
          background: "var(--vscode-editorIndentGuide-background)",
          background1: "var(--vscode-editorIndentGuide-background1)",
          background2: "var(--vscode-editorIndentGuide-background2)",
          background3: "var(--vscode-editorIndentGuide-background3)",
          background4: "var(--vscode-editorIndentGuide-background4)",
          background5: "var(--vscode-editorIndentGuide-background5)",
          background6: "var(--vscode-editorIndentGuide-background6)",
        },
        editorInfo: {
          background: "var(--vscode-editorInfo-background)",
        },
        editorInlayHint: {
          background: "var(--vscode-editorInlayHint-background)",
          parameterBackground:
            "var(--vscode-editorInlayHint-parameterBackground)",
          typeBackground: "var(--vscode-editorInlayHint-typeBackground)",
        },
        editorMarkerNavigation: {
          background: "var(--vscode-editorMarkerNavigation-background)",
        },
        editorMarkerNavigationError: {
          background: "var(--vscode-editorMarkerNavigationError-background)",
          headerBackground:
            "var(--vscode-editorMarkerNavigationError-headerBackground)",
        },
        editorMarkerNavigationInfo: {
          background: "var(--vscode-editorMarkerNavigationInfo-background)",
          headerBackground:
            "var(--vscode-editorMarkerNavigationInfo-headerBackground)",
        },
        editorMarkerNavigationWarning: {
          background: "var(--vscode-editorMarkerNavigationWarning-background)",
          headerBackground:
            "var(--vscode-editorMarkerNavigationWarning-headerBackground)",
        },
        editorMultiCursor: {
          primary: {
            background: "var(--vscode-editorMultiCursor-primary-background)",
          },
          secondary: {
            background: "var(--vscode-editorMultiCursor-secondary-background)",
          },
        },
        editorOverviewRuler: {
          background: "var(--vscode-editorOverviewRuler-background)",
        },
        editorPane: {
          background: "var(--vscode-editorPane-background)",
        },
        editorStickyScroll: {
          background: "var(--vscode-editorStickyScroll-background)",
        },
        editorStickyScrollHover: {
          background: "var(--vscode-editorStickyScrollHover-background)",
        },
        editorSuggestWidget: {
          background: "var(--vscode-editorSuggestWidget-background)",
          selectedBackground:
            "var(--vscode-editorSuggestWidget-selectedBackground)",
        },
        editorUnicodeHighlight: {
          background: "var(--vscode-editorUnicodeHighlight-background)",
        },
        editorWarning: {
          background: "var(--vscode-editorWarning-background)",
        },
        editorWidget: {
          background: "var(--vscode-editorWidget-background)",
        },
        extensionBadge: {
          remoteBackground: "var(--vscode-extensionBadge-remoteBackground)",
        },
        extensionButton: {
          background: "var(--vscode-extensionButton-background)",
          hoverBackground: "var(--vscode-extensionButton-hoverBackground)",
          prominentBackground:
            "var(--vscode-extensionButton-prominentBackground)",
          prominentHoverBackground:
            "var(--vscode-extensionButton-prominentHoverBackground)",
        },
        inlineChat: {
          background: "var(--vscode-inlineChat-background)",
        },
        inlineChatInput: {
          background: "var(--vscode-inlineChatInput-background)",
        },
        inlineEdit: {
          indicator: {
            background: "var(--vscode-inlineEdit-indicator-background)",
          },
          modifiedBackground: "var(--vscode-inlineEdit-modifiedBackground)",
          modifiedChangedLineBackground:
            "var(--vscode-inlineEdit-modifiedChangedLineBackground)",
          modifiedChangedTextBackground:
            "var(--vscode-inlineEdit-modifiedChangedTextBackground)",
          originalBackground: "var(--vscode-inlineEdit-originalBackground)",
          originalChangedLineBackground:
            "var(--vscode-inlineEdit-originalChangedLineBackground)",
          originalChangedTextBackground:
            "var(--vscode-inlineEdit-originalChangedTextBackground)",
          acceptedBackground: "var(--vscode-inlineEdit-acceptedBackground)",
        },
        input: {
          background: "var(--vscode-input-background)",
        },
        inputOption: {
          activeBackground: "var(--vscode-inputOption-activeBackground)",
          hoverBackground: "var(--vscode-inputOption-hoverBackground)",
        },
        inputValidation: {
          errorBackground: "var(--vscode-inputValidation-errorBackground)",
          infoBackground: "var(--vscode-inputValidation-infoBackground)",
          warningBackground: "var(--vscode-inputValidation-warningBackground)",
        },
        keybindingLabel: {
          background: "var(--vscode-keybindingLabel-background)",
        },
        keybindingTable: {
          headerBackground: "var(--vscode-keybindingTable-headerBackground)",
          rowsBackground: "var(--vscode-keybindingTable-rowsBackground)",
        },
        list: {
          activeSelectionBackground:
            "var(--vscode-list-activeSelectionBackground)",
          dropBackground: "var(--vscode-list-dropBackground)",
          dropBetweenBackground: "var(--vscode-list-dropBetweenBackground)",
          filterMatchBackground: "var(--vscode-list-filterMatchBackground)",
          focusBackground: "var(--vscode-list-focusBackground)",
          hoverBackground: "var(--vscode-list-hoverBackground)",
          inactiveFocusBackground: "var(--vscode-list-inactiveFocusBackground)",
          inactiveSelectionBackground:
            "var(--vscode-list-inactiveSelectionBackground)",
        },
        listFilterWidget: {
          background: "var(--vscode-listFilterWidget-background)",
        },
        menu: {
          background: "var(--vscode-menu-background)",
          selectionBackground: "var(--vscode-menu-selectionBackground)",
          separatorBackground: "var(--vscode-menu-separatorBackground)",
        },
        menubar: {
          selectionBackground: "var(--vscode-menubar-selectionBackground)",
        },
        merge: {
          commonContentBackground:
            "var(--vscode-merge-commonContentBackground)",
          commonHeaderBackground: "var(--vscode-merge-commonHeaderBackground)",
          currentContentBackground:
            "var(--vscode-merge-currentContentBackground)",
          currentHeaderBackground:
            "var(--vscode-merge-currentHeaderBackground)",
          incomingContentBackground:
            "var(--vscode-merge-incomingContentBackground)",
          incomingHeaderBackground:
            "var(--vscode-merge-incomingHeaderBackground)",
        },
        mergeEditor: {
          change: {
            background: "var(--vscode-mergeEditor-change-background)",
            word: {
              background: "var(--vscode-mergeEditor-change-word-background)",
            },
          },
          changeBase: {
            background: "var(--vscode-mergeEditor-changeBase-background)",
            word: {
              background:
                "var(--vscode-mergeEditor-changeBase-word-background)",
            },
          },
          conflict: {
            input1: {
              background:
                "var(--vscode-mergeEditor-conflict-input1-background)",
            },
            input2: {
              background:
                "var(--vscode-mergeEditor-conflict-input2-background)",
            },
          },
          conflictingLines: {
            background: "var(--vscode-mergeEditor-conflictingLines-background)",
          },
        },
        minimap: {
          background: "var(--vscode-minimap-background)",
        },
        minimapGutter: {
          addedBackground: "var(--vscode-minimapGutter-addedBackground)",
          deletedBackground: "var(--vscode-minimapGutter-deletedBackground)",
          modifiedBackground: "var(--vscode-minimapGutter-modifiedBackground)",
        },
        minimapSlider: {
          activeBackground: "var(--vscode-minimapSlider-activeBackground)",
          background: "var(--vscode-minimapSlider-background)",
          hoverBackground: "var(--vscode-minimapSlider-hoverBackground)",
        },
        multiDiffEditor: {
          background: "var(--vscode-multiDiffEditor-background)",
          headerBackground: "var(--vscode-multiDiffEditor-headerBackground)",
        },
        notebook: {
          cellEditorBackground: "var(--vscode-notebook-cellEditorBackground)",
          cellHoverBackground: "var(--vscode-notebook-cellHoverBackground)",
          cellStatusBarItemHoverBackground:
            "var(--vscode-notebook-cellStatusBarItemHoverBackground)",
          editorBackground: "var(--vscode-notebook-editorBackground)",
          focusedCellBackground: "var(--vscode-notebook-focusedCellBackground)",
          outputContainerBackgroundColor:
            "var(--vscode-notebook-outputContainerBackgroundColor)",
          selectedCellBackground:
            "var(--vscode-notebook-selectedCellBackground)",
          symbolHighlightBackground:
            "var(--vscode-notebook-symbolHighlightBackground)",
        },
        notebookScrollbarSlider: {
          activeBackground:
            "var(--vscode-notebookScrollbarSlider-activeBackground)",
          background: "var(--vscode-notebookScrollbarSlider-background)",
          hoverBackground:
            "var(--vscode-notebookScrollbarSlider-hoverBackground)",
        },
        notificationCenterHeader: {
          background: "var(--vscode-notificationCenterHeader-background)",
        },
        notifications: {
          background: "var(--vscode-notifications-background)",
        },
        outputView: {
          background: "var(--vscode-outputView-background)",
        },
        outputViewStickyScroll: {
          background: "var(--vscode-outputViewStickyScroll-background)",
        },
        panel: {
          background: "var(--vscode-panel-background)",
        },
        panelSection: {
          dropBackground: "var(--vscode-panelSection-dropBackground)",
        },
        panelSectionHeader: {
          background: "var(--vscode-panelSectionHeader-background)",
        },
        panelStickyScroll: {
          background: "var(--vscode-panelStickyScroll-background)",
        },
        peekViewEditor: {
          background: "var(--vscode-peekViewEditor-background)",
          matchHighlightBackground:
            "var(--vscode-peekViewEditor-matchHighlightBackground)",
        },
        peekViewEditorGutter: {
          background: "var(--vscode-peekViewEditorGutter-background)",
        },
        peekViewEditorStickyScroll: {
          background: "var(--vscode-peekViewEditorStickyScroll-background)",
        },
        peekViewResult: {
          background: "var(--vscode-peekViewResult-background)",
          matchHighlightBackground:
            "var(--vscode-peekViewResult-matchHighlightBackground)",
          selectionBackground:
            "var(--vscode-peekViewResult-selectionBackground)",
        },
        peekViewTitle: {
          background: "var(--vscode-peekViewTitle-background)",
        },
        profileBadge: {
          background: "var(--vscode-profileBadge-background)",
        },
        progressBar: {
          background: "var(--vscode-progressBar-background)",
        },
        quickInput: {
          background: "var(--vscode-quickInput-background)",
          list: {
            focusBackground: "var(--vscode-quickInput-list-focusBackground)",
          },
        },
        quickInputList: {
          focusBackground: "var(--vscode-quickInputList-focusBackground)",
        },
        quickInputTitle: {
          background: "var(--vscode-quickInputTitle-background)",
        },
        radio: {
          activeBackground: "var(--vscode-radio-activeBackground)",
          inactiveBackground: "var(--vscode-radio-inactiveBackground)",
          inactiveHoverBackground:
            "var(--vscode-radio-inactiveHoverBackground)",
        },
        scmGraph: {
          historyItemHoverDefaultLabelBackground:
            "var(--vscode-scmGraph-historyItemHoverDefaultLabelBackground)",
        },
        scrollbarSlider: {
          activeBackground: "var(--vscode-scrollbarSlider-activeBackground)",
          background: "var(--vscode-scrollbarSlider-background)",
          hoverBackground: "var(--vscode-scrollbarSlider-hoverBackground)",
        },
        searchEditor: {
          findMatchBackground: "var(--vscode-searchEditor-findMatchBackground)",
        },
        selection: {
          background: "var(--vscode-selection-background)",
        },
        settings: {
          checkboxBackground: "var(--vscode-settings-checkboxBackground)",
          dropdownBackground: "var(--vscode-settings-dropdownBackground)",
          focusedRowBackground: "var(--vscode-settings-focusedRowBackground)",
          numberInputBackground: "var(--vscode-settings-numberInputBackground)",
          rowHoverBackground: "var(--vscode-settings-rowHoverBackground)",
          textInputBackground: "var(--vscode-settings-textInputBackground)",
        },
        sideBar: {
          background: "var(--vscode-sideBar-background)",
          dropBackground: "var(--vscode-sideBar-dropBackground)",
        },
        sideBarSectionHeader: {
          background: "var(--vscode-sideBarSectionHeader-background)",
        },
        sideBarStickyScroll: {
          background: "var(--vscode-sideBarStickyScroll-background)",
        },
        sideBarTitle: {
          background: "var(--vscode-sideBarTitle-background)",
        },
        statusBar: {
          background: "var(--vscode-statusBar-background)",
          debuggingBackground: "var(--vscode-statusBar-debuggingBackground)",
          noFolderBackground: "var(--vscode-statusBar-noFolderBackground)",
        },
        statusBarItem: {
          activeBackground: "var(--vscode-statusBarItem-activeBackground)",
          compactHoverBackground:
            "var(--vscode-statusBarItem-compactHoverBackground)",
          errorBackground: "var(--vscode-statusBarItem-errorBackground)",
          errorHoverBackground:
            "var(--vscode-statusBarItem-errorHoverBackground)",
          hoverBackground: "var(--vscode-statusBarItem-hoverBackground)",
          offlineBackground: "var(--vscode-statusBarItem-offlineBackground)",
          offlineHoverBackground:
            "var(--vscode-statusBarItem-offlineHoverBackground)",
          prominentBackground:
            "var(--vscode-statusBarItem-prominentBackground)",
          prominentHoverBackground:
            "var(--vscode-statusBarItem-prominentHoverBackground)",
          remoteBackground: "var(--vscode-statusBarItem-remoteBackground)",
          remoteHoverBackground:
            "var(--vscode-statusBarItem-remoteHoverBackground)",
          warningBackground: "var(--vscode-statusBarItem-warningBackground)",
          warningHoverBackground:
            "var(--vscode-statusBarItem-warningHoverBackground)",
        },
        tab: {
          activeBackground: "var(--vscode-tab-activeBackground)",
          hoverBackground: "var(--vscode-tab-hoverBackground)",
          inactiveBackground: "var(--vscode-tab-inactiveBackground)",
          selectedBackground: "var(--vscode-tab-selectedBackground)",
          unfocusedActiveBackground:
            "var(--vscode-tab-unfocusedActiveBackground)",
          unfocusedHoverBackground:
            "var(--vscode-tab-unfocusedHoverBackground)",
          unfocusedInactiveBackground:
            "var(--vscode-tab-unfocusedInactiveBackground)",
        },
        terminal: {
          background: "var(--vscode-terminal-background)",
          dropBackground: "var(--vscode-terminal-dropBackground)",
          findMatchBackground: "var(--vscode-terminal-findMatchBackground)",
          findMatchHighlightBackground:
            "var(--vscode-terminal-findMatchHighlightBackground)",
          hoverHighlightBackground:
            "var(--vscode-terminal-hoverHighlightBackground)",
          inactiveSelectionBackground:
            "var(--vscode-terminal-inactiveSelectionBackground)",
          selectionBackground: "var(--vscode-terminal-selectionBackground)",
        },
        terminalCommandDecoration: {
          defaultBackground:
            "var(--vscode-terminalCommandDecoration-defaultBackground)",
          errorBackground:
            "var(--vscode-terminalCommandDecoration-errorBackground)",
          successBackground:
            "var(--vscode-terminalCommandDecoration-successBackground)",
        },
        terminalCursor: {
          background: "var(--vscode-terminalCursor-background)",
        },
        terminalStickyScroll: {
          background: "var(--vscode-terminalStickyScroll-background)",
        },
        terminalStickyScrollHover: {
          background: "var(--vscode-terminalStickyScrollHover-background)",
        },
        testing: {
          coverCountBadgeBackground:
            "var(--vscode-testing-coverCountBadgeBackground)",
          coveredBackground: "var(--vscode-testing-coveredBackground)",
          coveredGutterBackground:
            "var(--vscode-testing-coveredGutterBackground)",
          message: {
            error: {
              badgeBackground:
                "var(--vscode-testing-message-error-badgeBackground)",
              lineBackground:
                "var(--vscode-testing-message-error-lineBackground)",
            },
            info: {
              lineBackground:
                "var(--vscode-testing-message-info-lineBackground)",
            },
          },
          messagePeekHeaderBackground:
            "var(--vscode-testing-messagePeekHeaderBackground)",
          peekHeaderBackground: "var(--vscode-testing-peekHeaderBackground)",
          uncoveredBackground: "var(--vscode-testing-uncoveredBackground)",
          uncoveredBranchBackground:
            "var(--vscode-testing-uncoveredBranchBackground)",
          uncoveredGutterBackground:
            "var(--vscode-testing-uncoveredGutterBackground)",
        },
        textBlockQuote: {
          background: "var(--vscode-textBlockQuote-background)",
        },
        textCodeBlock: {
          background: "var(--vscode-textCodeBlock-background)",
        },
        textPreformat: {
          background: "var(--vscode-textPreformat-background)",
        },
        titleBar: {
          activeBackground: "var(--vscode-titleBar-activeBackground)",
          inactiveBackground: "var(--vscode-titleBar-inactiveBackground)",
        },
        toolbar: {
          activeBackground: "var(--vscode-toolbar-activeBackground)",
          hoverBackground: "var(--vscode-toolbar-hoverBackground)",
        },
        tree: {
          tableOddRowsBackground: "var(--vscode-tree-tableOddRowsBackground)",
        },
        walkThrough: {
          embeddedEditorBackground:
            "var(--vscode-walkThrough-embeddedEditorBackground)",
        },
        welcomePage: {
          background: "var(--vscode-welcomePage-background)",
          progress: {
            background: "var(--vscode-welcomePage-progress-background)",
          },
          tileBackground: "var(--vscode-welcomePage-tileBackground)",
          tileHoverBackground: "var(--vscode-welcomePage-tileHoverBackground)",
        },
      },
      borderColor: {
        activityBar: {
          activeBorder: "var(--vscode-activityBar-activeBorder)",
          activeFocusBorder: "var(--vscode-activityBar-activeFocusBorder)",
          border: "var(--vscode-activityBar-border)",
          dropBorder: "var(--vscode-activityBar-dropBorder)",
        },
        activityBarTop: {
          activeBorder: "var(--vscode-activityBarTop-activeBorder)",
          dropBorder: "var(--vscode-activityBarTop-dropBorder)",
        },
        button: {
          border: "var(--vscode-button-border)",
          separator: "var(--vscode-button-separator)",
        },
        chat: {
          requestBorder: "var(--vscode-chat-requestBorder)",
        },
        checkbox: {
          border: "var(--vscode-checkbox-border)",
          selectBorder: "var(--vscode-checkbox-selectBorder)",
        },
        commandCenter: {
          activeBorder: "var(--vscode-commandCenter-activeBorder)",
          border: "var(--vscode-commandCenter-border)",
          inactiveBorder: "var(--vscode-commandCenter-inactiveBorder)",
        },
        contrastActiveBorder: "var(--vscode-contrastActiveBorder)",
        contrastBorder: "var(--vscode-contrastBorder)",
        debugExceptionWidget: {
          border: "var(--vscode-debugExceptionWidget-border)",
        },
        debugToolBar: {
          border: "var(--vscode-debugToolBar-border)",
        },
        diffEditor: {
          border: "var(--vscode-diffEditor-border)",
          insertedTextBorder: "var(--vscode-diffEditor-insertedTextBorder)",
          move: {
            border: "var(--vscode-diffEditor-move-border)",
          },
          moveActive: {
            border: "var(--vscode-diffEditor-moveActive-border)",
          },
          removedTextBorder: "var(--vscode-diffEditor-removedTextBorder)",
        },
        dropdown: {
          border: "var(--vscode-dropdown-border)",
        },
        editor: {
          compositionBorder: "var(--vscode-editor-compositionBorder)",
          findMatchBorder: "var(--vscode-editor-findMatchBorder)",
          findMatchHighlightBorder:
            "var(--vscode-editor-findMatchHighlightBorder)",
          findRangeHighlightBorder:
            "var(--vscode-editor-findRangeHighlightBorder)",
          lineHighlightBorder: "var(--vscode-editor-lineHighlightBorder)",
          rangeHighlightBorder: "var(--vscode-editor-rangeHighlightBorder)",
          selectionHighlightBorder:
            "var(--vscode-editor-selectionHighlightBorder)",
          snippetFinalTabstopHighlightBorder:
            "var(--vscode-editor-snippetFinalTabstopHighlightBorder)",
          snippetTabstopHighlightBorder:
            "var(--vscode-editor-snippetTabstopHighlightBorder)",
          symbolHighlightBorder: "var(--vscode-editor-symbolHighlightBorder)",
          wordHighlightBorder: "var(--vscode-editor-wordHighlightBorder)",
          wordHighlightStrongBorder:
            "var(--vscode-editor-wordHighlightStrongBorder)",
          wordHighlightTextBorder:
            "var(--vscode-editor-wordHighlightTextBorder)",
        },
        editorBracketMatch: {
          border: "var(--vscode-editorBracketMatch-border)",
        },
        editorCommentsWidget: {
          resolvedBorder: "var(--vscode-editorCommentsWidget-resolvedBorder)",
          unresolvedBorder:
            "var(--vscode-editorCommentsWidget-unresolvedBorder)",
        },
        editorError: {
          border: "var(--vscode-editorError-border)",
        },
        editorGhostText: {
          border: "var(--vscode-editorGhostText-border)",
        },
        editorGroup: {
          border: "var(--vscode-editorGroup-border)",
          dropIntoPromptBorder:
            "var(--vscode-editorGroup-dropIntoPromptBorder)",
          focusedEmptyBorder: "var(--vscode-editorGroup-focusedEmptyBorder)",
        },
        editorGroupHeader: {
          border: "var(--vscode-editorGroupHeader-border)",
          tabsBorder: "var(--vscode-editorGroupHeader-tabsBorder)",
        },
        editorHint: {
          border: "var(--vscode-editorHint-border)",
        },
        editorHoverWidget: {
          border: "var(--vscode-editorHoverWidget-border)",
        },
        editorInfo: {
          border: "var(--vscode-editorInfo-border)",
        },
        editorOverviewRuler: {
          border: "var(--vscode-editorOverviewRuler-border)",
        },
        editorStickyScroll: {
          border: "var(--vscode-editorStickyScroll-border)",
        },
        editorSuggestWidget: {
          border: "var(--vscode-editorSuggestWidget-border)",
        },
        editorUnicodeHighlight: {
          border: "var(--vscode-editorUnicodeHighlight-border)",
        },
        editorUnnecessaryCode: {
          border: "var(--vscode-editorUnnecessaryCode-border)",
        },
        editorWarning: {
          border: "var(--vscode-editorWarning-border)",
        },
        editorWidget: {
          border: "var(--vscode-editorWidget-border)",
          resizeBorder: "var(--vscode-editorWidget-resizeBorder)",
        },
        extensionButton: {
          separator: "var(--vscode-extensionButton-separator)",
        },
        focusBorder: "var(--vscode-focusBorder)",
        inlineChat: {
          border: "var(--vscode-inlineChat-border)",
        },
        inlineChatInput: {
          border: "var(--vscode-inlineChatInput-border)",
          focusBorder: "var(--vscode-inlineChatInput-focusBorder)",
        },
        inlineEdit: {
          border: "var(--vscode-inlineEdit-border)",
          indicator: {
            border: "var(--vscode-inlineEdit-indicator-border)",
          },
        },
        input: {
          border: "var(--vscode-input-border)",
        },
        inputOption: {
          activeBorder: "var(--vscode-inputOption-activeBorder)",
        },
        inputValidation: {
          errorBorder: "var(--vscode-inputValidation-errorBorder)",
          infoBorder: "var(--vscode-inputValidation-infoBorder)",
          warningBorder: "var(--vscode-inputValidation-warningBorder)",
        },
        interactive: {
          activeCodeBorder: "var(--vscode-interactive-activeCodeBorder)",
          inactiveCodeBorder: "var(--vscode-interactive-inactiveCodeBorder)",
        },
        keybindingLabel: {
          border: "var(--vscode-keybindingLabel-border)",
          bottomBorder: "var(--vscode-keybindingLabel-bottomBorder)",
        },
        list: {
          filterMatchBorder: "var(--vscode-list-filterMatchBorder)",
        },
        menu: {
          border: "var(--vscode-menu-border)",
          selectionBorder: "var(--vscode-menu-selectionBorder)",
        },
        menubar: {
          selectionBorder: "var(--vscode-menubar-selectionBorder)",
        },
        merge: {
          border: "var(--vscode-merge-border)",
        },
        mergeEditor: {
          conflict: {
            handledFocused: {
              border:
                "var(--vscode-mergeEditor-conflict-handledFocused-border)",
            },
            handledUnfocused: {
              border:
                "var(--vscode-mergeEditor-conflict-handledUnfocused-border)",
            },
            unhandledFocused: {
              border:
                "var(--vscode-mergeEditor-conflict-unhandledFocused-border)",
            },
            unhandledUnfocused: {
              border:
                "var(--vscode-mergeEditor-conflict-unhandledUnfocused-border)",
            },
          },
        },
        multiDiffEditor: {
          border: "var(--vscode-multiDiffEditor-border)",
        },
        notebook: {
          cellToolbarSeparator: "var(--vscode-notebook-cellToolbarSeparator)",
          focusedCellBorder: "var(--vscode-notebook-focusedCellBorder)",
          focusedEditorBorder: "var(--vscode-notebook-focusedEditorBorder)",
          inactiveFocusedCellBorder:
            "var(--vscode-notebook-inactiveFocusedCellBorder)",
          inactiveSelectedCellBorder:
            "var(--vscode-notebook-inactiveSelectedCellBorder)",
          selectedCellBorder: "var(--vscode-notebook-selectedCellBorder)",
        },
        notificationCenter: {
          border: "var(--vscode-notificationCenter-border)",
        },
        notificationToast: {
          border: "var(--vscode-notificationToast-border)",
        },
        notifications: {
          border: "var(--vscode-notifications-border)",
        },
        panel: {
          border: "var(--vscode-panel-border)",
          dropBorder: "var(--vscode-panel-dropBorder)",
        },
        panelInput: {
          border: "var(--vscode-panelInput-border)",
        },
        panelSection: {
          border: "var(--vscode-panelSection-border)",
        },
        panelSectionHeader: {
          border: "var(--vscode-panelSectionHeader-border)",
        },
        panelStickyScroll: {
          border: "var(--vscode-panelStickyScroll-border)",
        },
        panelTitle: {
          activeBorder: "var(--vscode-panelTitle-activeBorder)",
          border: "var(--vscode-panelTitle-border)",
        },
        peekView: {
          border: "var(--vscode-peekView-border)",
        },
        peekViewEditor: {
          matchHighlightBorder:
            "var(--vscode-peekViewEditor-matchHighlightBorder)",
        },
        pickerGroup: {
          border: "var(--vscode-pickerGroup-border)",
        },
        profiles: {
          sashBorder: "var(--vscode-profiles-sashBorder)",
        },
        radio: {
          activeBorder: "var(--vscode-radio-activeBorder)",
          inactiveBorder: "var(--vscode-radio-inactiveBorder)",
        },
        sash: {
          hoverBorder: "var(--vscode-sash-hoverBorder)",
        },
        searchEditor: {
          findMatchBorder: "var(--vscode-searchEditor-findMatchBorder)",
          textInputBorder: "var(--vscode-searchEditor-textInputBorder)",
        },
        settings: {
          checkboxBorder: "var(--vscode-settings-checkboxBorder)",
          dropdownBorder: "var(--vscode-settings-dropdownBorder)",
          dropdownListBorder: "var(--vscode-settings-dropdownListBorder)",
          focusedRowBorder: "var(--vscode-settings-focusedRowBorder)",
          headerBorder: "var(--vscode-settings-headerBorder)",
          numberInputBorder: "var(--vscode-settings-numberInputBorder)",
          sashBorder: "var(--vscode-settings-sashBorder)",
          textInputBorder: "var(--vscode-settings-textInputBorder)",
        },
        sideBar: {
          border: "var(--vscode-sideBar-border)",
        },
        sideBarActivityBarTop: {
          border: "var(--vscode-sideBarActivityBarTop-border)",
        },
        sideBarSectionHeader: {
          border: "var(--vscode-sideBarSectionHeader-border)",
        },
        sideBarStickyScroll: {
          border: "var(--vscode-sideBarStickyScroll-border)",
        },
        sideBarTitle: {
          border: "var(--vscode-sideBarTitle-border)",
        },
        sideBySideEditor: {
          horizontalBorder: "var(--vscode-sideBySideEditor-horizontalBorder)",
          verticalBorder: "var(--vscode-sideBySideEditor-verticalBorder)",
        },
        simpleFindWidget: {
          sashBorder: "var(--vscode-simpleFindWidget-sashBorder)",
        },
        statusBar: {
          border: "var(--vscode-statusBar-border)",
          debuggingBorder: "var(--vscode-statusBar-debuggingBorder)",
          focusBorder: "var(--vscode-statusBar-focusBorder)",
          noFolderBorder: "var(--vscode-statusBar-noFolderBorder)",
        },
        statusBarItem: {
          focusBorder: "var(--vscode-statusBarItem-focusBorder)",
        },
        tab: {
          activeBorder: "var(--vscode-tab-activeBorder)",
          activeModifiedBorder: "var(--vscode-tab-activeModifiedBorder)",
          border: "var(--vscode-tab-border)",
          dragAndDropBorder: "var(--vscode-tab-dragAndDropBorder)",
          hoverBorder: "var(--vscode-tab-hoverBorder)",
          inactiveModifiedBorder: "var(--vscode-tab-inactiveModifiedBorder)",
          lastPinnedBorder: "var(--vscode-tab-lastPinnedBorder)",
          unfocusedActiveBorder: "var(--vscode-tab-unfocusedActiveBorder)",
          unfocusedActiveModifiedBorder:
            "var(--vscode-tab-unfocusedActiveModifiedBorder)",
          unfocusedHoverBorder: "var(--vscode-tab-unfocusedHoverBorder)",
          unfocusedInactiveModifiedBorder:
            "var(--vscode-tab-unfocusedInactiveModifiedBorder)",
        },
        terminal: {
          border: "var(--vscode-terminal-border)",
          findMatchBorder: "var(--vscode-terminal-findMatchBorder)",
          findMatchHighlightBorder:
            "var(--vscode-terminal-findMatchHighlightBorder)",
          tab: {
            activeBorder: "var(--vscode-terminal-tab-activeBorder)",
          },
        },
        terminalOverviewRuler: {
          border: "var(--vscode-terminalOverviewRuler-border)",
        },
        terminalStickyScroll: {
          border: "var(--vscode-terminalStickyScroll-border)",
        },
        testing: {
          coveredBorder: "var(--vscode-testing-coveredBorder)",
          message: {
            error: {
              badgeBorder: "var(--vscode-testing-message-error-badgeBorder)",
            },
          },
          messagePeekBorder: "var(--vscode-testing-messagePeekBorder)",
          peekBorder: "var(--vscode-testing-peekBorder)",
          uncoveredBorder: "var(--vscode-testing-uncoveredBorder)",
        },
        textBlockQuote: {
          border: "var(--vscode-textBlockQuote-border)",
        },
        titleBar: {
          border: "var(--vscode-titleBar-border)",
        },
        tree: {
          tableColumnsBorder: "var(--vscode-tree-tableColumnsBorder)",
        },
        welcomePage: {
          tileBorder: "var(--vscode-welcomePage-tileBorder)",
        },
        widget: {
          border: "var(--vscode-widget-border)",
        },
        window: {
          activeBorder: "var(--vscode-window-activeBorder)",
          inactiveBorder: "var(--vscode-window-inactiveBorder)",
        },
      },
      boxShadow: {
        diffEditor: "var(--vscode-diffEditor-unchangedRegionShadow)",
        editorStickyScroll: "var(--vscode-editorStickyScroll-shadow)",
        inlineChat: "var(--vscode-inlineChat-shadow)",
        listFilterWidget: "var(--vscode-listFilterWidget-shadow)",
        panelStickyScroll: "var(--vscode-panelStickyScroll-shadow)",
        scrollbar: "var(--vscode-scrollbar-shadow)",
        sideBarStickyScroll: "var(--vscode-sideBarStickyScroll-shadow)",
        widget: "var(--vscode-widget-shadow)",
      },
      colors: {
        chart: {
          axis: "var(--vscode-chart-axis)",
          guide: "var(--vscode-chart-guide)",
          line: "var(--vscode-chart-line)",
        },
        charts: {
          blue: "var(--vscode-charts-blue)",
          green: "var(--vscode-charts-green)",
          lines: "var(--vscode-charts-lines)",
          orange: "var(--vscode-charts-orange)",
          purple: "var(--vscode-charts-purple)",
          red: "var(--vscode-charts-red)",
          yellow: "var(--vscode-charts-yellow)",
        },
        commentsView: {
          resolvedIcon: "var(--vscode-commentsView-resolvedIcon)",
          unresolvedIcon: "var(--vscode-commentsView-unresolvedIcon)",
        },
        debugTokenExpression: {
          boolean: "var(--vscode-debugTokenExpression-boolean)",
          error: "var(--vscode-debugTokenExpression-error)",
          name: "var(--vscode-debugTokenExpression-name)",
          number: "var(--vscode-debugTokenExpression-number)",
          string: "var(--vscode-debugTokenExpression-string)",
          type: "var(--vscode-debugTokenExpression-type)",
          value: "var(--vscode-debugTokenExpression-value)",
        },
        debugView: {
          valueChangedHighlight:
            "var(--vscode-debugView-valueChangedHighlight)",
        },
        diffEditor: {
          diagonalFill: "var(--vscode-diffEditor-diagonalFill)",
        },
        editorOverviewRuler: {
          inlineChatInserted:
            "var(--vscode-editorOverviewRuler-inlineChatInserted)",
          inlineChatRemoved:
            "var(--vscode-editorOverviewRuler-inlineChatRemoved)",
        },
        inlineChatDiff: {
          inserted: "var(--vscode-inlineChatDiff-inserted)",
          removed: "var(--vscode-inlineChatDiff-removed)",
        },
        mergeEditor: {
          conflict: {
            handled: {
              minimapOverViewRuler:
                "var(--vscode-mergeEditor-conflict-handled-minimapOverViewRuler)",
            },
            unhandled: {
              minimapOverViewRuler:
                "var(--vscode-mergeEditor-conflict-unhandled-minimapOverViewRuler)",
            },
          },
        },
        minimap: {
          errorHighlight: "var(--vscode-minimap-errorHighlight)",
          findMatchHighlight: "var(--vscode-minimap-findMatchHighlight)",
          infoHighlight: "var(--vscode-minimap-infoHighlight)",
          selectionHighlight: "var(--vscode-minimap-selectionHighlight)",
          selectionOccurrenceHighlight:
            "var(--vscode-minimap-selectionOccurrenceHighlight)",
          warningHighlight: "var(--vscode-minimap-warningHighlight)",
        },
        notebook: {
          cellBorderColor: "var(--vscode-notebook-cellBorderColor)",
          cellInsertionIndicator:
            "var(--vscode-notebook-cellInsertionIndicator)",
          outputContainerBorderColor:
            "var(--vscode-notebook-outputContainerBorderColor)",
        },
        scmGraph: {
          historyItemBaseRefColor:
            "var(--vscode-scmGraph-historyItemBaseRefColor)",
          historyItemRefColor: "var(--vscode-scmGraph-historyItemRefColor)",
          historyItemRemoteRefColor:
            "var(--vscode-scmGraph-historyItemRemoteRefColor)",
        },
        settings: {
          modifiedItemIndicator: "var(--vscode-settings-modifiedItemIndicator)",
        },
        tab: {
          activeBorderTop: "var(--vscode-tab-activeBorderTop)",
          selectedBorderTop: "var(--vscode-tab-selectedBorderTop)",
          unfocusedActiveBorderTop:
            "var(--vscode-tab-unfocusedActiveBorderTop)",
        },
        terminal: {
          ansiBlack: "var(--vscode-terminal-ansiBlack)",
          ansiBlue: "var(--vscode-terminal-ansiBlue)",
          ansiBrightBlack: "var(--vscode-terminal-ansiBrightBlack)",
          ansiBrightBlue: "var(--vscode-terminal-ansiBrightBlue)",
          ansiBrightCyan: "var(--vscode-terminal-ansiBrightCyan)",
          ansiBrightGreen: "var(--vscode-terminal-ansiBrightGreen)",
          ansiBrightMagenta: "var(--vscode-terminal-ansiBrightMagenta)",
          ansiBrightRed: "var(--vscode-terminal-ansiBrightRed)",
          ansiBrightWhite: "var(--vscode-terminal-ansiBrightWhite)",
          ansiBrightYellow: "var(--vscode-terminal-ansiBrightYellow)",
          ansiCyan: "var(--vscode-terminal-ansiCyan)",
          ansiGreen: "var(--vscode-terminal-ansiGreen)",
          ansiMagenta: "var(--vscode-terminal-ansiMagenta)",
          ansiRed: "var(--vscode-terminal-ansiRed)",
          ansiWhite: "var(--vscode-terminal-ansiWhite)",
          ansiYellow: "var(--vscode-terminal-ansiYellow)",
        },
        testing: {
          iconErrored: {
            default: "var(--vscode-testing-iconErrored)",
            retired: "var(--vscode-testing-iconErrored-retired)",
          },
          iconFailed: {
            default: "var(--vscode-testing-iconFailed)",
            retired: "var(--vscode-testing-iconFailed-retired)",
          },
          iconPassed: {
            default: "var(--vscode-testing-iconPassed)",
            retired: "var(--vscode-testing-iconPassed-retired)",
          },
          iconQueued: {
            default: "var(--vscode-testing-iconQueued)",
            retired: "var(--vscode-testing-iconQueued-retired)",
          },
          iconSkipped: {
            default: "var(--vscode-testing-iconSkipped)",
            retired: "var(--vscode-testing-iconSkipped-retired)",
          },
          iconUnset: {
            default: "var(--vscode-testing-iconUnset)",
            retired: "var(--vscode-testing-iconUnset-retired)",
          },
          runAction: "var(--vscode-testing-runAction)",
        },
      },
      opacity: {
        "editorUnnecessaryCode-opacity":
          "var(--vscode-editorUnnecessaryCode-opacity)",
        "minimap-foregroundOpacity": "var(--vscode-minimap-foregroundOpacity)",
      },
      outlineColor: {
        list: {
          focusAndSelectionOutline:
            "var(--vscode-list-focusAndSelectionOutline)",
          focusOutline: "var(--vscode-list-focusOutline)",
          inactiveFocusOutline: "var(--vscode-list-inactiveFocusOutline)",
        },
        listFilterWidget: {
          noMatchesOutline: "var(--vscode-listFilterWidget-noMatchesOutline)",
          outline: "var(--vscode-listFilterWidget-outline)",
        },
        toolbar: {
          hoverOutline: "var(--vscode-toolbar-hoverOutline)",
        },
      },
      stroke: {
        tree: {
          inactiveIndentGuidesStroke:
            "var(--vscode-tree-inactiveIndentGuidesStroke)",
          indentGuidesStroke: "var(--vscode-tree-indentGuidesStroke)",
        },
      },
      textColor: {
        activityBar: {
          foreground: "var(--vscode-activityBar-foreground)",
          inactiveForeground: "var(--vscode-activityBar-inactiveForeground)",
        },
        activityBarBadge: {
          foreground: "var(--vscode-activityBarBadge-foreground)",
        },
        activityBarTop: {
          foreground: "var(--vscode-activityBarTop-foreground)",
          inactiveForeground: "var(--vscode-activityBarTop-inactiveForeground)",
        },
        activityErrorBadge: {
          foreground: "var(--vscode-activityErrorBadge-foreground)",
        },
        activityWarningBadge: {
          foreground: "var(--vscode-activityWarningBadge-foreground)",
        },
        badge: {
          foreground: "var(--vscode-badge-foreground)",
        },
        banner: {
          foreground: "var(--vscode-banner-foreground)",
          iconForeground: "var(--vscode-banner-iconForeground)",
        },
        breadcrumb: {
          activeSelectionForeground:
            "var(--vscode-breadcrumb-activeSelectionForeground)",
          focusForeground: "var(--vscode-breadcrumb-focusForeground)",
          foreground: "var(--vscode-breadcrumb-foreground)",
        },
        button: {
          foreground: "var(--vscode-button-foreground)",
          secondaryForeground: "var(--vscode-button-secondaryForeground)",
        },
        charts: {
          foreground: "var(--vscode-charts-foreground)",
        },
        chat: {
          avatarForeground: "var(--vscode-chat-avatarForeground)",
          editedFileForeground: "var(--vscode-chat-editedFileForeground)",
          slashCommandForeground: "var(--vscode-chat-slashCommandForeground)",
        },
        checkbox: {
          foreground: "var(--vscode-checkbox-foreground)",
        },
        commandCenter: {
          activeForeground: "var(--vscode-commandCenter-activeForeground)",
          foreground: "var(--vscode-commandCenter-foreground)",
          inactiveForeground: "var(--vscode-commandCenter-inactiveForeground)",
        },
        debugConsole: {
          errorForeground: "var(--vscode-debugConsole-errorForeground)",
          infoForeground: "var(--vscode-debugConsole-infoForeground)",
          sourceForeground: "var(--vscode-debugConsole-sourceForeground)",
          warningForeground: "var(--vscode-debugConsole-warningForeground)",
        },
        debugConsoleInputIcon: {
          foreground: "var(--vscode-debugConsoleInputIcon-foreground)",
        },
        debugIcon: {
          breakpointCurrentStackframeForeground:
            "var(--vscode-debugIcon-breakpointCurrentStackframeForeground)",
          breakpointDisabledForeground:
            "var(--vscode-debugIcon-breakpointDisabledForeground)",
          breakpointForeground: "var(--vscode-debugIcon-breakpointForeground)",
          breakpointStackframeForeground:
            "var(--vscode-debugIcon-breakpointStackframeForeground)",
          breakpointUnverifiedForeground:
            "var(--vscode-debugIcon-breakpointUnverifiedForeground)",
          continueForeground: "var(--vscode-debugIcon-continueForeground)",
          disconnectForeground: "var(--vscode-debugIcon-disconnectForeground)",
          pauseForeground: "var(--vscode-debugIcon-pauseForeground)",
          restartForeground: "var(--vscode-debugIcon-restartForeground)",
          startForeground: "var(--vscode-debugIcon-startForeground)",
          stepBackForeground: "var(--vscode-debugIcon-stepBackForeground)",
          stepIntoForeground: "var(--vscode-debugIcon-stepIntoForeground)",
          stepOutForeground: "var(--vscode-debugIcon-stepOutForeground)",
          stepOverForeground: "var(--vscode-debugIcon-stepOverForeground)",
          stopForeground: "var(--vscode-debugIcon-stopForeground)",
        },
        debugView: {
          exceptionLabelForeground:
            "var(--vscode-debugView-exceptionLabelForeground)",
          stateLabelForeground: "var(--vscode-debugView-stateLabelForeground)",
        },
        descriptionForeground: "var(--vscode-descriptionForeground)",
        diffEditor: {
          unchangedRegionForeground:
            "var(--vscode-diffEditor-unchangedRegionForeground)",
        },
        diffEditorOverview: {
          insertedForeground:
            "var(--vscode-diffEditorOverview-insertedForeground)",
          removedForeground:
            "var(--vscode-diffEditorOverview-removedForeground)",
        },
        disabledForeground: "var(--vscode-disabledForeground)",
        dropdown: {
          foreground: "var(--vscode-dropdown-foreground)",
        },
        editor: {
          findMatchForeground: "var(--vscode-editor-findMatchForeground)",
          findMatchHighlightForeground:
            "var(--vscode-editor-findMatchHighlightForeground)",
          foldPlaceholderForeground:
            "var(--vscode-editor-foldPlaceholderForeground)",
          foreground: "var(--vscode-editor-foreground)",
          inlineValuesForeground: "var(--vscode-editor-inlineValuesForeground)",
          placeholder: {
            foreground: "var(--vscode-editor-placeholder-foreground)",
          },
          selectionForeground: "var(--vscode-editor-selectionForeground)",
        },
        editorActionList: {
          focusForeground: "var(--vscode-editorActionList-focusForeground)",
          foreground: "var(--vscode-editorActionList-foreground)",
        },
        editorActiveLineNumber: {
          foreground: "var(--vscode-editorActiveLineNumber-foreground)",
        },
        editorBracketHighlight: {
          foreground1: "var(--vscode-editorBracketHighlight-foreground1)",
          foreground2: "var(--vscode-editorBracketHighlight-foreground2)",
          foreground3: "var(--vscode-editorBracketHighlight-foreground3)",
          foreground4: "var(--vscode-editorBracketHighlight-foreground4)",
          foreground5: "var(--vscode-editorBracketHighlight-foreground5)",
          foreground6: "var(--vscode-editorBracketHighlight-foreground6)",
          unexpectedBracket: {
            foreground:
              "var(--vscode-editorBracketHighlight-unexpectedBracket-foreground)",
          },
        },
        editorCodeLens: {
          foreground: "var(--vscode-editorCodeLens-foreground)",
        },
        editorCursor: {
          foreground: "var(--vscode-editorCursor-foreground)",
        },
        editorError: {
          foreground: "var(--vscode-editorError-foreground)",
        },
        editorGhostText: {
          foreground: "var(--vscode-editorGhostText-foreground)",
        },
        editorGroup: {
          dropIntoPromptForeground:
            "var(--vscode-editorGroup-dropIntoPromptForeground)",
        },
        editorGutter: {
          commentGlyphForeground:
            "var(--vscode-editorGutter-commentGlyphForeground)",
          commentRangeForeground:
            "var(--vscode-editorGutter-commentRangeForeground)",
          commentUnresolvedGlyphForeground:
            "var(--vscode-editorGutter-commentUnresolvedGlyphForeground)",
          foldingControlForeground:
            "var(--vscode-editorGutter-foldingControlForeground)",
        },
        editorHint: {
          foreground: "var(--vscode-editorHint-foreground)",
        },
        editorHoverWidget: {
          foreground: "var(--vscode-editorHoverWidget-foreground)",
          highlightForeground:
            "var(--vscode-editorHoverWidget-highlightForeground)",
        },
        editorInfo: {
          foreground: "var(--vscode-editorInfo-foreground)",
        },
        editorInlayHint: {
          foreground: "var(--vscode-editorInlayHint-foreground)",
          parameterForeground:
            "var(--vscode-editorInlayHint-parameterForeground)",
          typeForeground: "var(--vscode-editorInlayHint-typeForeground)",
        },
        editorLightBulb: {
          foreground: "var(--vscode-editorLightBulb-foreground)",
        },
        editorLightBulbAi: {
          foreground: "var(--vscode-editorLightBulbAi-foreground)",
        },
        editorLightBulbAutoFix: {
          foreground: "var(--vscode-editorLightBulbAutoFix-foreground)",
        },
        editorLineNumber: {
          activeForeground: "var(--vscode-editorLineNumber-activeForeground)",
          dimmedForeground: "var(--vscode-editorLineNumber-dimmedForeground)",
          foreground: "var(--vscode-editorLineNumber-foreground)",
        },
        editorLink: {
          activeForeground: "var(--vscode-editorLink-activeForeground)",
        },
        editorMultiCursor: {
          primary: {
            foreground: "var(--vscode-editorMultiCursor-primary-foreground)",
          },
          secondary: {
            foreground: "var(--vscode-editorMultiCursor-secondary-foreground)",
          },
        },
        editorOverviewRuler: {
          addedForeground: "var(--vscode-editorOverviewRuler-addedForeground)",
          bracketMatchForeground:
            "var(--vscode-editorOverviewRuler-bracketMatchForeground)",
          commentForeground:
            "var(--vscode-editorOverviewRuler-commentForeground)",
          commentUnresolvedForeground:
            "var(--vscode-editorOverviewRuler-commentUnresolvedForeground)",
          commonContentForeground:
            "var(--vscode-editorOverviewRuler-commonContentForeground)",
          currentContentForeground:
            "var(--vscode-editorOverviewRuler-currentContentForeground)",
          deletedForeground:
            "var(--vscode-editorOverviewRuler-deletedForeground)",
          errorForeground: "var(--vscode-editorOverviewRuler-errorForeground)",
          findMatchForeground:
            "var(--vscode-editorOverviewRuler-findMatchForeground)",
          incomingContentForeground:
            "var(--vscode-editorOverviewRuler-incomingContentForeground)",
          infoForeground: "var(--vscode-editorOverviewRuler-infoForeground)",
          modifiedForeground:
            "var(--vscode-editorOverviewRuler-modifiedForeground)",
          rangeHighlightForeground:
            "var(--vscode-editorOverviewRuler-rangeHighlightForeground)",
          selectionHighlightForeground:
            "var(--vscode-editorOverviewRuler-selectionHighlightForeground)",
          warningForeground:
            "var(--vscode-editorOverviewRuler-warningForeground)",
          wordHighlightForeground:
            "var(--vscode-editorOverviewRuler-wordHighlightForeground)",
          wordHighlightStrongForeground:
            "var(--vscode-editorOverviewRuler-wordHighlightStrongForeground)",
          wordHighlightTextForeground:
            "var(--vscode-editorOverviewRuler-wordHighlightTextForeground)",
        },
        editorRuler: {
          foreground: "var(--vscode-editorRuler-foreground)",
        },
        editorSuggestWidget: {
          focusHighlightForeground:
            "var(--vscode-editorSuggestWidget-focusHighlightForeground)",
          foreground: "var(--vscode-editorSuggestWidget-foreground)",
          highlightForeground:
            "var(--vscode-editorSuggestWidget-highlightForeground)",
          selectedForeground:
            "var(--vscode-editorSuggestWidget-selectedForeground)",
          selectedIconForeground:
            "var(--vscode-editorSuggestWidget-selectedIconForeground)",
        },
        editorSuggestWidgetStatus: {
          foreground: "var(--vscode-editorSuggestWidgetStatus-foreground)",
        },
        editorWarning: {
          foreground: "var(--vscode-editorWarning-foreground)",
        },
        editorWatermark: {
          foreground: "var(--vscode-editorWatermark-foreground)",
        },
        editorWhitespace: {
          foreground: "var(--vscode-editorWhitespace-foreground)",
        },
        editorWidget: {
          foreground: "var(--vscode-editorWidget-foreground)",
        },
        errorForeground: "var(--vscode-errorForeground)",
        extensionBadge: {
          remoteForeground: "var(--vscode-extensionBadge-remoteForeground)",
        },
        extensionButton: {
          foreground: "var(--vscode-extensionButton-foreground)",
          prominentForeground:
            "var(--vscode-extensionButton-prominentForeground)",
        },
        extensionIcon: {
          preReleaseForeground:
            "var(--vscode-extensionIcon-preReleaseForeground)",
          sponsorForeground: "var(--vscode-extensionIcon-sponsorForeground)",
          starForeground: "var(--vscode-extensionIcon-starForeground)",
          verifiedForeground: "var(--vscode-extensionIcon-verifiedForeground)",
        },
        foreground: "var(--vscode-foreground)",
        icon: {
          foreground: "var(--vscode-icon-foreground)",
        },
        inlineChat: {
          foreground: "var(--vscode-inlineChat-foreground)",
        },
        inlineChatInput: {
          placeholderForeground:
            "var(--vscode-inlineChatInput-placeholderForeground)",
        },
        inlineEdit: {
          indicator: {
            foreground: "var(--vscode-inlineEdit-indicator-foreground)",
          },
        },
        input: {
          foreground: "var(--vscode-input-foreground)",
          placeholderForeground: "var(--vscode-input-placeholderForeground)",
        },
        inputOption: {
          activeForeground: "var(--vscode-inputOption-activeForeground)",
        },
        inputValidation: {
          errorForeground: "var(--vscode-inputValidation-errorForeground)",
          infoForeground: "var(--vscode-inputValidation-infoForeground)",
          warningForeground: "var(--vscode-inputValidation-warningForeground)",
        },
        keybindingLabel: {
          foreground: "var(--vscode-keybindingLabel-foreground)",
        },
        list: {
          activeSelectionForeground:
            "var(--vscode-list-activeSelectionForeground)",
          activeSelectionIconForeground:
            "var(--vscode-list-activeSelectionIconForeground)",
          deemphasizedForeground: "var(--vscode-list-deemphasizedForeground)",
          errorForeground: "var(--vscode-list-errorForeground)",
          focusForeground: "var(--vscode-list-focusForeground)",
          focusHighlightForeground:
            "var(--vscode-list-focusHighlightForeground)",
          highlightForeground: "var(--vscode-list-highlightForeground)",
          hoverForeground: "var(--vscode-list-hoverForeground)",
          inactiveSelectionForeground:
            "var(--vscode-list-inactiveSelectionForeground)",
          inactiveSelectionIconForeground:
            "var(--vscode-list-inactiveSelectionIconForeground)",
          invalidItemForeground: "var(--vscode-list-invalidItemForeground)",
          warningForeground: "var(--vscode-list-warningForeground)",
        },
        menu: {
          foreground: "var(--vscode-menu-foreground)",
          selectionForeground: "var(--vscode-menu-selectionForeground)",
        },
        menubar: {
          selectionForeground: "var(--vscode-menubar-selectionForeground)",
        },
        notebookEditorOverviewRuler: {
          runningCellForeground:
            "var(--vscode-notebookEditorOverviewRuler-runningCellForeground)",
        },
        notebookStatusErrorIcon: {
          foreground: "var(--vscode-notebookStatusErrorIcon-foreground)",
        },
        notebookStatusRunningIcon: {
          foreground: "var(--vscode-notebookStatusRunningIcon-foreground)",
        },
        notebookStatusSuccessIcon: {
          foreground: "var(--vscode-notebookStatusSuccessIcon-foreground)",
        },
        notificationCenterHeader: {
          foreground: "var(--vscode-notificationCenterHeader-foreground)",
        },
        notificationLink: {
          foreground: "var(--vscode-notificationLink-foreground)",
        },
        notifications: {
          foreground: "var(--vscode-notifications-foreground)",
        },
        notificationsErrorIcon: {
          foreground: "var(--vscode-notificationsErrorIcon-foreground)",
        },
        notificationsInfoIcon: {
          foreground: "var(--vscode-notificationsInfoIcon-foreground)",
        },
        notificationsWarningIcon: {
          foreground: "var(--vscode-notificationsWarningIcon-foreground)",
        },
        panelSectionHeader: {
          foreground: "var(--vscode-panelSectionHeader-foreground)",
        },
        panelTitle: {
          activeForeground: "var(--vscode-panelTitle-activeForeground)",
          inactiveForeground: "var(--vscode-panelTitle-inactiveForeground)",
        },
        peekViewResult: {
          fileForeground: "var(--vscode-peekViewResult-fileForeground)",
          lineForeground: "var(--vscode-peekViewResult-lineForeground)",
          selectionForeground:
            "var(--vscode-peekViewResult-selectionForeground)",
        },
        peekViewTitleDescription: {
          foreground: "var(--vscode-peekViewTitleDescription-foreground)",
        },
        peekViewTitleLabel: {
          foreground: "var(--vscode-peekViewTitleLabel-foreground)",
        },
        pickerGroup: {
          foreground: "var(--vscode-pickerGroup-foreground)",
        },
        ports: {
          iconRunningProcessForeground:
            "var(--vscode-ports-iconRunningProcessForeground)",
        },
        problemsErrorIcon: {
          foreground: "var(--vscode-problemsErrorIcon-foreground)",
        },
        problemsInfoIcon: {
          foreground: "var(--vscode-problemsInfoIcon-foreground)",
        },
        problemsWarningIcon: {
          foreground: "var(--vscode-problemsWarningIcon-foreground)",
        },
        profileBadge: {
          foreground: "var(--vscode-profileBadge-foreground)",
        },
        quickInput: {
          foreground: "var(--vscode-quickInput-foreground)",
        },
        quickInputList: {
          focusForeground: "var(--vscode-quickInputList-focusForeground)",
          focusIconForeground:
            "var(--vscode-quickInputList-focusIconForeground)",
        },
        radio: {
          activeForeground: "var(--vscode-radio-activeForeground)",
          inactiveForeground: "var(--vscode-radio-inactiveForeground)",
        },
        scmGraph: {
          foreground1: "var(--vscode-scmGraph-foreground1)",
          foreground2: "var(--vscode-scmGraph-foreground2)",
          foreground3: "var(--vscode-scmGraph-foreground3)",
          foreground4: "var(--vscode-scmGraph-foreground4)",
          foreground5: "var(--vscode-scmGraph-foreground5)",
          historyItemHoverAdditionsForeground:
            "var(--vscode-scmGraph-historyItemHoverAdditionsForeground)",
          historyItemHoverDefaultLabelForeground:
            "var(--vscode-scmGraph-historyItemHoverDefaultLabelForeground)",
          historyItemHoverDeletionsForeground:
            "var(--vscode-scmGraph-historyItemHoverDeletionsForeground)",
          historyItemHoverLabelForeground:
            "var(--vscode-scmGraph-historyItemHoverLabelForeground)",
        },
        search: {
          resultsInfoForeground: "var(--vscode-search-resultsInfoForeground)",
        },
        settings: {
          checkboxForeground: "var(--vscode-settings-checkboxForeground)",
          dropdownForeground: "var(--vscode-settings-dropdownForeground)",
          headerForeground: "var(--vscode-settings-headerForeground)",
          numberInputForeground: "var(--vscode-settings-numberInputForeground)",
          settingsHeaderHoverForeground:
            "var(--vscode-settings-settingsHeaderHoverForeground)",
          textInputForeground: "var(--vscode-settings-textInputForeground)",
        },
        sideBar: {
          foreground: "var(--vscode-sideBar-foreground)",
        },
        sideBarSectionHeader: {
          foreground: "var(--vscode-sideBarSectionHeader-foreground)",
        },
        sideBarTitle: {
          foreground: "var(--vscode-sideBarTitle-foreground)",
        },
        statusBar: {
          debuggingForeground: "var(--vscode-statusBar-debuggingForeground)",
          foreground: "var(--vscode-statusBar-foreground)",
          noFolderForeground: "var(--vscode-statusBar-noFolderForeground)",
        },
        statusBarItem: {
          errorForeground: "var(--vscode-statusBarItem-errorForeground)",
          errorHoverForeground:
            "var(--vscode-statusBarItem-errorHoverForeground)",
          hoverForeground: "var(--vscode-statusBarItem-hoverForeground)",
          offlineForeground: "var(--vscode-statusBarItem-offlineForeground)",
          offlineHoverForeground:
            "var(--vscode-statusBarItem-offlineHoverForeground)",
          prominentForeground:
            "var(--vscode-statusBarItem-prominentForeground)",
          prominentHoverForeground:
            "var(--vscode-statusBarItem-prominentHoverForeground)",
          remoteForeground: "var(--vscode-statusBarItem-remoteForeground)",
          remoteHoverForeground:
            "var(--vscode-statusBarItem-remoteHoverForeground)",
          warningForeground: "var(--vscode-statusBarItem-warningForeground)",
          warningHoverForeground:
            "var(--vscode-statusBarItem-warningHoverForeground)",
        },
        symbolIcon: {
          arrayForeground: "var(--vscode-symbolIcon-arrayForeground)",
          booleanForeground: "var(--vscode-symbolIcon-booleanForeground)",
          classForeground: "var(--vscode-symbolIcon-classForeground)",
          colorForeground: "var(--vscode-symbolIcon-colorForeground)",
          constantForeground: "var(--vscode-symbolIcon-constantForeground)",
          constructorForeground:
            "var(--vscode-symbolIcon-constructorForeground)",
          enumeratorForeground: "var(--vscode-symbolIcon-enumeratorForeground)",
          enumeratorMemberForeground:
            "var(--vscode-symbolIcon-enumeratorMemberForeground)",
          eventForeground: "var(--vscode-symbolIcon-eventForeground)",
          fieldForeground: "var(--vscode-symbolIcon-fieldForeground)",
          fileForeground: "var(--vscode-symbolIcon-fileForeground)",
          folderForeground: "var(--vscode-symbolIcon-folderForeground)",
          functionForeground: "var(--vscode-symbolIcon-functionForeground)",
          interfaceForeground: "var(--vscode-symbolIcon-interfaceForeground)",
          keyForeground: "var(--vscode-symbolIcon-keyForeground)",
          keywordForeground: "var(--vscode-symbolIcon-keywordForeground)",
          methodForeground: "var(--vscode-symbolIcon-methodForeground)",
          moduleForeground: "var(--vscode-symbolIcon-moduleForeground)",
          namespaceForeground: "var(--vscode-symbolIcon-namespaceForeground)",
          nullForeground: "var(--vscode-symbolIcon-nullForeground)",
          numberForeground: "var(--vscode-symbolIcon-numberForeground)",
          objectForeground: "var(--vscode-symbolIcon-objectForeground)",
          operatorForeground: "var(--vscode-symbolIcon-operatorForeground)",
          packageForeground: "var(--vscode-symbolIcon-packageForeground)",
          propertyForeground: "var(--vscode-symbolIcon-propertyForeground)",
          referenceForeground: "var(--vscode-symbolIcon-referenceForeground)",
          snippetForeground: "var(--vscode-symbolIcon-snippetForeground)",
          stringForeground: "var(--vscode-symbolIcon-stringForeground)",
          structForeground: "var(--vscode-symbolIcon-structForeground)",
          textForeground: "var(--vscode-symbolIcon-textForeground)",
          typeParameterForeground:
            "var(--vscode-symbolIcon-typeParameterForeground)",
          unitForeground: "var(--vscode-symbolIcon-unitForeground)",
          variableForeground: "var(--vscode-symbolIcon-variableForeground)",
        },
        tab: {
          activeForeground: "var(--vscode-tab-activeForeground)",
          hoverForeground: "var(--vscode-tab-hoverForeground)",
          inactiveForeground: "var(--vscode-tab-inactiveForeground)",
          selectedForeground: "var(--vscode-tab-selectedForeground)",
          unfocusedActiveForeground:
            "var(--vscode-tab-unfocusedActiveForeground)",
          unfocusedHoverForeground:
            "var(--vscode-tab-unfocusedHoverForeground)",
          unfocusedInactiveForeground:
            "var(--vscode-tab-unfocusedInactiveForeground)",
        },
        terminal: {
          foreground: "var(--vscode-terminal-foreground)",
          initialHintForeground: "var(--vscode-terminal-initialHintForeground)",
          selectionForeground: "var(--vscode-terminal-selectionForeground)",
        },
        terminalCommandGuide: {
          foreground: "var(--vscode-terminalCommandGuide-foreground)",
        },
        terminalCursor: {
          foreground: "var(--vscode-terminalCursor-foreground)",
        },
        terminalOverviewRuler: {
          cursorForeground:
            "var(--vscode-terminalOverviewRuler-cursorForeground)",
          findMatchForeground:
            "var(--vscode-terminalOverviewRuler-findMatchForeground)",
        },
        testing: {
          coverCountBadgeForeground:
            "var(--vscode-testing-coverCountBadgeForeground)",
          message: {
            error: {
              badgeForeground:
                "var(--vscode-testing-message-error-badgeForeground)",
            },
            info: {
              decorationForeground:
                "var(--vscode-testing-message-info-decorationForeground)",
            },
          },
        },
        textLink: {
          activeForeground: "var(--vscode-textLink-activeForeground)",
          foreground: "var(--vscode-textLink-foreground)",
        },
        textPreformat: {
          foreground: "var(--vscode-textPreformat-foreground)",
        },
        textSeparator: {
          foreground: "var(--vscode-textSeparator-foreground)",
        },
        titleBar: {
          activeForeground: "var(--vscode-titleBar-activeForeground)",
          inactiveForeground: "var(--vscode-titleBar-inactiveForeground)",
        },
        walkthrough: {
          stepTitle: {
            foreground: "var(--vscode-walkthrough-stepTitle-foreground)",
          },
        },
        welcomePage: {
          progress: {
            foreground: "var(--vscode-welcomePage-progress-foreground)",
          },
        },
      },
    },
  },
})
