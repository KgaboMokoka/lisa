# React + Vite

## Shared timers on Netlify

Both elapsed-time counters use one shared pause state stored in a Turso
database (SQLite-compatible). Visitors can pause or resume both timers, and
other open pages pick up the change within a few seconds.

1. Create a Turso database and an authentication token.
2. In Netlify, set `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` as environment
   variables available to functions. Keep the token private and do not commit
   it to the repository.
3. Deploy the site to Netlify. The function creates the shared timer table on
   its first request.

For local development in PowerShell, set the variables in the current shell
and run Netlify Dev so the function and `/api/timer-state` route are available
alongside Vite:

```powershell
$env:TURSO_DATABASE_URL = "libsql://your-database-url"
$env:TURSO_AUTH_TOKEN = "your-auth-token"
npx netlify-cli dev
```

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
