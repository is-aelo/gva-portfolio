# General VA Portfolio + Static Admin CMS

## Unified Product, Design, Data, Architecture, and AI Implementation Specification

**Document type:** Implementation blueprint\
**Project:** General Virtual Assistant portfolio and content-management
dashboard\
**Status:** Master specification\
**Primary goal:** Build a polished, maintainable portfolio with an admin
interface that lets the owner manage projects, services, profile
content, and media without manually editing HTML or JSON for every
change.

------------------------------------------------------------------------

## 1. Project Summary

Build a responsive General Virtual Assistant (GVA) portfolio website and
a separate admin dashboard. The public website will be static and hosted
on GitHub Pages. Content will be stored as structured JSON files in the
GitHub repository. Images and videos will be hosted on Cloudinary, with
their URLs and metadata referenced from JSON.

The admin dashboard will provide forms, previews, validation, and
content-management actions. It must not require a database. The GitHub
repository's JSON files remain the canonical published source of truth.

### Core requirements

-   Reuse the existing portfolio's design system rather than inventing a
    new visual identity.
-   Use the existing warm off-white, white, monochromatic cobalt, and
    teal-charcoal palette.
-   Reuse Gilda Display, IBM Plex Mono, and Geist Pixel according to the
    roles defined below.
-   Keep public-site layout and content separate.
-   Store editable content in structured JSON, not hardcoded repeatedly
    across HTML files.
-   Host public images and videos on Cloudinary.
-   Support project case studies using a consistent problem →
    approach/solution → value structure.
-   Make it easy to add, edit, reorder, feature, unpublish, archive, and
    preview projects.
-   Include draft/published behavior without exposing private drafts
    through the public website.
-   Validate content and media references before publishing.
-   Never expose GitHub tokens, Cloudinary API secrets, or other
    privileged credentials in client-side JavaScript.
-   Keep the initial implementation focused. Do not add a database,
    unnecessary framework, or unrelated features.

### Non-goals

-   No database.
-   No custom authentication system built from scratch.
-   No client-facing account system.
-   No unnecessary full-stack features in the public portfolio.
-   No fabricated client projects, testimonials, results, or performance
    metrics.
-   No requirement to build a separate project microsite for every
    portfolio item in the first version.

------------------------------------------------------------------------

## 2. Product Architecture

### 2.1 Logical architecture

``` text
                 ┌──────────────────────────┐
                 │       Admin Dashboard    │
                 │ Forms · Preview · Checks │
                 └────────────┬─────────────┘
                              │
                    Authenticated publish
                              │
                 ┌────────────▼─────────────┐
                 │   Secure Publishing API  │
                 │ Validates and writes JSON│
                 └────────────┬─────────────┘
                              │
                 ┌────────────▼─────────────┐
                 │      GitHub Repository   │
                 │ Canonical JSON content   │
                 │ HTML · CSS · JavaScript  │
                 └────────────┬─────────────┘
                              │
                      GitHub Pages build
                              │
                 ┌────────────▼─────────────┐
                 │    Public Portfolio      │
                 │ Reads published JSON     │
                 └──────────────────────────┘

Cloudinary ── hosts images/videos; JSON stores media references.
```

### 2.2 Responsibilities

**Public portfolio** - Static HTML, CSS, and JavaScript. - Reads
published JSON. - Renders profile, services, projects, case studies, and
contact details. - Contains no privileged secrets. - Must remain usable
if an optional video or external embed fails.

**Admin dashboard** - Separate route or separate app. - Loads current
content through an authenticated admin workflow. - Provides forms for
creating and editing content. - Validates records before publishing. -
Supports previewing changes before they become public. - Shows clear
saving, publishing, success, and error states. - Does not directly write
to GitHub from browser code using a personal access token.

**Content repository** - Stores canonical JSON records and schemas. -
Uses stable IDs. - Uses a defined schema version. - Tracks changes
through Git history.

**Secure publishing API** - A small server-side endpoint hosted
separately from GitHub Pages, for example as a serverless function. -
Holds the GitHub credential in server-side environment variables. -
Authenticates and authorizes the editor. - Validates the payload and
permitted file paths. - Writes only approved content files to the
repository. - Returns a useful success or error response. - Does not
need a database.

**Cloudinary** - Hosts images, screenshots, and video demonstrations. -
Supplies delivery URLs and public IDs. - Does not become the canonical
store for project descriptions or business content.

### 2.3 Important hosting limitation

GitHub Pages serves static files. It cannot securely accept admin edits
and write them back to a repository on its own. A browser-only dashboard
cannot safely hold a privileged GitHub token.

Therefore, if the dashboard must publish directly from an online
interface, a secure server-side publishing endpoint is required. This is
a small backend component, but it does not require a database.

If a secure publishing endpoint is intentionally deferred, the dashboard
must instead export validated JSON for manual commit. Never fake a
successful save when changes have only been saved locally in the
browser.

------------------------------------------------------------------------

## 3. Design System

The admin dashboard must use the same visual identity as the existing
public portfolio. The following values and roles come from the supplied
design-system summary. When the existing source files become available,
the implementation agent must extract the exact existing tokens and
component behavior instead of approximating them.

### 3.1 Color

  -----------------------------------------------------------------------
  Token role              Value                   Usage
  ----------------------- ----------------------- -----------------------
  Warm canvas             `#FAFAF7`               Main page background

  White surface           `#FFFFFF`               Cards, panels, forms,
                                                  modals

  Cobalt accent           `#1A52D4`               Primary actions, links,
                                                  active states

  Teal-charcoal           `#172A2F`               Main text and
                                                  high-contrast content

  Cobalt darker/lighter   Extract from source     Hover, pressed, subtle
  variants                                        backgrounds, hierarchy

  Deep red decoration     Extract from source     Rare decorative accents
                                                  only

  Error red               Extract from source     Validation errors and
                                                  destructive/error
                                                  states only
  -----------------------------------------------------------------------

Rules: - Do not introduce a new accent palette. - Do not use deep red as
a general accent or success color. - Do not invent color values when
exact existing tokens can be extracted. - Use neutral borders and
restrained shadows. - Ensure text, buttons, focus rings, and status
indicators have accessible contrast. - Keep status colors restrained and
consistent with existing tokens.

### 3.2 Typography

  ---------------------------------------------------------------------
  Typeface                           Role
  ---------------------------------- ----------------------------------
  Gilda Display                      Expressive headlines, page titles,
                                     section headings, selected
                                     editorial emphasis

  IBM Plex Mono                      Body text, navigation, form
                                     labels, inputs, helper text, admin
                                     content

  Geist Pixel                        Small metadata, labels, compact
                                     accents, button text where
                                     appropriate
  ---------------------------------------------------------------------

Rules: - Reuse the existing font files or font-loading approach if
available. - Do not silently substitute unrelated typefaces. - Keep
long-form admin content readable. - Avoid using the expressive headline
face for dense forms or long paragraphs. - Confirm all fonts load in the
deployed site; provide sensible fallback stacks.

### 3.3 Layout and surfaces

-   Spacious editorial layout with generous whitespace.
-   Clear readable widths and consistent alignment.
-   Intentional asymmetry only where it improves hierarchy.
-   Warm canvas background contrasted with white content surfaces.
-   Folder- and document-inspired framing for project records and case
    studies.
-   Restrained borders and shadows.
-   Consistent page gutters, spacing scale, radii, and content widths
    extracted from the existing portfolio.

### 3.4 Components to reuse or standardize

-   `Button`: primary, secondary, subtle/tertiary, destructive,
    disabled, loading.
-   `Badge`: draft, published, archived, featured, validation status.
-   `Container`: shared width and horizontal padding.
-   `SectionLabel`: compact metadata or section identifier.
-   `TextField`, `TextArea`, `Select`, `Checkbox`, `Switch`,
    `FormField`.
