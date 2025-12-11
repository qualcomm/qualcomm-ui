// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

/**
 * Mermaid diagram styles using Qualcomm Design System tokens.
 * These styles override mermaid's default theme with QDS colors.
 */

import {blockStyles} from "./block"
import {c4Styles} from "./c4"
import {classStyles} from "./class"
import {erStyles} from "./er"
import {flowchartStyles} from "./flowchart"
import {ganttStyles} from "./gantt"
import {gitStyles} from "./git"
import {kanbanStyles} from "./kanban"
import {mindmapStyles} from "./mindmap"
import {packetStyles} from "./packet"
import {radarStyles} from "./radar"
import {requirementStyles} from "./requirement"
import {sankeyStyles} from "./sankey"
import {sequenceStyles} from "./sequence"
import {stateStyles} from "./state"
import {timelineStyles} from "./timeline"
import {treemapStyles} from "./treemap"
import {userJourneyStyles} from "./user-journey"

export const mermaidStyles = `
${flowchartStyles}

${sequenceStyles}

${classStyles}

${ganttStyles}

${stateStyles}

${erStyles}

${gitStyles}

${userJourneyStyles}

${timelineStyles}

${c4Styles}

${mindmapStyles}

${kanbanStyles}

${blockStyles}

${requirementStyles}

${packetStyles}

${radarStyles}

${sankeyStyles}

${treemapStyles}
`
