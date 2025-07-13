# Task Manager Application

A full-stack task management application built with React, Azure Functions, and SQL Server. Features Microsoft Azure AD authentication, CRUD operations, search functionality, and a responsive UI.

## 🚀 Features

- **User Authentication**: Microsoft Azure AD integration with MSAL
- **Task Management**: Create, read, update, delete tasks
- **Search & Filter**: Search by title/assignee and filter by status
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **Real-time Updates**: React Query for efficient data fetching and caching
- **RESTful API**: Azure Functions backend with OpenAPI documentation

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Client  │────│ Azure Functions │────│   SQL Server    │
│   (Frontend)    │    │   (Backend)     │    │   (Database)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                        │                        │
        │                        │                        │
    ┌───▼────┐              ┌────▼────┐              ┌────▼────┐
    │ MSAL   │              │ JWT     │              │ Indexes │
    │ Auth   │              │ Validation              │ Schema  │
    └────────┘              └─────────┘              └─────────┘
```

## 📋 Prerequisites

- Node.js 18+ and npm
- .NET 8.0 SDK
- Azure Functions Core Tools v4
- SQL Server (local or Azure SQL Database)
- Azure AD tenant for authentication

## 🛠️ Local Development Setup

### 1. Database Setup

#### Option A: Azure SQL Database
1. Create an Azure SQL Database
2. Connect using SQL Server Management Studio or Azure Data Studio
3. Run the schema creation script:

```sql
-- Create Tasks table
CREATE TABLE Tasks (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Title NVARCHAR(200) NOT NULL,
    Description NVARCHAR(MAX),
    DueDate DATETIME2,
    Status NVARCHAR(50) NOT NULL DEFAULT 'pending',
    CreatedBy NVARCHAR(256),
    AssignedTo NVARCHAR(256),
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);

-- Create search indexes for performance
CREATE INDEX IX_Tasks_Title ON Tasks (Title);
CREATE INDEX IX_Tasks_AssignedTo ON Tasks (AssignedTo);
```

#### Option B: Local SQL Server
1. Install SQL Server LocalDB or SQL Server Express
2. Create a new database named `taskmanagementdb`
3. Run the same schema script above


#### Option C: Use my Azure DB (Recommended)
1. Paste the local.settings.json I provided into the visual studio project in the /api/TaskManagerAPI folder

### 2. Azure Functions API Setup

Navigate to the API directory:
```bash
cd api/TaskManagerAPI
```

Configure local settings:
```bash
# Copy the local.settings.json template
cp local.settings.json.example local.settings.json
```

Update `local.settings.json` with your configuration:
```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "dotnet-isolated",
    "SqlConnectionString": "YOUR_SQL_CONNECTION_STRING",
    "TenantId": "YOUR_AZURE_TENANT_ID",
    "ClientId": "YOUR_AZURE_CLIENT_ID"
  },
  "Host": {
    "CORS": "*",
    "CORSCredentials": false
  }
}
```

Start the Azure Functions:
```bash
func start
```

The API will be available at `http://localhost:7011`

### 3. React Frontend Setup

Navigate to the client directory:
```bash
cd client
```

Install dependencies:
```bash
npm install
```

Configure environment variables:
```bash
# Copy the environment template
cp .env.example .env.local
```

Edit `.env.local` with your Azure AD values:
```env
VITE_AZURE_CLIENT_ID=your_azure_client_id_here
VITE_AZURE_AUTHORITY=https://login.microsoftonline.com/common
VITE_AZURE_REDIRECT_URI=http://localhost:5173
VITE_AZURE_SCOPES=api://your_azure_client_id_here/user_impersonation
```

Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 4. 🔐 Authentication Setup 

### Use local.set
### Azure AD Configuration

### (Recommended: use local.settings.json I provided)

1. **Register Application in Azure AD**:
   - Go to Azure Portal → Azure Active Directory → App registrations
   - Click "New registration"
   - Name: "Task Manager App"
   - Redirect URI: `http://localhost:5173` (for development)

2. **Configure API Permissions**:
   - Add `User.Read` permission
   - Grant admin consent

3. **Authentication Settings**:
   - Enable "Access tokens" and "ID tokens"
   - Add redirect URIs for both development and production

4. **Get Configuration Values**:
   - Client ID: Found in app registration overview
   - Tenant ID: Found in Azure AD overview
   - Use these values in both frontend and backend configuration

