# WordPress Data Flow Documentation

## Overview
This document explains how data flows from WordPress to the frontend components, including all ACF fields and their mappings.

## Data Sources

### WordPress REST API Endpoints
- **Research Papers**: `https://ansrdlabs.com/wp-json/wp/v2/research`
- **Podcast Episodes**: `https://ansrdlabs.com/wp-json/wp/v2/episodes`
- **Blog Posts**: `https://ansrdlabs.com/wp-json/wp/v2/posts`

### WordPress ACF Fields

#### Research Post Type ACF Fields
\`\`\`
- research_type: string (e.g., "Research Report", "Brief", "Case Study")
- authors: string (comma-separated author names)
- abstract: string (research abstract/summary)
- pdfUpload: object
  - mediaItemUrl: string (PDF file URL)
  - url: string (alternative PDF URL)
- pdf_url: string (fallback PDF URL)
- doi: string (Digital Object Identifier)
- citation: string (full citation text)
- key_findings: array of strings (key findings/conclusions)
- pages: number (page count)
- downloads: number (download count)
- related_content: array of objects
  - type: string (e.g., "Podcast", "Article", "Research")
  - title: string
  - href: string
\`\`\`

#### Episode Post Type ACF Fields
\`\`\`
- episode_number: number
- duration: string (e.g., "45:22")
- audio_url: string (MP3/M4A file URL)
- video_url: string (YouTube embed URL)
- show_notes: string (episode show notes/description)
- transcript: array of objects OR JSON string
  - time: string (e.g., "00:00")
  - text: string (transcript text)
  - seconds: number (time in seconds)
- sources: array of objects OR line-separated string
  - title: string
  - url: string
- related_content: array of objects
  - type: string
  - title: string
  - href: string
\`\`\`

## Data Extraction Flow

### 1. Fetch from WordPress
\`\`\`
fetchPostBySlug(slug, type) 
  → WordPress REST API 
  → WordPressPost object with ACF fields
\`\`\`

### 2. Extract Data
\`\`\`
extractResearchData(post) / extractPodcastData(post)
  → Normalize ACF fields
  → Handle multiple field locations (e.g., pdfUpload.mediaItemUrl vs pdf_url)
  → Parse complex fields (transcript, sources)
  → Extract featured image
  → Return ExtractedResearchData / ExtractedPodcastData
\`\`\`

### 3. Verify Data
\`\`\`
verifyResearchData(data) / verifyPodcastData(data)
  → Check required fields
  → Return validation errors if any
  → Log warnings for missing fields
\`\`\`

### 4. Convert to Component Data
\`\`\`
convertWordPressToResearch(post) / convertWordPressToPodcast(post)
  → Use extracted data
  → Extract taxonomy terms (theme, methods, geography)
  → Format dates
  → Generate citations
  → Return ResearchData / PodcastData
\`\`\`

### 5. Display in Component
\`\`\`
ResearchDetail / PodcastDetail component
  → Render all fields
  → Display PDF preview
  → Show audio player
  → Display transcript, sources, related content
\`\`\`

## Field Mapping Examples

### Research PDF URL Extraction
The system checks multiple locations for PDF URLs in this order:
1. `post.acf.pdfUpload.mediaItemUrl` (WordPress media library)
2. `post.acf.pdfUpload.url` (alternative media URL)
3. `post.acf.pdf_url` (direct URL field)

### Podcast Transcript Parsing
The system handles transcripts in two formats:
1. **Array format**: Already parsed as array of objects
2. **JSON string format**: Parsed from JSON string
3. **Empty**: Falls back to empty array

### Podcast Sources Parsing
The system handles sources in two formats:
1. **Array format**: Already parsed as array of objects
2. **Line-separated format**: Parsed from "Label - URL" format (one per line)
3. **Empty**: Falls back to empty array

## Verification Checklist

### Research Data
- [ ] Title is present
- [ ] Authors are present
- [ ] Abstract is present
- [ ] PDF URL is present
- [ ] Featured image is present (optional)
- [ ] Key findings are present (optional)

### Podcast Data
- [ ] Title is present
- [ ] Audio URL is present
- [ ] Duration is present
- [ ] Featured image is present (optional)
- [ ] Transcript is present (optional)
- [ ] Sources are present (optional)

## Debugging

### Enable Debug Logging
All data extraction functions log to console with `[v0]` prefix:
\`\`\`javascript
console.log("[v0] Loaded research from WordPress:", researchData.title)
console.log("[v0] Podcast data validation errors:", errors)
\`\`\`

### Check WordPress API Response
Visit these URLs in your browser to see raw data:
- `https://ansrdlabs.com/wp-json/wp/v2/research?slug=your-slug&_embed=true`
- `https://ansrdlabs.com/wp-json/wp/v2/episodes?slug=your-slug&_embed=true`

### Verify ACF Fields
Check WordPress admin to ensure ACF fields are:
1. Created and assigned to correct post types
2. Populated with data
3. Using correct field names (case-sensitive)

## Common Issues

### PDF Not Displaying
- Check if PDF URL is present in WordPress ACF fields
- Verify PDF file is accessible (not behind authentication)
- Check browser console for CORS errors

### Audio Not Playing
- Check if audio URL is present in WordPress ACF fields
- Verify audio file format is MP3 or M4A
- Check browser console for CORS errors

### Transcript Not Showing
- Verify transcript field is populated in WordPress
- Check if transcript is in correct format (array or JSON string)
- Ensure time format is "MM:SS" and seconds are numbers

### Sources Not Displaying
- Verify sources field is populated in WordPress
- Check if sources are in correct format (array or line-separated)
- Ensure line-separated format uses "Label - URL" pattern
