# AGENTS.md

# GMMX - AI Agent Guidelines

## Project Overview & Vision

**Long-term Vision:** GMMX is a web-first multi-tenant **Fitness Business Management Platform**. While initially built for gyms, the platform is designed to eventually support Yoga Studios, Dance Academies, Swimming Academies, Martial Arts, and Personal Trainers.

**MVP Focus:** For the initial MVP, development is **strictly focused on Gyms** to ensure a strong product-market fit, fast development, and clear workflows.

The product helps fitness businesses:

* Manage clients/members
* Track payments and renewals
* Track membership expiry
* Manage leads
* Generate professional websites
* Accept online payments

Internal Terminology Mindset (for future scalability):
- Gym -> Organization / Business
- Trainer -> Staff / Coach
- Member -> Client / Member

Primary value proposition:
"Manage your fitness business and get a professional website in minutes."

---

# Product Philosophy

Always prioritize:

1. Revenue generation
2. Gym owner workflows
3. Simplicity
4. Fast deployment
5. Maintainability

Avoid:

* Unnecessary microservices
* Complex architecture
* Premature optimization
* Enterprise-only patterns
* Features not requested by gym owners

---

# Target Users

## Primary

Gym Owners

Goals:

* Track members
* Collect payments
* Prevent membership expiry losses
* Generate leads
* Maintain an online presence

## Secondary

Gym Trainers

Goals:

* View assigned members
* Mark attendance

## Future

Gym Members

Do not build member-facing functionality unless explicitly requested.

---

# Tech Stack

Frontend:

* Next.js (App Router)
* TypeScript
* Tailwind CSS
* shadcn/ui

Backend:

* Next.js Server Actions
* Next.js Route Handlers

Database:

* PostgreSQL

Platform Services:

* Supabase Auth
* Supabase Database
* Supabase Storage

Payments:

* Razorpay

Deployment:

* Docker
* Coolify
* Nginx

---

# Architecture Principles

## Monolith First

Keep everything inside one Next.js application.

Do NOT introduce:

* NestJS
* Spring Boot
* Separate API servers
* Message queues
* Event buses

unless explicitly requested.

Current architecture:

Next.js
├── Marketing Site
├── Dashboard
├── Public Gym Websites
├── API Routes
├── Authentication
└── Admin Panel

---

# Multi-Tenancy

GMMX is tenant-based.

Each gym is a tenant.

Every applicable table must contain:

gym_id

All queries must be scoped to gym_id.

Never return data belonging to another gym.

Use Supabase RLS wherever possible.

---

# MVP Priorities

Always prioritize development in this order:

1. Authentication
2. Gym Onboarding
3. Members
4. Membership Plans
5. Payments
6. Expiry Management
7. Lead Management
8. Public Gym Websites
9. Custom Domains
10. Razorpay
11. Trainer Management
12. Attendance

If scope conflicts occur, prioritize higher items.

---

# Core Features

## Member Management

Must support:

* Create member
* Update member
* Delete member
* Search member
* View profile
* View payment history

---

## Payments

Must support:

* Cash
* UPI
* Card
* Bank Transfer
* Razorpay

Store:

* membership_start
* membership_end

Expiry tracking depends on these dates.

---

## Expiry Management

Critical feature.

Must provide:

* Expiring Today
* Expiring This Week
* Expiring This Month
* Expired Members

Provide renewal actions.

---

## Lead Management

Critical feature.

Lead statuses:

* New
* Contacted
* Interested
* Trial
* Converted
* Lost

Allow lead → member conversion.

Provide WhatsApp shortcuts.

---

## Gym Websites

Every gym receives:

{subdomain}.gmmx.app

Example:

ironfit.gmmx.app

Website must support:

* Home
* About
* Plans
* Trainers
* Gallery
* Contact
* Join Form

Join Form creates a lead.

---

## Custom Domains

Premium feature.

Examples:

ironfit.com
elitefitness.in

Support:

* Domain registration workflow
* DNS instructions
* Verification status

---

# Branch Support

All gyms may have multiple branches.

Use:

branches

table.

Members, payments, attendance, and leads may belong to a branch.

Single-location gyms should automatically receive:

Main Branch

during onboarding.

---

# Dashboard Philosophy

Dashboard should answer:

1. How many members do I have?
2. Who is expiring soon?
3. How much money did I make?
4. How many leads do I have?
5. Which leads need follow-up?

Avoid vanity metrics.

---

# Super Admin Dashboard

Must support:

* Total Gyms
* Active Gyms
* Trial Gyms
* Monthly Recurring Revenue
* Annual Recurring Revenue
* Total Members
* Total Revenue Processed
* Recent Signups

---

# Website Builder Philosophy

Do NOT build drag-and-drop editing.

Use templates only.

Supported templates:

* Modern Fitness
* Minimal
* Performance

Allow content editing only.

---

# UI Principles

Preferred style:

* Clean
* Professional
* Modern SaaS
* Fitness-oriented

Primary Color:

#FF5C73

Requirements:

* Mobile responsive
* Accessible
* Fast
* Consistent

Use shadcn/ui whenever possible.

Avoid custom UI unless necessary.

---

# Coding Standards

TypeScript strict mode.

Use:

* Zod validation
* Server Actions where appropriate
* React Query only when necessary
* Reusable components
* Feature-based folders

Avoid:

* Any
* Large components
* Business logic in UI components

---

# Security Rules

Always enforce:

* Authentication
* Authorization
* Tenant isolation
* RLS policies
* Input validation
* File validation

Never trust client-side data.

---

# Storage Rules

Supabase Storage buckets:

* gym-logos
* gym-gallery
* trainer-images
* documents

Validate:

* File type
* File size

before upload.

---

# WhatsApp Integration

Current implementation:

URL generation only.

Example:

https://wa.me/91XXXXXXXXXX

Do NOT implement:

* WhatsApp API
* Automation
* Messaging services

unless explicitly requested.

---

# Future Features

Design code so future features can be added:

* QR Attendance
* Diet Plans
* Workout Plans
* Mobile App
* AI Analytics
* WhatsApp Automation
* Multi-Branch Expansion

Do not build these features now.

---

# Success Metric

A feature is valuable if it helps:

* Acquire members
* Retain members
* Collect payments
* Save gym owner time

If a feature does not improve one of these outcomes, question whether it belongs in the MVP.
