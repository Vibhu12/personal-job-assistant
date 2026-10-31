# Product decisions

| Decision | Reason | Trade-off |
|---|---|---|
| Research before application automation | Validate relevance and persistent decisions first | Less immediate automation |
| Explain fit with evidence and gaps | Make uncertainty reviewable | More detail to read |
| Fixed salary separate from bonus/equity | Avoid false compensation qualification | Many roles remain unverified |
| Stable IDs preserve decisions | Weekly discovery must not erase intent | Requires deduplication rules |
| Approval tied to job and resume | Limit unintended external actions | Adds an explicit review step |
| Missing facts require user input | Avoid fabricated applications | Some work remains manual |
| Public product, private workspaces | Allow discovery without sharing candidate data | Requires trusted identity infrastructure |

## Lessons
Form filling is not an end-to-end application. Attachment capabilities, human verification and employer confirmation are separate dependencies. A visible Apply button may redirect or require JavaScript/login. Reminder execution does not establish email receipt. Tests must assert data identity and evidence, not just output structure.
