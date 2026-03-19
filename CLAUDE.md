# CLAUDE.md — n8n Execution Viewer

## Overview

| Parameter | Value |
|-----------|-------|
| **Repository** | `execution-viewer` on GitHub |
| **Backend** | Node.js + Express + TypeScript |
| **Frontend** | React 18 + Vite + TypeScript |
| **Database** | Existing PostgreSQL (remote access available) |
| **Hosting** | Railway (auto-deploy from GitHub) |
| **Auth** | Google OAuth 2.0 → JWT |
| **Roles** | pending → viewer → editor → admin |

---

## Project Structure

```
execution-viewer/
├── CLAUDE.md                 # Instructions for Claude Code
├── package.json              # Root: dev/build/start scripts
├── tsconfig.json             # TS config for server
├── .env.example              # Environment variables template
├── .gitignore
├── railway.json              # Railway deploy config
│
├── server/
│   ├── index.ts              # Express entry point
│   ├── config.ts             # Env variables loader
│   ├── db/
│   │   ├── pool.ts           # pg Pool connection
│   │   ├── migrate.ts        # Migration runner script
│   │   └── migrations/
│   │       └── 001_create_users_table.sql
│   ├── middleware/
│   │   ├── auth.ts           # JWT verification
│   │   ├── requireRole.ts    # Role checking
│   │   └── errorHandler.ts
│   ├── routes/
│   │   ├── auth.ts           # Google OAuth endpoints
│   │   ├── executions.ts     # Execution data endpoints
│   │   └── admin.ts          # User management endpoints
│   └── services/
│       ├── auth.service.ts
│       ├── execution.service.ts
│       └── user.service.ts
│
├── client/
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── api/
│       │   └── client.ts
│       ├── hooks/
│       │   ├── useAuth.ts
│       │   └── useExecutions.ts
│       ├── contexts/
│       │   └── AuthContext.tsx
│       ├── pages/
│       │   ├── LoginPage.tsx
│       │   ├── PendingApprovalPage.tsx
│       │   ├── ViewerPage.tsx
│       │   └── AdminPage.tsx
│       ├── components/
│       │   ├── layout/
│       │   │   ├── Header.tsx
│       │   │   ├── Sidebar.tsx
│       │   │   └── InfoBar.tsx
│       │   ├── canvas/
│       │   │   ├── Canvas.tsx
│       │   │   ├── CanvasNode.tsx
│       │   │   ├── CanvasConnection.tsx
│       │   │   └── ZoomControls.tsx
│       │   ├── node-detail/
│       │   │   ├── NodeDetailPanel.tsx
│       │   │   ├── InputPanel.tsx
│       │   │   ├── OutputPanel.tsx
│       │   │   ├── ParametersTab.tsx
│       │   │   ├── SettingsTab.tsx
│       │   │   └── JsonViewer.tsx
│       │   ├── node-renderers/
│       │   │   ├── index.ts
│       │   │   ├── WebhookRenderer.tsx
│       │   │   ├── HttpRequestRenderer.tsx
│       │   │   ├── CodeRenderer.tsx
│       │   │   ├── IfRenderer.tsx
│       │   │   ├── OpenAiRenderer.tsx
│       │   │   └── GenericRenderer.tsx
│       │   ├── execution-list/
│       │   │   ├── ExecutionList.tsx
│       │   │   └── ExecutionItem.tsx
│       │   └── admin/
│       │       ├── UserTable.tsx
│       │       └── RoleSelect.tsx
│       ├── utils/
│       │   ├── nodeIcons.ts
│       │   ├── connectionPath.ts
│       │   ├── formatters.ts
│       │   └── constants.ts
│       └── styles/
│           ├── globals.css
│           ├── canvas.css
│           └── node-detail.css
│
└── docs/
    ├── original-html.txt         # Current HTML for reference
    └── original-workflow.json    # n8n workflow JSON for reference
```

---

## Commands

- `npm run dev` — start dev (server + client in parallel via concurrently)
- `npm run dev:server` — start server only
- `npm run dev:client` — start client only
- `npm run build` — production build
- `npm start` — run production server
- `npm run db:migrate` — run database migrations

---

## Rules

### Backend (server/)

