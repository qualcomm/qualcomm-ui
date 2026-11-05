---
name: conventional-commit-rebaser
description: Rebase the current branch into clean conventional commits with proper author attribution. Use when the user wants to clean up a branch's commit history into well-organized conventional commits.
---

# Conventional Commit Rebaser

Rebase the current branch into clean, single-concern conventional commits with correct author attribution.

**Base branch**: default: `main` if no argument provided

## Commit Message Format

Format: `<type>(<scope>): <description>`

### Scope Rules

- `<scope>` is never the package within the workspace.
- It is often the exported module within the package.
   - This is not just the module's file name. If the folder name is a better fit, use that instead. Check the package.json exports field, that is usually your best bet.
- If changes apply to an entire package, omit the scope.
- Never include a reference to the package name in the scope or description


### Types

| Type | Use |
|------|-----|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, no code change |
| `refactor` | Code change that neither fixes nor adds |
| `perf` | Performance improvement |
| `test` | Adding or fixing tests |
| `chore` | Build, tooling, deps |
| `ci` | CI configuration |
| `revert` | Revert previous commit |

### Rules

- Lowercase type and description
- No period at end
- Imperative mood ("add" not "added")
- Scope optional, lowercase
- Max 72 chars for subject line
- Breaking changes: append `!` before colon (e.g. `feat(api)!: change response format`)
- Describe the intent or user-facing effect, not the code change. Prefer "allow keyboard interaction on clear button" over "ignore keyboard events from child elements". Fall back to describing the mechanism only when the change is purely internal with no observable behavior change (e.g. a refactor).
- Reserve the body for changes that are not described in the message. Never use prose or paragraphs that repeat the commit message.

## Procedure

### Phase 1: Analyze

1. Determine the base branch. Use `$ARGUMENTS` if provided, otherwise default to `main`.

2. Verify preconditions:
   ```
   git status  # must be clean working tree
   git log --oneline main..HEAD  # must have commits to rebase
   ```
   If the working tree is dirty or there are no commits, stop and inform the user.

3. Save the current state for verification:
   ```
   ORIGINAL_TREE=$(git rev-parse HEAD^{tree})
   ORIGINAL_SHA=$(git rev-parse HEAD)
   ```

4. Gather commit metadata:
   ```
   git log <base>..HEAD --format="%H %ae %an" --reverse  # all authors
   git diff <base>..HEAD --stat                           # file change summary
   ```

5. For each commit, identify the author and which files it touched:
   ```
   git log -1 --format="%ae %an %s" <sha>
   git diff-tree --no-commit-id --name-only -r <sha>
   ```

6. Read the full diff (`git diff <base>..HEAD`) to understand all changes. For large diffs, read in sections by path.

### Phase 2: Group

Organize all changes into logical conventional commits. Each commit should represent a single concern.

**Grouping principles:**
- One logical change per commit (a feature, a fix, a refactor)
- Related files that serve the same purpose go together
- Keep framework-specific implementations with their core changes when tightly coupled
- Separate docs, tests, and tooling changes from feature code
- Generated/derived files (e.g. CSS token files) go with the change that necessitated them

**For each proposed commit, determine:**
- Commit message (type, scope, description)
- Files to include
- Author attribution (see Authorship section below)

### Phase 3: Approve

Present the proposed commit plan to the user using `AskUserQuestion`. Show a numbered table with:
- Commit message
- Author
- File count

Ask: "Does this commit plan look correct? Select 'Execute' to proceed or 'Revise' to make changes."

**Do NOT proceed without explicit user approval.** This is a destructive operation (rewriting history).

### Phase 4: Execute

1. Soft reset to the merge base:
   ```
   MERGE_BASE=$(git merge-base <base> HEAD)
   git reset --soft $MERGE_BASE
   git reset HEAD .
   ```

2. Restore any new files that became untracked:
   ```
   git checkout $ORIGINAL_SHA -- <path>   # for each new file
   git reset HEAD .                        # unstage after restore
   ```

3. For each planned commit, selectively stage and commit:
   ```
   git add <file1> <file2> ...
   git commit [--author="Name <email>"] -m "<message>"
   ```

4. Use HEREDOC for commit messages to ensure correct formatting:
   ```
   git commit -m "$(cat <<'EOF'
   <type>(<scope>): <description>

   [Co-authored-by: Name <email>]
   Signed-off-by: Name <email>
   EOF
   )"
   ```

### Phase 5: Verify

1. Confirm the tree matches:
   ```
   FINAL_TREE=$(git rev-parse HEAD^{tree})
   [ "$ORIGINAL_TREE" = "$FINAL_TREE" ] && echo "MATCH" || echo "MISMATCH"
   ```

2. If MISMATCH: immediately alert the user. Run `git diff $ORIGINAL_SHA HEAD --stat` to identify discrepancies. The original SHA was saved — recovery is possible via `git reset --hard $ORIGINAL_SHA`.

3. If MATCH: show the final commit log:
   ```
   git log --oneline --format="%h %ae %s" <base>..HEAD
   ```

## Authorship Rules

Preserve the contributions of every author on the branch.

### Determining authorship per commit

For each new commit, check which original commits contributed to its files:
- If **all contributing original commits** are by one author: set that person as the commit author using `--author="Name <email>"`
- If **multiple authors** contributed: the primary author (most lines/commits) is the commit author; add `Co-authored-by: Name <email>` trailers for all other contributors

### Sign-off

Every commit ends with `Signed-off-by: <author-name> <author-email>` matching the commit author.

For co-authored commits, the sign-off matches the primary author, and co-author trailers come before the sign-off:

```
Co-authored-by: Other Person <other@example.com>
Signed-off-by: Primary Author <primary@example.com>
```

## Recovery

If anything goes wrong during execution, the original branch state can be restored:
```
git reset --hard $ORIGINAL_SHA
```
Always keep `$ORIGINAL_SHA` available until verification passes.