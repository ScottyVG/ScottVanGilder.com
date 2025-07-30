# Security Scanning

## Gitleaks

```bash
# install (via brew, cargo, or download binary)
gitleaks detect --source . --report-path gitleaks-report.json
```

* Scans commits, branches and tags for AWS keys, SSH keys, tokens, passwords, and more.

* Report shows file, line, and commit hash for each finding.