- Routes in `server/routes/`, business logic in `server/services/`
- All API routes protected by `auth` middleware (JWT) + `requireRole`
- SQL: ONLY parameterized queries ($1, $2). Never use string concatenation
- Errors go through errorHandler middleware
- Do NOT modify the `errors_executions` table — it is READ ONLY

### Frontend (client/src/)

- Components in `components/`, pages in `pages/`
- API calls via `api/client.ts` (with credentials: include)
- Styles: CSS files in `styles/`, CSS variables from globals.css
- API URLs: only relative (`/api/...`), never hardcode domains
- State: React Context + useState/useReducer. No Redux.

### Data

- `errors_executions` — n8n table, READ ONLY. Fields: execution_id, workflow_id, execution (jsonb)
- `app_users` — our users table
- execution.data may be a string (needs JSON.parse) or an object
- Workflow snapshot: execution.workflowData

### Canvas

- Positioning via CSS transform (translate + scale), NOT canvas element
- Connections: SVG path (bezier/orthogonal)
- Pan: drag on empty canvas. Zoom: Ctrl+wheel

### Node Renderers

- Each node type — separate file in `components/node-renderers/`
- Fallback: GenericRenderer for unknown types
- Icons: `utils/nodeIcons.ts` (SVG strings keyed by node type)

---
---

# STEP-BY-STEP IMPLEMENTATION

Each step is marked:
- **MANUAL** — do it yourself (cannot be automated)
- **CLAUDE CODE** — copy the prompt into Claude Code

---

## Step 1 — Repository Setup

### MANUAL:

1. Clone the repo locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/execution-viewer.git
   cd execution-viewer
   ```

2. Make sure Node.js is installed (version 18+):
   ```bash
   node --version
   ```

3. Place two reference files in the project root:
   - `docs/original-workflow.json` — your n8n workflow JSON
   - `docs/original-html.txt` — your current HTML viewer

4. Open Claude Code in this directory.

---

## Step 2 — Project Skeleton

### CLAUDE CODE — copy this prompt:

```
Read CLAUDE.md if it exists. Then create the project skeleton:

1. Root package.json:
   - name: execution-viewer
   - scripts: dev, dev:server, dev:client, build, start, db:migrate
   - dependencies: express, cors, pg, jsonwebtoken, google-auth-library, dotenv, cookie-parser
   - devDependencies: typescript, tsx, @types/express, @types/pg, @types/jsonwebtoken,
     @types/cookie-parser, @types/cors, concurrently, nodemon

2. tsconfig.json for server (target: ES2022, outDir: dist)

