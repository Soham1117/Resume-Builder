# Resume Builder Frontend - Planning Document

## Project Overview

Create an intuitive, modern React-based frontend for the Resume Builder application using Vite for fast development and Tailwind CSS for styling. The frontend will provide a user-friendly interface for creating and editing resumes with real-time preview capabilities and drag-and-drop functionality for easy content management.

## Technology Stack

- **React 18** - Modern React with hooks and functional components
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **TypeScript** - Type safety and better developer experience
- **React Hook Form** - Form handling and validation
- **React Router** - Client-side routing
- **Axios** - HTTP client for API communication
- **Lucide React** - Modern icon library
- **React Hot Toast** - Toast notifications
- **React DnD** - Drag and drop functionality
- **React Beautiful DnD** - Alternative drag and drop library for smooth interactions

## Project Structure

```
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── ui/           # Reusable UI components
│   │   ├── forms/        # Form components
│   │   ├── layout/       # Layout components
│   │   ├── resume/       # Resume-specific components
│   │   └── dragdrop/     # Drag and drop components
│   ├── pages/            # Page components
│   ├── hooks/            # Custom React hooks
│   ├── services/         # API services
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   ├── styles/           # Global styles
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── index.html
```

## Core Features & Components

### 1. Main Layout (`src/components/layout/`)

- **Header** - Navigation, logo, theme toggle
- **Sidebar** - Resume sections navigation
- **Main Content Area** - Form and preview area
- **Footer** - Links, version info

### 2. Resume Sections (`src/components/resume/`)

- **PersonalInfoSection** - Name, email, phone, location, LinkedIn, portfolio
- **ExperienceSection** - Company, title, dates, location, projects with bullet points
- **ProjectsSection** - Project title, technologies, link, description
- **EducationSection** - Degree, institution, dates, GPA
- **SkillsSection** - Technical skills, soft skills
- **CertificationsSection** - Certifications and achievements

### 3. Form Components (`src/components/forms/`)

- **DynamicForm** - Reusable form with validation
- **InputField** - Text input with labels and validation
- **TextAreaField** - Multi-line text input
- **DateRangeField** - Date range picker
- **LinkField** - URL input with validation
- **BulletPointEditor** - Dynamic bullet point management
- **ProjectEditor** - Project-specific form with technologies and links

### 4. UI Components (`src/components/ui/`)

- **Button** - Primary, secondary, outline variants
- **Card** - Content containers
- **Modal** - Popup dialogs
- **Dropdown** - Select components
- **Badge** - Technology tags
- **IconButton** - Icon-only buttons
- **LoadingSpinner** - Loading states
- **Toast** - Notifications

### 5. Drag & Drop Components (`src/components/dragdrop/`)

- **DraggableItem** - Individual draggable experience/project item
- **DropZone** - Target area for dropping items
- **DragPreview** - Visual feedback during drag operations
- **ContentLibrary** - Side panel with available content items
- **DragContext** - Context provider for drag state management

### 6. Pages (`src/pages/`)

- **HomePage** - Landing page with resume templates
- **ResumeBuilderPage** - Main resume editing interface
- **PreviewPage** - PDF preview and download
- **TemplatesPage** - Template selection
- **SettingsPage** - User preferences

## User Interface Design

### Design Principles

1. **Intuitive Navigation** - Clear section-based navigation
2. **Real-time Preview** - Live preview of resume changes
3. **Drag & Drop Interface** - Visual content management
4. **Responsive Design** - Works on desktop, tablet, and mobile
5. **Accessibility** - WCAG 2.1 AA compliance
6. **Modern Aesthetics** - Clean, professional design

