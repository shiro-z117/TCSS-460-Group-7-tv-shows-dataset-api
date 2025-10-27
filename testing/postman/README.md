# TCSS-460 TV Shows Dataset API - Postman Testing Collection

Comprehensive Postman collection for testing the TCSS-460 TV Shows Dataset API. This collection provides complete test coverage for all TV show endpoints and demonstrates RESTful API testing best practices.

## 📋 Collection Overview

### **Test Categories:**
- ✅ **Health Check** - API availability monitoring (1 request)
- ✅ **API Documentation** - Documentation endpoints (2 requests)
- ✅ **TV Shows List** - Show retrieval (1 request)
- ✅ **Genre Filtering** - Filter shows by genre (5 requests)
- ✅ **Genres List** - Genre list with search and pagination (3 requests)
- ✅ **Data Validation** - Sample data verification and integrity checks (3 requests)

### **Total Test Cases:** 15 requests with 65+ individual test assertions

## 🌐 Live API Information

**Live API URL:** `https://tcss-460-group-7-tv-shows-dataset-api-g4kq.onrender.com`

The API is deployed on Render and provides access to a comprehensive dataset of **7,382+ TV shows** from various genres, including popular shows like Breaking Bad, Game of Thrones, Stranger Things, The Office, and thousands more.

## 🚀 Quick Start

### Prerequisites
1. **Postman Installed**: Desktop app or web version ([Download Postman](https://www.postman.com/downloads/))
2. **Internet Connection**: Required to access the live API on Render

### Setup Instructions

1. **Import Collection**:
   ```
   File → Import → Choose Files → Select postman.json
   ```

2. **Start Testing**:
   - The collection is pre-configured with the live API URL: `https://tcss-460-group-7-tv-shows-dataset-api-g4kq.onrender.com`
   - Run Collection or test individual requests immediately
   - No environment file needed!

**Note:** The `base_url` variable is set in the collection itself, so it works out of the box.

## 🧪 Test Scenarios

### **1. Health Check**

**Endpoint:** `GET /health`

Tests basic API availability:
- API running status verification
- JSON content type validation

**Sample Response:**
```json
{
  "status": "API is running"
}
```

### **2. API Documentation**

**Endpoint:** `GET /api-docs`

Retrieves the interactive API documentation page with Swagger UI:
- Full HTML documentation page
- Interactive endpoint testing
- OpenAPI specification viewer
- Comprehensive API reference

**Browser Access:** Open `https://tcss-460-group-7-tv-shows-dataset-api-g4kq.onrender.com/api-docs` in your browser

**Endpoint:** `GET /api-docs/swagger.yaml`

Retrieves the raw OpenAPI/Swagger YAML specification:
- Machine-readable API specification
- OpenAPI 3.0 format
- Complete endpoint definitions
- Schema documentation

**Sample Response (YAML):**
```yaml
openapi: 3.0.0
info:
  title: TV Shows API
  description: API for querying TV shows dataset
  version: 1.0.0
servers:
  - url: https://tcss-460-group-7-tv-shows-dataset-api-g4kq.onrender.com
paths:
  /health:
    get:
      summary: Health check endpoint
      ...
```

### **3. TV Shows List**

**Endpoint:** `GET /api/shows`

Tests show retrieval:
- **Default Behavior**: Returns all TV shows in the database

**Sample Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Breaking Bad",
      "original_name": "Breaking Bad",
      "first_air_date": "2008-01-20T00:00:00.000Z",
      "last_air_date": "2013-09-29T00:00:00.000Z",
      "seasons": 5,
      "episodes": 62,
      "status": "Ended",
      "overview": "A chemistry teacher turned meth cook...",
      "popularity": "85.5000",
      "tmdb_rating": "9.5",
      "vote_count": 15000,
      "poster_url": "https://example.com/poster1.jpg",
      "backdrop_url": null
    }
  ]
}
```

**Key Validations:**
- Response structure (success, data array)
- All required fields present (id, name, seasons, episodes, etc.)
- Data types are correct
- Response time is acceptable

### **4. Filter by Genre**

**Endpoint:** `GET /api/shows/by-genre/{genreName}`

Tests genre-based filtering:
- **Drama**: `/api/shows/by-genre/Drama` - Returns Breaking Bad, Game of Thrones, etc.
- **Comedy**: `/api/shows/by-genre/Comedy` - Returns The Office
- **Sci-Fi & Fantasy**: `/api/shows/by-genre/Sci-Fi & Fantasy` - Returns Stranger Things, Westworld, The Mandalorian
- **Crime**: `/api/shows/by-genre/Crime` - Returns shows with Crime genre
- **Invalid Genre**: Returns empty array with `success: true`

**Sample Response (Genre Filter):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Breaking Bad",
      "original_name": "Breaking Bad",
      "first_air_date": "2008-01-20T00:00:00.000Z",
      "seasons": 5,
      "episodes": 62,
      "status": "Ended",
      "tmdb_rating": "9.5"
    }
  ]
}
```

