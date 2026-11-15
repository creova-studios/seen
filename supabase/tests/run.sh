#!/usr/bin/env bash
# Runs migrations and RLS tests against a throwaway local Postgres (no Docker, no Supabase project).
set -euo pipefail
PGBIN=${PGBIN:-/usr/lib/postgresql/16/bin}
DIR=$(cd "$(dirname "$0")/.." && pwd)
TMP=$(mktemp -d); chmod 755 "$TMP"
RUNAS=""; if [ "$(id -u)" = 0 ]; then chown -R postgres "$TMP" 2>/dev/null; RUNAS="su postgres -c"; fi
run() { if [ -n "$RUNAS" ]; then su postgres -c "$*"; else bash -c "$*"; fi; }
PORT=${PGPORT:-54329}
run "$PGBIN/initdb -D $TMP/data -U postgres -A trust >/dev/null"
run "$PGBIN/pg_ctl -D $TMP/data -o '-p $PORT -k $TMP' -l $TMP/log -w start >/dev/null"
trap 'run "$PGBIN/pg_ctl -D $TMP/data -m immediate stop >/dev/null" || true; rm -rf "$TMP"' EXIT
P="$PGBIN/psql -h $TMP -p $PORT -U postgres -v ON_ERROR_STOP=1 -q -d postgres"
cat "$DIR/tests/stub_auth.sql" "$DIR"/migrations/*.sql "$DIR/tests/rls.test.sql" > "$TMP/all.sql"; chmod 644 "$TMP/all.sql"
run "$P -f $TMP/all.sql"
