# Personal Job Assistant

A multi-user job-search tracker with private resume versions, evidence-based matching, employer screening-question review, explicit application approvals, and confirmation-based progress tracking.

This is a sanitized export of the implemented Career Desk source as of 19 October 2026. It is an agent-assisted application product, not a complete unattended application service. The source does not contain applicant resumes, personal contact details, real tracker records, credentials, or the original hosted project identity.

## What works

- Public landing page and isolated signed-in workspaces.
- Preferences, saved employer links, job decisions, company research and update history.
- Private PDF/DOCX resume storage with immutable versions, SHA-256 hashes, duplicate detection, size limits and structural format checks.
- Browser-local text extraction and hybrid evidence retrieval: lexical scoring, synonym handling and local quantized sentence embeddings.
- Exact employer questions with required answers, single-select and multi-select options, revision control, answer approval and audit history.
- Approval tied to an exact job URL, role/company and resume hash; duplicate-submission prevention and revocation.
- Application progress with an employer confirmation requirement for Submitted status.
- Authenticated MCP tools for reading/updating the tracker, storing resumes, retrieving approved packets and posting missing questions back to the website.

## What is not included

- A standalone server-side browser executor, automatic ATS scanning or a private binary-upload adapter.
- A built-in job-search engine or per-user weekly scheduler. The MCP research endpoint accepts researched results; external authorized research/scheduling must be configured separately.
- An email sender, recipient verification service or email-delivery receipts. An email preference is not a configured email integration.
- CAPTCHA solving, login automation, cover-letter generation, automatic factual screening-answer generation or universal ATS support.
- Production malware scanning, OCR for scanned PDFs or a full security certification.

A one-off external browser test accepted an exact resume attachment, but submission paused at an employer CAPTCHA. A task-notification email test was confirmed received by the owner. Neither external test means those capabilities are implemented as standalone website services.

## Architecture

- React 19, TypeScript and Vinext/Vite frontend and route handlers.
- Cloudflare Worker runtime and R2 binding named `BUCKET`.
- ChatGPT Sites authentication boundary supplies trusted user identity headers.
- R2 stores a separate state object and resume objects for each verified user.
- Mammoth extracts DOCX text; PDF.js extracts text from readable PDFs.
- Transformers.js 3.8.1 and `Xenova/all-MiniLM-L6-v2` generate local browser embeddings. Model assets download from Hugging Face; resume text is not sent to an inference service.
- Provider integrations are isolated behind authenticated server endpoints and the MCP interface.

**Authentication warning:** production handlers trust identity headers injected by the Sites gateway. Never expose them behind an arbitrary proxy that accepts client-supplied identity headers. A deployment outside Sites must implement verified authentication and strip/rewrite those headers before these handlers run.

## Local development

Requirements: Node.js >=22.13, Git, and pnpm 11.25.0 (declared in `package.json`). Install pnpm using its official supported installation method if it is absent.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Portable mode is the default for a clean clone and uses loopback development authentication. Follow the URL printed by the dev server. Local sign-in uses the starter's synthetic development identity, not a real applicant account. Production mock authentication must remain disabled.

```sh
pnpm test
pnpm typecheck
pnpm build
```

The functional tests use synthetic data and an in-memory R2 substitute. The sanitized export runs 47 QA groups plus the multi-tenant regression script. The original owner's 48th check used a private resume and is deliberately excluded. The actual embedding reference evaluation used an additional small synthetic set; it was not a browser UI test or a general accuracy benchmark.

## Register and deploy with Sites

1. Use the supported Sites workflow to register a fresh project. Do not reuse another deployment's project ID.
2. Configure the exact returned project ID:

   ```sh
   node scripts/configure-project.mjs YOUR_EXACT_SITES_PROJECT_ID
   ```

3. Keep the R2 binding `BUCKET` and MCP capability in `.openai/hosting.json`.
4. Build, package, save and deploy using the supported Sites workflow. Preserve the chosen audience and test that the production gateway strips untrusted identity headers.
5. Configure research, scheduling and email integrations for each authorized account. These are not created by cloning this repository.

The export intentionally leaves `project_id` absent. Registration is required for hosted publication. For another hosting provider, replace the Sites-specific authentication, build and integration layers; do not assume the current code is provider-independent.

## Application workflow

1. Save an official employer job URL and upload the intended resume.
2. Review resume evidence and approve the exact job/resume combination.
3. An authorized agent inspects the actual employer form, then uses `request_application_input` to send unknown required questions to the user's private webpage.
4. The user answers and approves the current question revision on the webpage.
5. A supported external executor may fill the approved form. Pause for login, CAPTCHA, unsupported attachments or changed requirements.
6. Record Submitted only after explicit employer success evidence; never retry a possibly submitted request blindly.

Show the employer application link and precise pending action for blockers when that fallback is wanted. A newly opened link may not preserve another browser's filled form.

## API and MCP entry points

| Endpoint | Purpose |
| --- | --- |
| `/api/state` | Private workspace state and preference/decision updates; blank anonymous response |
| `/api/jobs` | Save an employer job link |
| `/api/resumes` | Private immutable resume upload/download |
| `/api/applications` | Approvals, screening-question revisions, approved answers and progress |
| `/api/refresh` | Merge researched jobs while preserving decisions and application history |
| `/mcp` | Authenticated agent tools for this workspace |

The exact MCP schemas are defined in `app/mcp/route.ts`. Do not treat MCP availability as an installed browser, email or scheduling adapter.

## Important files

- `app/page.tsx`, `app/phase-two.tsx`: dashboard and application workflow.
- `app/application-questions.tsx`: required screening-answer review.
- `app/resume-review.tsx`, `app/resume-reader.ts`, `app/semantic.worker.ts`: local extraction and evidence search.
- `lib/access.ts`, `lib/state.ts`: trusted identity boundary and scoped persistence.
- `lib/applications.ts`, `lib/questions.ts`, `lib/resume-format.ts`: approvals, question revisions and file checks.
- `lib/resume-match.ts`: lexical/synonym ranking and semantic fusion.
- `docs/PRODUCT_PROMPT.md`: one complete, reusable product-building prompt.
- `docs/VALIDATION.md`: observed test coverage and remaining release gates.

## Privacy and operational boundaries

Never commit `.env` files, credentials, resumes, applicant answers, browser profiles, recordings or real workspace exports. Keep secrets server-side and per-user access scoped. Do not publish resume URLs or send applicant information to unrelated services. Display unknown salary/eligibility facts honestly. File signature/structure checks do not replace malware scanning. Resume similarity is evidence retrieval, not proof of experience or a hiring decision.

Use repository branch `personal-job-assistant`. Git branch names cannot contain spaces. No GitHub remote or personal Git history is bundled.
