import { Outlet } from "react-router-dom";

// Header and footer is always visible. And pages (from route.ts) render inside "outlet"
export default function Main() {
  return (
    <main>
      <Outlet />
    </main>
  );
}
