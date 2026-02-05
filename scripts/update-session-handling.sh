#!/bin/bash

# Script to update all table components to use session expiration dialog
# Run from admin-portal directory

echo "🔄 Updating table components to handle session expiration..."

# Find all table components
TABLE_FILES=$(find src/app/dashboard -name "*-table.tsx" -o -name "*table.tsx" | grep -v node_modules)

for file in $TABLE_FILES; do
  echo "Processing: $file"
  
  # Check if file already imports useSessionExpired
  if grep -q "useSessionExpired" "$file"; then
    echo "  ✅ Already updated"
    continue
  fi
  
  # Check if file has error handling
  if ! grep -q "setError" "$file"; then
    echo "  ⏭️  No error handling found, skipping"
    continue
  fi
  
  echo "  📝 Needs update - please update manually using the pattern:"
  echo "     1. Import: import { useSessionExpired } from '@/hooks/use-session-expired';"
  echo "     2. Hook: const { checkSessionExpired, SessionExpiredDialog } = useSessionExpired();"
  echo "     3. Check: if (result.error && checkSessionExpired(result.error)) { return; }"
  echo "     4. Dialog: Add <SessionExpiredDialog /> in return statement"
  echo ""
done

echo "✅ Done! Check the files above and update them manually."
echo "📖 See docs/session-quick-reference.md for examples"
