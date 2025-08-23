
## project overview

**shipnotes.dev** - a saas that transforms github commits into beautiful, customer-friendly release notes. automatically generates professional change logs (what we call ship notes) from commit history using AI, eliminating the manual effort of writing release notes and keeping customers informed about product updates.

**target users:** indie saas developers and small development teams (1-50 people) who want to keep customers informed about product updates without the manual overhead of writing release notes.

**main problem:** saas companies struggle to communicate product updates to customers. writing release notes manually takes hours and often gets skipped, leading to poor customer awareness of new features and increased churn.

**unique value:** "turn your commits into customer communications in less than (<) 30 seconds". fully automated release note generation from existing developer workflow (GitHub commits) with instant publishing and distribution.

## technical stack

- **database:** MongoDB Atlas with Mongoose
- **frontend/backend:** Next.js 15.4 with app router
- **authentication:** NextAuth.js with GitHub OAuth
- **styling:** Tailwind CSS + DaisyUI components
- **AI provider:** OpenAI GPT-4o for release note generation
- **deployment:** Vercel
- **APIs:** GitHub Rest API (using axios for all API calls)
- **alerts and messages**: react hot toast

## styling approach

**main headings:**

- DaisyUI hero text classes
- bold, clear hierarchy
- use "raleway" font: `font-raleway font-black tracking-tighter text-4xl`

**sub headings:**

- secondary text with proper spacing
- consistent font weights
- use "raleway" font: `font-raleway font-bold text-xl tracking-tighter`

**body text**

- customer-facing content use "lora" - `font-lora tracking-tighter opacity-80 text-neutral`
- technical/developer content use "space mono" - `font-space tracking-tighter text-sm opacity-60 text-neutral`
- code snippets and commit messages use "space mono" - `font-space tracking-tighter opacity-80 text-neutral`

**color palette:**

- primary: for main CTAs and branding
- neutral: for main texts and borders
- secondary: for less important actions
- success: for published status
- error: for any errors
- base-100 and base-200: for backgrounds

**misc note:**

- sections must be wrapped in borders `border boder-1 border-neutral rounded-sm`
- no shadows
- no gradients
- design like bento boxes is brand appropriate
- make full utilisation of DaisyUI library
- lowercase text, until absolutely necessary (e.g. proper nouns)

**components:**

- consistent naming: TypeComponentName.js... here are examples:
	- SectionHero.js
	- FormPublishLog.js
	- ButtonLogout.js
	- ButtonBilling.js
- avoid repeating code and turn it into components
## features

### mvp features to build and ship

**GitHub integration**

- OAuth connection to GitHub account
- repository selection (1 per project - user can create multiple projects)
- fetch commits from repository part of project page
- basic user dashboard

**core functionality**

- user creates a project and links to their github repository
- fetch commits from selected time range (30 days)
- user selects code commits like a todo list
- ai-powered release note generation (customer-facing oriented format)
- simple text editor for editing generated notes
- one-click publish to hosted changelog

**publishing & distribution**

- hosted changelog page (`shipnotes.dev/[project]`)
- simple in-app widget (permanent bottom-left badge showing updates this month)
- widget redirects to hosted patch note page when clicked
- copy-paste widget installation code

**credit system**

- 5 free release note generations per new user (out of 20 free credits)
- credit deduction per generation
- request fill credit bar by booking a call with me (link to book call)
- no paywall.. just asking them to book a call
- if they show up... i will manually give them credits

**user management**

- user settings page
- repository and project management
- usage tracking (credits used/remaining)

## all user pages

### **landing page** (`/`)

- hero section explaining automated release notes
- feature highlights and benefits
- sign up with github cta

### **authentication page** (`/auth`)

- github oauth login
- account creation flow
- redirect handling after login

### **dashboard** (`/dashboard`)

- project selection
- recent commits display
- published release notes history
- credit usage display

### project page (`/project/[project]`)

- select commit range (commit selection)
- preview fetched commits
- generate release notes with AI
- widget code generator
- widget customisation

### **release note editor** (`/edit/[noteid]`)

- rich text editor for release notes
- preview customer-facing format
- save as draft or publish

### **hosted change log** (`/[project]`)

- public-facing change log page
- clean, professional design
- chronological release notes

### **settings page** (`/settings`)

- account information
- repository management
- credit status and add credits button (to book call link)

## user flow

### onboarding flow

1. user lands on homepage
2. clicks "sign up with GitHub"
3. GitHub OAuth authorisation
4. dashboard with option to create first project
5. create project → name project + select repository
6. project page with repository connected

### daily usage flow

1. user opens dashboard
2. selects specific project or creates a new one
3. goes to project page
4. selects commits from the last 30 days (todo list style)
5. clicks "generate release notes"
6. AI generates customer-friendly release notes
7. user edits if needed in editor
8. one-click publish to hosted change log
9. copy widget code to integrate into their SaaS (one time setup)

### widget integration flow

1. user publishes release notes for a project
2. copies provided widget script from project page
3. pastes into their saas application
4. widget appears showing message "X new updates this month" for that project
5. users click widget → redirects to change log `shipnotes.dev/[projectSlug]`

