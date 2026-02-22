import type { RouteObject } from "react-router-dom"; // Type helper for route definitions
import { StrictMode } from "react"; // Helps catch React problems in development
import { createRoot } from "react-dom/client"; // Creates the root for rendering React
import { createBrowserRouter, RouterProvider } from "react-router-dom"; // Imports Modern React Router
import routes from "./routes"; // Import App's route definitions
import App from "./App"; // Import main layout wrapper (Header + Main + Footer)
import "../sass/index.scss"; // Imports custom SCSS styling
import "bootstrap/dist/css/bootstrap.min.css"; // Imports Bootstrap CSS

// Create a router using App as the main layout
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // Wraps Header + Footer + Main
    children: routes as RouteObject[], // The become <Outlet /> pages (from routes.ts)
    HydrateFallback: App,
  },
]);

// Create the React root element
createRoot(document.querySelector("#root")!).render(
  <StrictMode>
    {/* Give React Router the router we just created */}
    <RouterProvider router={router} />
  </StrictMode>,
);

// what this file does -> entry point for react app, like Start React app
// it loads CSS (Bootstrap + SCSS)
// Creates the React root (#root in index.html)
// Creates the router (React Router v6.4+)
// Mounts <App /> as the layout wrapper → Header + Main + Footer
// Injects all routes from routes.tsx file
// In summary, main.tsx = start React + start routing + load styles