**Note:** Genre filter responses return fewer fields than the full list endpoint (no overview, popularity, vote_count, poster_url, backdrop_url).

**Key Validations:**
- **Sample shows from each genre are present** (validates known shows exist in the dataset)
- Genre-specific validations:
  - Drama: Checks for presence of Breaking Bad, Game of Thrones, or Stranger Things
  - Comedy: Checks for presence of The Office
  - Sci-Fi & Fantasy: Checks for presence of Stranger Things, Westworld, or The Mandalorian
  - Crime: Checks for presence of The Witcher or The Mandalorian
- Empty array for non-existent genres
- Response structure consistency

### **5. Genres List**

**Endpoint:** `GET /api/genres`

Tests the genres list endpoint with search and pagination capabilities:

**Basic Request** - Returns all available genres:
```json
{
  "success": true,
  "data": ["Action & Adventure", "Animation", "Comedy", "Crime", "Documentary", "Drama", ...],
  "page": 1,
  "limit": 50,
  "total": 18
}
```

**Search Request** - `GET /api/genres?q=dram`:
- Tests case-insensitive genre search
- Returns genres matching the query substring
- Example: searching "dram" returns ["Drama"]

**Pagination Request** - `GET /api/genres?page=1&limit=5`:
- Tests pagination functionality
- Limits results to specified number
- Returns proper pagination metadata

**Key Validations:**
- Response structure includes `success`, `data`, `page`, `limit`, `total`
- Data array contains strings (genre names)
- Search results match the query
- Pagination respects page and limit parameters
- Total count is accurate

### **6. Data Validation**

Tests data integrity across the dataset:
- **Breaking Bad Verification**: Confirms 5 seasons, 62 episodes, first aired in 2008
- **Game of Thrones Verification**: Confirms 8 seasons, 73 episodes
- **Data Completeness**: All shows have non-null names, valid dates, positive seasons/episodes
- **Rating Validation**: TMDB ratings are between 0-10
- **Date Validation**: All dates are valid ISO 8601 format

## 📚 Available Genres

Based on the sample data, the following genres are available:

| Genre ID | Genre Name |
|----------|------------|
| 1 | Drama |
| 2 | Comedy |
| 3 | Sci-Fi & Fantasy |
| 4 | Animation |
| 5 | Action & Adventure |
| 6 | Crime |
| 7 | Mystery |
| 8 | Family |
| 9 | Kids |
| 10 | Documentary |
| 11 | Reality |
| 12 | Soap |
| 13 | War & Politics |
| 14 | Western |
| 15 | News |
| 16 | Romance |
| 17 | History |

## 📊 Sample TV Shows Data

The API contains **7,382+ TV shows** from the past year. The tests validate the presence of these known sample shows:

(Title; Genre; First Air Date; Seasons; Episodes; Status; Rating)
- Breaking Bad; Drama; 2008-01-20; 5; 62; Ended; 9.5
- Game of Thrones; Drama; 2011-04-17; 8; 73; Ended; 9.2
- Stranger Things; Drama, Sci-Fi & Fantasy; 2016-07-15; 4; 42; Returning Series; 8.7
- The Office; Comedy; 2005-03-24; 9; 201; Ended; 9.0
- The Witcher; Crime; 2019-12-20; 3; 30; Ended; 8.2
- Westworld; Drama, Sci-Fi & Fantasy; 2016-10-02; 4; 36; Ended; 8.5
- The Mandalorian; Sci-Fi & Fantasy, Crime; 2019-11-12; 3; 24; Returning Series; 8.7


- Breaking Bad: Drama
- Game of Thrones: Drama
- Stranger Things: Drama, Sci-Fi & Fantasy
- The Office: Comedy
- The Witcher: Crime
- Westworld: Drama, Sci-Fi & Fantasy
- The Mandalorian: Sci-Fi & Fantasy, Crime

**Note:** The database contains thousands of additional TV shows beyond these samples. Tests verify data structure and sample show presence rather than exact counts.

## 🌐 Environment Variables

The collection uses these environment variables:

| Variable | Description | Default Value |
|----------|-------------|---------------|
| `base_url` | Live API URL | `https://tcss-460-group-7-tv-shows-dataset-api-g4kq.onrender.com` |
| `local_url` | Local dev URL (disabled) | `http://localhost:8000` |
| `api_version` | Current version | `1.0.0` |
| `environment_name` | Environment type | `production` |
| `test_timestamp` | Test timestamp | *Auto-generated* |

### Switching to Local Development

To test against a local server:
1. Open "TV Shows API Environment" settings
2. **Disable** `base_url` (uncheck the checkbox)
3. **Enable** `local_url` (check the checkbox)
4. Update `environment_name` to `development`
5. Ensure your local server is running on port 8000

## 📊 Test Automation

### **Running All Tests**

1. Click "Collections" in the sidebar
2. Hover over "TCSS-460 TV Shows Dataset API"
3. Click the "..." (three dots) menu
4. Select "Run collection"
5. Configure runner settings:
   - **Iterations**: 1 (recommended)
   - **Delay**: 100-500ms between requests (avoids rate limiting)
   - **Save responses**: Enable for detailed results
6. Click "Run TCSS-460 TV Shows Dataset API"

### **Expected Test Results**

With the live API:

| Test Category | Requests | Test Assertions | Expected Result |
|---------------|----------|-----------------|-----------------|
| Health Check | 1 | ~4 tests | ✅ All Pass |
| API Documentation | 2 | ~8 tests | ✅ All Pass |
| TV Shows List | 1 | ~4 tests | ✅ All Pass |
| Genre Filtering | 5 | ~15 tests | ✅ All Pass |
| Genres List | 3 | ~15 tests | ✅ All Pass |
| Data Validation | 3 | ~15 tests | ✅ All Pass |
| **TOTAL** | **15** | **~65 tests** | **✅ All Pass** |

### **Understanding Test Results**

- ✅ **Green checkmark**: Test passed
- ❌ **Red X**: Test failed - click for details
- 📊 **Summary panel**: Overall pass/fail statistics
- 📝 **Console output**: Detailed logs via Postman Console (View → Show Postman Console)

## 🔧 Troubleshooting

### Common Issues

**🔴 Connection Timeout / Unable to Connect**
```
Error: ETIMEDOUT or Could not get any response
```
**Solutions:**
- Verify internet connection
- Render free tier may need 30-60 seconds to wake up if idle
- Try accessing API directly in browser: `https://tcss-460-group-7-tv-shows-dataset-api-g4kq.onrender.com/health`
- Check Postman proxy settings (Settings → Proxy - try disabling)
- Wait 1 minute and retry - Render spins down inactive services

**🔴 Slow Response Times**
```
Requests taking longer than expected
```
**Solutions:**
- First request after idle may be slow (cold start - Render free tier)
- Subsequent requests should be faster
- Response time tests have been removed to accommodate free tier variability
- Run collection again after service warms up