### Alternative Providers

The application is designed to work with Microsoft Identity Platform, but can be adapted for other OAuth2/OpenID Connect providers by:
- Updating the MSAL configuration in `authConfig.ts`
- Modifying the JWT validation in `TaskFunction.cs`
- Adjusting the token validation parameters

## 📚 API Documentation

### Postman Collection
Import the Postman collection from `docs/Task Manager.postman_collection.json`

**Setup Variables in Postman**:
- Add your Bearer token to the Authorization tab in the collection root within postman
- `base_url`: `http://localhost:7011` (for local development)

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks (supports filtering and search) |
| GET | `/api/tasks/{id}` | Get task by ID |
| POST | `/api/tasks` | Create new task |
| PUT | `/api/tasks/{id}` | Update existing task |
| DELETE | `/api/tasks/{id}` | Delete task |

**Query Parameters for GET /api/tasks**:
- `status`: Comma-separated status values (e.g., "pending,inprogress")
- `searchText`: Search in title and assignee fields

## 🏛️ Architecture Decisions & Patterns

### Backend (Azure Functions)
- **Repository Pattern**: Abstraction layer for data access
- **Dependency Injection**: Clean separation of concerns
- **JWT Authentication**: Stateless token-based authentication
- **OpenAPI Integration**: Auto-generated API documentation

### Frontend (React)
- **Component-Based Architecture**: Reusable UI components
- **State Management**: Redux Toolkit for global state
- **Data Fetching**: React Query for server state management
- **Authentication**: MSAL React for Azure AD integration
- **Styling**: Tailwind CSS
- **TypeScript**: Type safety and better developer experience

### Database
- **Relational Model**: SQL Server
- **Indexing Strategy**: Indexes on frequently queried columns
- **UUID Primary Keys**: Globally unique identifiers

### Key Patterns Implemented
1. **Clean Architecture**: Separation of business logic, data access, and presentation
2. **CQRS-lite**: Separate DTOs for commands and queries
3. **Factory Pattern**: Repository creation with dependency injection
4. **Observer Pattern**: React Query for reactive data updates
5. **Facade Pattern**: Service layer abstracting repository complexity

## 🔧 Testing

### Backend Tests
```bash
cd tests/TaskManagerAPI.Tests
dotnet test
```

### Frontend Tests
```bash
cd client
npm run test  # (if tests were implemented)
```

## 🚀 Deployment

### Azure Deployment
1. **Azure Functions**: Deploy using Azure Functions extension for VS Code or Azure CLI
2. **React App**: Deploy to Azure Static Web Apps or Azure App Service
3. **Database**: Use Azure SQL Database for production

### Environment Variables
Set these in your deployment environment:
- `SqlConnectionString`: Production database connection
- `TenantId`: Azure AD tenant ID
- `ClientId`: Azure AD application client ID

## 🔮 Future Improvements

Given more time, and if I were to scale this project, I would implement the following enhancements:

### High Priority
1. **Enhanced Security**:
   - Role-based access control (RBAC)
   - Input validation and sanitization
   - Rate limiting
   - Audit logging for all operations
   - Improve loading states in UI

2. **Performance Optimizations**:
   - Database query optimization
   - Caching strategy (Redis)
   - Image optimization and CDN
   - Bundle splitting and lazy loading

3. **Testing Coverage**:
   - Comprehensive unit tests (frontend & backend)
   - Integration tests
   - End-to-end testing
   - Performance testing

### Medium Priority
4. **User Experience**:
   - Real-time notifications (with something like SignalR) (nice to have)
   - Drag-and-drop task reordering
   - Advanced filtering and sorting options
   - Dark/light theme toggle
   - Offline support with service workers

5. **Features**:
   - Task comments and attachments
   - Due date notifications
   - Task templates
   - Bulk operations
   - Export functionality (PDF, Excel)

6. **DevOps & Monitoring**:
   - CI/CD pipelines (GitHub Actions)
   - Application Insights integration
   - Automated deployment

### Long-term Enhancements
7. **Scalability**:
   - Microservices architecture
   - Event-driven architecture
   - Multi-tenant support

8. **Advanced Features**:
   - AI-powered task suggestions
   - Advanced analytics and reporting
   - Mobile app (React Native)
   - Third-party integrations (Slack, Teams, etc.)

## 🐛 Known Issues
- Limited error handling in some edge cases
- Little input validation on client side for some fields
