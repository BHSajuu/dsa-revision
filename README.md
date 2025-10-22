# DSA Revision Tracker - Setup Instructions

This is a pattern-based DSA learning platform with spaced repetition built with Next.js and Convex.

## Prerequisites

- Node.js 18+ installed
- A Convex account (free at https://www.convex.dev/)

## Setup Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Convex

1. Install Convex CLI globally (if not already installed):
   ```bash
   npm install -g convex
   ```

2. Login to Convex:
   ```bash
   npx convex login
   ```

3. Initialize Convex in your project:
   ```bash
   npx convex dev
   ```

4. This will:
   - Create a new Convex project
   - Generate a `.env.local` file with your `NEXT_PUBLIC_CONVEX_URL`
   - Start the Convex development server
   - Push your schema and functions to Convex

### 3. Run the Development Server

In a new terminal (keep Convex dev running):

```bash
npm run dev
```

Visit `http://localhost:3000` to see your app.

## Features

- **Pattern-Based Organization**: Organize DSA problems by patterns (Sliding Window, Two Pointer, etc.)
- **Spaced Repetition**: Smart review scheduling using intervals (1, 3, 7, 14, 30, 60, 90 days)
- **Progress Tracking**: Comprehensive stats dashboard with visual metrics
- **Review Reminders**: Automatic notifications for problems due for review
- **Dark Theme**: Beautiful dark mode interface with smooth animations
- **CRUD Operations**: Full control to add, edit, and delete problems and patterns

## Usage

1. **Login**: Enter your email to create an account or login
2. **Add Patterns**: Create patterns like "Sliding Window", "Two Pointer", etc.
3. **Add Problems**: Add LeetCode problems to each pattern
4. **Mark as Solved**: Click the green checkmark to mark a problem as solved (automatically schedules next review)
5. **Track Progress**: View your stats at the top of the dashboard
6. **Review**: Get notified when problems are due for review

## Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS 4
- **Database**: Convex (real-time serverless backend)
- **Animations**: Custom CSS animations
- **Deployment**: Can be deployed to Vercel or any Next.js hosting platform

## Database Schema

### Users
- Email, name, LeetCode profile link

### Patterns
- Pattern name, user ID, display order

### Problems
- Problem name, LeetCode link, last solved date, next review date, successful reviews count