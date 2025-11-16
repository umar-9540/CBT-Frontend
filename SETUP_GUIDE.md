# CBT Frontend - Setup & Configuration Guide

## Current Setup

### Backend Server
- **URL**: `http://localhost:8080`
- **Endpoints**: 
  - `GET /api/v1/tests` — fetch all tests
  - `GET /api/v1/questions` — fetch all questions
  - `POST /api/v1/questions` — create question
  - `PUT /api/v1/questions/:id` — update question
  - `DELETE /api/v1/questions/:id` — delete question

### Frontend Server
- **URL**: `http://localhost:3000`
- **Framework**: Next.js 16 with TypeScript
- **Package Manager**: npm

---
## How CORS/Rewrite Works

### Development Mode
When you run `npm run dev`:
1. Frontend (localhost:3000) makes request to `/api/v1/questions`
2. Next.js rewrite rule (in `next.config.ts`) intercepts it
3. Request is proxied to `http://localhost:8080/api/v1/questions`
4. **No CORS error** because request appears same-origin to browser

**Key File**: `next.config.ts`
```typescript
async rewrites() {
  return [
    {
      source: '/api/:path*',
      destination: 'http://localhost:8080/api/:path*',
    },
  ];
}
```

### Environment Variables
**File**: `.env.local`
```
NEXT_PUBLIC_API_URL=
```
- **Empty** = Use relative paths (`/api/...`) which trigger the rewrite
- **Has value** = Use direct URL (bypasses rewrite, causes CORS in development)

---

## File Structure

```
app/
  ├── page.tsx                 # Home page (fetches tests)
  ├── login/
  │   └── page.tsx
  └── admin/
      └── questions/
          └── page.tsx         # Question management CRUD page

components/
  ├── Navbar.tsx
  ├── Footer.tsx
  ├── TestCard.tsx
  ├── QuestionForm.tsx         # Form for creating/editing questions
  ├── QuestionDialog.tsx       # Modal wrapper for form
  └── ...

lib/
  ├── Interface.ts             # TypeScript interfaces (Test, Question, etc.)
  ├── questionApi.ts           # Axios API service for questions CRUD
  └── ...

next.config.ts                  # Next.js config with rewrite rules
.env.local                      # Environment variables (local, not committed)
tsconfig.json                   # TypeScript config
package.json                    # Dependencies
```

---

## Running the Application

### 1. Start Backend Server
Make sure your backend is running on port 8080:
```bash
# On your backend directory
npm start
# or
java -jar your-app.jar
```

### 2. Start Frontend Dev Server
In the frontend directory:
```bash
cd C:\Users\admin\Documents\CBT-Frontend
npm run dev
```

The frontend will be available at `http://localhost:3000`

### 3. Access the Application
- **Home/Tests**: `http://localhost:3000`
- **Question Management**: `http://localhost:3000/admin/questions`

---

## API Integration

### Making API Calls from Components
Use the API service modules in `lib/`:

#### For Questions:
```typescript
import { getQuestions, createQuestion, updateQuestion, deleteQuestion } from "@/lib/questionApi";

// Fetch
const questions = await getQuestions(testId, section);

// Create
const newQuestion = await createQuestion(questionData);

// Update
const updated = await updateQuestion(questionId, updates);

// Delete
await deleteQuestion(questionId);
```

#### For Tests (in `app/page.tsx`):
```typescript
const base = process.env.NEXT_PUBLIC_API_URL ?? "";
const res = await axios.get(`${base}/api/v1/tests`);
```

---

## Features Implemented

### Pages
✅ Home page with test listing, filtering, and search
✅ Admin questions page with full CRUD operations

### Components
✅ Navbar & Footer
✅ TestCard (display test info)
✅ QuestionForm (create/edit questions)
✅ QuestionDialog (modal for form)

### CRUD Operations
✅ **Create**: Create new questions with options, attachments, scoring
✅ **Read**: List all questions with pagination/filtering
✅ **Update**: Edit existing questions
✅ **Delete**: Remove questions with confirmation

### Filters
✅ Filter by testId
✅ Filter by section
✅ Search by question stem or section

---

## Troubleshooting

### CORS Error
**Error**: "Access to XMLHttpRequest at 'http://localhost:8080/api/v1/questions' from origin 'http://localhost:3000' has been blocked by CORS policy"

**Solution**:
1. Ensure `.env.local` has `NEXT_PUBLIC_API_URL=` (empty)
2. Restart dev server: `npm run dev`
3. Make sure Next.js rewrite is in `next.config.ts`

### Port Already in Use
**Error**: "Port 3000 is in use"

**Solution**:
```bash
# Kill node processes
taskkill /F /IM node.exe

# Then restart
npm run dev
```

### Dev Server Not Picking Up Changes
**Error**: Environment variables not updating, files keep reverting

**Solution**:
1. Stop dev server (Ctrl+C)
2. Delete `.next` folder: `rm -r .next`
3. Restart: `npm run dev`

---

## Production Deployment

For production, set `NEXT_PUBLIC_API_URL` to your actual API URL:
```bash
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

Then:
1. Enable CORS on your backend for the frontend origin
2. Or use a reverse proxy / API gateway to handle CORS

---

## Next Steps

1. ✅ Restart dev server with clean `.env.local`
2. ✅ Visit `http://localhost:3000/admin/questions`
3. ✅ Create a test question
4. ✅ Test filtering and CRUD operations
5. (Optional) Add image upload instead of URL input
6. (Optional) Add question templates
7. (Optional) Add bulk import from CSV

---

## Contact & Support
If you encounter issues:
1. Check browser DevTools → Network tab for request details
2. Check browser Console for error messages
3. Check terminal output for server logs
