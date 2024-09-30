# API Endpoints

## Base URL

`/api/v{API_VERSION}`

---

### Root Route

- **GET /**  
  Redirects to `/api/v{API_VERSION}`.

---

### Home

- **GET /api/v{API_VERSION}**  
  Returns a welcome message.

---

## Authentication Routes

- **POST /api/v{API_VERSION}/auth/register**  
  Handles user registration.

- **POST /api/v{API_VERSION}/auth/login**  
  Handles user login.

- **POST /api/v{API_VERSION}/auth/refresh-token**  
  Authenticates the user and returns a new access token.

---

## Todo Routes

- **GET /api/v{API_VERSION}/todos**  
  Retrieves all Todos (authentication required).

- **POST /api/v{API_VERSION}/todos**  
  Creates a new Todo (authentication required).

- **GET /api/v{API_VERSION}/todos/:id**  
  Retrieves a specific Todo by ID (authentication required).

- **PUT /api/v{API_VERSION}/todos/:id**  
  Updates a specific Todo by ID (authentication required).

- **DELETE /api/v{API_VERSION}/todos/:id**  
  Deletes a specific Todo by ID (authentication required).

---

## User Routes (Authenticated Users)

- **GET /api/v{API_VERSION}/users/me**  
  Retrieves the current user's profile information.

- **DELETE /api/v{API_VERSION}/users/me**  
  Deletes the current user's account.

- **PUT /api/v{API_VERSION}/users/me**  
  Updates the current user's profile information.

---

## Admin Routes (User Management)

- **GET /api/v{API_VERSION}/users**  
  Retrieves a list of all users (Admin only).

- **GET /api/v{API_VERSION}/users/:id**  
  Retrieves a specific user by ID (Admin only).

- **DELETE /api/v{API_VERSION}/users/:id**  
  Deletes a specific user by ID (Admin only).

- **PUT /api/v{API_VERSION}/users/:id**  
  Updates a specific user by ID (Admin only).
