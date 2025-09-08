# EkiliSync

EkiliSync is a monorepo for a full-stack application with a NestJS backend, a React Native mobile app, and a React (Vite/Tauri) web/desktop app.

## Sub-projects

### `backend`

This is a NestJS-based REST API that serves as the backend for the EkiliSync application. It handles business logic, data storage, and authentication.

### `mobile`

This is a React Native (Expo) application for iOS and Android. It provides a mobile interface for interacting with the EkiliSync backend.

### `web`

This is a React application built with Vite. It serves as a web-based client for the EkiliSync backend. It can also be packaged as a desktop application using Tauri.

## Getting Started

This project uses `pnpm` as a package manager. Make sure you have `pnpm` installed globally.

```bash
npm install -g pnpm
```

Then, install the dependencies at the root of the project:

```bash
pnpm install
```

### Running the `backend`

```bash
cd backend
pnpm start:dev
```

The backend will be running on `http://localhost:3000`.

### Running the `mobile` app

```bash
cd mobile
pnpm start
```

This will start the Expo development server. You can then run the app on an iOS simulator, Android emulator, or on your physical device using the Expo Go app.

### Running the `web` app

```bash
cd web
pnpm dev
```

The web app will be running on `http://localhost:5173`.

To build the desktop app, run:

```bash
cd web
pnpm tauri:build
```

## Tech Stack

### Backend

- [NestJS](https://nestjs.com/) - A progressive Node.js framework for building efficient, reliable and scalable server-side applications.
- [TypeORM](https://typeorm.io/) - A TypeScript ORM for Node.js.
- [PostgreSQL](https://www.postgresql.org/) - A powerful, open source object-relational database system.
- [Passport](http://www.passportjs.org/) - Authentication middleware for Node.js.
- [Swagger](https://swagger.io/) - API documentation.

### Mobile

- [React Native](https://reactnative.dev/) - A framework for building native apps with React.
- [Expo](https://expo.dev/) - A framework and a platform for universal React applications.
- [Expo Router](https://expo.github.io/router/) - A file-based router for React Native and web applications.
- [Zustand](https://github.com/pmndrs/zustand) - A small, fast and scalable bearbones state-management solution.

### Web

- [React](https://reactjs.org/) - A JavaScript library for building user interfaces.
- [Vite](https://vitejs.dev/) - A fast build tool for modern web projects.
- [Tauri](https://tauri.app/) - A framework for building tiny, blazingly fast binaries for all major desktop platforms.
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework.
- [TanStack Router](https://tanstack.com/router/) - A fully type-safe router with first-class search-param APIs.
- [Shadcn UI](https://ui.shadcn.com/) - A collection of re-usable components that you can copy and paste into your apps.