-   `Modal` or confirmation dialog.
-   `Toast` or inline status message.
-   `EmptyState`, `LoadingState`, `ErrorState`.
-   `MediaPreview`.
-   `ProjectCard` and `ProjectCaseStudy`.
-   `SaveStatus` and `PublishStatus`.

The component names above are suggested implementation names, not a
requirement to replace components already present in the source project.

### 3.5 Interaction and accessibility

-   Clear hover, focus, pressed, disabled, and loading states.
-   Visible keyboard focus.
-   All forms usable by keyboard.
-   Labels associated with their controls.
-   Meaningful alternative text for images.
-   Video controls available and keyboard accessible.
-   Respect `prefers-reduced-motion`.
-   Do not rely on color alone to communicate status.
-   Confirm before destructive actions.
-   Prevent accidental navigation away from unsaved edits where
    practical.

### 3.6 Admin visual direction

The admin is a functional extension of the portfolio, not a separate
product brand.

-   Sidebar or compact navigation can use the same typography and color
    tokens.
-   Main work area uses the warm canvas.
-   Forms and editor panels use white surfaces.
-   Cobalt indicates the primary action and active navigation.
-   Folder/document motifs can distinguish content-management sections.
-   Keep the interface clean and restrained; avoid generic dark SaaS
    dashboards, excessive gradients, and unrelated icon/color systems.

------------------------------------------------------------------------

## 4. Repository and Folder Structure

Use this as the initial target structure. Before creating files, inspect
the existing repository and preserve working code. Adapt paths if the
current project already has an established structure.

``` text
general-va-portfolio/
├── README.md
├── index.html
├── projects/
│   └── index.html
├── admin/
│   ├── index.html
│   ├── admin.css
│   ├── admin.js
│   └── README.md
├── css/
│   ├── styles.css
│   ├── tokens.css
│   └── components.css
├── js/
│   ├── main.js
│   ├── data-loader.js
│   ├── render-projects.js
│   ├── render-services.js
│   └── media-utils.js
├── content/
│   ├── site.json
│   ├── services.json
│   ├── projects.json
│   └── navigation.json
├── schemas/
│   ├── site.schema.json
│   ├── service.schema.json
│   ├── services.schema.json
│   ├── project.schema.json
│   ├── projects.schema.json
│   └── navigation.schema.json
├── assets/
│   ├── icons/
│   └── fonts/
├── scripts/
│   └── validate-content.*
├── docs/
│   ├── ARCHITECTURE.md
│   ├── DATA_MODEL.md
│   ├── DESIGN_SYSTEM.md
│   ├── ADMIN_WORKFLOW.md
│   ├── PUBLISHING.md
│   └── IMPLEMENTATION_LOG.md
└── server/
    └── publish/
        └── [serverless publishing endpoint files]
```

### Folder rules

-   `content/`: canonical published content only.
-   `schemas/`: machine-readable validation rules.
-   `admin/`: editor UI; no privileged secrets.
-   `server/`: server-side publishing logic and deployment
    configuration. This folder may live in a separate
    repository/deployment if that is cleaner.
-   `assets/`: shared assets that belong in Git. Large images and videos
    should remain in Cloudinary.
-   `docs/`: implementation and maintenance documentation.
-   `scripts/`: validation and maintenance scripts.
-   `projects/`: public project index or detail pages only if needed.
    Project records themselves remain in JSON.

Do not create empty folders or placeholder files without a purpose. If
the existing project already has a better organization, document the
mapping rather than duplicating files.

------------------------------------------------------------------------

## 5. Content and Data Architecture

### 5.1 Source of truth

The published JSON files in GitHub are the canonical source of truth for
public content.

-   Cloudinary stores media files.
-   JSON stores text, structure, media references, links, ordering, and
    publication metadata.
-   The admin's unsaved form state is temporary.
-   Browser `localStorage` may be used for convenience, such as
    restoring an unfinished local draft, but must not be treated as the
    canonical published database.
-   Git history provides version history and rollback for published
    content.

### 5.2 Data relationships

``` text
site.json
  └── profile and site-wide settings

services.json
  └── service records

projects.json
  └── project records
       ├── category
       ├── tools
       ├── media references
       └── external links

navigation.json
  └── navigation items and order

Cloudinary
  └── actual image/video assets referenced by JSON
```

Use stable IDs rather than relying on array position or title as
identity. Titles and slugs can change; IDs should remain stable.

### 5.3 Shared metadata conventions

Content records should use consistent conventions where applicable:

-   `id`: stable unique identifier.
-   `createdAt`: ISO 8601 timestamp.
-   `updatedAt`: ISO 8601 timestamp.
-   `status`: controlled status value.
-   `sortOrder`: integer used for display ordering.
-   `schemaVersion`: version of the data structure where useful.
-   `slug`: URL-friendly identifier when a public route needs one.

Timestamps should be generated consistently in UTC. The UI may display
them in the user's local time zone.

### 5.4 Publication statuses

Use these statuses consistently:

-   `draft`: incomplete or awaiting review; never shown publicly.
-   `published`: validated and eligible for public display.
-   `archived`: retained but excluded from public display.

Important: if draft records are stored in a JSON file served by GitHub
Pages, users can still inspect that file even if the website hides those
records. If draft privacy matters, keep drafts in an
authenticated/private location and write only published records into
public JSON.

### 5.5 Example `site.json`

``` json
{
  "schemaVersion": 1,
  "profile": {
    "name": "Eloisa Jane Talingting",
    "displayName": "Eloi",
    "title": "General Virtual Assistant",
    "tagline": "Administrative support with creative and technical skills.",
    "about": "",
    "profileImage": {
      "url": "",
      "alt": ""
    }
  },
  "contact": {
    "email": "",
    "linkedinUrl": "",
    "portfolioUrl": ""
  },
  "seo": {
    "title": "General Virtual Assistant Portfolio",
    "description": ""
  },
  "updatedAt": ""
}
```

The values above are examples/defaults. Do not invent contact details,
claims, or biography text. Populate them from owner-approved content.

### 5.6 Example `services.json`

``` json
{
  "schemaVersion": 1,
  "services": [
    {
      "id": "administrative-support",
      "title": "Administrative Support",
      "description": "",
      "tasks": [],
      "icon": "",
      "status": "published",
      "sortOrder": 1
    }
  ],
  "updatedAt": ""
}
```

Requirements: - Service IDs must be unique. - Do not list a service
merely because it sounds marketable; the owner must be able to perform
it. - Service categories and task labels should be consistent. - Avoid
redundant services that describe the same deliverable.

### 5.7 Example `projects.json`

``` json
{
  "schemaVersion": 1,
  "projects": [
    {
      "id": "email-task-management-demo",
      "slug": "email-task-management",
      "title": "Email & Task Management",
      "subtitle": "",
      "summary": "",
      "category": "administrative-support",
      "projectType": "sample",
      "status": "draft",
      "featured": false,
      "sortOrder": 1,
      "problem": "",
      "approach": "",
      "solution": "",
      "value": "",
      "role": "",
      "tools": [],
      "servicesDemonstrated": [],
      "media": {
        "cover": null,
        "gallery": [],
        "video": null,
        "documents": []
      },
      "links": [],
      "createdAt": "",
      "updatedAt": ""
    }
  ],
  "updatedAt": ""
}
```

### 5.8 Project type values

Use a controlled list, for example:

-   `sample`: simulated demonstration created to show a skill.
-   `personal`: independently created personal project.
-   `academic`: school or capstone project.
-   `concept`: speculative redesign or concept work.
-   `client`: actual work completed for a client, only when true and
    permitted to disclose.

The public UI must display the project type clearly when it is relevant.
Never describe simulated work as client work.

### 5.9 Media record format

Use a consistent media object rather than placing unrelated raw strings
in many fields.

