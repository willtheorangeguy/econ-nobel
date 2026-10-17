"""Verify PDFs contain selectable article text, multiple pages and a bibliography."""
import sys
from pypdf import PdfReader
reader = PdfReader(sys.argv[1])
assert len(reader.pages) >= 2, 'Overview needs title and article pages'
text = '\n'.join(page.extract_text() or '' for page in reader.pages)
assert len(text) > 1000, 'PDF text is missing or not selectable'
assert 'Sources and further reading' in text, 'PDF bibliography missing'
assert 'Economics Prize Archive' in text, 'PDF author attribution missing'
assert 'UNREVIEWED DRAFT' in text or 'published' in text, 'Editorial state missing'
print(f'{sys.argv[1]}: {len(reader.pages)} pages; {len(text)} text characters')
