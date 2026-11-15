# Backend cutover rules (R2 refined)

1. A staging Supabase project (ca-central-1) is used before production.
2. The adapter flag is a read-path switch once a real user has written server data.
3. Demo-adapter local data is **discarded** on first server sign-in, with a visible notice. It is never silently imported.
4. Before the flag is flipped: `npm run test:db`, `npm run check`, browser journeys, Supabase security advisors, backup and restore drill, paid tier (no auto-pause, backups).
5. Rolling back is a flag flip; data written to the server stays on the server.
6. Real customers: server-side deletion, consent copy, retention statement, terms and privacy pages, FR/ES strings for consent, delete, export and report (see docs/security/DATA_RETENTION_MATRIX.md).
7. Google sign-in prerequisites (start early, review can take days): OAuth consent screen, domain verification, privacy policy URL.