``` json
{
  "id": "email-inbox-cover",
  "type": "image",
  "role": "cover",
  "url": "CLOUDINARY_DELIVERY_URL",
  "publicId": "portfolio/email-task-management/inbox-cover",
  "alt": "Illustrative inbox organization workflow",
  "caption": "",
  "sortOrder": 1
}
```

Video example:

``` json
{
  "id": "email-workflow-walkthrough",
  "type": "video",
  "role": "demonstration",
  "url": "CLOUDINARY_VIDEO_DELIVERY_URL",
  "publicId": "portfolio/email-task-management/workflow-demo",
  "alt": "",
  "caption": "Walkthrough of the sample email management workflow",
  "sortOrder": 1
}
```

Rules: - Store delivery URLs and public IDs returned by Cloudinary. - Do
not construct URLs by guessing Cloudinary path conventions. - Validate
that required media URLs are present and use allowed protocols. - Use
image alt text that describes the actual content. - Keep video files on
Cloudinary or another dedicated video host, not in Git history. - Do not
store API secrets, upload presets intended to be private, or credentials
in JSON. - For any media that is no longer used, warn before removing it
from Cloudinary; a file may be referenced by more than one project.

### 5.10 Links

Represent links as structured objects:

``` json
{
  "id": "live-demo",
  "label": "View Live Website",
  "type": "external",
  "url": "https://example.com"
}
```

Allowed types should be explicitly defined, such as `external`, `video`,
`document`, or `repository`. Validate URL protocols and avoid rendering
unsafe URL schemes.

------------------------------------------------------------------------

## 6. Owner-Approved Initial Content and Prefill Plan

This portfolio must **not launch with empty placeholder content
everywhere**. Seed the initial JSON files with the owner information and
project records below, based on the supplied portfolio-copy workspace
and previously established project details.

The admin dashboard must load these records on first launch so the owner
can edit them through forms. Do not require the owner to retype existing
background, skills, tools, services, or project names manually.

### 6.1 Source-of-truth and editorial rules

-   The uploaded `eloi-portfolio-copy-workspace-v13(3).html` is the
    source for the existing biography, education, experience
    descriptions, skills, tools, services, process, approach, and
    value-proposition copy recorded in this section.
-   The current career direction is **General Virtual Assistant (GVA)**.
    The older HTML hero headline "Web Designer & Developer" must not
    automatically override the newer GVA positioning.
-   Retain the user's creative and technical capabilities as supporting
    strengths, but present the public portfolio for GVA opportunities.
-   Keep existing project names and links accurate.
-   Projects created only to demonstrate a workflow must be labeled as
    `sample` or `concept`, not client work.
-   Do not invent client names, testimonials, business outcomes,
    metrics, or claims of paid work.
-   Existing copy can be prefilled as editable content. The owner may
    revise it before publication.
-   Records whose details are incomplete should be seeded as drafts and
    flagged for completion rather than filled with invented information.

### 6.2 Initial `site.json`

Use this as the initial editable profile data. The GVA title and tagline
are the proposed current positioning; other biography details come from
the supplied portfolio-copy workspace.

``` json
{
  "schemaVersion": 1,
  "profile": {
    "name": "Eloisa Jane Talingting",
    "displayName": "Eloi",
    "title": "General Virtual Assistant",
    "tagline": "Administrative support with creative and technical skills.",
    "about": "I bring together organization, creative production, and technical problem-solving to support digital work. My background in Information Technology complements my experience with graphic design and self-directed web projects.",
    "profileImage": {
      "url": "",
      "alt": ""
    }
  },
  "education": [
    {
      "id": "bs-information-technology",
      "qualification": "Bachelor of Science in Information Technology",
      "institution": "Cavite State University — Silang Campus",
      "dates": "2021–2025"
    },
    {
      "id": "shs-tvl-ict",
      "qualification": "SHS — TVL-ICT (Computer Programming)",
      "institution": "Philippine Christian University — Cavite",
      "dates": "2018–2020"
    }
  ],
  "contact": {
    "email": "",
    "linkedinUrl": "",
    "portfolioUrl": "https://eloisatalingting-portfolio.vercel.app/"
  },
  "seo": {
    "title": "Eloi | General Virtual Assistant",
    "description": "General Virtual Assistant portfolio featuring administrative support demonstrations, creative work, and web-related projects."
  },
  "updatedAt": ""
}
```

**Important:** Contact email and LinkedIn URL are intentionally blank
because the supplied source does not provide their exact values. Do not
guess them. The portfolio URL above is the known current portfolio link;
update it only after confirming the final public URL.

### 6.3 Initial skills and tools

Seed these as editable lists. Avoid implying expert-level proficiency.
The dashboard should allow the owner to remove or regroup items.

``` json
{
  "schemaVersion": 1,
  "skillGroups": [
    {
      "id": "creative",
      "title": "Creative Skills",
      "items": [
        "Marketing & Social Media Graphics",
        "UI/UX Design",
        "Wireframing & Prototyping",
        "Visual Design",
        "Image Editing"
      ]
    },
    {
      "id": "web-technical",
      "title": "Web & Technical Skills",
      "items": [
        "Responsive Website Design",
        "Frontend Development",
        "Website Content Updates",
        "CMS Integration",
        "API Integration",
        "Basic Troubleshooting & QA"
      ]
    }
  ],
  "toolGroups": [
    {
      "id": "design-creative",
      "title": "Design & Creative Tools",
      "items": [
        "Figma",
        "Adobe Photoshop",
        "Adobe Illustrator",
        "Canva",
        "Adobe Lightroom"
      ]
    },
    {
      "id": "website-builders-cms",
      "title": "Website Builders & CMS",
      "items": [
        "WordPress",
        "Elementor",
        "Framer",
        "Sanity CMS"
      ]
    },
    {
      "id": "web-development",
      "title": "Web Development Technologies",
      "items": [
        "Next.js",
        "React",
        "TypeScript",
        "Bootstrap",
        "Tailwind CSS",
        "PHP",
        "Laravel",
        "Django"
      ]
    },
    {
      "id": "ecommerce-apis",
      "title": "E-commerce & APIs",
      "items": [
        "Shopify",
        "Shopify Storefront API",
        "Cloudinary API",
        "API Integrations"
      ]
    },
    {
      "id": "hosting-deployment",
      "title": "Hosting & Deployment",
      "items": [
        "Vercel",
        "Render"
      ]
    },
    {
      "id": "databases-backend",
      "title": "Databases & Backend Services",
      "items": [
        "MySQL",
        "PostgreSQL",
        "Supabase"
      ]
    },
    {
      "id": "ai-workflows",
      "title": "AI Tools & Workflows",
      "items": [
        "ChatGPT",
        "Claude",
        "Gemini",
        "Codex"
      ]
    }
  ],
  "updatedAt": ""
}
```

### 6.4 Initial experience records

Use a dedicated `experience.json` file or an equivalent section within
`site.json`. A separate file is preferred so the admin can edit
experience independently.

``` json
{
  "schemaVersion": 1,
  "experience": [
    {
      "id": "independent-web-projects",
      "title": "Independent Web Design & Development Projects",
      "organization": "",
      "dates": "Self-directed · Present",
      "description": "Design and build responsive websites and interfaces for self-initiated projects, using AI-assisted workflows to support implementation, troubleshoot issues, and refine functionality. Projects include a CMS-driven website, a website redesign, and a headless Shopify storefront concept.",
      "type": "self-directed",
      "status": "published",
      "sortOrder": 1
    },
    {
      "id": "web-developer-intern",
      "title": "Web Developer Intern",
      "organization": "Philippine Christian University — Cavite",
      "dates": "March–June 2025",
      "description": "Developed a university event management system using Laravel, Filament PHP, and MySQL. Implemented eligibility validation, QR-based check-ins, and role-based access control to support event registration and attendance workflows.",
      "type": "internship",
      "status": "published",
      "sortOrder": 2
    },
    {
      "id": "freelance-graphic-designer",
      "title": "Freelance Graphic Designer",
      "organization": "",
      "dates": "2020–2021",
      "description": "Created custom visual assets for different client needs, including social media graphics, podcast covers, vector and vexel artwork, flyers, magazine covers, and infographics.",
      "type": "freelance",
      "status": "published",
      "sortOrder": 3
    }
  ],
  "updatedAt": ""
}
```

