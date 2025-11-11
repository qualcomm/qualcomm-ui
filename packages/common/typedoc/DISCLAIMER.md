# Disclaimer

This package needs a fair bit of reorganization work. There are some noticeable pitfalls:

- Type parsing currently requires two passes to flatten deep references.
- Type parsing is not very efficient.
- Reference resolution is messy.
- References with the same name overwrite each other (the last occurrence wins).

This will be cleaned up in the future, unless we find a better solution that is more performant than TypeDoc.
