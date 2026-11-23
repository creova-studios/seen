#!/usr/bin/env bash
# Runs migrations and RLS tests against either an external Postgres service container (when PGHOST is set)
# or a throwaway local Postgres instance initialized via initdb/pg_ctl.
set -euo pipefail

DIR=$(cd "$(dirname "$0")/.." && pwd)
TMP=$(mktemp -d)
chmod 755 "$TMP"
cat "$DIR/tests/stub_auth.sql" "$DIR"/migrations/*.sql "$DIR/tests/rls.test.sql" > "$TMP/all.sql"
chmod 644 "$TMP/all.sql"

if [ -n "${PGHOST:-}" ]; then
  trap 'rm -rf "$TMP"' EXIT
  PGPORT=${PGPORT:-5432}
  PGUSER=${PGUSER:-postgres}
  PGDATABASE=${PGDATABASE:-postgres}
  psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -v ON_ERROR_STOP=1 -q -d "$PGDATABASE" -f "$TMP/all.sql"
  exit 0
fi

if [ -z "${PGBIN:-}" ]; then
  for candidate in /usr/lib/postgresql/16/bin /opt/homebrew/opt/postgresql@16/bin /usr/local/opt/postgresql@16/bin; do
    if [ -x "$candidate/initdb" ]; then
      PGBIN="$candidate"
      break
    fi
  done
fi
PGBIN=${PGBIN:-/usr/lib/postgresql/16/bin}
RUNAS=""; if [ "$(id -u)" = 0 ]; then chown -R postgres "$TMP" 2>/dev/null; RUNAS="su postgres -c"; fi
run() { if [ -n "$RUNAS" ]; then su postgres -c "$*"; else bash -c "$*"; fi; }
PORT=${PGPORT:-54329}
run "$PGBIN/initdb -D $TMP/data -U postgres -A trust >/dev/null"
run "$PGBIN/pg_ctl -D $TMP/data -o '-p $PORT -k $TMP' -l $TMP/log -w start >/dev/null"
trap 'run "$PGBIN/pg_ctl -D $TMP/data -m immediate stop >/dev/null" || true; rm -rf "$TMP"' EXIT
P="$PGBIN/psql -h $TMP -p $PORT -U postgres -v ON_ERROR_STOP=1 -q -d postgres"
run "$P -f $TMP/all.sql"