The self-directed web projects record must not be presented as paid
client experience. The internship and earlier freelance graphic design
work may be presented as written above, subject to the owner's final
review.

### 6.5 Initial service catalog

Prefill the service manager with the services and descriptions in the
supplied portfolio-copy workspace. Store them as data, not as fixed
HTML. Keep the `Design` and `Build` groupings because the source
currently uses those two categories.

``` json
{
  "schemaVersion": 1,
  "intro": {
    "heading": "What I can help with",
    "description": "Work directly with me on the design and development work your project needs."
  },
  "categories": [
    {
      "id": "design",
      "title": "Design",
      "sortOrder": 1,
      "services": [
        {
          "id": "website-design",
          "title": "Website Design",
          "description": "Designing website layouts, user interfaces, visual hierarchy, and responsive experiences."
        },
        {
          "id": "website-redesign",
          "title": "Website Redesign",
          "description": "Improving an existing website through stronger structure, visual direction, usability, responsiveness, and consistency."
        },
        {
          "id": "creative-design",
          "title": "Creative Design",
          "description": "Social media graphics, marketing assets, promotional materials, presentations, and other digital visuals."
        },
        {
          "id": "landing-page-design",
          "title": "Landing Page Design",
          "description": "Designing focused pages for a specific product, service, campaign, or launch."
        }
      ]
    },
    {
      "id": "build",
      "title": "Build",
      "sortOrder": 2,
      "services": [
        {
          "id": "business-website-development",
          "title": "Business Website Development",
          "description": "Responsive websites for businesses, professionals, and service providers."
        },
        {
          "id": "ecommerce-development",
          "title": "E-commerce Development",
          "description": "Online storefronts, product catalogs, shopping experiences, and supported e-commerce integrations."
        },
        {
          "id": "web-management-systems",
          "title": "Web-Based Management Systems",
          "description": "Building custom systems for managing business operations, records, inventory, events, and internal workflows."
        },
        {
          "id": "booking-inquiry-systems",
          "title": "Booking & Inquiry Systems",
          "description": "Implementing inquiry forms, appointment requests, and booking workflows for customers."
        },
        {
          "id": "api-integrations",
          "title": "API & Third-Party Integrations",
          "description": "Connecting websites and systems to external APIs, services, and platforms to support specific functionality."
        },
        {
          "id": "website-maintenance",
          "title": "Website Maintenance & Support",
          "description": "Handling content and product updates, bug fixes, layout adjustments, troubleshooting, and routine improvements to existing websites."
        },
        {
          "id": "seo-performance",
          "title": "Basic SEO & Performance Improvements",
          "description": "Metadata updates, image optimization, and basic technical and performance checks."
        },
        {
          "id": "hosting-deployment",
          "title": "Hosting & Deployment Setup",
          "description": "Setting up website hosting and deployment, connecting custom domains, and configuring basic environment settings for supported platforms."
        }
      ]
    }
  ],
  "updatedAt": ""
}
```

These are prefilled from the existing source, not a declaration that
every service is equally mature. The owner should be able to mark
services as active, hidden, or draft. The public site must not advertise
services that the owner chooses not to offer.

### 6.6 Initial process, work approach, and value propositions

Prefill these sections from the existing workspace as editable content.

**Design process** 1. **Discover** --- Understand the project goals,
audience, requirements, and constraints through discussion and relevant
research. 2. **Define** --- Establish the content hierarchy, page
structure, key user flows, and visual direction. 3. **Design** ---
Develop the layouts, typography, colors, and visual elements into
polished, cohesive designs. 4. **Refine** --- Review the designs against
the brief, incorporate agreed revisions, and prepare the final assets or
design handoff.

**Build process** 1. **Discover** --- Understand the project
requirements, existing systems, desired functionality, and technical
constraints through discussion and research. 2. **Outline** --- Define
the implementation scope, page structure, components, data requirements,
and necessary integrations. 3. **Build** --- Turn the approved direction
into a responsive, functional website using appropriate technologies. 4.
**Test & Refine** --- Check functionality, responsiveness, and
integrations, then troubleshoot issues and implement agreed fixes. 5.
**Deliver** --- Prepare the completed website for launch or handoff,
including relevant documentation and access details within the agreed
scope.

**How I approach my work** - **I look beyond the brief.** Before jumping
into a solution, I take time to understand the project's goals,
requirements, and limitations. This helps me focus on what the project
actually needs. - **I'm always exploring better ideas.** I enjoy
exploring different ideas and approaches before settling on a solution.
Sometimes, a little more research or a different perspective can lead to
a better result, and I'm open to discovering that along the way. - **I
find practical ways forward.** I'm open to exploring different tools and
approaches to solve a problem. I use AI to help with development and
research, but I still review the results to make sure they're useful and
appropriate for the project. - **I don't stop at the first version.** I
review what I've built, check how the pieces work together, and refine
what needs improvement. A working first draft is a starting point, not
automatically the finished product.

**Why work with me** - **Design and development in one place** --- From
shaping the visual direction to implementing the website, I can work
across both design and development, helping keep the interface and
functionality aligned. - **Direct communication, fewer handoffs** ---
You'll work directly with the person handling your project, making it
easier to discuss requirements, share feedback, and clarify changes
along the way. - **Flexible to your project needs** --- Whether you need
a landing page, a website update, or a more functional web-based
solution, we can define a scope that fits your requirements. - **A clear
handover** --- You'll know what's been completed, what's included in the
agreed scope, and what you need to manage or maintain the result after
delivery.

**GVA-specific editorial note:** These sections were written for a
web/design portfolio. They may be retained as editable source content,
but the AI must not blindly publish all of them unchanged on a GVA-first
portfolio. During the content review phase, adapt their emphasis toward
organization, communication, reliability, documentation, creative
support, and technical troubleshooting only where those claims are
supported by the owner's real skills and experience. Do not imply
established expertise in spreadsheets or executive-level support.

### 6.7 Initial project records

Create the following project records at setup. Use `draft` status for
demonstrations or records that still need approved media, a finished
case study, or owner review. Existing public links can be included when
confirmed.