**🔴 Environment Not Set**
```
Error: base_url is not defined
```
**Solutions:**
- Click environment dropdown (top right)
- Select "TV Shows API Environment"
- Verify variables are set correctly

**🔴 Empty Data Arrays**
```
data: []
```
**Solutions:**
- For `/api/shows`: Indicates no shows in database (should have 7,382+)
- For `/api/shows/by-genre/SomeGenre`: Normal for invalid genres
- For `/api/genres`: Indicates no genres in database (should have 18)
- Verify database was populated with TV shows data

### **Debug Mode**

1. **Open Postman Console**:
   - View → Show Postman Console (or Ctrl+Alt+C / Cmd+Alt+C)

2. **Run Individual Requests**:
   - Observe detailed request/response logs
   - Check console.log() output from test scripts
   - Verify environment variable values

3. **Inspect Response**:
   - Click on any request
   - View Response body, headers, cookies tabs
   - Check Test Results tab for specific failures

## 🎯 Advanced Usage

### **Newman CLI Integration**

Run tests from command line:

```bash
# Install Newman globally
npm install -g newman

# Run collection against live API
newman run postman.json \
  --reporters cli,json

# Run with HTML reports
npm install -g newman-reporter-htmlextra

newman run postman.json \
  --reporters cli,htmlextra \
  --reporter-htmlextra-export test-results.html

# Run with custom delay
newman run postman.json \
  --delay-request 500 \
  --timeout-request 10000
```

### **CI/CD Integration**

Example GitHub Actions workflow:

```yaml
name: API Tests

on: [push, pull_request]

jobs:
  test-api:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Install Newman
        run: npm install -g newman newman-reporter-htmlextra

      - name: Run Postman Tests
        run: |
          newman run testing/postman/postman.json \
            --reporters cli,htmlextra,junit \
            --reporter-htmlextra-export test-results.html \
            --reporter-junit-export results.xml

      - name: Upload Test Results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: |
            test-results.html
            results.xml
```

## 📖 Educational Features

### **Learning Objectives**

This collection demonstrates:
- **RESTful API Design**: Proper use of HTTP GET method and status codes
- **Resource Filtering**: Genre-based filtering with clean URL structure
- **Consistent Responses**: Uniform `{success, data}` structure
- **Error Handling**: Graceful handling of invalid genres (empty array, not 404)
- **Data Validation**: Comprehensive assertions for data integrity
- **Test Automation**: Automated test suite with clear assertions
- **Environment Management**: Flexible configuration for prod/dev environments

### **API Design Patterns**

1. **Consistent Response Format**:
   ```json
{
  "success": true,
  "data": ["..."]
}
```

2. **Descriptive Endpoints**:
   - `/health` - Clear health check
   - `/api/shows` - RESTful resource naming
   - `/api/shows/by-genre/{genreName}` - Readable filter endpoints

3. **Optional Pagination**: Works on both list and filter endpoints
   - `?page=1&limit=5`

4. **Graceful Degradation**: Invalid genres return empty array, not errors

## 📝 API Endpoint Reference

### **GET /health**
Health check endpoint

**Response:**
```json
{
  "status": "API is running"
}
```

### **GET /api-docs**
Retrieve interactive API documentation page

**Response:**
- HTML page with Swagger UI interface
- Interactive endpoint testing
- Complete API reference documentation

**Browser Access:** Best viewed in a web browser at `https://tcss-460-group-7-tv-shows-dataset-api-g4kq.onrender.com/api-docs`

### **GET /api-docs/swagger.yaml**
Retrieve OpenAPI specification file

**Response:**
- YAML format OpenAPI 3.0 specification
- Machine-readable API definition
- Complete endpoint schemas and descriptions

### **GET /api/shows**
Retrieve all TV shows

**Query Parameters:**
- None required (returns all shows)

