# QUI Docs Authoring Principles

## Effective Documentation

Effective documentation answers the reader's next practical question. Across page types, that usually means:

- What is this and when do I use it?
- What do I need to know or have before I start?
- What are the exact steps, shape, or answer?
- How do I know it worked, and what can go wrong?

If the reader cannot answer those after reading, the page is not done.

## Page Types

Every page has one primary type. Split the page if it does not fit one type cleanly.

- **How-to**: walk a reader through an action — one step, many steps, or a short repeatable recipe. Examples: submit a job, re-run a failed task run, prepare a host, install Launcher.
- **Concept**: build the mental model a reader needs before following tasks. Examples: what is a taxonomy, how utilization is calculated, what is a coverage plan.
- **API Guide**: document an API surface — endpoints, parameters, request/response shapes, component props, fields, and states.
- **FAQ**: answer questions readers ask repeatedly — errors, symptoms, edge cases, and "why does it work this way."

## Page Value

Open with what the page helps the reader do. Do not start with `This page contains...`, `The below sections...`, or `This document explains...`.

Prefer:

```md
Use Device Status to investigate why a device is unavailable for job execution. Start by checking allocation state, host connection, last heartbeat, and the active job linked to the device.
```

Avoid manual table-of-contents or summary sections that duplicate the H2-H4 headings. QUI Docs renders the table of contents automatically.

## Screenshots

Screenshots support the text. They do not replace it. Use screenshots to confirm a state, clarify a dense table, or show a non-obvious control location.

Every screenshot needs nearby text explaining why it matters. If removing screenshots leaves no useful documentation, rewrite the page as a how-to, concept, API guide, or FAQ.

## Writing

Use active voice, present tense, imperative steps, and exact UI labels, field names, commands, statuses, and file names.

Avoid `below`, `above`, `here`, `please`, `user can`, `as per`, and `kindly`. Name the thing directly.

## Before Submitting

Confirm:

- Each page has one clear primary type.
- The first paragraph states the reader value.
- Prerequisites, steps, expected result, and failure modes are explicit.
- Examples use realistic values.
- Screenshots support the text instead of replacing it.
- Terminology matches the canonical glossary and is consistent.
