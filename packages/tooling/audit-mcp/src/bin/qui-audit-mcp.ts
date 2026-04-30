#!/usr/bin/env node
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

/**
 * Stdio MCP server entrypoint. Placeholder: audit engine is shipped in v0.1,
 * but MCP stdio tools (`audit_qui_usage`, `apply_qui_fix`, `list_available_rules`)
 * land in a follow-up slice. See
 * docs/superpowers/specs/2026-04-27-qui-best-practices-skill-design.md.
 */

import {allRules} from "@qualcomm-ui/audit-mcp/rules"

process.stderr.write(
  `@qualcomm-ui/audit-mcp (${allRules.length} rules bundled) — MCP stdio server not yet implemented\n`,
)
process.exit(1)