**Response Fields:**
- `id`: Unique show identifier
- `name`: Show name
- `original_name`: Original show name
- `first_air_date`: First air date (ISO 8601)
- `last_air_date`: Last air date (ISO 8601)
- `seasons`: Number of seasons
- `episodes`: Total episodes
- `status`: Show status (Ended, Returning Series)
- `overview`: Show description
- `popularity`: Popularity score (string)
- `tmdb_rating`: TMDB rating (string, 0-10)
- `vote_count`: Number of votes
- `poster_url`: Poster image URL
- `backdrop_url`: Backdrop image URL (may be null)

### **GET /api/shows/by-genre/{genreName}**
Filter shows by genre

**Path Parameters:**
- `genreName` (required): Genre name (e.g., "Drama", "Comedy", "Sci-Fi & Fantasy")

**Query Parameters:**
- None required (returns all shows for the specified genre)

**Response Fields:**
- Same as `/api/shows` but **without**: `overview`, `popularity`, `vote_count`, `poster_url`, `backdrop_url`

**Valid Genres:**
- Drama
- Comedy
- Sci-Fi & Fantasy
- Action & Adventure
- Crime
- Animation
- And 11 more (see Available Genres table above)

**Notes:**
- Genre names are case-sensitive
- Use exact names including spaces and special characters (e.g., "Sci-Fi & Fantasy")
- Invalid genres return `{success: true, data: []}`

### **GET /api/genres**
Retrieve list of all available genres with search and pagination

**Query Parameters:**
- `q` (optional): Search query for filtering genres (case-insensitive substring match)
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of results per page (default: 50)

**Response Format:**
```json
{
  "success": true,
  "data": ["Action & Adventure", "Animation", "Comedy", ...],
  "page": 1,
  "limit": 50,
  "total": 18
}
```

**Examples:**
- `GET /api/genres` - Returns all genres
- `GET /api/genres?q=com` - Returns genres matching "com" (Comedy)
- `GET /api/genres?page=1&limit=5` - Returns first 5 genres
- `GET /api/genres?q=sci&page=1&limit=10` - Search "sci" with pagination

**Notes:**
- Data array contains genre names as strings
- Search is case-insensitive
- Pagination metadata included in response (page, limit, total)

## 🔄 Collection Maintenance

### **Updating Tests**

When API changes:
1. Update request URLs or parameters in collection
2. Modify test assertions to match new response format
3. Update environment variables if needed
4. Re-export collection and environment files
5. Update this README with changes

### **Adding New Tests**

To add new endpoint tests:
1. Create new request in appropriate folder
2. Add comprehensive test scripts following existing patterns
3. Update environment variables if needed
4. Document new endpoint in this README
5. Test thoroughly before committing

---

## 🚀 Getting Started Summary

**Quick 2-Step Setup:**
1. **Import** `postman.json` into Postman
2. **Run** the collection and watch all 65+ tests pass!



---

## 📞 Support & Resources

- **Live API**: [https://tcss-460-group-7-tv-shows-dataset-api-g4kq.onrender.com](https://tcss-460-group-7-tv-shows-dataset-api-g4kq.onrender.com)
- **API Documentation**: [/api-docs](https://tcss-460-group-7-tv-shows-dataset-api-g4kq.onrender.com/api-docs) - Interactive Swagger UI
- **API Health Check**: [/health](https://tcss-460-group-7-tv-shows-dataset-api-g4kq.onrender.com/health)
- **Sample Endpoint**: [/api/shows](https://tcss-460-group-7-tv-shows-dataset-api-g4kq.onrender.com/api/shows)
- **Postman Documentation**: [docs.postman.com](https://learning.postman.com/docs/)
- **Newman Documentation**: [newman docs](https://learning.postman.com/docs/running-collections/using-newman-cli/command-line-integration-with-newman/)
- **Course**: TCSS-460 Web APIs

---

**Last Updated:** October 2025
**Collection Version:** 1.0.0
**API Version:** 1.0.0
