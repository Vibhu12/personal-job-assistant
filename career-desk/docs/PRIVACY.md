# Privacy and release checks

- This project was exported through an explicit file allowlist, without the deployed repository's Git history.
- Personal seed data, owner-email exceptions and approved-resume fixture references were removed before upload.
- New accounts receive empty state. Synthetic tests use reserved example domains and fabricated content.
- No production configuration, hosting IDs, contact information, applicant answers or resume bytes belong in this tree.
- Ignore uploads, documents, environment files, private keys, backups and generated output.
- Run the privacy scanner before committing. It reports paths/categories, never matched values.
- Review files manually too: regex scanning cannot prove the absence of every secret or personal fact.
- Keep real resume processing in private runtime storage with authenticated per-user access.
- Configure trusted identity, retention, deletion and consent before production use.
