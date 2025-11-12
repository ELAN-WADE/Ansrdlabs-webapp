# Local Development Setup

## Prerequisites

- Node.js 18+ installed
- Access to a WordPress site with:
  - WPGraphQL plugin installed and activated
  - ACF (Advanced Custom Fields) plugin installed
  - Custom post types configured (Research, Episodes, Posts)

## Environment Variables Setup

1. **Copy the example environment file:**
   \`\`\`bash
   cp .env.local.example .env.local
   \`\`\`

2. **Configure your WordPress URLs:**
   
   Open `.env.local` and replace the placeholder values:

   \`\`\`env
   # Your WordPress GraphQL endpoint
   NEXT_PUBLIC_WP_GRAPHQL_URL=https://ansrdlabs.com/graphql
   
   # Your WordPress REST API endpoint
   NEXT_PUBLIC_WP_API_URL=https://ansrdlabs.com/wp-json
   
   # Your WordPress RSS feed URL (optional)
   NEXT_PUBLIC_WP_RSS_URL=https://ansrdlabs.com/feed
   \`\`\`

3. **Optional: RSS Feed Configuration**
   
   If you want to use RSS feeds, get a free API key from [RSS2JSON](https://rss2json.com):
   
   \`\`\`env
   NEXT_PUBLIC_RSS2JSON_API_KEY=your_api_key_here
   \`\`\`

## WordPress Configuration

### Required Plugins

1. **WPGraphQL** - Provides GraphQL API
   - Install from WordPress.org or via Composer
   - Activate the plugin

2. **WPGraphQL for Advanced Custom Fields** - Exposes ACF fields to GraphQL
   - Install from GitHub: https://github.com/wp-graphql/wp-graphql-acf
   - Activate the plugin

3. **Advanced Custom Fields (ACF)** - Custom fields for content
   - Install ACF Pro or Free version
   - Configure field groups for Research, Episodes, and Posts

### Custom Post Types

Ensure these custom post types are registered:
- `research` - Research papers
- `episodes` - Podcast episodes  
- `post` - Blog posts (default WordPress)

### Taxonomies

Ensure these taxonomies are registered:
- `contentThemes` - Content themes (Food, Transport, Trust, etc.)
- `seriesTag` - Series tags
- `formats` - Content formats
- `methods` - Research methods

## Installation

1. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Run the development server:**
   \`\`\`bash
   npm run dev
   \`\`\`

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Troubleshooting

### GraphQL Endpoint Not Working

- Verify WPGraphQL plugin is activated
- Check that your WordPress site is accessible
- Test the GraphQL endpoint directly: `https://your-site.com/graphql`

### Missing ACF Fields

- Ensure WPGraphQL for ACF plugin is installed
- Check that ACF field groups are set to "Show in GraphQL"
- Verify field names match the GraphQL queries

### CORS Issues

- Add your Next.js development URL to WordPress CORS settings
- Or use a CORS plugin like "WP CORS"

### Images Not Loading

- Check that featured images are set in WordPress
- Verify image URLs are accessible
- Ensure Next.js `next.config.js` has the WordPress domain in `images.domains`

## Production Deployment

1. Set environment variables in your hosting platform (Vercel, Netlify, etc.)
2. Ensure WordPress site is accessible from production
3. Configure proper CORS headers on WordPress
4. Test all API endpoints before going live

## Support

For issues or questions:
- Check the debug logs in browser console (look for `[v0]` prefix)
- Verify WordPress GraphQL queries in GraphiQL
- Review the WordPress plugin documentation
