# Step-by-Step AI Implementation / Maintenance Plan

Use phases in order. Make one phase-sized change at a time and report files changed, tests run, failures, and unresolved decisions.

## Phase 0 — Establish workspace
1. Read README, MASTER-SPEC, CONTENT-MODEL, CONTENT-ACCURACY, and ADMIN-SECURITY.
2. Run `node scripts/validate-content.mjs`.
3. Start `python -m http.server 8000` from project root.
4. Check `/public/` and `/admin/`; review browser console.
5. Record baseline issues before editing.

## Phase 1 — Verify source design
1. Compare the CSS references against the actual live portfolio/source files.
2. Do not treat the copy workspace HTML as the production site design source.
3. Extract exact tokens from the true source: color, type, spacing, border, radius, motion, components.
4. Reconcile public and admin styles without creating a new visual identity.
5. Keep General Virtual Assistant as primary positioning; not Executive Assistant.

## Phase 2 — Verify content model
1. Keep stable IDs.
2. Every project needs title, type, status, summary, context, approach, deliverables, tools, URLs/media when available, and disclaimers where useful.
3. Keep planned demos, unapproved internship work, and assets without display permission in draft.
4. Verify `servicesDemonstrated` references real service IDs.
5. Verify URLs, alt text, and publication permission.
6. Never add unsupported testimonials, metrics, or outcomes.

## Phase 3 — Build Email & Task Management demo
1. Use synthetic names, dates, and messages only.
2. Define inbox triage: urgent/time-sensitive, important/non-urgent, waiting on others, routine, archive/reference.
3. Build a tracker with task, owner, due date, priority, status, blocker, next action.
4. Document triage rules; show before/after and handover summary.
5. Upload sanitized screenshots/PDF to Cloudinary.
6. Update project JSON with actual artifacts and mark published only after owner review.

## Phase 4 — Build Presentation demo
1. Use a fictional brief or explicitly licensed source material.
2. Outline narrative before slide design.
3. Establish typography, grid, colors, and chart/table rules.
4. Create relevant title, context, key points, recommendation/next steps, and closing slides.
5. Export PDF and 3–5 previews; proofread and check factual accuracy.
6. Update project JSON; publish only after review.

## Phase 5 — Improve CMS
1. Replace raw JSON editor with form-based fields for common content.
2. Add dedicated project form and repeatable deliverables/tools/media.
3. Add reorder controls and status badges.
4. Add media preview and alt-text checks.
5. Add local preview for unsaved content and dirty-state warnings.
6. Add real JSON Schema validation and cross-reference checks.
7. Test keyboard and screen-reader behavior.

## Phase 6 — Media workflow
1. Create Cloudinary folders: `portfolio/profile`, `portfolio/projects`, `portfolio/graphics`, `portfolio/demos`.
2. Use clear file names and optimized images.
3. Keep originals locally; JSON stores delivery URL, public ID, alt text, dimensions, kind.
4. Never expose API secrets in client code.
5. Check crop/loading/mobile layout.

## Phase 7 — Deployment
1. Confirm repository and hosting base path.
2. Ensure `content/*.json` is copied to the public path expected by `public/app.js`.
3. Test all navigation, links, admin import/export, and draft visibility.
4. Keep manual publish as baseline.
5. If adding direct publish, implement real server-side auth, authorization, rate limits, origin/CSRF protection, audit logs, and secret rotation.

## Final QA
- [ ] Desktop/tablet/mobile
- [ ] Keyboard navigation and focus visibility
- [ ] Reduced motion
- [ ] No broken project links
- [ ] Draft/archived projects hidden publicly
- [ ] No tokens in client assets
- [ ] No console errors
- [ ] Valid JSON and unique IDs
- [ ] Contact links work
- [ ] Project status/limitations accurate
- [ ] Exported bundle re-imports successfully
- [ ] Production hosting paths tested

## AI agent rules
Do not invent missing facts. Keep unknown fields blank or mark for owner review. Do not delete working behavior without replacement. Validate after changes. Report exact changes and remaining decisions.