3. server/index.ts:
   - Express server on PORT from env (default 3000)
   - GET /api/health → { status: 'ok', timestamp }
   - In production: serve static files from client/dist/
   - For any GET not matching /api/* → serve client/dist/index.html (SPA fallback)

4. server/config.ts:
   - Load dotenv, export all env variables with defaults

5. client/ — initialize Vite + React + TypeScript:
   - vite.config.ts with proxy: '/api' → 'http://localhost:3000' (for dev mode)
   - src/main.tsx, src/App.tsx (empty with text "Execution Viewer")
   - index.html

6. .env.example:
   DATABASE_URL=postgresql://user:pass@host:5432/dbname
   GOOGLE_CLIENT_ID=
   GOOGLE_CLIENT_SECRET=
   JWT_SECRET=change-me-to-random-string
   ADMIN_EMAIL=your-email@gmail.com
   PORT=3000
   NODE_ENV=development

7. .gitignore: node_modules, dist, .env, *.log

8. railway.json:
   {
     "$schema": "https://railway.app/railway.schema.json",
     "build": { "builder": "NIXPACKS" },
     "deploy": {
       "startCommand": "npm start",
       "healthcheckPath": "/api/health",
       "restartPolicyType": "ON_FAILURE"
     }
   }

Make sure `npm run dev` starts both server and client via concurrently.
Make sure `npm run build && npm start` builds the client and runs production.
```

### MANUAL — after completion:

```bash
npm install
cp .env.example .env
# Fill in DATABASE_URL in .env (the rest can wait)
npm run dev
# Open http://localhost:5173 — should see "Execution Viewer"
# Open http://localhost:3000/api/health — should see { status: 'ok' }
```

If it works:
```bash
git add -A
git commit -m "feat: project skeleton"
git push
```

**Railway will auto-rebuild. Wait ~2 minutes. You'll get a URL like `xxx.up.railway.app`. Note it down.**

---

## Step 3 — Database: Connection + Migration

### CLAUDE CODE:

```
Create PostgreSQL connection and user migration:

1. server/db/pool.ts:
   - Create pg Pool from DATABASE_URL
   - On startup verify connection (pool.query('SELECT NOW()'))
   - Log "Database connected" or error

2. server/db/migrations/001_create_users_table.sql:
   CREATE TABLE IF NOT EXISTS app_users (
       id            SERIAL PRIMARY KEY,
       google_id     VARCHAR(255) UNIQUE NOT NULL,
       email         VARCHAR(255) UNIQUE NOT NULL,
       name          VARCHAR(255),
       avatar_url    TEXT,
       role          VARCHAR(20) DEFAULT 'pending'
                     CHECK (role IN ('pending', 'viewer', 'editor', 'admin')),
       created_at    TIMESTAMPTZ DEFAULT NOW(),
       updated_at    TIMESTAMPTZ DEFAULT NOW()
   );

3. server/db/migrate.ts:
   - Read all .sql files from migrations/ in order
   - Execute each one
   - Log the result

4. Update server/index.ts — on startup call database connection check.

5. Update package.json: "db:migrate": "tsx server/db/migrate.ts"
```

### MANUAL — after completion:

```bash
# Make sure DATABASE_URL in .env points to your PostgreSQL
npm run db:migrate
# Should output: "Migration 001_create_users_table.sql applied"
npm run dev
# Console should show: "Database connected"
```

If it works — commit and push.

---

## Step 4 — Google OAuth: Create Credentials

### MANUAL (entirely, cannot be automated):

1. Go to https://console.cloud.google.com
2. Create a new project (or select an existing one)
3. Left menu: **APIs & Services → OAuth consent screen**
   - User type: External
   - App name: "n8n Execution Viewer"
   - Support email: your email
   - Scopes: email, profile, openid
   - Test users: add your email
   - Save
4. Left menu: **APIs & Services → Credentials**
   - Create Credentials → OAuth 2.0 Client ID
   - Application type: **Web application**
   - Name: "Execution Viewer"
   - Authorized JavaScript origins:
     - `http://localhost:5173` (for local development)
     - `https://YOUR-URL.up.railway.app` (from Step 2)
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/google/callback`
     - `https://YOUR-URL.up.railway.app/api/auth/google/callback`
   - Click **Create**
5. Copy **Client ID** and **Client Secret**

6. Update `.env`:
   ```
   GOOGLE_CLIENT_ID=xxxxxxxxxxxx.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxx
   ADMIN_EMAIL=your-google-email@gmail.com
   JWT_SECRET=generate-a-random-string-at-least-32-chars
   ```

7. Update variables in **Railway dashboard**:
   - Go to your project at railway.app
   - Variables → add all from .env (DATABASE_URL, GOOGLE_CLIENT_ID, etc.)

---

## Step 5 — Auth: Backend

### CLAUDE CODE:

```
Implement Google OAuth authentication on the backend. Read CLAUDE.md for context.

1. server/services/auth.service.ts:
   - Function verifyGoogleToken(idToken): verify via google-auth-library (OAuth2Client)
   - Extract: googleId, email, name, picture
   - Return user data

2. server/services/user.service.ts:
   - findByGoogleId(googleId): search in app_users
   - findByEmail(email): search in app_users
   - createUser({ googleId, email, name, avatarUrl }): create with role='pending'
   - updateRole(userId, role): update role
   - getAllUsers(): list all users
   - deleteUser(userId): delete user
   - On creation: if email === ADMIN_EMAIL from env → set role='admin' immediately

3. server/routes/auth.ts:
   - POST /api/auth/google — accepts { idToken } in body
     → verify token
     → find or create user
     → if role === 'pending' → return { status: 'pending', user }
     → if role is active → create JWT, set httpOnly cookie 'token', return { status: 'ok', user }
   - GET /api/auth/me — read JWT from cookie 'token'
     → return current user or 401
   - POST /api/auth/logout — clear cookie 'token'

4. server/middleware/auth.ts:
   - Read JWT from cookie 'token'
   - Verify via jsonwebtoken
   - Attach user to req.user
   - If no token or invalid → 401

5. server/middleware/requireRole.ts:
   - Accept an array of allowed roles
   - Check req.user.role
   - If no access → 403

6. Update server/index.ts:
   - Add cookie-parser
   - Add cors with credentials: true
   - Mount auth routes

JWT payload: { userId, email, role }
JWT expiry: 7 days
Cookie: httpOnly, secure in production, sameSite: 'lax', maxAge: 7 days
```

### MANUAL — after completion:

```bash
npm run dev
# Verify: GET http://localhost:3000/api/auth/me → should return 401
```

Commit and push.

---

## Step 6 — Auth: Frontend

### CLAUDE CODE:

```
Create the frontend authentication flow. Read CLAUDE.md for context.

1. client/src/api/client.ts:
   - Functions apiGet(url), apiPost(url, body) — wrappers over fetch
   - Automatically include credentials: 'include' (for cookies)
   - On 401 → redirect to /login

2. client/src/contexts/AuthContext.tsx:
   - Stores: user (or null), isLoading, isAuthenticated
   - On mount: call GET /api/auth/me
   - Function login(idToken): POST /api/auth/google → update state
   - Function logout(): POST /api/auth/logout → clear state

3. client/src/pages/LoginPage.tsx:
   - "Sign in with Google" button — use Google Identity Services (GSI)
   - Load script https://accounts.google.com/gsi/client
   - google.accounts.id.initialize with client_id from VITE_GOOGLE_CLIENT_ID
   - Callback receives credential (id_token) → calls login(credential)
   - Dark theme matching current viewer style (var(--bg-dark), etc.)
   - Centered: logo/title + Google button

4. client/src/pages/PendingApprovalPage.tsx:
   - Text: "Your account is pending administrator approval"
   - Shows user's email
   - "Logout" button → logout()
   - Dark theme

5. client/src/App.tsx with react-router-dom:
   - /login → LoginPage (unauthenticated only)
   - /pending → PendingApprovalPage (only for role=pending)
   - /viewer → ViewerPage (for viewer/editor/admin) — stub for now
   - /admin → AdminPage (admin only) — stub for now
   - / → redirect to /viewer if authenticated, otherwise /login
   - Automatic redirect by role after login

6. Update client/vite.config.ts:
   - Use import.meta.env.VITE_GOOGLE_CLIENT_ID

7. Create client/.env.example:
   VITE_GOOGLE_CLIENT_ID=xxxxxxxxxxxx.apps.googleusercontent.com

Styles: use CSS variables from the current viewer (dark theme):
--bg-dark: #1a1a1a, --bg-darker: #141414, --text: #f5f5f5, --accent: #7c5cfc
```

### MANUAL — after completion:

```bash
# Create client/.env with VITE_GOOGLE_CLIENT_ID=your-client-id
npm run dev
# Open http://localhost:5173
# Should see login page with Google button
# Sign in — if you're ADMIN_EMAIL, you'll land on /viewer (stub)
# If another email — you'll land on /pending
```

Commit and push. After Railway deploy — verify login works there too.

---

## Step 7 — Admin Panel

### CLAUDE CODE:

```
Create the admin panel for user management.

1. server/routes/admin.ts:
   - GET /api/admin/users — list all users (admin only)
     Sort: pending first, then by created_at desc
   - PATCH /api/admin/users/:id — change role { role: 'viewer'|'editor'|'admin' }
     Cannot change own role
     Only admin can change roles
   - DELETE /api/admin/users/:id — delete user
     Cannot delete self

   All endpoints protected: auth + requireRole(['admin'])

2. Mount admin routes in server/index.ts

3. client/src/pages/AdminPage.tsx:
   - Title "User Management"
   - "Pending Approval" section — cards for pending users:
     Avatar, name, email, registration date
     Buttons: "Approve as Viewer" (green), "Approve as Editor", "Reject" (red)
   - "Active Users" section — table:
     Avatar, name, email, role (dropdown select), date
     Delete button (with confirmation)
   - Dark theme, use styles from current viewer

4. client/src/components/admin/UserTable.tsx — active users table
5. client/src/components/admin/RoleSelect.tsx — role change dropdown

6. In Header.tsx (when created) or in App.tsx:
   - If admin — show link to /admin
   - Badge with pending user count
```

### MANUAL — after completion:

```bash
npm run dev
# Open http://localhost:5173/admin
# Should see user management page with user table
# Try approving a test user
```

Commit and push.

---

## Step 8 — Executions API (Port Logic from n8n)

### CLAUDE CODE:

```
Port the execution data retrieval logic from the n8n workflow to TypeScript.
Study docs/original-workflow.json to understand the current logic.

1. server/services/execution.service.ts:

   Function getExecutionList(workflowId, offset=0, limit=500):
   - SQL: SELECT * FROM errors_executions WHERE workflow_id = $1 ORDER BY id DESC LIMIT $2 OFFSET $3
   - For each row: extract from the `execution` field:
     id, status (success/error), mode, startedAt, stoppedAt, workflowId
   - Calculate duration = stoppedAt - startedAt
   - workflowName from execution.workflowData.name
   - Return: { success, workflowName, count, executions[] }

   Function getExecutionDetails(executionId):
   - SQL: SELECT * FROM errors_executions WHERE execution_id = $1 LIMIT 1
   - If not found → throw NotFoundError
   - Parse execution.data (may be a string — then JSON.parse)
   - workflow = execution.workflowData
   - runData = execution.data.resultData.runData
   - Determine overall status: success/error/running

   - Process nodes: for each node from workflow.nodes:
     - Find its runs in runData[node.name]
     - Last run: lastRun = runs[runs.length - 1]
     - status: error if lastRun.error, success if hasRun, otherwise not-executed
     - outputData: lastRun.data.main
     - outputCount: sum of array lengths in outputData
     - inputSources: lastRun.source
     - Return: { id, name, type, typeVersion, position, parameters, status,
         hasRun, hasError, error, startTime, executionTime, inputSources, outputData, outputCount }

   - Process connections: for each connection from workflow.connections
     - Find fromNode and toNode by name
     - Count itemCount from runData
     - Return: { from, fromName, to, toName, fromPort, toPort, itemCount }

   - Stats: totalNodes, executedNodes, errorNodes

   Final response: { success, executionId, workflowId, workflowName, status,
     mode, startedAt, stoppedAt, error, stats, nodes, connections, execution: { id, data } }

   THIS LOGIC EXACTLY REPLICATES "Format Details Response" from the n8n workflow.
   Look at docs/original-workflow.json — the "Format Details Response" node contains
   the original JavaScript code. Port the logic 1:1, but in TypeScript with types.

2. server/routes/executions.ts:
   - GET /api/executions?workflow_id=&execution_id=&offset=&limit=
     Protected: auth + requireRole(['viewer', 'editor', 'admin'])
   - GET /api/executions/:id
     Protected: auth + requireRole(['viewer', 'editor', 'admin'])

3. Mount executions routes in server/index.ts
```

### MANUAL — after completion:

```bash
npm run dev
# Test API via browser or curl (must be logged in):
# GET /api/executions?workflow_id=YOUR_WORKFLOW_ID
# GET /api/executions/SOME_EXECUTION_ID
# Compare results with what the n8n viewer returned
```

Commit and push.

---

## Step 9 — Frontend: Layout + Sidebar + ExecutionList

### CLAUDE CODE:

```
Start building the main viewer UI. Use docs/original-html.txt as a style
and structure reference. Read CLAUDE.md.

1. client/src/styles/globals.css:
   Port ALL CSS variables from :root in the current HTML.
   Port base styles: body, *, fonts.

2. client/src/components/layout/Header.tsx:
   - Logo/title on the left
   - Breadcrumb: Executions > Workflow Name > Execution ID (as user navigates)
   - Right side: username + avatar + Logout button
   - If admin: link to /admin + pending count badge
   - Styles from /* ===== HEADER ===== */ section of the current HTML

