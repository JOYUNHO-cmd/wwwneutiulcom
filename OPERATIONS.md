# Security and recovery operations

- Dependabot checks npm dependencies weekly and GitHub Actions weekly. Review and test update PRs before merging; updates do not auto-merge.
- `Security checks` runs dependency audit, type checks and tests for PRs, main pushes and daily (08:23 Asia/Seoul). Any known npm vulnerability fails the audit.
- `Production health` checks five public pages, their security headers, two RSS feeds and denial of anonymous Firestore system reads hourly at minute 37. Each check retries three times. It never signs in or writes data.
- GitHub Actions schedules can be delayed and public repositories' schedules can be disabled after 60 days without repository activity. Check the Actions page periodically. This is basic monitoring, not a guaranteed real-time incident service.
- Account notification preferences must keep failed workflow email notifications enabled. Confirm actual receipt on a future failure; successful runs do not prove email delivery. Dependabot notifications are configured separately in GitHub account settings.

## When a check fails

Open the failed Actions run and review which check failed. For a dependency alert, inspect the advisory and Dependabot PR, then rerun tests. For a production failure, check Vercel deployment status and logs before rolling back to a known healthy deployment. Do not weaken Firebase rules to make a check pass.

## Backups

A separately stored, verified Git bundle preserves source history. Keep it on an independent secure device or storage location and refresh it after meaningful changes. A Git bundle does not include Firestore records, Firebase Auth users, Vercel environment variables or account settings.

To restore the main source snapshot from a bundle containing `refs/remotes/origin/main`:

```sh
git init recovered-site
cd recovered-site
git fetch /path/to/backup.bundle refs/remotes/origin/main:refs/heads/restored-main
git switch restored-main
npm ci
npm run lint
npm test
npm run build
```

Firestore scheduled backups and point-in-time recovery must be configured independently on the correct database. Billing approval is required before enabling paid services. After configuring backups, verify a completed backup and periodically restore to a separate database before relying on recovery. Never overwrite production as a restore test.

## Account maintenance

Keep Google, GitHub and Vercel MFA enabled and store recovery codes privately. Review sessions, OAuth/installed apps and team members regularly. Revoke only confirmed obsolete access; integrations may serve other projects. Never commit credentials or recovery codes.
