import { Outlet } from "react-router-dom";

// Header and footer is always visible. And pages (from route.ts) render inside "outlet"
export default function Main() {
  return (
    <main>
      <Outlet />
    </main>
  );
}

// This component renders page layout
// "main" functions like a "frame"
// "Outlet" acts as a placeholder where specific page content will be swapped in and out as the user navigate