3. client/src/components/layout/Sidebar.tsx:
   - Input fields: Workflow ID, Execution ID
   - Search button
   - Contains ExecutionList

4. client/src/components/execution-list/ExecutionList.tsx + ExecutionItem.tsx:
   - List of executions
   - Each item: status (colored dot), execution ID, time, duration
   - Click → loads details
   - Pagination (Load More)

5. client/src/components/layout/InfoBar.tsx:
   - Bar above canvas: Workflow Name, Execution ID, Status, Duration, Started At
   - Styles from /* ===== INFO BAR ===== */

6. client/src/pages/ViewerPage.tsx:
   - Layout: Header on top, Sidebar on left (260px), InfoBar + Canvas on the right
   - State: workflowId, executions[], currentExecId, currentExecData
   - On search: call GET /api/executions?workflow_id=...
   - On execution click: call GET /api/executions/:id

7. client/src/hooks/useExecutions.ts:
   - fetchList(workflowId, offset, limit)
   - fetchDetails(executionId)
   - loading states

Canvas is an empty container with text "Select an execution" for now.
```

### MANUAL — after completion:

```bash
npm run dev
# Should see layout: header, sidebar with search, empty canvas
# Enter workflow_id → execution list should appear
# Click an execution → InfoBar should update
```

Commit and push.

---

## Step 10 — Frontend: Canvas (Nodes + Connections)

### CLAUDE CODE:

```
Implement the canvas with node and connection rendering. Use docs/original-html.txt
as reference — sections CANVAS, NODES, functions renderCanvas, renderNodes,
renderConnections, generateConnectionPath, generateBezierPath, generateOrthogonalPath.

