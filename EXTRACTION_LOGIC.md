# Extraction Logic

## Approach
1. **PDF Upload:**
   - User uploads EPA PDF via the dashboard.
   - File is sent to the FastAPI backend.
2. **Backend Extraction:**
   - FastAPI uses PDF parsing libraries (e.g., Docling) to extract text and tables.
   - Custom logic identifies key sections (Goals, BMPs, Implementation, Monitoring, Outreach, Geographic Areas).
   - Data is normalized into structured JSON.
3. **Frontend Consumption:**
   - Next.js fetches structured data from the backend.
   - Data is visualized using Chart.js and displayed in tables/lists.

## Ensuring Accuracy
- Extraction rules are tailored to EPA document structure (headings, table formats, etc.).
- Fallbacks and error handling for missing or malformed data.
- Manual review of extracted data for edge cases.

# Author

Rainer Hamal