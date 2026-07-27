#!/usr/bin/env bash
# BASKARA CNG Ecosystem — Automated Security Scanner
# Usage: ./scan_security.sh

set -e

echo "🛡️  ================================================================"
echo "🛡️  BASKARA-SEC: Automated Cybersecurity & DevSecOps Scanner v1.0.0"
echo "🛡️  ================================================================"

WORKSPACE_DIR=$(git rev-parse --show-toplevel 2>/dev/null || echo ".")
cd "$WORKSPACE_DIR"

echo "🔍 [1/4] Checking for exposed sensitive environment variable names..."
EXPOSED_SECRETS=$(grep -rn --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" --exclude-dir="node_modules" --exclude-dir=".next" "NEXT_PUBLIC_.*SECRET\|NEXT_PUBLIC_.*SERVICE_ROLE\|NEXT_PUBLIC_.*PRIVATE_KEY" . || true)
if [ -n "$EXPOSED_SECRETS" ]; then
  echo "🚨 CRITICAL WARNING: Found potentially exposed secret keys prefixed with NEXT_PUBLIC_:"
  echo "$EXPOSED_SECRETS"
else
  echo "✅ No exposed NEXT_PUBLIC_ secret keys detected in client code."
fi

echo ""
echo "🔍 [2/4] Checking for hardcoded service_role keys or passwords in source files..."
HARDCODED_KEYS=$(grep -rn --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" --exclude-dir="node_modules" --exclude-dir=".next" "service_role.*=.*['\"][ey][A-Za-z0-9_-]\{20,\}" . || true)
if [ -n "$HARDCODED_KEYS" ]; then
  echo "🚨 CRITICAL WARNING: Found potential hardcoded JWT/service_role strings:"
  echo "$HARDCODED_KEYS"
else
  echo "✅ No hardcoded service_role JWT strings detected."
fi

echo ""
echo "🔍 [3/4] Checking for SQL query concatenation (Potential SQL Injection risks)..."
RAW_SQL=$(grep -rn --include="*.ts" --include="*.tsx" --exclude-dir="node_modules" --exclude-dir=".next" -E "\.query\s*\(\s*[\"'].*\\\$" . || true)
if [ -n "$RAW_SQL" ]; then
  echo "⚠️ HIGH WARNING: Found string template literals in query calls (verify parameterization):"
  echo "$RAW_SQL"
else
  echo "✅ No obvious raw string-concatenated SQL queries found in client code."
fi

echo ""
echo "🔍 [4/4] Checking Supabase RLS policies across SQL migrations (if any exist)..."
SQL_FILES=$(find . -maxdepth 3 -name "*.sql" ! -path "*/node_modules/*" || true)
if [ -n "$SQL_FILES" ]; then
  for sql_file in $SQL_FILES; do
    RLS_CHECK=$(grep -i "ENABLE ROW LEVEL SECURITY" "$sql_file" || true)
    if [ -z "$RLS_CHECK" ]; then
      echo "⚠️ NOTICE: SQL file $sql_file does not contain 'ENABLE ROW LEVEL SECURITY'."
    else
      echo "✅ RLS enabled in $sql_file."
    fi
  done
else
  echo "ℹ️ No local .sql migration files found to scan for RLS."
fi

echo ""
echo "🛡️  ================================================================"
echo "🛡️  BASKARA-SEC Scan Complete. Keep our CNG infrastructure secure!"
echo "🛡️  ================================================================"