``` json
{
  "schemaVersion": 1,
  "projects": [
    {
      "id": "email-task-management-demo",
      "slug": "email-task-management",
      "title": "Email & Task Management",
      "subtitle": "Sample administrative workflow",
      "summary": "A demonstration of organizing a fictional inbox, assessing message priority, drafting replies, and tracking follow-ups.",
      "category": "administrative-support",
      "projectType": "sample",
      "status": "draft",
      "featured": true,
      "sortOrder": 1,
      "problem": "A busy inbox can make it difficult to identify urgent messages, determine the next action, and remember follow-ups.",
      "approach": "Use a fictional inbox scenario to classify messages by urgency and action required, draft context-appropriate replies, and record follow-up actions in a simple tracker.",
      "solution": "A documented inbox triage example with priority decisions, sample replies, and a follow-up list, supported by a short recorded walkthrough.",
      "value": "Demonstrates a repeatable approach to email triage, clear communication, and follow-up tracking. This is a sample workflow, not a claim of measured client results.",
      "role": "Self-directed sample project",
      "tools": [],
      "servicesDemonstrated": [],
      "media": {
        "cover": null,
        "gallery": [],
        "video": null,
        "documents": []
      },
      "links": [],
      "createdAt": "",
      "updatedAt": ""
    },
    {
      "id": "presentation-design-demo",
      "slug": "presentation-design",
      "title": "Presentation Design",
      "subtitle": "Sample presentation deck",
      "summary": "A presentation design sample demonstrating information hierarchy, slide consistency, and clear visual communication.",
      "category": "creative-support",
      "projectType": "sample",
      "status": "draft",
      "featured": true,
      "sortOrder": 2,
      "problem": "Unstructured information or inconsistent slides can make a presentation difficult to follow.",
      "approach": "Organize the content into a clear narrative, establish consistent typography and spacing, and use layouts that support the purpose of each slide.",
      "solution": "A sample slide deck with a defined visual system and clear content hierarchy.",
      "value": "Demonstrates the ability to structure information and produce polished presentation materials. No client outcome is claimed.",
      "role": "Self-directed sample project",
      "tools": [
        "Figma"
      ],
      "servicesDemonstrated": [
        "creative-design"
      ],
      "media": {
        "cover": null,
        "gallery": [],
        "video": null,
        "documents": []
      },
      "links": [],
      "createdAt": "",
      "updatedAt": ""
    },
    {
      "id": "creative-design-collection",
      "slug": "creative-design-collection",
      "title": "Creative Design Collection",
      "subtitle": "Freelance Graphic Design · 2020–2021",
      "summary": "A curated collection of selected graphic design projects showcasing visual communication, layout design, image editing, and adaptability across different formats.",
      "category": "creative-support",
      "projectType": "client",
      "status": "draft",
      "featured": true,
      "sortOrder": 3,
      "problem": "Different visual communication needs call for adaptable layouts and formats while maintaining clear messaging.",
      "approach": "Create visual assets tailored to each format and intended use.",
      "solution": "A curated gallery of available work, organized into Marketing & Social Media; Posters, Flyers & Cover Art; and Illustration & Information Design.",
      "value": "Shows range across visual formats and creative production. Publish only assets the owner has permission to display.",
      "role": "Freelance graphic design",
      "tools": [
        "Adobe Photoshop",
        "Adobe Illustrator",
        "Canva"
      ],
      "servicesDemonstrated": [
        "creative-design"
      ],
      "media": {
        "cover": null,
        "gallery": [],
        "video": null,
        "documents": []
      },
      "links": [],
      "createdAt": "",
      "updatedAt": ""
    },
    {
      "id": "nova-echo-redesign",
      "slug": "nova-echo-redesign",
      "title": "Nova Echo — AI Website Redesign",
      "subtitle": "Website redesign concept",
      "summary": "A website redesign concept exploring visual hierarchy, layout consistency, and interface refinement.",
      "category": "web-support",
      "projectType": "concept",
      "status": "draft",
      "featured": true,
      "sortOrder": 4,
      "problem": "The redesign review identified opportunities to improve CTA gradient consistency, sticky navigation behavior, color consistency, and card density.",
      "approach": "Review the interface for repeated visual patterns, navigation behavior, color usage, and information density.",
      "solution": "A redesign concept focused on improving consistency and the overall interface presentation. Add specific screenshots and a final explanation after reviewing the current deployed version.",
      "value": "Demonstrates interface critique and redesign thinking. Do not claim measured conversion or usability improvements without testing evidence.",
      "role": "Self-directed redesign concept",
      "tools": [],
      "servicesDemonstrated": [
        "website-redesign"
      ],
      "media": {
        "cover": null,
        "gallery": [],
        "video": null,
        "documents": []
      },
      "links": [
        {
          "id": "live-demo",
          "label": "View Project",
          "type": "external",
          "url": "https://novaecho-redesign.vercel.app/"
        }
      ],
      "createdAt": "",
      "updatedAt": ""
    },
    {
      "id": "bini-fan-website",
      "slug": "bini-fan-website",
      "title": "BINI Fan Website Concept",
      "subtitle": "CMS-driven fan website",
      "summary": "A fan-made website concept built with Next.js and Sanity CMS.",
      "category": "web-support",
      "projectType": "personal",
      "status": "draft",
      "featured": false,
      "sortOrder": 5,
      "problem": "A content-rich fan website needs a structured way to present group information and discography content.",
      "approach": "Use a modern frontend and a content management system to separate page presentation from editable content.",
      "solution": "A Next.js website using Sanity CMS. The project also includes a custom script that generates a BINI discography JSON file from a Spotify-related pipeline.",
      "value": "Demonstrates CMS-driven content presentation and frontend integration. Do not claim official affiliation with BINI.",
      "role": "Self-directed fan website concept",
      "tools": [
        "Next.js",
        "Sanity CMS"
      ],
      "servicesDemonstrated": [
        "business-website-development"
      ],
      "media": {
        "cover": null,
        "gallery": [],
        "video": null,
        "documents": []
      },
      "links": [
        {
          "id": "live-demo",
          "label": "View Project",
          "type": "external",
          "url": "https://bini-concept-website.vercel.app/"
        }
      ],
      "createdAt": "",
      "updatedAt": ""
    },
    {
      "id": "nothing-headless-shopify",
      "slug": "nothing-headless-shopify",
      "title": "Nothing — Headless Shopify Concept Storefront",
      "subtitle": "Headless e-commerce concept",
      "summary": "A concept storefront built with Next.js and the Shopify Storefront API.",
      "category": "web-support",
      "projectType": "concept",
      "status": "draft",
      "featured": false,
      "sortOrder": 6,
      "problem": "A custom storefront needs to coordinate product variants and cart interactions while using Shopify as the commerce backend.",
      "approach": "Build a custom frontend on a Next.js Commerce foundation and connect it to Shopify's Storefront API.",
      "solution": "A headless storefront concept featuring dynamic variant handling, a sticky add-to-cart experience, and custom interaction logic.",
      "value": "Demonstrates headless commerce integration and custom frontend behavior. The current checkout flow redirects to Shopify; do not claim a fully headless checkout.",
      "role": "Self-directed e-commerce concept",
      "tools": [
        "Next.js",
        "Shopify Storefront API"
      ],
      "servicesDemonstrated": [
        "ecommerce-development",
        "api-integrations"
      ],
      "media": {
        "cover": null,
        "gallery": [],
        "video": null,
        "documents": []
      },
      "links": [
        {
          "id": "live-demo",
          "label": "View Project",
          "type": "external",
          "url": "https://headless-shopify-nothing.vercel.app/"
        }
      ],
      "createdAt": "",
      "updatedAt": ""
    },
    {
      "id": "ai-scam-detection-capstone",
      "slug": "ai-scam-detection-capstone",
      "title": "AI-Integrated Scam Detection Platform",
      "subtitle": "Academic capstone project",
      "summary": "An academic project integrating AI and external threat-analysis APIs into a scam detection workflow.",
      "category": "software-technical",
      "projectType": "academic",
      "status": "draft",
      "featured": false,
      "sortOrder": 7,
      "problem": "Users may need support evaluating potentially suspicious messages, links, or other scam-related signals.",
      "approach": "Combine an AI API with an external threat-analysis API as part of an academic scam-detection workflow.",
      "solution": "A capstone platform integrating the Gemini API and VirusTotal API. Add verified details about supported inputs, architecture, and evaluation after reviewing the original project materials.",
      "value": "Demonstrates academic software development and API integration. Do not claim production readiness or detection accuracy without evidence.",
      "role": "Academic capstone project",
      "tools": [
        "Gemini API",
        "VirusTotal API"
      ],
      "servicesDemonstrated": [
        "api-integrations"
      ],
      "media": {
        "cover": null,
        "gallery": [],
        "video": null,
        "documents": []
      },
      "links": [],
      "createdAt": "",
      "updatedAt": ""
    },
    {
      "id": "university-event-management-system",
      "slug": "university-event-management-system",
      "title": "University Event Management System",
      "subtitle": "Internship project",
      "summary": "A university event management system developed during a Web Developer Internship.",
      "category": "software-technical",
      "projectType": "academic",
      "status": "draft",
      "featured": false,
      "sortOrder": 8,
      "problem": "Event registration and attendance workflows require eligibility checks, check-in handling, and appropriate role-based access.",
      "approach": "Develop a web-based system using Laravel, Filament PHP, and MySQL.",
      "solution": "Implemented eligibility validation, QR-based check-ins, and role-based access control to support event registration and attendance workflows.",
      "value": "Demonstrates web application development and workflow implementation. Publish only details and screenshots that can be shared.",
      "role": "Web Developer Intern",
      "tools": [
        "Laravel",
        "Filament PHP",
        "MySQL"
      ],
      "servicesDemonstrated": [
        "web-management-systems"
      ],
      "media": {
        "cover": null,
        "gallery": [],
        "video": null,
        "documents": []
      },
      "links": [],
      "createdAt": "",
      "updatedAt": ""
    }
  ],
  "updatedAt": ""
}
```

