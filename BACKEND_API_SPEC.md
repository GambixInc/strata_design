# Backend API Specification: Create Project Feature

## Overview
This document specifies the API requirements for implementing the "Create Project" feature on the backend. The frontend will send comprehensive website analysis data from the lambda scraper to create a new project.

## API Endpoint

### POST /api/projects
**Description**: Creates a new project with scraped website data

**Content-Type**: `application/json`

## Request Body

The frontend will send a JSON object with the following structure:

```json
{
  "websiteUrl": "https://example.com",
  "category": "General",
  "description": "Optional project description",
  "scrapedData": {
    // Complete lambda scraper response data
  }
}
```

### Request Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `websiteUrl` | string | ✅ | The URL of the website being analyzed |
| `category` | string | ❌ | Project category (default: "General") |
| `description` | string | ❌ | Optional project description |
| `scrapedData` | object | ✅ | Complete scraped data from lambda function |

## Scraped Data Structure

The `scrapedData` field contains the complete response from the lambda scraper. Here's the expected structure:

### Basic Information
```json
{
  "url": "https://example.com",
  "title": "Website Title",
  "description": "Meta description",
  "keywords": "keyword1, keyword2, keyword3",
  "content": "Extracted text content (truncated to 2000 chars)",
  "links": ["https://link1.com", "https://link2.com"],
  "content_length": 1234,
  "links_count": 15,
  "status_code": 200,
  "content_type": "text/html; charset=utf-8"
}
```

### Scraper Metadata
```json
{
  "scraped_at": 1703123456.789,
  "scraper_version": "2.0",
  "scraper_features": [
    "anti-bot-protection",
    "realistic-headers",
    "retry-logic",
    "rate-limiting-handling"
  ]
}
```

### HTTP/Curl Information
```json
{
  "curl_info": {
    "status_code": 200,
    "content_type": "text/html; charset=utf-8",
    "content_length": 3741,
    "encoding": "utf-8",
    "url_final": "https://example.com/",
    "redirected": false,
    "redirect_count": 0,
    "redirect_chain": [],
    "response_time_ms": 245.67,
    "server": "nginx/1.18.0",
    "date": "Mon, 18 Aug 2025 19:25:55 GMT",
    "last_modified": "Mon, 13 Jan 2025 20:11:20 GMT",
    "etag": "\"84238dfc8092e5d9c0dac8ef93371a07:1736799080.121134\"",
    "cache_control": "max-age=2891",
    "expires": "",
    "content_encoding": "gzip",
    "transfer_encoding": "",
    "connection": "keep-alive",
    "keep_alive": "",
    "all_headers": {
      "Accept-Ranges": "bytes",
      "Content-Type": "text/html",
      "ETag": "\"84238dfc8092e5d9c0dac8ef93371a07:1736799080.121134\"",
      "Last-Modified": "Mon, 13 Jan 2025 20:11:20 GMT",
      "Vary": "Accept-Encoding",
      "Content-Encoding": "gzip",
      "Cache-Control": "max-age=2891",
      "Date": "Mon, 18 Aug 2025 19:25:55 GMT",
      "Alt-Svc": "h3=\":443\"; ma=93600,h3-29=\":443\"; ma=93600",
      "Content-Length": "648",
      "Connection": "keep-alive"
    },
    "cookies": {},
    "is_compressed": true,
    "is_chunked": false,
    "has_cache_headers": true,
    "security_headers": {
      "x_frame_options": "",
      "x_content_type_options": "",
      "x_xss_protection": "",
      "strict_transport_security": "",
      "content_security_policy": "",
      "referrer_policy": ""
    }
  }
}
```

### Enhanced Scraping Data
```json
{
  "meta_tags": {
    "viewport": "width=device-width, initial-scale=1",
    "robots": "index, follow",
    "author": "Example Author",
    "og:title": "Example Page Title",
    "og:description": "Example page description",
    "twitter:card": "summary_large_image"
  },
  "images": [
    {"src": "https://example.com/image1.jpg", "alt": "Image description"},
    {"src": "https://example.com/image2.png", "alt": "Another image"}
  ],
  "forms": [
    {"action": "/search", "method": "get"},
    {"action": "/contact", "method": "post"}
  ],
  "scripts": [
    "https://example.com/js/main.js",
    "https://cdn.example.com/jquery.min.js"
  ],
  "stylesheets": [
    "https://example.com/css/style.css",
    "https://cdn.example.com/bootstrap.min.css"
  ]
}
```

### Content Analysis
```json
{
  "content_analysis": {
    "headings": {
      "h1": 1,
      "h2": 3,
      "h3": 5,
      "h4": 2,
      "h5": 0,
      "h6": 0
    },
    "paragraphs": 25,
    "lists": {
      "ul": 3,
      "ol": 1
    },
    "tables": 2,
    "divs": 45,
    "spans": 67,
    "images_count": 8,
    "forms_count": 2,
    "scripts_count": 5,
    "stylesheets_count": 3
  }
}
```