1. client/src/utils/nodeIcons.ts:
   Port the NODE_ICONS object from the current HTML — all SVG strings by node type.
   Also port the getNodeIcon(type) function.

2. client/src/utils/connectionPath.ts:
   Port functions:
   - generateConnectionPath(sourceX, sourceY, targetX, targetY)
   - generateBezierPath(sourceX, sourceY, targetX, targetY)
   - generateOrthogonalPath(sourceX, sourceY, targetX, targetY)
   - getConnectionMidpoint(sourceX, sourceY, targetX, targetY)

3. client/src/utils/formatters.ts:
   - calcDuration(start, end) → string "1.2s" or "45.3s"
   - escapeHtml(str)
   - formatDate(iso)

4. client/src/components/canvas/Canvas.tsx:
   - Container with pan (mousedown+mousemove) and zoom (wheel, ctrl+wheel)
   - State: zoom, panX, panY, isPanning
   - Transform: translate(panX, panY) scale(zoom)
   - SVG layer for connections + div layer for nodes
   - Port logic from initCanvas() of the current HTML

5. client/src/components/canvas/CanvasNode.tsx:
   - Props: node data (name, type, status, position, outputCount, ports)
   - Renders node card: icon, name, status color, input/output ports
   - Height depends on port count (getNodeHeight)
   - Click → opens node detail
   - Styles from /* ===== NODES ===== */

