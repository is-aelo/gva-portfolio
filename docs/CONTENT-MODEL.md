# Content Model

| File | Purpose | Main collection |
|---|---|---|
| `site.json` | Profile, navigation, about, contact, SEO | singleton |
| `services.json` | Service groups | `groups[].items[]` |
| `projects.json` | Work samples and demos | `items[]` |
| `experience.json` | Work and internship history | `items[]` |
| `education.json` | Education | `items[]` |
| `skills.json` | Skill/tool groupings | `groups[].items[]` |
| `process.json` | Work steps and principles | `steps[]` |

## Project fields
`id`, `title`, `category`, `projectType`, `status`, `featured`, `sortOrder`, `summary`, `context`, `approach`, `deliverables`, `tools`, `liveUrl`, `repoUrl`, `coverImage`, `gallery`, `altText`, `disclaimer`, `metrics`, `servicesDemonstrated`.

- `id`: stable unique kebab-case ID.
- `projectType`: `personal`, `concept`, `academic`, `internship`, `freelance`, `demo`, or `client`.
- `status`: `draft`, `published`, or `archived`.
- `metrics`: evidence-based only; leave empty without measurement.
- `servicesDemonstrated`: IDs from service records; keep cross-references valid.

## Status rules
- `draft`: not public; incomplete, planned, unapproved, or awaiting permission.
- `published`: reviewed, approved, fact-checked, and safe for public display.
- `archived`: retained but not rendered publicly.

## Recommended media object
```json
{"url":"https://res.cloudinary.com/your-cloud/image/upload/...","publicId":"portfolio/projects/example","alt":"Desktop preview of the homepage","width":1600,"height":1000,"kind":"image"}
```
Never put upload signatures or API keys in public JSON.
