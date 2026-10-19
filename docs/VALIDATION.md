# Validation status

Snapshot: 19 October 2026. This export derives from hosted source commit `8738c8a942261fe590b563a0733578795ca070a2`, with applicant data and site identity removed.

- Original backend suite: 48/48 groups; sanitized portable suite: 47 groups because the real private-resume fixture is omitted.
- Live signed-out access checks: 10/10 expected responses through the supported hosting QA route. Forged identity headers did not grant account access.
- Small lexical/synonym set: 8/8 expected top-ranked passages.
- Actual quantized CPU hybrid reference inference: 8/8 expected top-ranked passages. Browser WASM and a larger independent dataset were not tested.
- Ten employer application pages opened during read-only link checks. No universal ATS-compatibility claim follows.
- Owner-confirmed native task email receipt; this repository does not implement an email sender.
- External Chrome workflow successfully uploaded the approved DOCX and filled required answers. One submission attempt opened hCaptcha; no employer success confirmation was recorded.

Corrected cases include duplicate submissions after rejection, stable-ID preservation, stale question answers, invalid dropdown/multi-select answers, wrong archive uploads, long resume passages, generic-heading false positives, model-file compatibility, input changes during analysis and inconsistent browser Origin checks.

Remaining release gates: signed-in two-account browser UAT; keyboard/mobile/accessibility testing; browser model-loading verification; a supported standalone browser and private attachment adapter; employer confirmation testing; an observed full weekly research run; robust file parsing/malware scanning; larger relevance/negation evaluations; load and failure-recovery testing.

Verdict: suitable for further development and supervised review workflows; not certified for unattended applications. Test results are a dated snapshot, not a guarantee.
