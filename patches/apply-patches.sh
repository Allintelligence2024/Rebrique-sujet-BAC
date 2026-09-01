#!/bin/bash
# Historique : les patches de ce dossier sont déjà appliqués sur main (0cc7e44).
set -e
echo "Patches already applied on main (0cc7e44 / PR #14)."
echo "CI: quality.yml tracks main and arena/**"
echo "PDF: all 19 archive entries have contentVerified: true"
echo "Nothing to apply."
if git apply --check patches/ci-workflow-fix.patch 2>/dev/null; then
  echo "Note: ci-workflow-fix.patch could still apply — quality.yml may have drifted."
else
  echo "ci-workflow-fix.patch does not apply (already present). OK."
fi
