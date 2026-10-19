# CampusEvents – University Event & Society Management System

CampusEvents digitizes the entire university event lifecycle:
1. **Propose**: Society proposes event with venue & capacity limits
2. **Approve**: Admin inspects timetable conflicts, approves or rejects with reason
3. **Publish**: Approved event is published immediately to campus calendar
4. **Register**: Students register with real-time seat availability and auto-closure
5. **Attendance**: Society organizers mark digital attendance at the venue entrance
6. **Feedback**: Attendees submit quality ratings and reviews
7. **Certificate**: System issues verified digital participation certificates

---

## 1. Tech Stack
- **Framework**: React 18 / 19 + Vite
- **Styling**: Tailwind CSS v3 with custom brand tokens (teal, amber, neutral greys)
- **Routing**: react-router-dom
- **HTTP Client**: Axios with centralized client and interceptors
- **Linting & Code Quality**: ESLint + Prettier

---

## 2. Environment Variables & Mock Mode

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

| Variable | Description | Default |
|---|---|---|
| `VITE_API_BASE_URL` | Base URL for Node.js / Express backend | `http://localhost:5000/api` |
| `VITE_USE_MOCKS` | Enable standalone mock mode without live backend | `true` |

> **Mock Mode**: When `VITE_USE_MOCKS=true`, the app functions standalone with simulated delays, real-time seat decrementing, duplicate registration prevention, and role-based login checking.

---

## 3. Demo Accounts for Evaluation

| Role | Email | Password | Details |
|---|---|---|---|
| **Student** | `student@campus.edu` | `password123` | Amina Al-Mansoor (STU-2026-8841) |
| **Society Organizer** | `organizer@campus.edu` | `password123` | Marcus Vance (IEEE & CS Society) |
| **University Admin** | `admin@campus.edu` | `password123` | Dr. Sarah Jenkins (Student Affairs) |

*The login page also provides one-click "Quick Demo Autofill" buttons for instant testing.*

---

## 4. Expected Backend API Endpoints

When `VITE_USE_MOCKS=false`, the client connects to:

1. **`POST /api/auth/login`**
   - **Request**: `{ email: string, password: string, role: string }`
   - **Response**: `{ id: string, name: string, email: string, role: string, ... }`
2. **`GET /api/events?status=published`**
   - **Query**: `status=published`
   - **Response**: Array of published event objects:
     `[{ id, title, societyName, venue, date, startTime, endTime, capacity, registeredCount, status }]`
3. **`POST /api/events/:id/register`**
   - **Request**: `{ studentId: string }`
   - **Response**: `{ success: boolean, message: string }`
4. **`POST /api/contact`**
   - **Request**: `{ name: string, email: string, topic: string, message: string }`
   - **Response**: `{ success: boolean, message: string, ticketId?: string }`

---

## 5. Development & Build Commands

```bash
# Install dependencies
npm install

# Run local development server
npm run dev

# Run linter
npm run lint

# Production build
npm run build
```

---

## 6. Project Architecture

```
src/
  api/
    axiosClient.js      # Central Axios client with interceptors
    authService.js      # Login and authentication API
    eventService.js     # Event fetching and registration
    contactService.js   # Contact form submission API
  assets/
  components/
    common/
      Alert.jsx         # Accessible alerts (success, error, warning, info)
      Button.jsx        # Reusable button with variants & loading spinner
      FormField.jsx     # Accessible field wrapper with labels and errors
      Input.jsx         # Accessible input with focus and aria attributes
      Logo.jsx          # University emblem and branding
      Select.jsx        # Accessible dropdown selector
      Spinner.jsx       # SVG loading indicator
      Textarea.jsx      # Accessible multiline input
    events/
      EventCard.jsx     # Event card with SeatMeter & registration
      LifecycleSteps.jsx# 7-stage lifecycle (responsive desktop/mobile)
      SeatMeter.jsx     # Dynamic progress bar turning red at 0 seats
    layout/
      AuthLayout.jsx    # Clean centered layout for auth pages
      Footer.jsx        # University system footer
      MainLayout.jsx    # Sticky navbar + content + footer
      Navbar.jsx        # Sticky navigation with role status & mobile menu
  constants/
    eventStatus.js      # Status constants: pending, approved, rejected, published
    roles.js            # Roles: student, organizer, admin
    routes.js           # Centralized route strings
  context/
    AuthContext.jsx     # Auth state, login/logout, and localStorage
  hooks/
    useAuth.js          # Auth hook
    useEvents.js        # Event loading, error, and refetch hook
    useForm.js          # Form state, validation, and error management
  mocks/
    events.js           # Mock events including full (0 seats) and nearly full
    users.js            # Mock users for each role
  pages/
    Contact/
      ContactPage.jsx   # Contact form with validation & office info
    dashboards/
      AdminDashboard.jsx     # Admin destination placeholder
      OrganizerDashboard.jsx # Organizer destination placeholder
      StudentDashboard.jsx   # Student destination placeholder
    Home/
      HomePage.jsx      # Hero, events grid, lifecycle, roles, features
    Login/
      LoginPage.jsx     # Role selector radio, validation, demo autofill
    NotFoundPage.jsx    # Accessible 404 page
  routes/
    AppRoutes.jsx       # Route registry
    ProtectedRoute.jsx  # Authentication gate
    RoleRoute.jsx       # Role-based route gate
  utils/
    formatters.js       # Date, time span, and text formatting
    seatUtils.js        # Pure seat calculation, availability & labels
    validators.js       # Field and form validators
  App.jsx               # App wrapper with BrowserRouter & AuthProvider
  main.jsx              # DOM root mount
  index.css             # Tailwind base & styling
```