### Layout Structure with Drag & Drop

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Header (Logo, Navigation, Theme Toggle, Export)                        │
├─────────────────┬─────────────────────┬─────────────────────────────────┤
│                 │                     │                                 │
│ Sidebar         │ Main Content Area   │ Content Library                 │
│ (Sections)      │ ┌─────────────────┐ │ ┌─────────────────────────────┐ │
│ • Personal Info │ │ Form Area       │ │ │ Available Content           │ │
│ • Experience    │ │ (Current Form)  │ │ │ ┌─────────────────────────┐ │ │
│ • Projects      │ │                 │ │ │ │ Experience Items        │ │ │
│ • Education     │ │                 │ │ │ │ • Senior Developer      │ │ │
│ • Skills        │ │                 │ │ │ │ • Team Lead             │ │ │
│ • Certifications│ │                 │ │ │ │ • Project Manager       │ │ │
│                 │ └─────────────────┘ │ │ └─────────────────────────┘ │ │
│                 │ ┌─────────────────┐ │ │ ┌─────────────────────────┐ │ │
│                 │ │ Preview Area    │ │ │ │ Project Items           │ │ │
│                 │ │ (Live Preview)  │ │ │ │ • E-commerce App        │ │ │
│                 │ │                 │ │ │ │ • Mobile App            │ │ │
│                 │ │                 │ │ │ │ • API Development       │ │ │
│                 │ └─────────────────┘ │ │ └─────────────────────────┘ │ │
│                 │                     │ │                             │ │
│                 │                     │ │ Drag items from library    │ │
│                 │                     │ │ to replace current items   │ │
│                 │                     │ │                             │ │
└─────────────────┴─────────────────────┴─────────────────────────────────┘
```

### Drag & Drop Workflow

1. **Content Library Panel** - Shows all available experience/project templates
2. **Drag Source** - Each item in the library is draggable with visual feedback
3. **Drop Zones** - Current resume items become drop zones
4. **Visual Feedback** - Clear indication of valid drop targets
5. **Replacement Logic** - Dropping replaces the target item with the dragged item
6. **Undo/Redo** - Ability to undo drag operations

### Color Scheme

- **Primary**: Blue (#3B82F6) - Professional and trustworthy
- **Secondary**: Gray (#6B7280) - Neutral and clean
- **Success**: Green (#10B981) - Positive actions
- **Warning**: Yellow (#F59E0B) - Cautions
- **Error**: Red (#EF4444) - Errors and deletions
- **Background**: White/Light Gray - Clean and readable
- **Drag Active**: Purple (#8B5CF6) - Indicates active drag operation
- **Drop Zone**: Light Blue (#DBEAFE) - Valid drop target highlighting

## Key Features Implementation

### 1. Real-time Form Validation

- Client-side validation using React Hook Form
- Real-time error messages
- Field-specific validation rules
- Form state persistence

### 2. Dynamic Content Management

- Add/remove experience entries
- Add/remove project entries
- Dynamic bullet point management
- **Drag-and-drop reordering and replacement**

### 3. Drag & Drop System

- **Content Library** - Side panel with categorized content items
- **Draggable Items** - Visual cards with preview of content
- **Drop Zones** - Highlighted areas where items can be dropped
- **Replacement Logic** - Seamless content swapping
- **Visual Feedback** - Clear drag states and drop indicators
- **Undo/Redo** - History management for drag operations

### 4. Resume Preview

- Live preview as user types
- PDF preview generation
- Print-friendly styling
- Download functionality

### 5. Data Persistence

- Local storage for draft saves
- Auto-save functionality
- Export to JSON
- Import from JSON
- **Content library persistence**

### 6. Template System

- Multiple resume templates
- Template switching
- Custom styling options
- Template preview
- **Template-specific content libraries**

## Drag & Drop Implementation Details

### Content Library Structure

```typescript
interface ContentItem {
  id: string;
  type: "experience" | "project";
  title: string;
  company?: string;
  technologies?: string[];
  description: string;
  bulletPoints: string[];
  dateRange?: string;
  location?: string;
  link?: string;
  category: string;
  tags: string[];
}
```

### Drag & Drop Components

1. **DraggableItem** - Wraps content items with drag functionality
2. **DropZone** - Defines areas where items can be dropped
3. **DragPreview** - Custom preview during drag operations
4. **ContentLibrary** - Manages the side panel with available content
5. **DragContext** - Provides drag state to all components

### User Experience Flow

1. **Browse Library** - User scrolls through available content in side panel
2. **Select Item** - User clicks and drags an item from the library
3. **Visual Feedback** - Drag preview shows and drop zones highlight
4. **Drop & Replace** - User drops item on a target, replacing existing content
5. **Confirmation** - Toast notification confirms the replacement
6. **Undo Option** - User can undo the replacement if needed

### Content Categories

- **Experience Templates**: Different job roles and industries
- **Project Templates**: Various project types (web, mobile, API, etc.)
- **Skill Sets**: Technology stacks and frameworks
- **Achievement Templates**: Common accomplishments and metrics

## API Integration

### Backend Communication

- RESTful API calls to Spring Boot backend
- File upload for profile pictures
- PDF generation requests
- Resume data synchronization
- **Content library management**

### Error Handling

- Network error handling
- Validation error display
- Retry mechanisms
- Offline mode support
- **Drag operation error recovery**

## Development Phases

### Phase 1: Foundation (Week 1)

- [ ] Project setup with Vite + React + TypeScript
- [ ] Tailwind CSS configuration
- [ ] Basic routing setup
- [ ] Layout components (Header, Sidebar, Main)
- [ ] Basic UI components (Button, Card, Input)
- [ ] **Drag & Drop library setup**

### Phase 2: Core Forms & Drag & Drop (Week 2)

- [ ] Personal information form
- [ ] Experience form with dynamic entries
- [ ] Projects form with technologies
- [ ] Form validation and error handling
- [ ] Data persistence to local storage
- [ ] **Content library component**
- [ ] **Draggable item components**
- [ ] **Drop zone implementation**

### Phase 3: Advanced Features (Week 3)

- [ ] Real-time preview component
- [ ] PDF generation integration
- [ ] Template system
- [ ] Export/import functionality
- [ ] Responsive design implementation
- [ ] **Complete drag & drop workflow**
- [ ] **Content replacement logic**
- [ ] **Undo/redo functionality**

### Phase 4: Polish & Testing (Week 4)

- [ ] Accessibility improvements
- [ ] Performance optimization
- [ ] Error boundary implementation
- [ ] Unit and integration tests
- [ ] Documentation and deployment
- [ ] **Drag & drop testing**
- [ ] **Mobile touch support**

## Technical Considerations

### Performance

- Lazy loading of components
- Memoization for expensive operations
- Efficient re-rendering strategies
- Bundle size optimization
- **Drag operation optimization**

### Security

- Input sanitization
- XSS prevention
- CSRF protection
- Secure API communication
- **Content validation**

### Testing Strategy

- Unit tests for components
- Integration tests for forms
- E2E tests for critical flows
- Accessibility testing
- **Drag & drop interaction tests**

### Deployment

- Build optimization
- Environment configuration
- CI/CD pipeline setup
- Production deployment

## Success Metrics

- User can create a complete resume in under 10 minutes
- Form validation prevents 95% of data entry errors
- PDF generation completes in under 5 seconds
- Application loads in under 2 seconds
- Mobile responsiveness score > 95
- **Drag & drop operations complete in under 2 seconds**
- **Content replacement success rate > 98%**

## Future Enhancements

- **AI-powered content suggestions**
- **Smart content matching** - Suggest relevant content based on current selection
- **Content templates marketplace** - User-generated content sharing
- **Advanced drag & drop** - Multi-select, batch operations
- Multiple language support
- Advanced template customization
- Collaboration features
- Resume analytics and insights

## Session Management (JWT-Based Authentication)

For session management in this Resume Builder project, which appears to be a full-stack application with a Spring Boot backend and a React/TypeScript frontend, I propose implementing a **Token-Based Authentication (JWT)** system. This approach offers scalability and a clear separation of concerns between the frontend and backend.

Here's a detailed plan:

**I. Backend (Spring Boot - `src/main/java/com/resume/`)**

1.  **Add Security Dependencies**:

    - Include `spring-boot-starter-security` for core security features.
    - Include a JWT library (e.g., `jjwt`) for token generation and validation.
    - **Files to modify/create**: `pom.xml` (add dependencies).

2.  **User Entity and Repository**:

    - Create a `User` entity (e.g., `src/main/java/com/resume/model/User.java`) to represent application users, including fields like `username`, `password` (hashed), and `roles`.
    - Create a Spring Data JPA repository for the `User` entity (e.g., `src/main/java/com/resume/repository/UserRepository.java`).

3.  **Authentication Service**:

    - Implement a `UserDetailsService` (e.g., `src/main/java/com/resume/service/UserDetailsServiceImpl.java`) to load user-specific data during authentication.
    - Create an `AuthService` (e.g., `src/main/java/com/resume/service/AuthService.java`) responsible for user registration, login, and JWT generation.
    - **Files to create**: `src/main/java/com/resume/model/User.java`, `src/main/java/com/resume/repository/UserRepository.java`, `src/main/java/com/resume/service/UserDetailsServiceImpl.java`, `src/main/java/com/resume/service/AuthService.java`.

4.  **JWT Utility and Filter**:

    - Create a `JwtUtil` class (e.g., `src/main/java/com/resume/util/JwtUtil.java`) for generating, validating, and extracting information from JWTs.
    - Implement a `JwtRequestFilter` (e.g., `src/main/java/com/resume/filter/JwtRequestFilter.java`) that intercepts incoming requests, extracts the JWT, validates it, and sets the authentication context.
    - **Files to create**: `src/main/java/com/resume/util/JwtUtil.java`, `src/main/java/com/resume/filter/JwtRequestFilter.java`.

5.  **Security Configuration**:

    - Configure Spring Security (e.g., `src/main/java/com/resume/config/SecurityConfig.java`) to:
      - Disable CSRF protection (as JWTs are stateless).
      - Configure the `AuthenticationManager`.
      - Define authorization rules for API endpoints (e.g., `/api/auth/**` public, `/api/resume/**` authenticated).
      - Add the `JwtRequestFilter` to the security filter chain.
      - Configure password encoding (e.g., `BCryptPasswordEncoder`).
    - **Files to create**: `src/main/java/com/resume/config/SecurityConfig.java`.

6.  **Authentication Controller**:
    - Create an `AuthController` (e.g., `src/main/java/com/resume/controller/AuthController.java`) with endpoints for:
      - `/api/auth/register`: To register new users.
      - `/api/auth/login`: To authenticate users and return a JWT.
    - **Files to create**: `src/main/java/com/resume/controller/AuthController.java`.

**II. Frontend (React/TypeScript - `frontend/src/`)**

1.  **Login and Registration Components**:

    - Create new React components (e.g., `frontend/src/pages/LoginPage.tsx`, `frontend/src/pages/RegisterPage.tsx`) for user authentication forms.
    - **Files to create**: `frontend/src/pages/LoginPage.tsx`, `frontend/src/pages/RegisterPage.tsx`.

2.  **API Integration for Authentication**:

    - Modify `frontend/src/services/api.ts` to include functions for `login` and `register` requests to the backend authentication endpoints.
    - **Files to modify**: `frontend/src/services/api.ts`.

3.  **Token Storage and Management**:

    - Upon successful login, store the received JWT in `localStorage` (for persistence across browser sessions) or `sessionStorage` (for session-only persistence). I will initially use `localStorage` for simplicity, but note that `sessionStorage` is generally more secure against XSS if the token is short-lived and refreshed frequently.
    - Implement a mechanism to retrieve and attach the token to all authenticated requests. This can be done using Axios interceptors in `frontend/src/services/api.ts`.
    - **Files to modify**: `frontend/src/services/api.ts`.

4.  **Authentication Context/Hook**:

    - Create a React Context (e.g., `frontend/src/context/AuthContext.tsx`) or a custom hook (e.g., `frontend/src/hooks/useAuth.ts`) to manage authentication state (e.g., `isAuthenticated`, `user`, `token`).
    - This context will provide login, logout, and registration functions to other components.
    - **Files to create**: `frontend/src/context/AuthContext.tsx` or `frontend/src/hooks/useAuth.ts`.

5.  **Protected Routes**:

    - Implement private routes using React Router (e.g., in `frontend/src/App.tsx`) that only allow access if the user is authenticated.
    - **Files to modify**: `frontend/src/App.tsx`.

6.  **Logout Functionality**:
    - Add a logout button/feature that clears the stored JWT from `localStorage`/`sessionStorage` and updates the authentication state.

**III. Security Considerations**

- **Password Hashing**: Ensure all user passwords are securely hashed (e.g., using BCrypt) before storage in the database.
- **HTTPS**: All communication between frontend and backend must occur over HTTPS to prevent man-in-the-middle attacks.
- **Token Expiration and Refresh Tokens**: Implement short-lived access tokens and longer-lived refresh tokens to enhance security and user experience. Refresh tokens should be stored in HTTP-only cookies to mitigate XSS risks. (This can be a follow-up enhancement if not in the initial scope).
- **Input Validation**: Implement robust input validation on both frontend and backend to prevent injection attacks.

**IV. Database (PostgreSQL - `rabapp-db`)**

1.  **User Table Schema**:

    - Create a `users` table to store user authentication details.
    - **Table Name**: `users`
    - **Columns**:
      - `id` (Primary Key, UUID or BigInt)
      - `username` (Unique, VARCHAR, e.g., 255)
      - `password` (VARCHAR, e.g., 255 - for hashed password)
      - `email` (Unique, VARCHAR, e.g., 255)
      - `roles` (VARCHAR or JSONB, e.g., 'USER', 'ADMIN' - for Spring Security roles)
      - `created_at` (TIMESTAMP with default current timestamp)
      - `updated_at` (TIMESTAMP with default current timestamp)
    - **Files to modify/create**: Database migration script (e.g., Flyway or Liquibase, or direct SQL execution).

2.  **Resume Data Storage**:
    - Associate resume data with the `users` table via a foreign key. This ensures that each user's resume data is securely linked to their account.
    - The `ResumeData` model (already present in `src/main/java/com/resume/model/ResumeData.java`) will need to be updated to include a `userId` field.
    - **Files to modify**: `src/main/java/com/resume/model/ResumeData.java`, and corresponding database schema for resume data.
