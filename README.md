# Welcome to Sportnexus

A modern sports facility booking and equipment rental platform with tutorial services.

## Project info

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Setup

Follow these steps:

```sh
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies
npm i

# Step 4: Start the development server with auto-reloading and an instant preview
npm run dev
```

### Database Setup

This project uses Supabase as the backend. To set up your database:

1. Create a Supabase account and project at [supabase.com](https://supabase.com)
2. Get your Supabase URL and anon key from Project Settings > API
3. Create a `.env` file in the root of your project with:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. Run the migration SQL scripts:
   - Go to your Supabase project SQL editor
   - Copy and paste the contents of `supabase/migrations/20231120000000_create_schema.sql`
   - Execute the SQL to create all tables, policies, and functions

## Features

- **User Authentication** - Login, Register, and Password Reset
- **Venue Booking** - Browse and book sports venues
- **Equipment Rental** - Rent sports equipment
- **Tutorials** - Access sports training tutorials
- **User Dashboard** - Manage bookings, rentals, and tutorial progress

## Technologies

This project is built with:

- Vite
- TypeScript
- React
- Supabase (Backend as a Service)
- shadcn-ui
- Tailwind CSS
- React Router
- react-hook-form with Zod validation
- Tanstack React Query

## Project Structure

- `src/` - Main source code
  - `components/` - Reusable UI components
  - `context/` - React contexts (Auth, etc.)
  - `hooks/` - Custom React hooks
  - `integrations/` - Supabase client and type definitions
  - `lib/` - Utility functions
  - `pages/` - Route pages
  - `services/` - API service functions
  - `types/` - TypeScript type definitions
- `supabase/` - Supabase migrations and configuration
- `public/` - Static assets

## Contributing

Please follow these steps when contributing:

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request
4. Ensure all tests pass

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

