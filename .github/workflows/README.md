# GitHub Actions Workflows

This folder contains GitHub Actions workflows that provide automated CI/CD for the Task Manager application.

## 📁 Workflow Files

### `ci-cd.yml` - Main CI/CD Pipeline

**Purpose**: Automated build, test, and validation pipeline that runs on every code push and pull request.

---

## 🔄 `ci-cd.yml` - Detailed Breakdown

### **Triggers (When It Runs)**
```yaml
on:
  push:
    branches: [ main, develop ]  # Runs when you push to main or develop
  pull_request:
    branches: [ main ]           # Runs when PR is created targeting main
```

### **Environment Variables**
```yaml
env:
  NODE_VERSION: '18'      # Node.js version for frontend
  DOTNET_VERSION: '8.0.x' # .NET version for backend
```

---

## 🏗️ Jobs Explained

### **Job 1: `frontend-ci` (Frontend Build & Validation)**

| Step | Action | What It Does |
|------|--------|--------------|
| `Checkout code` | `actions/checkout@v4` | Downloads your repository code to the runner |
| `Setup Node.js` | `actions/setup-node@v4` | Installs Node.js 18 with npm caching enabled |
| `Install dependencies` | `npm ci` | Installs exact package versions from package-lock.json |
| `Run linting` | `npm run lint` | Checks code style and catches common errors |
| `Build application` | `npm run build` | Compiles React/TypeScript into production build |
| `Upload build artifacts` | `actions/upload-artifact@v4` | Saves the built files for potential deployment |

**What happens if it fails?**
- ❌ Linting errors → Workflow stops, shows code style issues
- ❌ Build errors → Workflow stops, shows compilation errors
- ❌ Missing dependencies → Workflow stops, shows package issues

---

### **Job 2: `backend-ci` (Backend Build & Test)**

| Step | Action | What It Does |
|------|--------|--------------|
| `Checkout code` | `actions/checkout@v4` | Downloads your repository code to the runner |
| `Setup .NET` | `actions/setup-dotnet@v4` | Installs .NET 8.0 SDK |
| `Restore dependencies` | `dotnet restore` | Downloads NuGet packages |
| `Build application` | `dotnet build` | Compiles C# code in Release configuration |
| `Run unit tests` | `dotnet test` | Executes all unit tests in the test project |
| `Publish application` | `dotnet publish` | Creates deployment-ready package |
| `Upload build artifacts` | `actions/upload-artifact@v4` | Saves the published files |

**What happens if it fails?**
- ❌ Compilation errors → Workflow stops, shows C# build errors
- ❌ Test failures → Workflow stops, shows which tests failed
- ❌ Missing packages → Workflow stops, shows dependency issues

---

### **Job 3: `deploy` (Deployment - Currently Disabled)**

| Step | Action | What It Does |
|------|--------|--------------|
| `Checkout code` | `actions/checkout@v4` | Downloads repository code |
| `Download frontend artifacts` | `actions/download-artifact@v4` | Gets built frontend files from Job 1 |
| `Download backend artifacts` | `actions/download-artifact@v4` | Gets compiled backend files from Job 2 |
| `Deployment Success` | `echo` | Prints success message (placeholder) |

**Conditions for this job to run:**
- ✅ Both `frontend-ci` and `backend-ci` must succeed
- ✅ Push must be to `main` branch (not develop)
- ✅ Must be a push event (not pull request)

**Commented Azure deployment steps:**
```yaml
# These are ready to use when you want real deployment:
# - Deploy to Azure Static Web Apps (for React frontend)
# - Deploy Azure Functions (for C# backend)
```

---

## 🎯 Workflow Benefits

### **For Development**
- **Early Bug Detection**: Catches issues before they reach main branch
- **Code Quality**: Ensures consistent style and standards
- **Test Automation**: Runs tests automatically on every change
- **Build Verification**: Confirms code actually compiles

### **For Pull Requests**
- **Status Checks**: Shows ✅ or ❌ next to PR
- **Merge Protection**: Can prevent merging broken code
- **Reviewer Confidence**: Reviewers know tests passed

### **For Team Collaboration**
- **Consistency**: Same build process for everyone
- **Documentation**: Clear history of what changed and when
- **Rollback Safety**: Easy to identify when issues were introduced

---

## 🔧 Customization Options

### **To Add Frontend Tests**
Uncomment this section in `ci-cd.yml`:
```yaml
- name: Run tests
  working-directory: ./client
  run: npm test
```

### **To Enable Real Deployment**
1. Set up Azure resources (Static Web Apps, Function Apps)
2. Add GitHub secrets for authentication
3. Uncomment the deployment steps
4. Update resource names

### **To Add More Jobs**
Examples you could add:
- Security scanning
- Code coverage reporting
- Performance testing
- Database migration testing

---

## 📊 Viewing Results

### **In GitHub Interface**
1. Go to your repository on GitHub
2. Click "Actions" tab
3. See all workflow runs with status
4. Click individual runs to see detailed logs

### **Status Indicators**
- 🟢 **Green checkmark**: All jobs passed
- 🔴 **Red X**: One or more jobs failed
- 🟡 **Yellow circle**: Workflow is running
- 🔘 **Gray circle**: Workflow was cancelled

### **Pull Request Integration**
- Status appears at bottom of PR
- Required checks can block merging
- Detailed logs available via "Details" link

---

## 🚨 Troubleshooting Common Issues

### **"npm ci failed"**
- Check if `package-lock.json` exists
- Verify Node.js version compatibility
- Check for syntax errors in `package.json`

### **"dotnet build failed"**
- Check for C# compilation errors
- Verify .NET version compatibility
- Check for missing NuGet packages

### **"Tests failed"**
- Look at test output in logs
- Fix failing unit tests
- Check test project configuration

### **"Workflow not running"**
- Check branch names match trigger conditions
- Verify workflow file syntax (YAML formatting)
- Check if Actions are enabled for repository

---

## 💰 Cost Information

- **GitHub Actions**: Free for public repositories
- **For private repos**: 2,000 minutes/month free, then pay-per-use
- **Current workflow**: Uses ~3-5 minutes per run
- **Estimated monthly usage**: 30-100 minutes (well within free tier)

---

## 🔮 Future Enhancements

Potential additions when project grows:
- **Security scanning** (CodeQL, Dependabot)
- **Performance testing** (Lighthouse CI)
- **Code coverage** reporting
- **Slack/Teams** notifications
- **Multiple environment** deployments
- **Database migration** testing