### Framework Detection
```json
{
  "framework_detection": {
    "jquery": true,
    "react": false,
    "vue": false,
    "angular": false,
    "bootstrap": true,
    "wordpress": false,
    "drupal": false,
    "joomla": false,
    "shopify": false,
    "woocommerce": false
  }
}
```

### Text Statistics
```json
{
  "word_count": 1250,
  "character_count": 8500
}
```

### URL Analysis
```json
{
  "has_ssl": true,
  "domain": "example.com",
  "path": "/",
  "query_params": {}
}
```

## Response Format

### Success Response (201 Created)
```json
{
  "success": true,
  "data": {
    "id": "project_123",
    "websiteUrl": "https://example.com",
    "category": "General",
    "description": "Optional project description",
    "title": "Website Title",
    "healthScore": 85,
    "lastChecked": "2025-08-18T19:46:59.000Z",
    "status": "active",
    "createdAt": "2025-08-18T19:46:59.000Z",
    "updatedAt": "2025-08-18T19:46:59.000Z",
    "scrapedData": {
      // Store the complete scraped data
    }
  },
  "message": "Project created successfully"
}
```

### Error Response (400/500)
```json
{
  "success": false,
  "error": "Error message",
  "message": "Detailed error description"
}
```

## Database Schema Recommendations

### Projects Table
```sql
CREATE TABLE projects (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  website_url TEXT NOT NULL,
  category VARCHAR(100) DEFAULT 'General',
  description TEXT,
  title VARCHAR(500),
  health_score INTEGER DEFAULT 0,
  last_checked TIMESTAMP,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  scraped_data JSON,
  INDEX idx_user_id (user_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
);
```

### Scraped Data Storage
Store the complete `scrapedData` object as JSON in the database. This allows for:
- Full data preservation
- Future analysis and reporting
- Historical tracking of website changes

## Authentication
- The endpoint requires authentication
- Include user ID in the project creation
- Validate user permissions

## Validation Requirements

### Required Validation
1. **URL Validation**: Ensure `websiteUrl` is a valid URL
2. **User Authentication**: Verify user is authenticated
3. **Data Integrity**: Validate scraped data structure
4. **Duplicate Prevention**: Check if project already exists for user + URL

### Optional Validation
1. **Content Length**: Validate content isn't empty
2. **Status Code**: Ensure successful HTTP response (200-299)
3. **Domain Validation**: Verify domain is accessible

## Implementation Notes

### Performance Considerations
- Store large scraped data as JSON (not individual columns)
- Index frequently queried fields (user_id, status, created_at)
- Consider data archival for old projects

### Security Considerations
- Sanitize all input data
- Validate URL schemes (http/https only)
- Rate limit project creation per user
- Store user ID with each project

### Error Handling
- Handle malformed JSON gracefully
- Provide meaningful error messages
- Log validation failures for debugging

## Example Implementation (Node.js/Express)

```javascript
app.post('/api/projects', authenticateUser, async (req, res) => {
  try {
    const { websiteUrl, category, description, scrapedData } = req.body;
    const userId = req.user.id;

    // Validation
    if (!websiteUrl || !scrapedData) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    // Check for duplicate project
    const existingProject = await Project.findOne({
      where: { userId, websiteUrl }
    });

    if (existingProject) {
      return res.status(409).json({
        success: false,
        error: 'Project already exists for this URL'
      });
    }

    // Create project
    const project = await Project.create({
      id: generateProjectId(),
      userId,
      websiteUrl,
      category: category || 'General',
      description: description || '',
      title: scrapedData.title || websiteUrl,
      healthScore: calculateHealthScore(scrapedData),
      lastChecked: new Date(),
      status: 'active',
      scrapedData: JSON.stringify(scrapedData)
    });

    res.status(201).json({
      success: true,
      data: project,
      message: 'Project created successfully'
    });

  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});
```

## Testing

### Test Cases
1. **Valid Project Creation**: Send complete data, expect 201 response
2. **Missing Required Fields**: Send incomplete data, expect 400 response
3. **Duplicate Project**: Create same project twice, expect 409 response
4. **Invalid URL**: Send malformed URL, expect 400 response
5. **Unauthenticated Request**: Send without auth, expect 401 response

### Sample Test Data
Use the example scraped data structure above for testing. Ensure all fields are populated to test the complete flow.

## Integration Notes

- The frontend will send this data when user clicks "Create Project" on the LambdaResults page
- The scraped data is comprehensive and includes all lambda function output
- Consider implementing a health score calculation based on the scraped data
- Plan for data retention and archival strategies
