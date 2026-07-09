# Job Application Tracker

A production-ready Job Application Tracker built with Next.js 16 (App Router), React, TypeScript, Redux Toolkit, and Tailwind CSS.

## Overview

This application allows job seekers to log job applications, track their status through a hiring pipeline, attach notes and interview details, and visualize their job search progress with summary statistics. It implements a clean separation between server-fetched content and client-side interactivity, strictly adhering to the requirements of the EXAM4 specification.

## Features & Requirements Fulfilled

- **Next.js App Router (v16+)**: Uses React Server Components and Client Components appropriately.
- **TypeScript Strict Mode**: Zero `any` types used. Full type safety.
- **Redux Toolkit**: Used for global state management of applications and interviews, including asynchronous thunks for API calls.
- **Context API**: `JobSearchContext` manages and persists user preferences (`targetRole`, `targetSalary`, `weeklyGoal`) to `localStorage`.
- **API Routes**: Full CRUD operations for applications and interviews.
- **Middleware / Proxy**: Protects routes (`/applications`, `/add`, `/interviews`), requiring a `job_tracker_session` cookie and appending a `X-Visited-At` header.
- **Custom Hooks**:
  - `useApplicationStats`: Derives statistics from Redux state.
  - `useFilteredApplications`: Handles complex filtering (status, workType, tags, text search).
  - `useApplicationForm`: Manages form state, validation, and submission logic cleanly.
- **UI Components**:
  - `ApplicationCard`, `InterviewCard`, `KanbanColumn`, `StatusPipeline`, `WeeklyGoalWidget` built according to spec.
  - Responsive design using Tailwind CSS and lucide-react icons.
  - Skeleton loaders for loading states.
- **Data Fetching Patterns**: 
  - Server components (e.g. `app/applications/page.tsx`) use `fetch()` with `cache: 'no-store'`.
  - Client components dispatch Redux async thunks.
- **Production Ready**: Builds successfully with zero TypeScript/ESLint errors and deploys to Vercel out of the box.

## Architecture

### Folder Structure
- `app/` - Next.js App Router routes, API routes, layout, and page components.
- `components/` - Reusable UI components (both Server and Client).
- `context/` - React Context providers (`JobSearchContext`).
- `hooks/` - Custom React hooks.
- `lib/` - Utility functions and the in-memory data store.
- `store/` - Redux Toolkit configuration, slices, and thunks.
- `types/` - TypeScript interfaces and types.

### State Flow
- **Global Application Data**: API Routes -> Redux Thunks -> Redux Store -> Client Components.
- **User Settings**: Context API -> `localStorage` -> Client Components.
- **Server Data**: API Routes -> `fetch()` -> Server Components -> Passed as initial data props to Client Components.

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

**Note on Authentication:**
To access the protected routes (`/applications`, `/add`, `/interviews`), you must set a session cookie. In your browser's developer console, run:
```javascript
document.cookie = "job_tracker_session=demo; path=/"
```
Then refresh the page.

## Deployment

This project is fully compatible with Vercel. Simply import the repository into Vercel and it will deploy without modifications.

## Constraints Adhered To

- No `any` types.
- No `eslint-disable`, `ts-ignore`, or `ts-expect-error`.
- Deleting an application properly cascades to delete associated interviews.
- Kanban board implemented alongside the list view.
- Reusable components properly isolated.
