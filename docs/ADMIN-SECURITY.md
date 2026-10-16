# Admin and Publishing Security

## Current baseline
The admin is a client-side JSON editor. It uses `localStorage` for drafts and downloads an export bundle. It does not authenticate users, write to GitHub, or upload media.

## Safeguards
- Anyone who can open a deployed admin page can use its UI, but browser edits do not alter the repository.
- Never store GitHub tokens in `admin.js`, HTML, JSON, localStorage, or other client assets.
- A hidden URL is not authentication.
- Use server-side authentication/authorization before publishing.
- Restrict server-side publishing to allowlisted paths and validate payloads.
- Add rate limiting, origin/CSRF controls, audit logs, and secret rotation.
- Cloudinary secrets stay server-side; use short-lived signed upload workflows for browser uploads.
- `draft` is not an access-control boundary for confidential data. Do not store private client data in public JSON.

Recommendation: keep manual export + Git commits for v1. The API placeholder is deliberately disabled until production auth is designed and tested.
