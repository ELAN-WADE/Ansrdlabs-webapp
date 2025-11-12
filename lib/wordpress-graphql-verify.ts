export interface GraphQLVerificationResult {
  isConfigured: boolean
  hasResearchType: boolean
  hasEpisodeType: boolean
  hasPostType: boolean
  hasCustomFields: boolean
  errors: string[]
  warnings: string[]
}

export async function verifyWordPressGraphQL(): Promise<GraphQLVerificationResult> {
  const result: GraphQLVerificationResult = {
    isConfigured: false,
    hasResearchType: false,
    hasEpisodeType: false,
    hasPostType: false,
    hasCustomFields: false,
    errors: [],
    warnings: [],
  }

  const graphqlUrl = process.env.NEXT_PUBLIC_WP_GRAPHQL_URL

  if (!graphqlUrl || graphqlUrl.includes("localhost")) {
    result.errors.push("WordPress GraphQL endpoint not configured")
    return result
  }

  result.isConfigured = true

  try {
    // Test basic GraphQL connection
    const testQuery = `
      query {
        __schema {
          types {
            name
          }
        }
      }
    `

    const response = await fetch(graphqlUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: testQuery }),
    })

    if (!response.ok) {
      result.errors.push(`GraphQL endpoint returned ${response.status}`)
      return result
    }

    const data = await response.json()

    if (data.errors) {
      result.errors.push(`GraphQL errors: ${data.errors.map((e: any) => e.message).join(", ")}`)
      return result
    }

    const typeNames = data.data?.__schema?.types?.map((t: any) => t.name) || []

    // Check for custom post types
    result.hasResearchType = typeNames.includes("Research")
    result.hasEpisodeType = typeNames.includes("Episode")
    result.hasPostType = typeNames.includes("Post")

    if (!result.hasResearchType) {
      result.warnings.push("Research post type not found in GraphQL schema")
    }
    if (!result.hasEpisodeType) {
      result.warnings.push("Episode post type not found in GraphQL schema")
    }
    if (!result.hasPostType) {
      result.warnings.push("Post post type not found in GraphQL schema")
    }

    // Check for custom fields
    const fieldsQuery = `
      query {
        research(first: 1) {
          nodes {
            researchFields {
              type
              author
              abstract
              pdfUpload {
                mediaItemUrl
              }
            }
          }
        }
      }
    `

    const fieldsResponse = await fetch(graphqlUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: fieldsQuery }),
    })

    const fieldsData = await fieldsResponse.json()
    result.hasCustomFields = !fieldsData.errors || fieldsData.errors.length === 0

    if (!result.hasCustomFields) {
      result.warnings.push("Custom ACF fields may not be properly configured")
    }
  } catch (error) {
    result.errors.push(`GraphQL verification failed: ${error instanceof Error ? error.message : "Unknown error"}`)
  }

  return result
}

export async function syncGraphQLWithREST() {
  const verification = await verifyWordPressGraphQL()

  if (!verification.isConfigured) {
    return false
  }

  if (verification.errors.length > 0) {
  }

  if (verification.warnings.length > 0) {
  }

  return verification.isConfigured && verification.errors.length === 0
}