## database schema

### users collection

```javascript
{
  _id: ObjectId,
  githubUsername: String,
  githubUserId: String,
  githubProfilePicture: String,
  githubAccessToken: String, // Encrypted
  email: String,
  credits: Number, // 20 total, 5 free generations used
  createdAt: Date,
  updatedAt: Date
}
```

### projects collection

```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  projectName: String, // User-defined project name
  projectSlug: String, // URL-friendly slug for shipnotes.dev/[projectSlug]
  repository: String, // "owner/repo"
  repositoryUrl: String, // Full GitHub URL
  description: String, // Optional project description
  isActive: Boolean, // Can be disabled/enabled
  createdAt: Date,
  updatedAt: Date
}
```

### patch notes collection

```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  projectId: ObjectId, // Reference to Projects collection
  title: String,
  content: String, // Markdown content
  version: String, // Optional version number
  publishedAt: Date,
  commits: Array, // Array of commit hashes included
  status: String, // "draft", "published"
  viewCount: Number, // For analytics
  createdAt: Date,
  updatedAt: Date
}
```

## GitHub API integration

### required endpoints

- `GET /repos/{owner}/{repo}/commits` - fetch commit history
- `GET /repos/{owner}/{repo}` - repository information
- `GET /user/repos` - user's accessible repositories

### required permissions

- read access to repositories
- access to commit history
- user profile information
- done via GitHub access tokens (during OAuth)

### API strategy

- fetch commits based on date range (30 days)
- focus on main/master branch

## AI integration

### OpenAI configuration

- model: GPT-4o
- purpose: release note generation from commit data

### prompt structure

```
context: GitHub commits from [repository] between [date range]
task: generate customer-friendly release notes, don't assume anything
format: professional changelog format with sections
tone: clear, engaging, focused on user benefits
commit data: [commit messages, files changed, pr titles]
```

### content processing

- filter out internal/technical commits
- group related changes together
- highlight user-facing improvements
- generate appropriate section headers

## development style

### file structure

```
/app
  /(auth)
    /auth/page.js
  /dashboard/page.js
  /project/[projectSlug]/page.js
  /edit/[noteId]/page.js
  /[projectSlug]/page.js  # Public changelog
  /settings/page.js
  /api
    /auth/[...nextauth]/route.js
    /github/commits/route.js
    /github/repositories/route.js
    /openai/generate/route.js
    /projects/route.js
    /projects/[projectId]/route.js
    /patch-notes/route.js
    /patch-notes/[noteId]/route.js
    /patch-notes/[noteId]/view/route.js
    /feedback/route.js
    /user/credits/route.js
    /widget/[projectSlug]/route.js
  /components
    /ui
      /ConfirmModal.js
    /dashboard
      /DashboardClient.js
      /CreateProjectModal.js
      /DashboardCredits.js
      /RepositorySelector.js
    /project
      /CommitSelector.js
      /ProjectClient.js
      /ProjectSettings.js
      /ReleaseNotesManager.js
      /WidgetGenerator.js
    /editor
      /ReleaseNoteEditor.js
    /layout
      /Navbar.js
      /LogoutButton.js
    /changelog
      /PublicChangelog.js
    /feedback
      /FeedbackForm.js
    /settings
      /DeleteAccountButton.js

/lib
  /mongoose.js
  /github-api.js
  /toast.js

/models
  /User.js
  /Project.js
  /PatchNote.js
  /Feedback.js

/auth.js
```

### coding standards

- use "use client" directive only when necessary
- server components by default
- comprehensive error handling in all api routes
- typescript for type safety
- functional components with hooks
- comment purpose at top of each file and start of each function and section
- `<main></main>` tags for displaying content on page
- `<section></section>` tags for separating different content
- react hot toast - to display alerts and messages

### security considerations

- encrypt GitHub access tokens
- validate all user inputs
- secure auth check ins on respective pages
- proper NextAuth.js configuration

## environment variables

```bash
# database
MONGODB_URI=

# authentication
AUTH_SECRET=
AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=

# ai
OPENAI_API_KEY=

# app
NODE_ENV=development
NEXT_PUBLIC_APP_URL=https://shipnotes.dev
```

## credit system

- new users: 20 credits
- each generation: -1 credit
- pro users: credits = -1 (unlimited)
- wall at 0 credits
	- feedback form to reset credit bar back to 20 credits
	- form requires 3 questions with minimum 15 characters each
	- credits reset to exactly 20 regardless of current amount
	- user can submit feedback form anytime they have <20 credits

## widget implementation

### basic widget script

```html
<script>
fetch('https://shipnotes.dev/api/widget/[company]')
  .then(r => r.json())
  .then(data => {
    if(data.unread_count > 0) {
      showbadge(data.unread_count)
    }
  })
</script>
```

### widget features

- shows unread release notes count
- fixed position bottom-right
- clicking redirects to hosted change log
- minimal css to avoid conflicts (text + SVG icon)
