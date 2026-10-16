# Eloi — General VA Portfolio + Admin CMS

A starter project bundle with a responsive public portfolio, a browser-based JSON editor, seeded content, schemas, validation, and implementation documentation.

## Structure
- `public/` — static portfolio website; `content-data.js` embeds the seed data so the public page also works when opened directly
- `admin/` — local JSON editor with import/export and basic validation
- `content/` — canonical JSON content files
- `schemas/` — JSON Schema references
- `scripts/validate-content.mjs` — structural validator (Node.js, no dependencies)
- `api/publish.js` — disabled publishing placeholder; deliberately not a publish endpoint
- `docs/` — master spec, build plan, data model, accuracy/security checklists, legacy spec

## Run locally
Run from this directory:
```bash
python -m http.server 8000
```
Open `http://localhost:8000/public/` and `http://localhost:8000/admin/`. The public page now includes its seed data and can also be opened directly. The Admin CMS still requires the local server because it loads the editable JSON files with `fetch()`.

## Validate
```bash
node scripts/validate-content.mjs
```

## Edit workflow
1. Open Admin CMS and select a content area.
2. Edit JSON and click **Save section**. This stores edits in the current browser only.
3. Click **Export content bundle**.
4. Review the bundle, then replace the corresponding files under `content/`.
5. Run validation and commit/push changes.

The admin does not write to GitHub. Never place a GitHub token in frontend code. `api/publish.js` intentionally returns 501 until a proper auth and server-side publishing implementation is built.

## Seed content rules
- General Virtual Assistant is the primary positioning, not Executive Assistant.
- BINI, Nothing, and Nova Echo have existing live links and are seeded as published with accurate disclaimers.
- Internship, capstone, creative collection, and planned demo projects are drafts until artifacts/permissions/review are complete.
- No testimonials, client outcomes, performance metrics, or invented engagements are included.
- Add public contact details and resume URL only when ready.

Read `docs/MASTER-SPEC.md` and `docs/BUILD-PLAN.md` before major changes.


### Latest content update (v5)
- Experience entries are published in the seeded content so the Experience column is populated.
- Removed the four working-principle statements from the About area.
- Replaced that area with a framed portrait placeholder. Add your own photo before publishing; no portrait image was supplied with this update.


### Project presentation update (v6)
- Web design/development projects now appear in a stacked folder-style section with sticky positioning; scrolling back up naturally reverses the stack.
- Projects are grouped by service category and introduced with narrative copy rather than a literal 'problem it solves' label.
- Other published projects remain in a separate category area pending the user's final category decisions.
- Cover images remain placeholders until real project screenshots are supplied or added to the content records.
