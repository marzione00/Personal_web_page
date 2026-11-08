# Travel diaries and photo albums — editing guide

The **Travels & Hikes** section is bilingual and intentionally starts without public entries. No journeys or photograph albums have been invented.

To create a diary, first upload your original photographs to `public/media/images/viaggi/<slug>/` and create `content/markdown/viaggi/<slug>.md`, using the Italian template in `examples/NUOVO_VIAGGIO_ESEMPIO.md.txt`. One Markdown file contains the date, location, summary, diary and photo list. Image lines take the form `![Descriptive caption](media/images/viaggi/<slug>/photo-01.jpg)` under the `## Album` heading.

For English, use the **same filename** in `content/markdown/en/viaggi/` and translate title, location, excerpt, diary and photograph captions. The date, publication status, cover and photo paths must match the Italian version. If no English translation is available, visitors see a clear notice and a link to the Italian diary, not a misleading automatic translation.

`draft: true` excludes a diary from the published site but **does not hide it from the source code of a public GitHub repository**. Set `draft: false` only after reviewing the diary and uploading every referenced photograph. The build rejects published diaries with broken media links.

All photographs remain unmodified; please review EXIF metadata (including potential GPS coordinates) before publishing. The gallery opens a full-size original in an accessible lightbox; without JavaScript, the photo links still open. Page introductions live in `content/markdown/viaggi.md` and `content/markdown/en/viaggi.md`.
