# Testing & Validation

## Validation Process
1. **Test Set:**
   - Used a set of EPA PDF reports with known data.
2. **Extraction Comparison:**
   - Compared extracted JSON to ground truth (manual extraction).
   - Checked for missing, extra, or misclassified fields.
3. **Frontend Review:**
   - Verified that all dashboard visualizations matched the source document.
   - Checked for errors or missing data in UI.

## Accuracy Metrics
- **Field-level accuracy:** % of correctly extracted fields.
- **Section completeness:** All required sections present.

## Iteration
- Refined extraction logic based on failed cases.
- Added defensive coding for null/undefined data.
# Author

Rainer Hamal