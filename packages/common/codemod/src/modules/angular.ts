// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {createImportModEntries} from "../mod-imports"
import type {ImportTransformEntry} from "../transformers"

export const angular: ImportTransformEntry[] = createImportModEntries(
  "@qui/angular",
  [
    {
      imports: [{name: "QAnimation", renameTo: "OverlayPanelAnimation"}],
      targetPackage: "@qui/core/overlay-panel",
    },
    {
      imports: [
        "camelCase",
        "pascalCase",
        "noCase",
        "Locale",
        "PascalCaseOptions",
        "Options",
      ],
      targetPackage: "@qui/utils/change-case",
    },
    {
      imports: ["Booleanish"],
      targetPackage: "@qui/utils/coercion",
    },
    {
      imports: [{name: "QAnimationEasing", renameTo: "AnimationEasing"}],
      targetPackage: "@qui/utils/transitions",
    },
    {
      imports: ["pixelAttribute", "safeNumberAttribute"],
      targetPackage: "@qui/angular-core/attributes",
    },
    {
      imports: ["CoercibleBoolean", "NgChanges"],
      targetPackage: "@qui/angular-core/common",
    },
    {
      imports: [
        "CACHES",
        "CSS",
        "LOCAL_STORAGE",
        "LOCATION",
        "MEDIA_DEVICES",
        "NAVIGATOR",
        "PERFORMANCE",
        "SCREEN",
        "USER_AGENT",
        "WINDOW",
        "IdService",
        "elementIdSignal",
        "ClipboardService",
        {name: "QConfigService", renameTo: "PortalConfigService"},
        {name: "QDomService", renameTo: "DomService"},
      ],
      targetPackage: "@qui/angular-core/dom",
    },
    {
      imports: [
        "ListenerConfig",
        "ListenerService",
        {name: "QTrigger", renameTo: "ListenerTrigger"},
        {name: "QTriggerOn", renameTo: "ListenerTriggerOn"},
        {name: "QTriggerOff", renameTo: "ListenerTriggerOff"},
        {name: "QTriggerToggle", renameTo: "ListenerTriggerToggle"},
      ],
      targetPackage: "@qui/angular-core/events",
    },
    {
      imports: [
        "LucideIconArrayData",
        "LucideIconCompat",
        "LucideIcon",
        "IconOrTemplate",
        "LUCIDE_ICONS",
        "LucideIconProviderValue",
        "provideIcons",
        {name: "IconTemplate", renameTo: "IconOrTemplate"},
      ],
      targetPackage: "@qui/angular-core/lucide",
    },
    {
      imports: [
        "SignalifyInput",
        "assertInjector",
        "hostBinding",
        "signalifyObject",
      ],
      targetPackage: "@qui/angular-core/signals",
    },
    {
      imports: ["ControlledState", "ControlledStateService"],
      targetPackage: "@qui/angular-core/state",
    },
  ],
)
