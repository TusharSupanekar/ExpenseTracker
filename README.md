# ExpenseTracker

ExpenseTracker is a full-stack expense management application for personal spending and shared group expenses. Track your own purchases, split costs with friends, and see exactly who owes whom.

## Project Structure

- `Backend/` - Express and MongoDB API
- `Frontend/login_auth/` - React and Vite web application

## Features

- User registration and login
- Personal expense tracking
- Friend management and shared groups
- Group transactions with automatic splits
- Total owed, total lent, and net group balance
- Person-by-person balances, such as "Alex owes you" or "You owe Sam"
- Monthly budget with a spent-versus-remaining gauge
- Chart.js views for budget health, top categories, monthly spending, and money flow
- Responsive dashboard with light and dark themes

## Requirements

- Node.js 18 or newer
- A MongoDB database

## Run Locally

1. Configure the MongoDB connection and JWT secret locally in `Backend/app.js` and `Backend/middlewares/isAuthenticated.js`. Use environment variables for real credentials and never commit secrets.
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

The backend exposes routes under `/api/users` for:

- Registration and login
- Personal expenses and categories
- Profile spending summaries
- Group creation, members, and group listings
- Friends
- Shared transactions and group details
- Group ledger summaries and person-level balances

The frontend uses `VITE_API_URL` when provided and otherwise expects the API at `http://localhost:3000/api/users`.

## Data Separation

Personal expenses are stored separately from group ledger entries at the application level. For MongoDB Atlas, use a dedicated database such as `ExpenseMaster` and a restricted database user instead of sharing the `JobTracker` database credentials.

## Current Status

The frontend builds successfully. The backend requires a working MongoDB connection before authentication and expense features can be used. Rotate any credentials that appeared in older commits and remove secrets from the Git history before making this repository public.