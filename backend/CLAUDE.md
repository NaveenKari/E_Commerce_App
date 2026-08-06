# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Java Spring Boot 4.0.3 e-commerce REST API using Java 21, Spring Security with JWT, Spring Data JPA, and H2 in-memory database.

## Build & Run Commands

```bash
# Build the project
./mvnw clean install

# Run the application
./mvnw spring-boot:run

# Run tests
./mvnw test

# Run a single test class
./mvnw test -Dtest=EcomApplicationTests

# Skip tests during build
./mvnw clean install -DskipTests
```

The H2 console is available at `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:ecom`).

## Architecture

Layered architecture: **Controller → Service (interface + impl) → Repository → Entity**

```
com.ecom.project/
├── controller/       # REST endpoints
├── service/          # Business logic (interface + Impl pairs)
├── repo/             # Spring Data JPA repositories
├── model/            # JPA entities
├── payload/          # DTOs (request/response)
├── security/         # JWT auth, Spring Security config
├── exception/        # Global exception handler + custom exceptions
├── config/           # AppConfig (ModelMapper bean), AppConstants (pagination defaults)
└── util/             # AuthUtil (gets current authenticated user)
```

## Key Patterns

**DTOs**: All API inputs/outputs use payload classes (e.g. `ProductDTO`, `CartDTO`). ModelMapper converts between entities and DTOs — configured as a `@Bean` in `AppConfig`.

**Service layer**: Every domain has an interface + `Impl` class. Inject the interface, not the implementation.

**Pagination**: Default page/size/sort values live in `AppConstants`. Controllers accept `pageNumber`, `pageSize`, `sortBy`, `sortOrder` query params.

**Special price**: `Product.specialPrice` is always computed as `price - (discount% * price)` — recalculate and persist it whenever price or discount changes.

**Cart totals**: `Cart.totalPrice` must be recalculated after any cart mutation (item add/update/delete) inside the service layer.

## Security

- JWT stored in a cookie (`personalEcom`), validated by `AuthTokenFilter` on every request.
- `WebSecurityConfig` defines public vs. protected paths:
  - **Public**: `/api/auth/**`, `/api/public/**`, `/h2-console/**`, `/swagger-ui/**`, `/v3/api-docs/**`, `/images/**`
  - **Protected**: everything else (requires authentication); `/api/admin/**` paths are admin-only.
- Three roles: `ROLE_USER`, `ROLE_ADMIN`, `ROLE_SELLER` (enum `AppRoles`).
- Default seed users created on startup (via `CommandLineRunner` in `WebSecurityConfig`): `user1` (USER), `seller1` (SELLER), `admin` (ADMIN + SELLER + USER).
- Use `AuthUtil.loggedInUser()` / `AuthUtil.loggedInEmail()` in services to get the current principal.

## Domain Model Relationships

- `User` ↔ `Cart`: One-to-One
- `User` → `Address`: One-to-Many
- `Cart` → `CartItem`: One-to-Many (orphanRemoval = true)
- `CartItem` → `Product`: Many-to-One
- `Order` → `OrderItem`: One-to-Many
- `Order` ↔ `Payment`: One-to-One
- `Order` → `Address`: Many-to-One
- `Product` → `Category`: Many-to-One
- `Product` → `User` (seller): Many-to-One

## Configuration (application.properties)

| Property | Value |
|---|---|
| DB URL | `jdbc:h2:mem:ecom` |
| DDL auto | `update` |
| Image path | `images/` |
| JWT expiry | 3 000 000 ms (~50 min) |
| JWT cookie | `personalEcom` |

## Exception Handling

`GlobalExceptionHandler` (`@RestControllerAdvice`) catches:
- `ResourceNotFoundException` → 404
- `ApiException` → 400
- Bean validation errors → 400

Throw these from service layer; don't handle them locally.

## Image Storage

Product images are stored on disk under the `images/` directory (relative to working directory). `FileServiceImpl` handles upload/retrieval. The path is injected via `@Value("${project.image}")`.