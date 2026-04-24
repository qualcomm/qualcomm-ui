---
name: de-slop
description: Clean AI-typical prose patterns from documentation files. Fixes em dash overuse, filler phrases, redundant openings, and bolded-label-with-em-dash lists. Use after writing or editing documentation.
argument-hint: <file-or-glob>
disable-model-invocation: true
allowed-tools: Read Edit Glob Grep
---

# De-slop

Remove AI-typical writing patterns from prose files. `$ARGUMENTS` is a file path or glob pattern (e.g., `docs/**/*.mdx`).

## Rules

### 1. Em dashes

Replace ` — ` (and ` – `) with simpler punctuation:

- Colon before an explanation: "Two packages: react-core and react"
- Period between separate thoughts: "Core handles behavior. QDS handles styling."
- Comma for a light pause: "The root component, which wraps everything, renders a label"
- Parentheses for an aside: "The machine (inspired by zag.js) manages state"

An occasional em dash is fine when nothing else reads as well. But it should not be the default connector between clauses.

Skip em dashes inside code blocks, inline code, and code comments.

### 2. Filler phrases

Remove or rewrite these. They add no information:

- "Key aspects of this pattern:"
- "The pattern:"
- "Key points:"
- "Here is the..."
- "This is the..."
- "In practice:"
- "How this works:"
- "Let's look at..."
- "It's worth noting that..."
- "As mentioned earlier..."
- "Essentially, ..."
- "Basically, ..."

If a filler phrase introduces a list or code block, either drop it and let the list speak for itself, or replace it with a sentence that adds real context.

### 3. Redundant openings

If a heading says "Root Directive" and the first sentence says "The root directive initializes the state machine", the sentence restates the heading. Either cut it or replace it with something the reader does not already know.

Same for sections that open with "This section covers..." or "In this section we will...".

### 4. Bolded list labels with em dashes

`- **Thing** — description` is a strong AI signal. Replace with:

- `- **Thing**: description`
- `- **Thing** description`
- A plain sentence

### 5. Overexplaining

If the code block above already shows how something works, don't restate it in prose. Trim sentences that add no new information beyond what the code or heading communicates.

### 6. What not to touch

- Code blocks (fenced or indented)
- Inline code spans
- Frontmatter (YAML between `---` markers)
- JSX component props and import statements
- Links, headings, and document structure
- Technical meaning

Do not add emojis. Do not change the document's factual content.

## Procedure

1. Resolve `$ARGUMENTS` to a file list. If it contains `*` or `**`, treat it as a glob. Otherwise treat it as a single file path.
2. For each file:
   a. Read the file
   b. Identify all prose violations (em dashes, filler, redundant openings, bold-label lists, overexplaining)
   c. Apply edits using the Edit tool
3. After all files are processed, print a summary: file name, number of edits made, and the types of changes (e.g., "3 em dashes, 1 filler phrase, 1 redundant opening").