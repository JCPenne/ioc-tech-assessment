# IOC Table Application

An reusable Infinite Scroll Table component, built with Material-React-Table

## Tech Stack

- Vite
- JSON-server
- faker
- React
- Typescript
- react-query
- material-react-table
- MUI

## Getting Started

To get started with the project, clone the repository and install the dependencies using npm install.

### Development

1. Navigate to the root directory of the project
2. Create a .env.development file
   - Inside of this file declare a variable named `VITE_BASE_URL` and set it to the local port of your choice, e.g. `VITE_BASE_URL=http://localhost:3000`
3. Spin up the backend and generate the randomized data
   - `json-server index.cjs`
   - You will now have access to the following endpoints:
     - `localhost:3000/users`
     - `localhost:3000/count`
4. Spin up the front end
   - `npm run dev`

## Project Structure

The project is structured into several directories:

- `src`: Contains the main application code.
- `src/components`: Contains global components.
- `src/contexts`: Contains React context providers.
- `src/hooks`: Contains custom hooks.
- `src/reducers`: Contains reducers.

**Components**

The main components of the application are:

- `App`: The root component of the application.
- `Header`: Displays the header of the application.
- `InfiniteScrollTable`: Displays the table of user data with infinite scrolling.

**Contexts and Hooks**

The application uses the React Context API for state management. The `UserContext` provides access to the user state and dispatch function for the user reducer.

The `useUser` hook is a custom hook that provides convenient access to the user state and actions.

**Reducers**

The application uses the `userReducer` for managing the user state. The reducer handles actions for logging in and out, setting and fetching the column order.

**Dependencies**

The project has several dependencies, including:

- `react` and `react-dom` for building the UI.
- `@mui/material` and `@mui/icons-material` for Material-UI components.
- `material-react-table` for the table component.
- `react-query` for data fetching.
- `vite` for the build tool.
