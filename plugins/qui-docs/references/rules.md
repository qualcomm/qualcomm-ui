# QUI Docs Authoring Rules

## Scope

These rules apply to MDX route files, QUI Docs navigation config, and asset folders in any documentation site that uses the QUI Docs platform.

## File And Folder Naming

- Use kebab-case for all new route files and folders.
- Use folder segments ending in `+` for nested URL groups, such as `guides+/integrations+/webhooks.mdx`.
- Do not introduce camelCase route files.
- Do not add new content under legacy mixed-case folders such as `Images/` or `Files/`.
- Keep each MDX route responsible for one page type.
- Fix filename typos the first time you touch a file.

## Section Pages

Do not create section `index.mdx` pages. A section index makes the side-nav item act as both parent folder and page.

If a section needs introductory content, create `overview.mdx` and sort it to the start of the section in `qui-docs.config.ts`. Use an overview page only when it explains what the section covers, who it is for, and how to think about the pages inside it.

An overview page should not list sibling routes. The side navigation already does that.

When moving an existing route, rename the route file, add a redirect or compatibility route if the old URL may still be used, and fix inbound links touched in the same PR.

## Frontmatter

- Every MDX page starts with frontmatter declaring `title`.
- Use `# {frontmatter.title}` as the page H1.
- Pages intentionally hidden from navigation may add `hidden: true`.

## Headings

- Use one H1 per page.
- Use H2 for main reader tasks or topics.
- Use H3 and H4 only when they add useful hierarchy.
- Do not skip heading levels.
- Do not add a manual list of H2-H4 headings.
- Avoid weak headings: `Screenshot`, `UI`, `Details`, `Below Steps`, `Important Notes`, `Steps`.
- Use specific headings such as `## Prerequisites`, `## Authenticate the request`, `## Verify the response`, or `## Troubleshoot rate-limit errors`.
- Keep headings brief.
- Do not style heading text with bold or italics.
- Do not end headings with punctuation.

## MDX Formatting

- Do not add `<br>` or `<br />` tags.
- Do not use inline HTML `style` attributes.
- Do not wrap content in styled `<div>` blocks to force layout.
- Do not use emojis.

## Links

- Use root-relative links for docs pages, such as `/api-reference/users/list-users`.
- Use descriptive link text that names the target task, concept, or reference.
- Avoid `click here`, `below`, `this page`, and `more details`.
- Do not link to compatibility `.ts` redirects.
- Do not use old casing or old route spellings in new content.
- After moving a page, update every inbound link you touch in the same PR.

## Navigation

- Add a page to `qui-docs.config.ts` when order, nesting, or visibility matters.
- Keep sidebar labels aligned with page titles and route names.
- Prefer stable, predictable section order over alphabetical accidents.
- Collapse deep groups by default unless the section is central to the reader's current workflow.

## Assets

- Use lower-case asset root folders: `assets/images` and `assets/files`.
- Use kebab-case directory and filenames.
- Group assets by documentation area, mirroring the route structure.
- Rename imported or linked image paths when an asset moves.
- Do not add new assets under mixed-case folders.
- Use `.png` screenshots with lowercase filenames.
- Name screenshots for the state or action shown.
- Place screenshots near text that explains them.
- Write alt text that describes the state or action, not `screenshot`.
- Explain what the reader should notice in nearby prose.
- Remove screenshots that only show obvious navigation or button placement.

Screenshot dimensions:

- Full-screen screenshots: 1880 x 1025 px.
- Dialog or small-component screenshots: 950 x 450 px.
- Minimum width: 900 px.
- Highlight color: `#FF0000`, 2 px solid, 4-8 px padding.
- Alt text starting with `UI-` inherits global CSS that stretches the image to full width.

## Terminology

Use the same term every time. Acronyms stay fully capitalized in prose.

| Use | Do not use |
| --- | --- |
| `API` | `Api`, `api` |
| `CLI` | `Cli`, `cli` |
| `URL` | `Url`, `url` |
| `JSON` | `Json`, `json` |
| `JavaScript` | `Javascript`, `javascript` |
| `OAuth` | `Oauth`, `oauth` |

Maintain product-specific glossary terms in the product docs repository or style guide. Pick one spelling and use it everywhere.

## Writing Mechanics

Use active voice, present tense, specific nouns, short paragraphs, imperative steps, and exact UI labels, field names, commands, statuses, and file names.

Avoid:

- `below`, `above`, `here`, and `this` when a direct name is clearer.
- `please` in procedural steps.
- `user can` when the step should be a direct command.
- `as per`, `kindly`, `same`, and other vague internal phrasing.
- Unexplained acronyms.
- Chat shorthand such as `pls`, `u`, `thx`, and `refer :`.
- Emojis.
- Unreviewed spelling and grammar errors.

Banned opening phrases:

- `This page contains...`
- `The below...`
- `This document explains...`

Open with what the page helps the reader do.

## Examples

Examples must prove the workflow.

- Use realistic values, not placeholder-only `"string"` examples.
- For UI tasks, include the starting object, entered values, and result that confirms success.
- For API or CLI tasks, include authentication/setup assumptions, the smallest working request, a successful response, at least one common error response, and how to store or reuse returned identifiers.
- Every code snippet must run or compile without errors. Run snippets before committing when feasible.

## API, CLI, And Integration Pages

Use this order unless the page has a strong reason not to:

1. What the integration does.
2. Who should implement or call it.
3. Prerequisites and authentication.
4. Minimal working request or command.
5. Successful response.
6. Required fields and valid values.
7. Error handling.
8. Versioning, compatibility, or support notes.
9. Full reference tables or generated details.

If generated reference material is large, put the usage path first and move the generated dump behind it or to a separate reference page.

## Compatibility Routes

- Keep compatibility `.ts` modules small. They redirect or delegate; they do not duplicate page content.
- Remove stale `.mdx` after the new page exists and the compatibility route is in place.
- Do not link to pages that are now `.ts` redirects. Link to the new canonical route.

## Reviewer Rejection Gates

Reject a page when:

- It is only a screen tour.
- It does not name its page type or opens with a banned phrase.
- It hides prerequisites.
- It uses screenshots as the main content.
- It includes placeholder examples.
- It duplicates another page.
- It links to stale content.
- It moves a page without adding a redirect or compatibility route for inbound URLs.
- Frontmatter is missing or invalid, or the H1 is not `# {frontmatter.title}`.
- A new developer could not complete the documented work without asking the author for context.

Approve a page when a new developer can complete the documented work without asking the author for context and an experienced developer can scan for the field, status, command, API behavior, or failure mode they need.

## Author Self-Check

- Page has one clear primary type.
- First paragraph states the reader value.
- Prerequisites are explicit.
- Steps produce a visible, testable, or inspectable result.
- Examples use realistic values.
- Every code snippet has been run or compiled when feasible.
- Screenshots support the text instead of replacing it.
- H2-H4 headings are meaningful, brief, and do not repeat a manual ToC.
- No bold, italics, or trailing punctuation in heading text.
- No `<br>` tags or inline HTML styling.
- No emojis in page content.
- Spelling and grammar are proofread; no chat shorthand.
- Terminology matches the canonical glossary; acronyms use canonical casing.
- Links are root-relative and use descriptive text.
- Filenames and routes are kebab-case, with no camelCase or typos.
- No section `index.mdx` pages.
- Frontmatter has `title` and H1 is `# {frontmatter.title}`.
- No duplicate page exists under another route.
- Page explains side effects, permissions, and failure modes when relevant.
- Page is short enough to maintain or has been split by how-to, concept, or API area.
