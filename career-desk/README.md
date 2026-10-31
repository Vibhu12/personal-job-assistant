# Career Desk

An AI-assisted workspace for turning job discovery into explainable recommendations, candidate decisions and an approval-based application workflow.

## Problem
Job seekers repeatedly compare role fit, work mode, salary and notice periods across disconnected listings. Applying also requires resume versions, screening answers and follow-up records. Career Desk brings these decisions into one workspace.

## Product ownership
The product owner defined the use case, preference rules, phase boundaries, approval requirements, failure handling and evaluation priorities. AI tools assisted substantially with implementation, research and testing. Source volume is not a claim of unaided coding.

## Implemented source
- Per-account job preferences, company research, notes and decisions.
- Stable job identifiers and research merges that preserve candidate choices.
- Private resume versions and a job-specific approval workflow.
- Resume extraction, synonym-aware lexical evidence matching and optional browser-side semantic retrieval.
- Missing-information questions, approval packets and application history.
- Manual employer-link handoff and user-recorded progress.
- Responsive white/lavender/blue/teal interface.

The semantic matching code requires evaluation across real document types. Its presence does not prove retrieval quality. Reliable employer upload and automatic submission have not been established. Opening an employer link never counts as submission.

## Architecture
```text
React UI → authenticated API → per-user state and private object storage
                         ↘ approval packet / questions / application timeline
Agent research → MCP operations → merge by stable job ID
Resume → browser extraction → lexical + optional semantic evidence → user review
```

## Run and configure
Requires Node 22.13+ and the package-manager version in package.json.

```sh
cd career-desk
corepack enable
pnpm install --frozen-lockfile
pnpm dev
pnpm build
node qa-validation.mjs
```

This is a Sites/Vinext/Cloudflare source project, not a portable standalone hosting bundle. Deployment requires your own Sites project and private R2 binding named BUCKET. The hosting manifest is a generic template with no project identity. All deployment IDs have deliberately been omitted. Register your own project through the supported Sites workflow before building/deploying. A plain clone may require execution-profile configuration in that environment.

Identity headers must be supplied by a trusted authenticated hosting layer that strips client-supplied identity headers. Never expose this API directly and trust arbitrary headers. Production connector access and scheduled searches require separately configured integrations. This repository includes no active schedule or email-delivery service.

## Privacy
New accounts start empty. There is no personal seed dataset or special owner-email mapping. No resumes, application answers, uploaded documents, screenshots, backups, production storage exports, credentials or Git history from the deployed project are included.

The public source supports runtime private uploads; that does not put uploaded files into Git. See [privacy and release checks](docs/PRIVACY.md).

## Product decisions, validation and roadmap
- [Product decisions and trade-offs](docs/PRODUCT.md)
- [Validation and evidence boundaries](docs/VALIDATION.md)
- [Planned improvements](docs/ROADMAP.md)

## Current limitations
External forms vary. Stop for login, CAPTCHA, unsupported upload or missing required answers. Do not bypass verification or retry a possibly submitted form. Record success only with employer evidence, or clearly label a manual user report.

No placement outcomes, external adoption or measured time savings are claimed. Synthetic tests verify specific invariants, not universal application compatibility.
