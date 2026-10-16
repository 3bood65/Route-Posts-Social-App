<div align="center">

# 🌐 Route Posts - Modern Social Platform

**A full-featured, responsive Single Page Application (SPA) social media experience built with React 19, TypeScript, Vite, and TanStack Query.**

[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-v5-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)](https://tanstack.com/query)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![HeroUI](https://img.shields.io/badge/HeroUI-v2-000000?style=for-the-badge&logo=nextui&logoColor=white)](https://heroui.com/)
[![Deployed on Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

[Explore Live Demo](#-live-demo) • [Key Features](#-key-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started)

</div>

---

## 🔗 Live Demo

Experience the live production application deployed on Vercel:

👉 **[https://route-posts-theta.vercel.app](https://route-posts-theta.vercel.app/)**

---

## 📖 About The Project

**Route Posts** is an end-to-end modern social networking web application developed as a capstone project during the **Route IT Training Center (Route Academy)** Front-End Development Track.

The objective was to engineer a high-performance, single-page social media application mimicking modern platforms (such as Facebook/LinkedIn), handling server state caching, optimistic UI patterns, real-time query invalidation, client-side routing, and robust authentication with strict TypeScript typing.

---

## 🚀 Key Features

### 🔐 Authentication & Route Guards

- **Secure JWT Flow**: Token-based authentication stored with state synchronisation via React Context and LocalStorage.
- **Form Validation**: Strict schema validation powered by **Zod** and **React Hook Form** with real-time field error messaging.
- **Cinematic Auth Layout**: Clean, video-backed login and registration screens with responsive overlay glassmorphism styling.

### 📰 Dynamic Feed & Post Interaction

- **Infinite Query Architecture**: Seamless post feeds driven by `@tanstack/react-query` infinite queries with automatic cache invalidation on any mutation.
- **Rich Post Creation**: Text publishing and image uploads with real-time feed updates.
- **Post Details View**: Dedicated deep-linked post page with custom comment threads and fallback states.
- **Share & Direct Link**: Native in-app post sharing modal and instant clipboard link copying.
- **Reactions & Bookmarks**: Dynamic post liking and instant bookmarking with synchronous metric updates.

### 💬 Threaded Comments System

- Fetching and real-time creation of comments per post.
- Modular comment management with query caching per post ID (`["getAllComments", postId]`).

### 👤 Profile & Social Graph

- **User Profiles**: Distinct views for personal profile and public community member profiles.
- **Follow / Unfollow Engine**: Instant follower/following relationship toggling with background cache re-fetching.
- **Asset Uploads**: Custom profile photo and cover photo uploads using `FormData` and secure endpoints.
- **User Activity Feeds**: Filtered personal post histories with post count indicators.

### 🛡️ Resilience & UX Polish

- **Offline Detection**: Built-in network state observer displaying an unobtrusive, styled connection overlay when offline.
- **Dynamic SEO / Meta Management**: Page title and meta management using `react-helmet-async`.
- **Loading & Error Boundaries**: Sleek loaders and fallback views preventing layout shifts.

---

## 🛠️ Tech Stack

### Core Framework & Build Tool

| Technology         | Role                                                          |
| :----------------- | :------------------------------------------------------------ |
| **React 19**       | Modern UI rendering library with advanced concurrent features |
| **TypeScript**     | Type-safe static analysis and reliable contract definitions   |
| **Vite 8**         | Next-generation frontend build tool and ultra-fast HMR        |
| **React Router 7** | Client-side routing, nested layouts, and URL parameters       |

### State Management & Data Fetching

| Technology                  | Role                                                                             |
| :-------------------------- | :------------------------------------------------------------------------------- |
| **TanStack React Query v5** | Server-state caching, infinite scroll queries, mutations, and query invalidation |
| **Axios**                   | HTTP client for authenticated API requests                                       |
| **Context API**             | Lightweight global client state management for authentication                    |

### UI, Styling & Animation

| Technology            | Role                                                                   |
| :-------------------- | :--------------------------------------------------------------------- |
| **Tailwind CSS v4**   | Utility-first, performant modern CSS styling                           |
| **HeroUI Components** | Accessible UI primitives (Modals, Dropdowns, Inputs, Avatars, Buttons) |
| **Framer Motion**     | Micro-interactions and smooth interface transitions                    |
| **FontAwesome Free**  | Modern vector icon library                                             |

### Forms, Utilities & Head Management

| Technology               | Role                                                             |
| :----------------------- | :--------------------------------------------------------------- |
| **React Hook Form**      | Performant, subscription-based form state management             |
| **Zod**                  | Declarative TypeScript-first schema validation                   |
| **react-helmet-async**   | Asynchronous `<head>` and document title management for React 19 |
| **jwt-decode**           | Client-side JWT token inspection                                 |
| **react-detect-offline** | Real-time browser connectivity monitoring                        |

---

## 📂 Project Structure

```text
social-app/
├── public/
│   └── auth-bg.mp4          # High-definition video background for AuthLayout
├── src/
│   ├── components/          # Reusable UI elements (Navbar, PostCard, LoaderScreen, etc.)
│   ├── context/             # AuthContext and global application providers
│   ├── interface/           # TypeScript interfaces (PostInterface, UserInterface, etc.)
│   ├── layouts/             # Route layouts (AuthLayout, MainLayout)
│   ├── pages/               # Application views (Home, Login, Register, Profile, PostDetails)
│   ├── App.tsx              # Root routes and providers configuration
│   ├── main.tsx             # Entry point with HelmetProvider and React Query Client
│   └── index.css            # Tailwind directives and design system overrides
├── vercel.json              # SPA rewrite configuration for clean routing on Vercel
├── package.json             # Dependencies and project metadata
└── tsconfig.json            # TypeScript compiler configuration
```

---

## ⚡ Getting Started

Follow these instructions to set up and run the project locally on your machine.

### Prerequisites

- **Node.js** (v18.0.0 or higher recommended)
- **npm** or **yarn** / **pnpm**

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/3bood65/Route-Posts-Social-App.git
   cd Route-Posts-Social-App
   ```

2. **Install project dependencies:**

   ```bash
   npm install
   ```

3. **Start the local development server:**

   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Navigate to `http://localhost:5173` to view the application.

### Available Scripts

- `npm run dev` - Runs the application in development mode with HMR.
- `npm run build` - Runs TypeScript compilation (`tsc -b`) and generates production bundle via Vite.
- `npm run preview` - Locally previews the production build.
- `npm run lint` - Runs ESLint to verify code quality and style consistency.

---

This prevents `404 Not Found` errors when refreshing routes such as `/profile` or `/posts/:postId`.

---

## 👨‍💻 Author & Acknowledgments

- **Developer**: [Abdalrahman (3bood65)](https://github.com/3bood65)
- **Supervision & Curriculum**: Special thanks to **[Route Academy](https://www.routemisr.com/)** instructors and mentors for technical guidance on React architecture, clean state management, and modern web standards.

---

<div align="center">
  <sub>Built with passion and React 19 🚀</sub>
</div>
