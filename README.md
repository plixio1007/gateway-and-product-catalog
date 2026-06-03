# Gateway & Product Catalog Service

A progressive API Gateway and Product Catalog microservice built with **NestJS**, **Prisma ORM (v7)**, and **PostgreSQL (Supabase)**.

---

## 🛠️ Prerequisites

Before getting started, ensure you have the following installed on your local machine:

- **Node.js** (v22.20.0 or higher recommended)
- **npm** (v10.9.3 or higher)
- A **Supabase** account and project instance

---

## 📦 Project Setup

1. **Clone the repository:**

```bash
   git clone <repository-url>
   cd gateway-and-product-catalog
```

2. **Install dependencies:**

```bash
   npm install
```

---

## 🗄️ Database Configuration & Initialization

This project utilizes Prisma ORM with connection pooling optimized for Supabase.

### 1. Environment Variables

Duplicate the `.env.example` file and rename it to `.env`:

```bash
cp .env.example .env
```

Open `.env` and configure your database connection strings:

```env
# Port 6543: Transaction Pooler (Used by the NestJS application runtime via pg pool)
DATABASE_URL="postgresql://postgres.[YOUR_PROJECT_REF]:[YOUR_PASSWORD]@[aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true](https://aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true)"

# Port 5432: Session Pooler / Direct Connection (Required for Prisma CLI Migrations)
DIRECT_URL="postgresql://postgres.[YOUR_PROJECT_REF]:[YOUR_PASSWORD]@[aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres](https://aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres)"
```

> ⚠️ **CRITICAL SECURITY NOTE ON PASSWORDS:**
> If your database password contains special characters like `#`, `@`, or `/`, you **MUST** URL-encode them. For example, replace `#` with `%23`. Failing to do so will cause connection string parsing errors (`P1001 / DatabaseNotReachable`).

### 2. Synchronization & Migration Flow

Run the following commands in order to provision your database structure and client models:

- **Generate Prisma Client Artifacts:**

```bash
  npx prisma generate
```

- **Execute Database Migrations:**
  This maps your Prisma schema to your Supabase PostgreSQL instance.

```bash
  npx prisma migrate dev --name init_tables
```

- **Seed Initial Data:**
  Resets product data and populates database with 50 realistic auction-ready sample products plus default administrator profile.

```bash
  npx ts-node prisma/seed.ts
```

## 🔁 Mock Auction State Transition (GraphQL)

Use GraphQL Playground/Sandbox to simulate Kafka/stream-like auction transitions:

```graphql
mutation {
  mockAuctionStateTransition(
    input: { productId: "<product-id>", status: SOLD }
  ) {
    id
    name
    status
    price
  }
}
```

- Allowed environments: `development`, `staging`
- Production response: `403 Forbidden` with message `Mocking mutations are not allowed in production`

---

## 💻 Running the Application

```bash
# Development mode
$ npm run start

# Watch mode (Highly recommended for active development)
$ npm run start:dev

# Production build preview
$ npm run start:prod
```

---

## 🧪 Verification & Testing

```bash
# Execute unit tests
$ npm run test

# Execute end-to-end (e2e) integration tests
$ npm run test:e2e

# Inspect test coverage metrics
$ npm run test:cov
```

---

## 🛡️ Code Quality & Formatting

This project enforces strict linting and formatting via ESLint and Prettier. Code quality gates are executed automatically on pre-commits using `husky` and `lint-staged`.

```bash
# Manually invoke linter execution
$ npm run lint

# Manually invoke formatter execution
$ npm run format
```
