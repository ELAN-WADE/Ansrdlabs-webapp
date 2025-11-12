# WordPress Data Sync & PDF/RSS Configuration Guide

## Overview

This guide explains how all WordPress data (PDFs, audio, RSS feeds) is synced to the frontend and how to verify everything is working correctly.

## Architecture

### Data Flow

\`\`\`
WordPress REST API
    ↓
lib/wordpress.ts (Fetch & Extract)
    ↓
lib/wordpress-data-sync.ts (Transform & Validate)
    ↓
Components (Display)
\`\`\`

## PDF Configuration

### How PDFs are Fetched

1. **WordPress ACF Fields** - PDFs are stored in ACF fields:
   - `pdf_url` - Direct PDF URL
   - `pdfUpload` - ACF file field with `mediaItemUrl`

2. **Extraction** - The `extractPdfUrl()` function checks both fields:
   \`\`\`typescript
   export function extractPdfUrl(post: WordPressPost): string | null {
     if (post.acf?.pdfUpload?.mediaItemUrl) return post.acf.pdfUpload.mediaItemUrl
     if (post.acf?.pdfUpload?.url) return post.acf.pdfUpload.url
     if (post.acf?.pdf_url) return post.acf.pdf_url
     return null
   }
   \`\`\`

3. **Display** - The `PDFViewer` component displays PDFs with:
   - Embedded preview using iframe
   - Download fallback if preview fails
   - Error handling with user-friendly messages

### Verifying PDF Setup

\`\`\`typescript
import { runVerificationReport } from "@/lib/wordpress-verify"

const report = await runVerificationReport()
console.log(report.checks.researchPdfData)
\`\`\`

## Podcast Audio & RSS Configuration

### How Audio is Fetched

1. **WordPress ACF Fields** - Audio is stored in:
   - `audio_url` - Direct audio file URL
   - `duration` - Episode duration
   - `transcript` - Episode transcript
   - `show_notes` - Show notes content

2. **Data Sync** - The `syncPodcastData()` function transforms WordPress data:
   \`\`\`typescript
   export function syncPodcastData(post: WordPressPost): SyncedPodcastData {
     return {
       audioUrl: post.acf?.audio_url || null,
       duration: post.acf?.duration || "0:00",
       transcript: post.acf?.transcript || null,
       // ... other fields
     }
   }
   \`\`\`

### RSS Feed Integration

#### Podcast RSS Feeds

Use the `PodcastRSSDisplay` component to display podcast episodes from RSS:

\`\`\`tsx
import { PodcastRSSDisplay } from "@/components/podcast-rss-display"

<PodcastRSSDisplay 
  feedUrl="https://your-podcast-rss-url.com/feed"
  title="Latest Episodes"
  maxItems={5}
/>
\`\`\`

#### YouTube RSS Feeds

Use the `YouTubeRSSDisplay` component to display YouTube videos:

\`\`\`tsx
import { YouTubeRSSDisplay } from "@/components/youtube-rss-display"

<YouTubeRSSDisplay 
  channelId="YOUR_YOUTUBE_CHANNEL_ID"
  title="Latest Videos"
  maxVideos={6}
/>
\`\`\`

### RSS Parser Features

- Parses RSS XML into structured data
- Handles podcast enclosures (audio files)
- Extracts YouTube video IDs and thumbnails
- Formats dates and durations
- Error handling with fallbacks

## Data Sync Components

### Research Data Sync

\`\`\`typescript
import { syncResearchData } from "@/lib/wordpress-data-sync"

const syncedData = syncResearchData(wordPressPost)
// Returns: SyncedResearchData with PDF URL, authors, methods, etc.
\`\`\`

### Podcast Data Sync

\`\`\`typescript
import { syncPodcastData } from "@/lib/wordpress-data-sync"

const syncedData = syncPodcastData(wordPressPost)
// Returns: SyncedPodcastData with audio URL, duration, transcript, etc.
\`\`\`

### Article Data Sync

\`\`\`typescript
import { syncArticleData } from "@/lib/wordpress-data-sync"

const syncedData = syncArticleData(wordPressPost)
// Returns: SyncedArticleData with content, author, theme, etc.
\`\`\`

## Verification & Debugging

### Run Full Verification Report

\`\`\`typescript
import { runVerificationReport } from "@/lib/wordpress-verify"

const report = await runVerificationReport()
console.log(report)
\`\`\`

### Individual Checks

\`\`\`typescript
import {
  verifyResearchPdfData,
  verifyPodcastAudioData,
  verifyDataMapping,
  verifyAcfFields,
} from "@/lib/wordpress-verify"

// Check each component
const pdfCheck = await verifyResearchPdfData()
const audioCheck = await verifyPodcastAudioData()
const mappingCheck = await verifyDataMapping()
const acfCheck = await verifyAcfFields()
\`\`\`

## WordPress Setup Requirements

### Required Plugins

1. **WPGraphQL** (optional, for GraphQL queries)
2. **Advanced Custom Fields (ACF)** - For storing PDF, audio, and metadata

### Required ACF Fields

#### For Research Posts

- `pdf_url` (Text) or `pdfUpload` (File)
- `authors` (Text)
- `abstract` (Textarea)
- `key_findings` (Repeater)
- `downloads` (Number)
- `pages` (Number)

#### For Podcast Episodes

- `audio_url` (Text or File)
- `duration` (Text)
- `episode_number` (Number)
- `transcript` (Textarea)
- `show_notes` (Textarea)
- `sources` (Textarea)

#### For Blog Posts

- `estimated_read_time` (Text)
- `external_mirror` (URL)

### REST API Configuration

Ensure custom post types are exposed to REST API:

\`\`\`php
register_post_type('research', [
  'show_in_rest' => true,
  'rest_base' => 'research',
  // ... other args
]);

register_post_type('episodes', [
  'show_in_rest' => true,
  'rest_base' => 'episodes',
  // ... other args
]);
\`\`\`

## Troubleshooting

### PDFs Not Showing

1. Check ACF field names match: `pdf_url` or `pdfUpload.mediaItemUrl`
2. Verify PDF URL is accessible (not blocked by CORS)
3. Check browser console for errors
4. Run: `verifyResearchPdfData()`

### Audio Not Playing

1. Check ACF field name: `audio_url`
2. Verify audio file format is supported (MP3, WAV, etc.)
3. Check CORS headers on audio server
4. Run: `verifyPodcastAudioData()`

### RSS Feeds Not Loading

1. Verify feed URL is correct and accessible
2. Check CORS proxy is working (uses cors-anywhere.herokuapp.com)
3. Validate RSS feed format with online validator
4. Check browser console for parsing errors

### Data Not Syncing

1. Run: `verifyDataMapping()`
2. Check ACF fields are properly configured
3. Verify WordPress REST API is enabled
4. Check environment variables are set correctly

## Environment Variables

\`\`\`env
NEXT_PUBLIC_WP_API_URL=https://your-wordpress-site.com/wp-json/wp/v2
NEXT_PUBLIC_WP_GRAPHQL_URL=https://your-wordpress-site.com/graphql
NEXT_PUBLIC_WP_RSS_URL=https://your-wordpress-site.com/feed
\`\`\`

## Components Using Data Sync

- `ResearchDetail` - Uses `syncResearchData()` for PDF display
- `PodcastDetail` - Uses `syncPodcastData()` for audio playback
- `ResearchArchive` - Displays synced research data
- `PodcastArchive` - Displays synced podcast data
- `PodcastRSSDisplay` - Displays RSS feed episodes
- `YouTubeRSSDisplay` - Displays YouTube videos

## Testing

### Test PDF Preview

1. Navigate to a research detail page
2. Verify PDF preview loads
3. Test download button
4. Test share functionality

### Test Audio Playback

1. Navigate to a podcast detail page
2. Verify audio player loads
3. Test play/pause controls
4. Test download button

### Test RSS Feeds

1. Add `PodcastRSSDisplay` component to a page
2. Verify episodes load from RSS
3. Test download links
4. Add `YouTubeRSSDisplay` component
5. Verify videos load with thumbnails

## Performance Optimization

- Data is cached with 5-minute TTL for posts
- Taxonomy data cached for 1 hour
- RSS feeds cached for 1 hour
- Parallel fetching for multiple data types
- Lazy loading for images and media

## Security Considerations

- All external URLs are validated
- CORS proxy used for cross-origin RSS feeds
- PDF URLs must be HTTPS
- Audio URLs must be HTTPS
- No sensitive data stored in frontend
