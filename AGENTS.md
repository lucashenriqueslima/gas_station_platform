# AGENTS.md

## Project Overview

This project is built with AdonisJS v7 and TypeScript.

Before making any code changes, understand the existing architecture and follow established project conventions.

## General Principles

- Follow existing patterns before introducing new ones.
- Prefer consistency over personal preference.
- Keep implementations simple and maintainable.
- Never modify business rules without explicit justification.
- When requirements are unclear, explain assumptions before implementing.

## Development Workflow

Before implementing:

1. Understand the existing code.
2. Identify affected files.

After implementing:

1. Run linting.
2. Run type checking.

## Code Quality

- Avoid using `any`.
- Prefer explicit and descriptive naming.
- Keep functions focused on a single responsibility.
- Favor composition over inheritance.

## Architecture

- Validation should be isolated from business logic, ./app/validators
- Transformers should be always used to transform data before sending it to the frontend, ./app/transformers
- Queries that are used across multiple controllers should be isolated in a repository pattern, ./app/repositories
- Avoid placing business logic directly inside models and controllers
- Actions classes should be used to isolate business logic, ./app/actions
- Controllers should only handle HTTP request and responses
- For new environment variables, add a file in ./config folder

## Database

- Do not modify old migrations unless explicitly requested.
- Create new migrations for schema changes.
