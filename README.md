# ATR Foundation

ATR Foundation is a production-ready, premium internal web application built for **ATR Design Studio** to onboard new employees and assess their understanding of the company's technical design standards, botanical requirements, and landscape grading workflows.

## Design Philosophy

Inspired by professional landscape design and architecture software, ATR Foundation utilizes:
- **Earthy Palettes**: Soft greens (Sage), warm beiges/creams, and dark charcoal backgrounds (for both Light/Dark theme preferences).
- **Modern Typography**: Outfit (display headings) and Plus Jakarta Sans (body copy).
- **Subtle Details**: Rounded corners (`0.75rem`), smooth micro-animations, drop shadows, and high white-space margins to feel premium and professional.

---

## Technical Architecture

The project is structured as a **Modular Monolith** to separate business logic domains clearly while keeping deployment simple.

### Folder Structure

```
ATR/
├── docker-compose.yml           # Compose orchestration for DB, Backend, Frontend
├── package.json                 # Developer workflow orchestration scripts
├── requirements.txt             # Central Python package dependencies list
├── README.md                    # Core project documentation
│
├── backend/                     # FastAPI Service Container
│   ├── app/
│   │   ├── common/              # Global shared configs, constants, custom HTTP exceptions
│   │   ├── database/            # SQLAlchemy 2.0 DB engine, session maker, get_db injector
│   │   ├── auth/                # JWT and Google OAuth logic (placeholder)
│   │   ├── users/               # Profile management and creation operations
│   │   ├── modules/             # Learning path module catalogues
│   │   ├── resources/           # Standard library reference file managers
│   │   ├── quizzes/             # Multiple choice quiz questions and answers
│   │   ├── assessments/         # Quiz submissions, grading, and transcript records
│   │   ├── analytics/           # Compliance metrics and cohort matrices (Admin Only)
│   │   └── quiz_import/         # XML/JSON quiz question parsers (Admin Only)
│   ├── Dockerfile               # Multi-stage python container build definition
│   ├── requirements.txt         # Standalone backend requirements
│   ├── main.py                  # CLI entrypoint for uvicorn runtime execution
│   └── .env.example             # Template for API settings
│
└── frontend/                    # Vite + React 19 Frontend Client
    ├── src/
    │   ├── assets/              # Static media and brand assets
    │   ├── components/
    │   │   └── ui/              # Custom brand components (Button, Card, Input, Progress, Tabs)
    │   ├── contexts/            # Context API files (ThemeContext, AuthContext)
    │   ├── hooks/               # Custom reusable React hooks (useLocalStorage)
    │   ├── layouts/             # Page templates (MainLayout, AuthLayout)
    │   ├── pages/               # Routed pages (Dashboard, Modules, Quizzes, Resources, Admin, etc.)
    │   ├── services/            # API Clients (api.ts fetch client configuration)
    │   ├── types/               # TypeScript domain type definitions
    │   ├── utils/               # Common formatting utilities (cn.ts class-merging helper)
    │   ├── App.tsx              # Router mapping and client provider wrappers
    │   ├── index.css            # TailwindCSS v4 configurations and global custom style layers
    │   └── main.tsx             # DOM mounting configuration
    ├── Dockerfile               # Multi-stage Node/Nginx build configuration
    ├── nginx.conf               # Nginx router fallbacks setup
    ├── tsconfig.json            # Path alias configs (@/* pointing to src/*)
    └── .env.example             # Template for client api server variables
```

---

## Local Setup & Development

Ensure you have [Python 3.12](https://www.python.org/) and [Node.js v20](https://nodejs.org/) installed locally.

### 1. Run via Docker Compose (Recommended)

Start the entire system including the PostgreSQL database container with one command from the root directory:

```bash
npm run docker:up
```

- **Frontend Client**: Access at `http://localhost` (Port 80)
- **API Swagger Docs**: Access at `http://localhost:8000/docs`

### 2. Manual Startup

#### Backend (FastAPI)

1. Create a virtual environment and activate it:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Setup variables:
   ```bash
   cp .env.example .env
   ```
4. Start development server:
   ```bash
   python main.py
   ```
   API will run at `http://localhost:8000`

#### Frontend (React + Vite)

1. Go to frontend directory and install packages:
   ```bash
   cd frontend
   npm install
   ```
2. Setup variables:
   ```bash
   cp .env.example .env
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   Client will run at `http://localhost:5173`

---

## Testing Workflows in Foundation Mode

Since this is the **foundation phase** of the project:
1. **Database & Real Database Models**: Not yet implemented. Data is simulated via service layer stubs.
2. **Authentication**: Fully bypassed to allow testing.
3. **Role Switcher Bar**: We built a utility bar at the top of the frontend client. You can instantly toggle between:
   - **Employee View (Sarah Chen)**: To test learning modules progress tracker, taking a quiz with immediate grading, reading standard blueprints, and checking your grades transcript.
   - **Admin View (Marcus Vance)**: To test the system compliance metrics dashboard, the cohort progress matrix, and the drag-and-drop XML/JSON quiz parser.