6. client/src/components/canvas/CanvasConnection.tsx:
   - Props: from position, to position, itemCount, status
   - SVG path between ports
   - Badge with itemCount at path midpoint
   - Color depends on status (success=green, error=red, grey=not executed)

7. client/src/components/canvas/ZoomControls.tsx:
   - Buttons: +, -, Reset, Fit
   - zoomToFit() — calculate bounds of all nodes and adjust zoom/pan

8. client/src/styles/canvas.css:
   Port styles from /* ===== CANVAS ===== */, /* ===== NODES ===== */,
   /* ===== ZOOM CONTROLS ===== */ of the current HTML.

9. Update ViewerPage: when execution details are loaded → pass nodes and
   connections to Canvas.
```

### MANUAL — after completion:

```bash
npm run dev
# Select an execution → nodes and connections should appear on canvas
# Test: pan (drag), zoom (ctrl+scroll), zoom buttons
# Verify: nodes show correct icons, statuses, item counts
```

Commit and push.

---

## Step 11 — Frontend: Node Detail Panel

### CLAUDE CODE:

```
Implement the node detail panel. Use docs/original-html.txt as reference —
section NODE DETAIL MODAL, functions openNodeDetail, updateInputPanel,
updateOutputPanel, renderParametersTab, renderSettingsTab.

1. client/src/components/node-detail/NodeDetailPanel.tsx:
   - Three-column overlay (like in the current HTML)
   - Left: InputPanel
   - Center: Parameters/Settings tabs
   - Right: OutputPanel
   - Close button
   - Resizable panels (drag resize between columns)

2. client/src/components/node-detail/InputPanel.tsx:
   - Title "INPUT" + source node dropdown
   - Run selector (if multiple runs)
   - Input JSON data — via JsonViewer
   - Buttons: Copy, Search
   - Port logic from updateInputPanel() and renderInputRun()