#### Project seed review rules

-   All records are seeded so the dashboard has real initial content to
    edit.
-   The email/task management and presentation deck are new
    demonstration concepts and should remain drafts until the owner
    creates the actual work and media.
-   The creative design collection should remain a draft until the owner
    selects assets she is allowed to display.
-   Existing live website links are included where known, but their
    screenshots, current behavior, and case-study details still need
    review.
-   The Nova Echo, BINI, Nothing, capstone, and internship project
    records are not automatically ready for publication just because a
    URL or title exists.
-   The public website must not show a project until the owner
    explicitly publishes it.
-   The AI must not invent screenshots, video URLs, GitHub links, or
    external proof.

### 6.8 Initial services and process relationship

When seeding service IDs, ensure project references use those exact IDs.
If a project uses an unknown service ID, validation should flag it
rather than silently creating a new service.

Suggested relationships: - `email-task-management-demo` → create a new
service ID only if an administrative-support service is explicitly added
by the owner. - `presentation-design-demo` → `creative-design`. -
`creative-design-collection` → `creative-design`. - `nova-echo-redesign`
→ `website-redesign`. - `bini-fan-website` →
`business-website-development` only as a broad demonstrative
relationship; do not overstate it as paid business work. -
`nothing-headless-shopify` → `ecommerce-development`,
`api-integrations`. - `ai-scam-detection-capstone` →
`api-integrations`. - `university-event-management-system` →
`web-management-systems`.

If service references are optional in the final design, make the
relationship optional instead of inventing missing service records.

### 6.9 Admin first-run behavior

On the first run, the dashboard should: 1. Load the seeded JSON files.
2. Display profile, experience, skills/tools, services, process,
approach, and project records as prefilled editable data. 3. Clearly
label seeded content as "Initial content" until reviewed. 4. Show draft
projects separately from published projects. 5. Show missing media and
missing external proof as completion tasks. 6. Allow the owner to edit
text without needing to edit JSON directly. 7. Preserve IDs when editing
a record. 8. Generate a new ID only when creating or duplicating a
record. 9. Require explicit confirmation before publishing any seeded
draft. 10. Keep all drafts out of the public JSON deployment.

The AI must generate the seed JSON files and schemas during the
data-model phase, validate every JSON file, and report which records are
complete, incomplete, or awaiting owner review.

------------------------------------------------------------------------

## 7. JSON Schemas and Validation

Create JSON Schema files for each content type. Use the JSON Schema
version supported by the chosen validator and document it.

Validation must cover:

-   Required fields.
-   Correct data types.
-   Allowed enum values for status, project type, media type, and link
    type.
-   Unique IDs.
-   Valid slug format.
-   Non-negative or sensible sort order.
-   Valid URL format and allowed protocols.
-   Media object structure.
-   Required alt text for meaningful images.
-   Valid service references.
-   Valid media references.
-   Supported schema version.
-   Maximum reasonable field lengths where appropriate.

The dashboard should validate before preview/publish and display errors
beside the relevant field. The server-side publishing endpoint must
validate again because client-side validation can be bypassed.

### Data integrity rules

-   No duplicate project or service IDs.
-   A project's `servicesDemonstrated` values must refer to existing
    service IDs if that relationship is used.
-   A project must not be published without its required title, summary,
    project type, case-study fields appropriate to the template, and
    required media where the layout demands it.
-   A missing optional video must not break the page.
-   An invalid media URL must produce a clear warning or block
    publication according to severity.
-   Unknown fields should be handled consistently. Do not silently
    destroy fields the dashboard does not understand when saving
    existing records.

------------------------------------------------------------------------

## 8. Project Case Study Content Pattern

Use one consistent case-study framework for the portfolio.

### Required narrative

1.  **Situation / Problem** --- What is difficult, unclear, inefficient,
    inconsistent, or missing?
2.  **Approach** --- How was the problem assessed? What requirements or
    constraints mattered?
3.  **Solution** --- What did the owner actually create or do?
4.  **Value** --- How could the work improve organization, usability,
    communication, consistency, or operations?
5.  **Evidence** --- Screenshots, deliverables, walkthrough video, live
    link, or other proof.
6.  **Role and tools** --- What the owner contributed and which tools
    were used.

Do not make unsupported claims such as percentage improvements, money
saved, client satisfaction, or measured time savings unless there is
real evidence.

### Suitable project groups

1.  Email and task management demonstration.
2.  Presentation design.
3.  Graphic design and creative support.
4.  Website and e-commerce support.

Avoid creating a separate elaborate case study for every small asset.
Strong projects receive detailed case studies; supporting samples can
use concise captions.

------------------------------------------------------------------------

## 9. Admin Dashboard Information Architecture

### Main navigation

-   Overview
-   Projects
-   Services
-   Profile & Contact
-   Navigation / Site Settings
-   Media References (optional in first release)
-   Validation / Publishing History (if supported by the publishing
    mechanism)

### Overview

Show only useful information: - Total projects. - Published projects. -
Draft projects. - Archived projects. - Validation or publishing
errors. - Last successful publish time, if available.

Do not fabricate counts or success states. Empty states should explain
what to do next.

### Project manager

Required capabilities: - List/search projects. - Filter by status, type,
category, and featured state. - Add project. - Edit project. - Duplicate
project with a new ID and slug. - Change display order. - Toggle
featured state. - Preview project. - Save draft. - Publish or
unpublish. - Archive with confirmation. - Detect unsaved changes. - Warn
if a project references missing services or media.

### Project editor sections

**Basic information** - Title - Slug - Subtitle - Summary - Category -
Project type - Featured state - Display order - Status

**Case study** - Problem - Approach - Solution - Value - Role /
contribution - Tools - Services demonstrated

**Media** - Cover image URL / Cloudinary public ID - Gallery items -
Video URL / Cloudinary public ID - Documents and supporting files - Alt
text and captions - Preview each asset

**Links** - Live demo - Repository - Video - Supporting document - Other
approved external links

### Service manager

-   Add/edit service.
-   Edit title, description, tasks, and display order.
-   Publish/archive.
-   Prevent duplicate IDs.
-   Warn if a service is referenced by existing projects before
    deletion.

### Profile and site settings

-   Name and display name.
-   Title and tagline.
-   About text.
-   Profile image reference.
-   Email and approved professional links.
-   SEO title and description.

### Preview behavior

-   Preview must use the same presentation components as the public site
    where practical.
-   Preview must reflect unsaved editor state.
-   Label preview clearly as a draft.
-   Ensure preview cannot accidentally publish changes.
-   Provide a way to return to editing without losing state.

------------------------------------------------------------------------

## 10. Admin State and Data Handling

### 9.1 State layers

Separate the following states:

1.  **Published state:** canonical content currently committed to
    GitHub.
2.  **Loaded state:** the version currently loaded by the editor.
3.  **Working draft:** unsaved changes in the current editing session.
4.  **Local recovery draft:** optional browser-stored recovery state.
5.  **Pending publish payload:** validated data waiting to be sent to
    the publishing endpoint.

Do not confuse local recovery storage with the published source of
truth.

### 9.2 Save behavior

