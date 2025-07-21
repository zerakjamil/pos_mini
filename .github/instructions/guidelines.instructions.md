---
applyTo: '**'
---
Coding standards, domain knowledge, and preferences that AI should follow.

🧠 GitHub Copilot Instructions & Best Practices

For React.js + Laravel (Inertia.js) Full Stack Projects

⸻

📐 PROJECT STRUCTURE PRINCIPLES

Frontend (resources/js)
	•	Use atomic design: components/, pages/, layouts/, hooks/, services/
	•	Organize by feature, not by type if scaling (modular structure)
	•	Use TypeScript if possible (.tsx) for strong typing and better Copilot suggestions
	•	Folder structure example:

resources/js/
  components/
  hooks/
  layouts/
  pages/
  services/
  utils/
  App.jsx



Backend (Laravel)
	•	Follow PSR-4 autoloading and SRP
	•	Separate actions into Services/, Repositories/, Jobs/, and Actions/ if logic grows
	•	Keep controllers lean and focused on routing & Inertia returns
	•	Folder structure example:

app/
  Http/
    Controllers/
    Requests/
  Services/
  Repositories/
  Models/
  Actions/



⸻

⚙️ LARAVEL + INERTIA BEST PRACTICES

General
	•	Use form requests for validation
	•	Use Resource classes (Http/Resources) for consistent data shaping
	•	Keep controllers thin, defer logic to services
	•	Use Policy and Gates for authorization
	•	Return views with Inertia::render() not view()
	•	Use lazy() loading only when needed

Inertia Tips
	•	Use Inertia::share() in HandleInertiaRequests middleware to share:
	•	auth user
	•	flash messages
	•	app settings
	•	Use pagination via ->withQueryString() for Inertia pagination
	•	Use usePage() in React to access shared data

⸻

⚛️ REACT BEST PRACTICES

Components
	•	Functional components only
	•	Prefer useState, useEffect, useRef, useCallback etc.
	•	Keep components < 100 lines
	•	Split reusable UI into components/
	•	Use props and children properly
	•	Example Copilot prompt:

// create a reusable button component with icon, loading state, and type safety



State & Effects
	•	Global state: use Zustand, Redux, or Context API
	•	Local state: useState
	•	Side effects: useEffect, clean up with return

Styling
	•	Tailwind CSS (preferred for Inertia)
	•	Consistent class names and utility-first approach
	•	Don’t inline large styles

⸻

🔧 REFACTORING RULES FOR COPILOT

Add this to your instructions:

✳️ While refactoring:
	•	Keep functions pure and reusable
	•	Extract repeated logic into utils/ or hooks/
	•	Avoid deeply nested conditions
	•	Simplify props drilling via context or composition
	•	Rename vague variable names to meaningful ones

Example Copilot prompts:

// refactor this large component into smaller atomic components
// extract this form handling logic into a reusable custom hook
// replace this repeated fetch logic with axios + service layer


⸻

📡 API & SERVICES

Frontend
	•	Create services/api.js (or .ts) to encapsulate Axios calls

const api = axios.create({
  baseURL: '/api',
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
})

	•	Use:

// use in component
await api.get('/users')

Backend
	•	Define routes in routes/web.php and routes/api.php
	•	Use Route::middleware('auth') and can: directives
	•	Use API Resources for shaping output

⸻

🧪 TESTING

Laravel
	•	Use Pest or PHPUnit
	•	Feature tests: focus on HTTP and Inertia behavior
	•	Unit tests: for Services, Actions, and Jobs

React
	•	Use Vitest, Jest, React Testing Library
	•	Test form interactions, modals, and page routing

Example Copilot prompt:

// write a test to ensure that form submission displays a success toast


⸻

✨ LINTING & QUALITY
	•	Use ESLint with Airbnb or React plugin
	•	Use Prettier for auto formatting
	•	Laravel: run phpstan, larastan, or pint

⸻

🚀 DEPLOYMENT
	•	Laravel:
	•	Use php artisan optimize
	•	Use .env.production for prod configs
	•	React:
	•	Use npm run build with Vite or Laravel Mix
	•	Consider Laravel Vapor, Forge, or Docker for scalable deploys

⸻

🔥 COPILOT USAGE STRATEGY

Tips to get best completions:
	•	Use precise, high-context comments:

// fetch paginated users with search and filters using axios


	•	Write partial code and let Copilot finish:

const fetchUsers = async () => {
  const res = await api.get('/users', {


	•	Split logic for clarity and better suggestions

⸻