3. client/src/components/node-detail/OutputPanel.tsx:
   - Title "OUTPUT" + item count
   - Run selector
   - Tabs: JSON / Table
   - Output JSON data — via JsonViewer
   - Buttons: Copy, Search
   - Port logic from updateOutputPanel() and renderOutputRun()

4. client/src/components/node-detail/JsonViewer.tsx:
   - Recursive React component (NOT string-based HTML generation!)
   - Collapsible objects and arrays
   - Syntax highlighting: keys, strings, numbers, booleans, null
   - Colors from CSS variables: --json-key, --json-string, --json-number, etc.
   - Clickable arrows for fold/unfold
   - Port logic from renderCollapsibleJson() and toggleJsonBlock()

5. client/src/components/node-detail/ParametersTab.tsx:
   - Display node parameters in n8n UI style
   - Use node-renderers for type-specific display

6. client/src/components/node-detail/SettingsTab.tsx:
   - Port renderSettings() from the current HTML

7. client/src/styles/node-detail.css:
   Port styles from /* ===== NODE DETAIL MODAL ===== */
   and /* ===== N8N NODE RENDERER STYLES ===== */

8. Update CanvasNode: click → opens NodeDetailPanel with that node's data.
```

### MANUAL — after completion:

```bash
npm run dev
# Click a node on canvas → detail panel should open
# Verify: Input data, Output data, Parameters, Settings
# Verify: JSON folds/unfolds, Copy works
```

Commit and push.

---

## Step 12 — Node Renderers (Type-Specific)

### CLAUDE CODE:

```
Port the type-specific parameter renderers from docs/original-html.txt.
These are functions renderWebhook, renderHttpRequest, renderOpenAi, renderExecWorkflow,
renderExecWfTrigger, renderIf, renderSet, renderCode, and helpers.

1. client/src/components/node-renderers/index.ts:
   - Export function getRenderer(nodeType) → corresponding component
   - Fallback: GenericRenderer

2. Create a separate file for each renderer:
   - WebhookRenderer.tsx — from renderWebhook()
   - HttpRequestRenderer.tsx — from renderHttpRequest()
   - OpenAiRenderer.tsx — from renderOpenAi()
   - CodeRenderer.tsx — from renderCode()
   - IfRenderer.tsx — from renderIf()
   - SetRenderer.tsx — from renderSet()
   - ExecuteWorkflowRenderer.tsx — from renderExecWorkflow()
   - ExecuteWorkflowTriggerRenderer.tsx — from renderExecWfTrigger()
   - GenericRenderer.tsx — from renderParamObj() (generic fallback)

3. Also port helper functions as React components or utilities:
   - renderToggle → ToggleField component
   - renderDropdown → DropdownField component
   - renderCredField → CredentialField component
   - renderSplitSel → SplitSelectField component
   - renderKVPairs → KeyValuePairs component
   - renderExpr → ExpressionField component
   - renderConditions → ConditionsBlock component
   - renderMessages → MessagesBlock component

4. Styles should replicate the n8n UI from /* ===== N8N NODE RENDERER STYLES ===== */

5. Update ParametersTab.tsx: use getRenderer(node.type) for rendering.
```

### MANUAL — after completion:

```bash
npm run dev
# Open details for different node types: Webhook, Code, If, HTTP Request
# Parameters should render in n8n style (fields, toggles, dropdowns)
```

Commit and push.

---

## Step 13 — Final Build + Deploy

### MANUAL:

1. Verify everything works locally:
   ```bash
   npm run build
   npm start
   # Open http://localhost:3000 — everything should work
   ```

2. Push to GitHub:
   ```bash
   git add -A
   git commit -m "feat: complete viewer migration"
   git push
   ```

3. Railway will pick up automatically. Verify:
   - `https://YOUR-URL.up.railway.app` — login works
   - Google OAuth → redirect is correct
   - Execution viewer works
   - Admin panel works

4. If you need a custom domain — in Railway: Settings → Custom Domain

---
---

# Appendix: Environment Variables for Railway

When the project is deployed, in Railway dashboard → Variables, add:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | `postgresql://user:pass@host:5432/dbname` |
| `GOOGLE_CLIENT_ID` | From Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | From Google Cloud Console |
| `JWT_SECRET` | Random string 32+ characters |
| `ADMIN_EMAIL` | Your Google email |
| `NODE_ENV` | `production` |
| `PORT` | `3000` (Railway usually sets this automatically) |
