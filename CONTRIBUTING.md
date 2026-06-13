# Contributing to GMMX

Thank you for your interest in contributing to GMMX! We welcome contributions from developers who want to help build the best platform for gym owners.

## Architecture & Philosophy

Before you start writing code, please review our core architectural principles in `AGENTS.md`. Key takeaways include:

- **Monolith First**: Keep everything inside our Next.js application. We do not use separate API servers or microservices.
- **Multi-Tenancy**: GMMX is a multi-tenant SaaS. Every applicable database table must include a `gym_id`. Queries must **always** be scoped to this ID. Never return data belonging to another gym.
- **Tech Stack**: Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui, and Appwrite (Auth/DB).

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/nitheeshmk41/gmmxapp.git
   cd gmmxapp
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Copy the example environment file and fill in your Appwrite credentials.
   ```bash
   cp .env.example .env
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

## Pull Request Process

1. Create a new branch for your feature or bugfix (`git checkout -b feature/your-feature-name`).
2. Ensure your code uses strict TypeScript and follows our Server Action patterns.
3. Write clean, accessible UI code using Tailwind and shadcn/ui. 
4. Commit your changes with descriptive commit messages.
5. Push your branch and open a Pull Request against the `main` branch.

## Code of Conduct
Please be respectful, constructive, and collaborative in all communications and code reviews.