-   Editing fields updates working draft state only.
-   Show `Unsaved changes` when the working draft differs from the
    loaded state.
-   `Save Draft` saves to the private draft store if one exists, or
    explicitly saves locally if the implementation is local-only.
-   `Publish` validates and submits a controlled payload to the secure
    publishing endpoint.
-   Show success only after the server confirms the repository update.
-   If the request fails, preserve the working draft and show an
    actionable error.
-   Prevent duplicate submissions while a publish operation is in
    progress.
-   Handle stale content: if the repository has changed since the editor
    loaded it, detect the conflict and require a reload or merge instead
    of silently overwriting newer changes.

### 9.3 Concurrency and versioning

Even for a single-owner site, avoid overwriting concurrent edits.

-   Record the repository commit SHA or equivalent version when content
    is loaded.
-   Publishing should use an expected version.
-   If the expected version no longer matches the latest repository
    version, return a conflict.
-   Provide a reload-and-review path.
-   Use Git history for rollback.
-   Include a schema version and a migration plan if field structures
    change.

### 9.4 Deletion and archiving

-   Prefer archive over permanent deletion.
-   Require confirmation for destructive operations.
-   Check for references before deleting a service or media record.
-   Do not delete a Cloudinary asset automatically when removing a
    reference from JSON.
-   If permanent deletion is later supported, make it a separate,
    deliberate action.

------------------------------------------------------------------------

## 11. Cloudinary Media Workflow

### Owner workflow

1.  Prepare and optimize the image or video.
2.  Upload it to Cloudinary using the Cloudinary dashboard or an
    approved upload workflow.
3.  Organize assets into project-oriented folders.
4.  Copy the delivery URL and public ID.
5.  Add the media reference in the admin project form.
6.  Preview the asset.
7.  Validate the URL and metadata.
8.  Publish the project content.

### Suggested Cloudinary folder organization

``` text
portfolio/
├── profile/
├── email-task-management/
├── presentation-design/
├── graphic-design/
└── website-ecommerce/
```

Cloudinary folders are for media organization. The JSON content
structure remains the source of truth for which project uses each asset.

### Performance rules

-   Use optimized formats and appropriately sized images.
-   Avoid loading full-resolution source files for small cards.
-   Lazy-load images below the fold.
-   Use `width` and `height` or `aspect-ratio` to reduce layout shift.
-   Load video metadata only until the visitor chooses to play.
-   Provide a poster image for video previews where possible.
-   Avoid autoplay with sound.
-   Provide a fallback if media fails to load.
-   Test delivery URLs on the deployed website, not only in the
    dashboard.

### Security rules

-   Delivery URLs for intended public portfolio assets may be public.
-   Never put Cloudinary API secrets or privileged credentials in client
    code.
-   If direct uploads from the admin are added later, use a signed
    upload flow handled by a trusted server, or an appropriately
    restricted upload preset only when its security implications are
    understood.
-   The initial version may simply accept media URLs copied from
    Cloudinary; direct upload integration is not required.

------------------------------------------------------------------------

## 12. Secure Publishing Design

### 11.1 Required security properties

-   No GitHub personal access token in browser JavaScript, HTML, public
    JSON, or Git history.
-   Server-side credentials stored in deployment environment variables.
-   Admin authorization enforced by the publishing endpoint.
-   Only explicitly allowed content paths may be written.
-   Request payloads are validated server-side.
-   Request size is limited.
-   Errors do not expose secrets or sensitive environment details.
-   Publishing operations are logged without logging credentials.
-   CORS is restricted where applicable, but CORS is not treated as
    authentication.
-   The endpoint cannot be used as a generic GitHub proxy.

### 11.2 Publish request

The dashboard sends a content payload and the expected repository
version. The server validates the user, payload, file paths, and schema,
then writes the permitted JSON file(s) to GitHub.

The server should return: - Success/failure. - Updated commit reference
or equivalent version. - Validation errors where relevant. - Conflict
status if the repository changed. - A safe error message for other
failures.

### 11.3 Multi-file publish consistency

If an edit updates several JSON files, publishing must avoid leaving
content in a partially updated state.

Preferred approach: - Validate the full content set. - Create a single
Git commit containing all related file updates, or use a controlled
pull-request workflow. - Trigger the site deployment. - Confirm the
resulting commit/deployment state where practical.

Do not report deployment completion merely because the API accepted a
request.

### 11.4 Authentication choice

Select an authentication method appropriate to the deployment platform
and budget. Prefer a maintained authentication provider or platform
access control over custom password handling. Do not invent an
authentication scheme in frontend JavaScript.

If authentication is not implemented yet, keep publishing disabled and
use a manual export/commit workflow during development.

------------------------------------------------------------------------

## 13. Public Portfolio Rendering

### Data loading

-   Load only public content JSON.
-   Filter to records with `status === "published"`.
-   Sort by `featured` and `sortOrder` according to a documented rule.
-   Handle missing or invalid JSON gracefully.
-   Show a useful fallback rather than a blank page if content loading
    fails.
-   Do not render draft content merely because the admin has a draft
    record in memory.
-   Use relative paths that work on the configured GitHub Pages base
    path.

### Project card

Each project card should display only the information necessary for
discovery: - Cover image. - Project title. - Short summary. - Category
or project type where useful. - Optional featured badge. - Link to the
case study.

### Case study page or modal

-   Situation/problem.
-   Approach and solution.
-   Value.
-   Media gallery/video.
-   Tools and role.
-   Relevant live links or deliverables.
-   Project type disclosure where applicable.

Use safe DOM APIs and text insertion for user-authored content. Avoid
injecting untrusted strings with `innerHTML`. If rich text is needed,
define a controlled format and sanitize it.

### SEO and accessibility

-   Unique page title and description for the main page and project
    detail pages where supported.
-   Descriptive alt text.
-   Correct heading hierarchy.
-   Meaningful link text.
-   Keyboard-accessible controls.
-   Responsive layouts.
-   Reduced-motion support.
-   Useful error and empty states.

------------------------------------------------------------------------

## 14. AI Implementation Protocol

The coding AI must follow the phases below in order. Do not skip ahead
to building the dashboard UI before understanding the current project.

### Phase 0 --- Inspect and establish baseline

1.  Inspect the existing repository, project files, deployment setup,
    and current public portfolio.
2.  Identify the current HTML/CSS/JS architecture, existing fonts, CSS
    variables, components, and any design-token files.
3.  Identify existing portfolio content and deployed project links.
4.  Determine the current GitHub Pages base path and build/deployment
    behavior.
5.  Create `docs/IMPLEMENTATION_LOG.md` and record findings,
    assumptions, risks, and files likely to be affected.
6.  Do not delete, overwrite, or replace existing files at this stage.
7.  Do not invent missing design tokens or contact details.

**Acceptance criteria:** A concise repository audit exists, current
deployment behavior is understood, and no existing files have been
changed destructively.

### Phase 1 --- Split and organize documentation

Create the documentation structure first. Keep this master specification
as the overall reference, then split it into focused documents so future
work can be delegated safely.

Create: - `docs/ARCHITECTURE.md` - `docs/DESIGN_SYSTEM.md` -
`docs/DATA_MODEL.md` - `docs/ADMIN_WORKFLOW.md` - `docs/PUBLISHING.md` -
`docs/IMPLEMENTATION_LOG.md`

For each document: 1. Extract the relevant requirements from this master
specification. 2. Preserve all mandatory constraints. 3. Avoid
contradictory duplicated instructions. 4. Link back to the master
specification when appropriate. 5. Update the implementation log with
files created and decisions made.

**Acceptance criteria:** The documentation is complete enough that an AI
agent can implement a single phase without needing to infer the whole
architecture from chat history.

### Phase 2 --- Extract the existing design system

1.  Inspect the existing public portfolio source.
2.  Extract exact CSS variables, font-loading rules, spacing values,
    radii, border styles, shadows, button variants, focus styles, and
    motion behavior.
