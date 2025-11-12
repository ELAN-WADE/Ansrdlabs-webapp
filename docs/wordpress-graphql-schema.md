# WordPress GraphQL Schema for ANSRd! Labs

This document outlines the complete WordPress GraphQL schema structure needed to support the ANSRd! Labs frontend application with full taxonomy integration.

## Overview

The ANSRd! Labs platform uses WordPress as a headless CMS with WPGraphQL plugin to manage and deliver content. The frontend fetches data via GraphQL queries that include comprehensive taxonomy support.

## Required WordPress Setup

### 1. Install Required Plugins
- **WPGraphQL** (v1.14+): Core GraphQL API
- **WPGraphQL for Advanced Custom Fields** (if using ACF)
- **WPGraphQL JWT Authentication** (for authenticated requests)

### 2. Custom Post Types

\`\`\`php
// Register Custom Post Types
register_post_type('podcast', [
  'label' => 'Podcasts',
  'public' => true,
  'show_in_graphql' => true,
  'graphql_single_name' => 'podcast',
  'graphql_plural_name' => 'podcasts',
  'supports' => ['title', 'editor', 'thumbnail', 'excerpt', 'custom-fields']
]);

register_post_type('research', [
  'label' => 'Research',
  'public' => true,
  'show_in_graphql' => true,
  'graphql_single_name' => 'research',
  'graphql_plural_name' => 'researches',
  'supports' => ['title', 'editor', 'thumbnail', 'excerpt', 'custom-fields']
]);
\`\`\`

### 3. Custom Taxonomies

\`\`\`php
// Theme Taxonomy (Primary, max 2 per item)
register_taxonomy('theme', ['podcast', 'research', 'post'], [
  'label' => 'Themes',
  'hierarchical' => false,
  'show_in_graphql' => true,
  'graphql_single_name' => 'theme',
  'graphql_plural_name' => 'themes'
]);

// Series Taxonomy (Optional, flat)
register_taxonomy('series', ['podcast', 'research', 'post'], [
  'label' => 'Series',
  'hierarchical' => false,
  'show_in_graphql' => true,
  'graphql_single_name' => 'series',
  'graphql_plural_name' => 'series'
]);

// Format Taxonomy (For UI filters)
register_taxonomy('format', ['podcast', 'research', 'post'], [
  'label' => 'Formats',
  'hierarchical' => false,
  'show_in_graphql' => true,
  'graphql_single_name' => 'format',
  'graphql_plural_name' => 'formats'
]);

// Methods Taxonomy (Research only)
register_taxonomy('method', ['research'], [
  'label' => 'Methods',
  'hierarchical' => false,
  'show_in_graphql' => true,
  'graphql_single_name' => 'method',
  'graphql_plural_name' => 'methods'
]);

// Geography Taxonomy (Hierarchical: Region > Country > City)
register_taxonomy('geography', ['podcast', 'research', 'post'], [
  'label' => 'Geography',
  'hierarchical' => true,
  'show_in_graphql' => true,
  'graphql_single_name' => 'geography',
  'graphql_plural_name' => 'geographies'
]);

// Audience Taxonomy (Optional)
register_taxonomy('audience', ['podcast', 'research', 'post'], [
  'label' => 'Audience',
  'hierarchical' => false,
  'show_in_graphql' => true,
  'graphql_single_name' => 'audience',
  'graphql_plural_name' => 'audiences'
]);

// Decision Science Tags (Max 3 per item)
register_taxonomy('decision_science', ['podcast', 'research', 'post'], [
  'label' => 'Decision Science Tags',
  'hierarchical' => false,
  'show_in_graphql' => true,
  'graphql_single_name' => 'decisionScience',
  'graphql_plural_name' => 'decisionSciences'
]);
\`\`\`

## GraphQL Queries

### Fetch All Podcasts with Taxonomies

\`\`\`graphql
query GetPodcasts($first: Int = 10, $after: String) {
  podcasts(first: $first, after: $after) {
    pageInfo {
      hasNextPage
      endCursor
    }
    nodes {
      id
      databaseId
      title
      excerpt
      content
      date
      slug
      featuredImage {
        node {
          sourceUrl
          altText
          mediaDetails {
            width
            height
          }
        }
      }
      themes {
        nodes {
          id
          name
          slug
          description
        }
      }
      series {
        nodes {
          id
          name
          slug
        }
      }
      formats {
        nodes {
          id
          name
          slug
        }
      }
      geographies {
        nodes {
          id
          name
          slug
          parent {
            node {
              name
              slug
            }
          }
        }
      }
      audiences {
        nodes {
          id
          name
          slug
        }
      }
      decisionSciences {
        nodes {
          id
          name
          slug
          description
        }
      }
      # Custom fields for podcast-specific data
      podcastMeta {
        audioUrl
        duration
        episodeNumber
        seasonNumber
        transcript
        showNotes
      }
    }
  }
}
