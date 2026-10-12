### Architecture Direction

The main dependency flow of the application is:
`Server → Routes → Controllers → Services → Repositories → Data`

Dependencies should generally move in this direction, never backwards.
Not every request has to use every layer. For example, /health does not need a service or repository. The important rule is that when layers are used, their dependencies follow the architecture rather than bypassing or reversing it.

Server — Application Entry Point
server.js is responsible for creating and running the HTTP server and passing incoming requests to the routing layer.
Responsibilities:

- Create the HTTP server
- Listen on the configured port
- Receive incoming requests
- Pass requests to routers
- Handle unmatched routes (404)
  It should contain no domain or business logic: no wallet balances, transactions, deposits, withdrawals, or direct data access.

## Roadmap (v2,v3,v4)

- HTTP API — complete routing, 404/405, query parameters, and resource lookup by id.
- HTTP Errors — introduce a consistent error-handling structure.
- SQL Fundamentals — learn SELECT, INSERT, UPDATE, DELETE, JOIN, and constraints.
- PostgreSQL — replace in-memory storage with a real relational database and tables for users, wallets, balances, and transactions.
- Node.js ↔ PostgreSQL — connect the application to PostgreSQL and replace mock repositories with real database queries.
- Promises & Async/Await — apply asynchronous programming to real database operations.
- Database Transactions — use BEGIN, COMMIT, and ROLLBACK to make balance updates and transaction creation atomic.
- Authentication — add registration, login, password hashing, JWT, and authentication middleware.
- Fastify — migrate the manually built Node.js HTTP layer to a backend framework.
- Schema Validation — validate request bodies, route parameters, and query parameters using schemas.
- Centralized Error Handling — introduce application-specific errors and a centralized error handler.
- Kysely — replace handwritten database queries where appropriate with a type-safe SQL query builder.
- Testing — add unit, integration, and API tests.
- Security — configure CORS, security headers, rate limiting, input validation, environment variables, and secrets.
- Realtime — add real-time wallet updates if the application requires them.
- Frontend ↔ Backend — connect the React frontend to the finished API.
- Deployment — configure the production environment, database, backend, and frontend deployment.
