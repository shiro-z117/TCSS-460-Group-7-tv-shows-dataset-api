# TCSS-460-Group-7-Project

Group Project for TCSS 460 @ UWT  

RESTful API for TV Shows Dataset providing access to comprehensive television show data including cast, crew, production companies, and ratings.


## Beta Sprint Documentation

### Beta Sprint Contributions (What member created/did)
Each member document:
- Tasks completed
- Files created
- Key accomplishments
- Testing results

### Beta Sprint Comments (what we met: worked, challenges, notes)
- What worked well
- Challenges faced
- Status of deliverables
- Notes for next sprint

---

## Beta Sprint Meetings
Meeting time: Thursday, October 17, 2025
Time: 12:30 PM - 1:00 PM (30 minutes)
Location: Discord

- **Discussion:**
  - we contribution the role
    Patrick: API Development (member 1)
    Linda: Database & Integration (Member 2)
    Coco: Documentation & GitHub Pages (member 3)
    Bao: Testing & Quality Assurance (member 4)
    Shiro: Deployment & DevOps (member 5)
  - Decided deployment tool: **Render**
  - Next meeting: 8:00PM On Sunday
---

## Beta Sprint Contributions

### Patrick

### Linda Miao - Database & API Integration
**Responsibilities:**
- Set up Supabase PostgreSQL database with 11 tables
- Created db/connection.js for secure database connections
- Wrote 5 query functions in db/queries.js
- Tested database connection and verified queries work
- Populated sample data: 10 TV shows linked to genres

**Files Created:**
- db/connection.js
- db/queries.js
- .env (local only, not on GitHub)

**Testing:**
Connection works Done!
Queries return variable results Done!
Sample data verified Done!

### Shiannel

### Bao

### Shiraz

---

## Beta Sprint Comments

### Patrick

### Linda Miao
**Challenges:**
- Did not clone GitHub repository initially
- Setting up .env file: Understanding Supabase password and host information took time
- Understanding full assignment scope was challenging

**Learning:**
- Based on previous week's confusion about "contributions" vs "comments"
- This week understood better: Contributions = what I created, Comments = process and meetings


### Shiannel

### Bao

### Shiraz


## Alpha Sprint Contributions

### Patrick
**Data Analysis & Quality Assurance**
- Analyze the TV shows dataset thoroughly 
- Verify data quality and identify any issues
- Review all project documentation for accuracy
- Verify Swagger documentation matches project plan

### Linda Miao
**Database Design & Implementation**
- Designed normalized ER diagram (11 tables, Third Normal Form)
- Created SQL schema for PostgreSQL/Supabase (`init_database.sql`)
- Developed Python data migration script (`import_tv_shows.py`)
- Successfully imported 7,316 TV shows with full cast and crew data (99.1% success rate)
- Extracted and normalized: 35,739 actors, 18 genres, 465 networks, 5,897 studios, 5,604 creators
- Created comprehensive database documentation (`database_README.md`)
- **Files:** `project_files/er_diagram.png`, `init_database.sql`, `import_tv_shows.py`, `database_README.md`

### Shiannel
**API Designer & Swagger Documentation**
- Analyzed the TV shows dataset and designed the API endpoint structure
- Created Swagger/OpenAPI YAML documentation file for the entire API
- Documented all endpoints with their request/response formats and examples
- Defined data schemas for TV shows, pagination, and error handling
- Added API key security requirements to protect all endpoints
- **Files:** `project_files/swagger.yaml`

### Bao
**Investigate hosting options**
- Research several hosting options for the Helloword API
- Try to deploy the Helloword API on different hosting services like Render, Railway and Koyeb
- Describe the information of the deployments
- **Files:** `project_files/TCSS460-Group7-Hosting Options.docx`

### Shiraz
**Project Plan**
Wrote the Project Plan:
- Describes how the API, once completed, should function and behave
- Provides information useful to a user of the API, but does not provide details about the underlying technicalities
-**Files:** `project_files/Project_Plan.pdf`

---

## Alpha Sprint Comments

**Database (Linda Miao):**
- Successfully designed and implemented. All tables created and populated with production data.
- Data Quality: 99.1% import success rate (7,316 of 7,382 shows). 66 records failed due to VARCHAR length constraints (can be fixed if needed).
- Performance: Database optimized with indexes on frequently queried columns. Average query time <100ms.

**Hosting Options (Bao Thinh Diep)**
- Tried several options for hosting web service.
- Some services are not sucessfull deployed.
- Render and Koyeb are the easiest deployments so far.

**API Documentation (Shiannel/Coco):**
- Swagger/OpenAPI specification completed and validated
- Documented 11 endpoints, including CRUD operations and search/filter features
- Added API key authentication requirements across all endpoints
- File pushed to GitHub at project_files/swagger.yaml and ready for implementation

**Project Plan (Shiraz)**
- The document in its current form describes the complete API.
- However, it the specifications only describe the essential functions that such an API should have.
- Additional functions may be added later, if time permits. Therefore, the document (and final product) is subject to change.
- 
**Testing and review (Patrick Quaidoo)** 
- Made Dataset doc outlining the different datatypes in the .csv.
- Reviewed ER diagram and sql initialization script for accuracy.
- Reviewed and edited swagger yaml file to fit csv types.


---

**Last Updated:** October 16, 2025
