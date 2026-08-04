# Contributing to QUI

We're happy that you're interested in developing. This guide includes instructions and rules for contributing to this repository.

## Branching Strategy

In general, contributors should develop on branches based off of `main` and pull requests should be made against `main`.

## AI Contributions

This repository does accept AI-assisted code, but the contributor remains responsible for matching conventions and understanding the repository before submitting code for review.

You, the human, are responsible for the output. At that, the following rules are mandatory:

- You must review all output before submitting a PR.
- You must ensure that the code is free of AI-generated boilerplate comments and emoji-heavy PR descriptions.
- You must ensure that all claims in the PR are verifiable.
- You must adhere to all repository conventions and guidelines.

## Local setup

After cloning, install dependencies from the repo root:

```bash
pnpm install
```

Then build all non-docs packages:

```bash
pnpm build && pnpm doc-gen
```

Then, to start watch mode for a specific framework:

```bash
pnpm dev:react
# or
pnpm dev:angular
```

Then, run one of the documentation sites:

```bash
pnpm react-docs dev
# or 
pnpm angular-docs dev
```

## First-time setup

You'll only need to do these once per machine.

### SSH key for GitHub

We recommend SSH over HTTPS for public repos.

1. Generate a key (skip if you already have one):

   ```bash
   ssh-keygen -t ed25519 -C "your-email@example.com"
   ```

2. Copy the public key and add it on GitHub at **Settings → SSH and GPG keys → New SSH key** (key type **Authentication Key**):

   ```bash
   cat ~/.ssh/id_ed25519.pub
   ```

3. Verify:

   ```bash
   ssh -T git@github.com
   ```

### GPG signing for verified commits

Signing your commits with GPG gets you the **Verified** badge on GitHub.

1. Generate a key:

   ```bash
   gpg --full-generate-key
   ```

   Recommended answers:

   - **Kind of key:** option `9` (ECC and ECC). Fall back to `1` (RSA and RSA) at 4096 bits if `9` isn't offered.
   - **Curve:** option `1` (Curve 25519).
   - **Expiration:** `2y` (extendable later via `gpg --edit-key <KEY_ID>` → `expire`).
   - **Email:** must match `git config user.email`. GitHub matches on this for the **Verified** badge.
   - **Comment:** leave blank.

2. Find your key ID and add the public key to GitHub at **Settings → SSH and GPG keys → New GPG key**:

   ```bash
   gpg --list-secret-keys --keyid-format=long
   ```

   Look for a line like:

   ```console
   sec   ed25519/ABC123DEF4567890 2026-05-15 [SC] [expires: 2028-05-14]
   ```

   The part after the `/` (here, `ABC123DEF4567890`) is your `<KEY_ID>`. Then export the public key and paste the entire output (including the `-----BEGIN-----` and `-----END-----` lines) into GitHub:

   ```bash
   gpg --armor --export <KEY_ID>
   ```

3. Configure git to use your key. Follow GitHub's [Telling Git about your signing key](https://docs.github.com/en/authentication/managing-commit-signature-verification/telling-git-about-your-signing-key) guide, which has OS-specific steps for Linux, macOS, and Windows.

## Submitting a pull request

1. Please read our [code of conduct](CODE-OF-CONDUCT.md) and [license](LICENSE.txt).

