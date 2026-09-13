# ExpenseTracker

ExpenseTracker is a full-stack expense sharing application. Users can create accounts, add friends, create groups, record shared transactions, and view spending insights.

## Project Structure

- `Backend/` - Express and MongoDB API
- `Frontend/login_auth/` - React and Vite web application

## Features

- User registration and login
- Friend management
- Expense groups and group members
- Shared group transactions and balances
- Monthly and category-based spending charts

## Requirements

- Node.js 18 or newer
- A MongoDB database

## Run Locally

1. Configure the MongoDB connection and JWT secret in `Backend/app.js` and `Backend/middlewares/isAuthenticated.js`. Use environment variables for real credentials and never commit secrets.
2. Start the API:

	```powershell
	cd Backend
	npm install
	npm start
	```

	The API listens on `http://localhost:3000`.

3. In a second terminal, start the frontend:

	```powershell
	cd Frontend/login_auth
	npm install
	npm run dev
	```

	Open the URL printed by Vite, normally `http://localhost:5173`.

## Frontend Checks

Run the production build and linter from `Frontend/login_auth`:

```powershell
npm run build
npm run lint
```

## API Areas

The backend exposes routes under `/api/users` for registration, login, friends, groups, transactions, profiles, and group details. The frontend currently expects the API at `http://localhost:3000`.

## Current Status

The frontend builds successfully. The backend requires a working MongoDB connection before authentication and expense features can be used. The original database credential and JWT secret should be rotated and removed from the Git history before making this repository public.