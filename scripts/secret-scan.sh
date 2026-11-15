#!/usr/bin/env bash
# Fails if a Supabase service key or private key appears in tracked files. Run in CI.
set -euo pipefail
if git grep -nIE 'service_role[^a-z_ ]*[=:] *["'\'']?eyJ|SUPABASE_SERVICE_ROLE_KEY *= *[^ ]+|-----BEGIN (RSA |EC )?PRIVATE KEY-----' -- . ':!scripts/secret-scan.sh' ':!docs'; then
  echo "Possible secret found" >&2; exit 1
fi
echo "secret scan clean"