2. [Fork](https://github.com/qualcomm/qualcomm-ui/fork) and clone the repository.

   ```bash
   git clone git@github.com:<username>/qualcomm-ui.git
   ```

3. Create a new branch based on `main`:

   ```bash
   git checkout -b <my-branch-name> main
   ```

4. Create an upstream `remote` to make it easier to keep your branches up-to-date:

   ```bash
   git remote add upstream git@github.com:qualcomm/qualcomm-ui.git
   ```

5. Make your changes, add tests, and make sure the tests still pass.

6. Commit your changes. Every commit must include a [DCO](https://developercertificate.org/) sign-off and a GPG signature. Use `-s` for sign-off and `-S` for the signature:

   ```bash
   git commit -s -S -m "fix(button): correct focus ring color in high-contrast mode"
   ```

   Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/): `<type>(<scope>): <description>`. Common types are `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, and `ci`. The scope identifies the module within a package — use the component or feature name, not the package name (e.g., `button`, not `react` or `angular`). The scope may be omitted for changes that span multiple modules.

7. After committing your changes on the topic branch, sync it with the upstream branch:

   ```bash
   git pull --rebase upstream main
   ```

8. Push to your fork.

   ```bash
   git push -u origin <my-branch-name>
   ```

   The `-u` is shorthand for `--set-upstream`. This will set up the tracking reference so subsequent runs of `git push` or `git pull` can omit the remote and branch.

9. [Submit a pull request](https://github.com/qualcomm/qualcomm-ui/pulls) from your branch to `main`.

10. Pat yourself on the back and wait for your pull request to be reviewed.

## Security Analysis of Pull Requests

To maintain the security and integrity of this project, all pull requests from external contributors are automatically scanned using [Semgrep](https://github.com/semgrep/semgrep) to detect insecure coding patterns and potential security flaws.

**Static Analysis with Semgrep:**  We use Semgrep to perform lightweight, fast static analysis on every PR. This helps identify risky code patterns and logic flaws early in the development process.

**Contributor Responsibility:** If any issues are flagged, contributors are expected to resolve them before the PR can be merged.

**Continuous Improvement:** Our Semgrep ruleset evolves over time to reflect best practices and emerging security concerns.

By submitting a PR, you agree to participate in this process and help us keep the project secure for everyone.

Here are a few things you can do that will increase the likelihood of your pull request to be accepted:

- Follow the existing style where possible.
- Write tests.
- Keep your change as focused as possible.
  If you want to make multiple independent changes, please consider submitting them as separate pull requests.
- Write a [good commit message](https://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html).
- It's a good idea to arrange a discussion with other developers to ensure there is consensus on large features, architecture changes, and other core code changes. PR reviews will go much faster when there are no surprises.

## Troubleshooting

### GPG signing fails with "Inappropriate ioctl for device"

This shows up in terminal-only environments (Linux, macOS, WSL, Git Bash) when GPG can't open a passphrase prompt because `GPG_TTY` isn't set. The full error looks like:

```console
gpg: signing failed: Inappropriate ioctl for device
```

Quick fix in the current shell:

```bash
export GPG_TTY=$(tty)
```

To make it permanent, add it to your shell profile (e.g. `~/.bashrc` or `~/.zshrc`):

```bash
echo 'export GPG_TTY=$(tty)' >> ~/.bashrc
```

If you see other signing failures on Windows, see GitHub's [Troubleshooting commit signature verification](https://docs.github.com/en/authentication/troubleshooting-commit-signature-verification/).

### Adding GPG signatures to commits you already pushed

If your existing commits show as **Unverified** on GitHub, re-sign them with a rebase:

```bash
git rebase HEAD~<N> --exec 'git commit --amend --no-edit -S'
git push --force-with-lease origin <my-branch-name>
```

…where `<N>` is the number of commits you want to re-sign. You'll be prompted for your GPG passphrase once per commit.

> **Heads up:** force-pushing rewrites history. Only do this on branches no one else is working from.

### Recovering unsigned commits

If the DCO bot has blocked your PR because earlier commits are missing `Signed-off-by`, and you're the only person on the branch:

```bash
git rebase HEAD~<N> --signoff --exec 'git commit --amend --no-edit -S'
git push --force-with-lease origin <my-branch-name>
```

…where `<N>` is the number of unsigned commits. The `--exec` step also re-signs each commit with GPG.

If your range contains an empty commit (for example one made just to retrigger CI), drop it first. `git commit --amend` refuses to amend an empty commit:

```bash
git reset --hard HEAD~1                          # drop the empty commit
git commit --amend --signoff --no-edit -S        # sign-off + GPG-sign the real commit
git push --force-with-lease origin <my-branch-name>
```

The force-push retriggers CI on its own.

> **Heads up:** force-pushing rewrites history. Only do this on branches no one else is working from.
