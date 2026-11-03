# Links

The Write job and the Review job use these URL forms. Take each URL form from this file, not from the links in the changelog. New links obey this file. Old links change only when the caller asks for a change to them.

## When you find the base URL

1. Run `git remote get-url origin`.
2. Remove the user part, the port, a `/` at the start or at the end of the path, and one `.git` at the end. An example is `git@github.com:example/demo.git`, which gives the host `github.com` and the path `example/demo`.
3. The base URL is `https://<host>/<path>`.
4. When `Host` is `auto` and the host is `github.com`, use the GitHub forms. When `Host` is `github`, also use the GitHub forms.

## When you write a GitHub link

Write each link after the base URL in these forms:

| Link | Form | Text of the link |
|---|---|---|
| Commit | `/commit/<sha>` | The short SHA in a code span, for example `` [`3f2a9c1`](https://github.com/example/demo/commit/3f2a9c1) `` |
| Pull request | `/pull/<n>` | `#<n>`, for example `[#6](https://github.com/example/demo/pull/6)` |
| Issue | `/issues/<n>` | `#<n>` |
| Version link, `Version links: release` | `/releases/tag/<tag>` | The definition `[X.Y.Z]: <URL>` |
| Version link, `Version links: compare` | `/compare/<previous tag>...<tag>` | The definition `[X.Y.Z]: <URL>` |

`<tag>` is the exact Git tag, for example `v1.3.0`. Put each link definition at the bottom of the file, with the latest version first.