3.  Record them in `docs/DESIGN_SYSTEM.md`.
4.  Centralize shared tokens in `css/tokens.css` only if this does not
    conflict with the existing architecture.
5.  Reuse existing components or refactor them carefully.
6.  Build a minimal admin shell that visually matches the public
    portfolio.
7.  Compare the admin and public site at desktop and mobile widths.

**Acceptance criteria:** No unrelated palette or typography system is
introduced; existing public-site design remains intact; the admin shell
uses the same tokens and visual language.

### Phase 3 --- Finalize data model and schemas

1.  Create the initial JSON files for site settings, services, projects,
    and navigation.
2.  Create matching JSON Schemas.
3.  Define status and project-type enums.
4.  Define media and link object structures.
5.  Add stable IDs, timestamps, sort order, and schema versions.
6.  Add a content-validation script.
7.  Test valid and invalid examples.
8.  Confirm drafts cannot appear in public output.

**Acceptance criteria:** Content records are valid, duplicate IDs are
rejected, invalid references are reported, and sample data does not
contain invented claims.

### Phase 4 --- Build the public data layer

1.  Create the data-loading utility.
2.  Load JSON from paths compatible with GitHub Pages.
3.  Implement published-only filtering.
4.  Implement sorting and error states.
5.  Render project cards from data.
6.  Render project details using reusable components.
7.  Connect Cloudinary media references.
8.  Verify that no content is hardcoded in multiple places
    unnecessarily.

**Acceptance criteria:** Editing a valid JSON record updates the
displayed public content after deployment without requiring layout
changes.

### Phase 5 --- Build the admin dashboard

Implement in this order:

1.  Admin shell and navigation.
2.  Overview and empty states.
3.  Project list and filters.
4.  Project create/edit form.
5.  Media and link editor.
6.  Preview using the public presentation components.
7.  Service editor.
8.  Profile/site-settings editor.
9.  Dirty-state detection and local recovery.
10. Validation feedback and confirmation dialogs.

Start with local fixture data if necessary, but clearly label it as
fixture data. Do not claim persistence or publishing works until the
corresponding implementation exists.

**Acceptance criteria:** The owner can create and edit content in the
interface, see validation errors, preview the working draft, and recover
from ordinary form mistakes.

### Phase 6 --- Implement the publishing workflow

1.  Select and document the authentication and serverless hosting
    approach.
2.  Implement the publishing endpoint separately from the public static
    site.
3.  Store credentials only in server-side environment variables.
4.  Restrict write operations to allowed JSON paths.
5.  Validate payloads on the server.
6.  Implement expected-version checks and conflict responses.
7.  Commit related file changes atomically where practical.
8.  Return accurate status information to the admin.
9.  Test unauthorized requests, invalid payloads, stale versions, and
    failed GitHub writes.
10. Keep publish actions disabled until the secure endpoint is
    configured.

**Acceptance criteria:** No privileged secret exists in the public
repository or browser bundle; unauthorized writes fail; valid writes
update only allowed files; errors preserve the user's draft.

### Phase 7 --- Media, performance, and responsive QA

1.  Verify Cloudinary URLs.
2.  Test missing images, missing videos, and invalid URLs.
3.  Check responsive behavior at desktop, tablet, and mobile widths.
4.  Check keyboard navigation and visible focus.
5.  Check reduced-motion behavior.
6.  Optimize image loading and video behavior.
7.  Check for console errors and failed network requests.
8.  Test GitHub Pages deployment paths.
9.  Confirm public JSON contains only publishable content.

**Acceptance criteria:** The public portfolio remains usable when
optional media fails; the layout works on common screen sizes; no
secrets or private drafts are published.

### Phase 8 --- Documentation and handoff

1.  Update `README.md` with project overview and local setup
    instructions.
2.  Document how to add/edit/archive a project.
3.  Document how to upload media to Cloudinary and add its URL.
4.  Document how publishing and rollback work.
5.  Document environment variables by name only; never include their
    values.
6.  Update `docs/IMPLEMENTATION_LOG.md`.
7.  Provide a list of completed work, known limitations, and remaining
    setup steps.
8.  Verify the final deployment.

**Acceptance criteria:** The owner can maintain the portfolio without
having to rediscover the architecture from source code.

------------------------------------------------------------------------

## 15. AI Agent Working Rules

The AI implementing this specification must:

-   Read the master specification and relevant `docs/` files before
    making changes.
-   Inspect existing code before creating replacements.
-   Preserve existing public portfolio behavior unless a change is
    explicitly required.
-   Prefer incremental changes over rewriting the entire project.
-   Keep full, working files rather than returning partial snippets when
    modifying an existing file.
-   Never invent personal information, client work, testimonials,
    outcomes, or metrics.
-   Never put credentials in client-side files.
-   Never silently change the design system.
-   Never mark an incomplete feature as complete.
-   Run available validation and build checks after each phase.
-   Report errors and limitations honestly.
-   Update the implementation log after completing a phase.
-   Stop and request a decision if an architectural requirement cannot
    be met safely or conflicts with the existing project.
-   Keep the implementation scoped to the GVA portfolio and its admin
    CMS.

### Required status report after each phase

The AI should report: 1. What was inspected or changed. 2. Files created
or modified. 3. Tests/checks run and their results. 4. Remaining issues
or decisions. 5. The next planned phase.

------------------------------------------------------------------------

## 16. Testing Checklist

### Content

-   [ ] JSON parses successfully.
-   [ ] JSON Schema validation passes.
-   [ ] IDs are unique.
-   [ ] Status values are valid.
-   [ ] Project references point to existing records.
-   [ ] Published content has the required fields.
-   [ ] Draft and archived records are excluded from the public site.

### Admin

-   [ ] Create, edit, duplicate, archive, and reorder behavior works.
-   [ ] Unsaved changes are visible.
-   [ ] Preview reflects current working state.
-   [ ] Invalid data shows field-level errors.
-   [ ] Failed publishing preserves draft state.
-   [ ] Conflicts do not silently overwrite newer content.
-   [ ] Destructive actions require confirmation.

### Security

-   [ ] No GitHub credential appears in client files or browser bundles.
-   [ ] No Cloudinary API secret appears in public files.
-   [ ] Unauthorized publish requests fail.
-   [ ] Only allowed paths can be updated.
-   [ ] Server-side validation is enforced.
-   [ ] Private drafts are not included in public JSON.

### Public site

-   [ ] Site loads on GitHub Pages at the actual deployment path.
-   [ ] Project cards and case studies render from JSON.
-   [ ] Cloudinary images display correctly.
-   [ ] Video playback works with controls.
-   [ ] Broken optional media does not break the page.
-   [ ] Mobile and keyboard accessibility checks pass.
-   [ ] No console errors remain.

### Documentation

-   [ ] Root README explains the project.
-   [ ] Each architecture document has a clear purpose.
-   [ ] Cloudinary and publishing workflows are documented.
-   [ ] The implementation log reflects actual state, not intended
    state.

------------------------------------------------------------------------

## 17. Definition of Done

The project is complete when:

1.  The public portfolio uses the existing design system.
2.  Published content is driven by structured JSON.
3.  Projects consistently present the problem, approach/solution, value,
    and evidence.
4.  Images and videos load from Cloudinary.
5.  The admin dashboard can manage content without manually editing
    HTML.
6.  Preview and validation work before publishing.
7.  Publishing is secure, or a clearly documented manual JSON-export
    workflow is used until secure publishing is configured.
8.  Drafts are not accidentally exposed.
9.  GitHub Pages deployment works at the real URL.
10. Documentation accurately describes the implemented architecture and
    maintenance workflow.

**Final guiding principle:** Keep the public website static and fast,
keep content structured and independently editable, keep media in
Cloudinary, keep publishing credentials private, and reuse the exact
design system from the existing portfolio.
