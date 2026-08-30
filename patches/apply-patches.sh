#!/bin/bash
# Script pour appliquer les patches Antigravity
# Usage: ./patches/apply-patches.sh

set -e

echo "=========================================="
echo "  PATCH APPLICATOR FOR ANTIGRAVITY"
echo "=========================================="
echo ""

# Step 1: Apply CI workflow fix
echo "[1/3] Applying CI workflow fix..."
if git apply patches/ci-workflow-fix.patch; then
    echo "✅ CI workflow patch applied successfully"
else
    echo "⚠️  CI workflow patch failed (may already be applied)"
fi
echo ""

# Step 2: Check if we're on the right branch
echo "[2/3] Checking branch..."
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "Current branch: $CURRENT_BRANCH"

if [ "$CURRENT_BRANCH" = "main" ] || [ "$CURRENT_BRANCH" = "heads/main" ]; then
    echo "✅ On main branch - CI workflow fix is ready"
else
    echo "⚠️  Not on main branch. CI workflow fix may need to be applied to main."
fi
echo ""

# Step 3: Instructions for PDF verification
echo "[3/3] PDF Verification Instructions:"
echo "====================================="
echo ""
echo "The following 9 PDFs need manual verification:"
echo ""
echo "  1. SE 2018 main:     https://www.dzexams.com/uploads/sujets/officiels/bac/2018/dzexams-bac-sciences-3509975.pdf"
echo "  2. SE 2016 exceptional: https://www.dzexams.com/uploads/sujets/officiels/bac/2016-2/dzexams-bac-sciences-3814840.pdf"
echo "  3. SE 2014 main:     https://www.dzexams.com/uploads/sujets/officiels/bac/2014/dzexams-bac-sciences-4380238.pdf"
echo "  4. M 2019 main:      https://www.dzexams.com/uploads/sujets/officiels/bac/2019/dzexams-bac-sciences-2280992.pdf"
echo "  5. M 2018 main:      https://www.dzexams.com/uploads/sujets/officiels/bac/2018/dzexams-bac-sciences-1967487.pdf"
echo "  6. M 2017 main:      https://www.dzexams.com/uploads/sujets/officiels/bac/2017/dzexams-bac-sciences-2275712.pdf"
echo "  7. M 2015 main:      https://www.dzexams.com/uploads/sujets/officiels/bac/2015/dzexams-bac-sciences-2723927.pdf"
echo "  8. M 2014 main:      https://www.dzexams.com/uploads/sujets/officiels/bac/2014/dzexams-bac-sciences-2369148.pdf"
echo "  9. M 2013 main:      https://www.dzexams.com/uploads/sujets/officiels/bac/2013/dzexams-bac-sciences-2770867.pdf"
echo ""
echo "To verify all PDFs at once, run:"
echo "  node scripts/verify-archive-pdfs.mjs"
echo ""
echo "After verification, update data/archive.js:"
echo "  For each verified PDF, change:"
echo "    page: \"access_confirmed\" → \"consulted\""
echo "    contentVerified: false → true"
echo ""

echo "=========================================="
echo "  PATCH APPLICATION COMPLETE"
echo "=========================================="
echo ""
echo "Next steps:"
echo "  1. Verify all 9 PDFs (run: node scripts/verify-archive-pdfs.mjs)"
echo "  2. Update data/archive.js with contentVerified: true for verified PDFs"
echo "  3. Commit and push changes"
echo "  4. Merge arena/01a0533b-rebrique-sujet-bac to main"
echo "  5. Wait for CI SUCCESS on main"
echo ""
